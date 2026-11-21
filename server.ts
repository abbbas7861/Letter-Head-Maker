import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface SanitizedShape {
  kind: 'path' | 'circle' | 'rect' | 'polygon' | 'line';
  d?: string;
  cx?: number;
  cy?: number;
  r?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  rx?: number;
  points?: string;
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  filled?: boolean;
  strokeWidth?: number;
}

const VALID_KINDS = new Set(['path', 'circle', 'rect', 'polygon', 'line']);
const SAFE_PATH_REGEX = /^[MmLlHhVvCcSsQqTtAaZz0-9.,\s-]+$/;
const SAFE_POINTS_REGEX = /^[0-9.,\s-]+$/;

function clampCoord(val: unknown, fallback = 32): number {
  const num = Number(val);
  if (!Number.isFinite(num)) return fallback;
  return Math.max(4, Math.min(60, Number(num.toFixed(2))));
}

function sanitizeShapes(raw: unknown): SanitizedShape[] {
  if (!Array.isArray(raw)) return [];
  const out: SanitizedShape[] = [];

  for (const item of raw.slice(0, 14)) {
    if (!item || typeof item !== 'object') continue;
    const obj = item as Record<string, unknown>;
    const kind = String(obj.kind || '').toLowerCase();
    if (!VALID_KINDS.has(kind)) continue;

    const strokeWidth = Math.max(1.2, Math.min(4, Number(obj.strokeWidth) || 2.2));
    const filled = Boolean(obj.filled);

    if (kind === 'path') {
      const d = typeof obj.d === 'string' ? obj.d.trim() : '';
      if (!d || d.length > 500 || !SAFE_PATH_REGEX.test(d)) continue;
      out.push({ kind: 'path', d, filled, strokeWidth });
    } else if (kind === 'circle') {
      const cx = clampCoord(obj.cx, 32);
      const cy = clampCoord(obj.cy, 32);
      const r = Math.max(1, Math.min(22, Number(obj.r) || 8));
      out.push({ kind: 'circle', cx, cy, r, filled, strokeWidth });
    } else if (kind === 'rect') {
      const x = clampCoord(obj.x, 18);
      const y = clampCoord(obj.y, 18);
      const width = Math.max(2, Math.min(44, Number(obj.width) || 20));
      const height = Math.max(2, Math.min(44, Number(obj.height) || 20));
      const rx = Math.max(0, Math.min(16, Number(obj.rx) || 0));
      out.push({ kind: 'rect', x, y, width, height, rx, filled, strokeWidth });
    } else if (kind === 'polygon') {
      const points = typeof obj.points === 'string' ? obj.points.trim() : '';
      if (!points || points.length > 240 || !SAFE_POINTS_REGEX.test(points)) continue;
      out.push({ kind: 'polygon', points, filled, strokeWidth });
    } else if (kind === 'line') {
      const x1 = clampCoord(obj.x1, 18);
      const y1 = clampCoord(obj.y1, 32);
      const x2 = clampCoord(obj.x2, 46);
      const y2 = clampCoord(obj.y2, 32);
      out.push({ kind: 'line', x1, y1, x2, y2, filled: false, strokeWidth });
    }
  }

  return out;
}

const aiClient = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/logo', async (req: Request, res: Response) => {
    const shopName = typeof req.body?.shopName === 'string' ? req.body.shopName.trim() : '';
    const variation = Number(req.body?.variation) || 0;

    if (!shopName || shopName.length < 2) {
      res.status(400).json({ error: 'Please enter a shop or company name first.' });
      return;
    }

    if (shopName.length > 140) {
      res.status(400).json({ error: 'Company name is too long.' });
      return;
    }

    if (!aiClient) {
      res.status(503).json({
        error: 'Custom logo generation requires GEMINI_API_KEY to be configured in Settings > Secrets.',
      });
      return;
    }

    const promptText = `Design a clean, minimalist vector stationery logo icon specifically representing what this company/shop does: "${shopName}".${
      variation > 0 ? ` Create a fresh distinct variation #${variation + 1}.` : ''
    }`;

    const requestConfig = {
      thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      systemInstruction: [
        'You are a minimalist corporate emblem designer creating crisp 1-color vector icons for printed business letterheads.',
        'Infer the exact industry/product/service from the shop or company name (for example: poultry/eggs -> rooster/egg, marble/granite -> geometric stone/chisel, bakery -> bread/wheat/cake, pharmacy -> mortar/cross, electronics -> microchip/plug, motors/auto -> wheel/wrench, textiles -> spool/fabric, water plant -> droplet/wave, solar -> sun/panel, optics -> eyeglasses, tea/spices -> teacup/leaf, etc.).',
        'Design the emblem centered inside a 64x64 viewBox within safe padding coordinates x=14..50, y=14..50 (do NOT draw an outer square/circle frame border because the UI already supplies the frame).',
        'Use 2 to 8 bold, recognizable geometric SVG shapes (path, circle, rect, polygon, line) with strokeWidth between 2.0 and 2.8.',
        'Keep SVG path d strings simple, valid, and well-proportioned so the mark is immediately legible at 36px-58px print size.',
      ].join(' '),
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          businessWork: {
            type: Type.STRING,
            description:
              'Short 2-4 word description of what the company does (e.g. "Poultry & Hatchery", "Marble & Tiles").',
          },
          shapes: {
            type: Type.ARRAY,
            description:
              'Geometric SVG shapes centered within x=14..50, y=14..50 on a 64x64 viewBox.',
            items: {
              type: Type.OBJECT,
              properties: {
                kind: {
                  type: Type.STRING,
                  description: 'One of: path, circle, rect, polygon, line',
                },
                d: {
                  type: Type.STRING,
                  description: 'SVG path d attribute when kind is path',
                },
                cx: { type: Type.NUMBER },
                cy: { type: Type.NUMBER },
                r: { type: Type.NUMBER },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                width: { type: Type.NUMBER },
                height: { type: Type.NUMBER },
                rx: { type: Type.NUMBER },
                points: {
                  type: Type.STRING,
                  description:
                    'Space-separated x,y pairs when kind is polygon',
                },
                x1: { type: Type.NUMBER },
                y1: { type: Type.NUMBER },
                x2: { type: Type.NUMBER },
                y2: { type: Type.NUMBER },
                filled: {
                  type: Type.BOOLEAN,
                  description:
                    'True for solid filled accent shapes, false for crisp stroked linework',
                },
                strokeWidth: {
                  type: Type.NUMBER,
                  description: 'Stroke thickness between 1.8 and 3.0',
                },
              },
              required: ['kind'],
            },
          },
        },
        required: ['businessWork', 'shapes'],
      },
    };

    try {
      let responseText = '';

      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-4-hydrogen',
          contents: promptText,
          config: requestConfig,
        });
        responseText = (response.text ?? '{}').trim();
      } catch (primaryErr: unknown) {
        const msg =
          primaryErr instanceof Error ? primaryErr.message : String(primaryErr);
        const isTransient =
          msg.includes('503') ||
          msg.includes('429') ||
          msg.includes('UNAVAILABLE') ||
          msg.includes('high demand');
        if (!isTransient) {
          throw primaryErr;
        }
        const fallbackResponse = await aiClient.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: promptText,
          config: {
            ...requestConfig,
            thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
          },
        });
        responseText = (fallbackResponse.text ?? '{}').trim();
      }

      const parsed = JSON.parse(responseText) as {
        businessWork?: string;
        shapes?: unknown;
      };

      const shapes = sanitizeShapes(parsed.shapes);
      if (shapes.length === 0) {
        res.status(502).json({
          error: 'Generated emblem was empty. Please try again.',
        });
        return;
      }

      res.json({
        forShopName: shopName,
        businessWork:
          typeof parsed.businessWork === 'string' && parsed.businessWork.trim()
            ? parsed.businessWork.trim().slice(0, 48)
            : 'Custom Company Emblem',
        shapes,
      });
    } catch (err: unknown) {
      let message =
        err instanceof Error
          ? err.message
          : 'Failed to generate custom company logo.';
      try {
        const parsedErr = JSON.parse(message) as {
          error?: { message?: string; code?: number };
        };
        if (parsedErr?.error?.message) {
          message = parsedErr.error.message;
        }
      } catch {
        // Not JSON error string
      }
      const status =
        message.includes('high demand') || message.includes('UNAVAILABLE')
          ? 503
          : 500;
      res.status(status).json({ error: message });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req: Request, res: Response) => {
      const indexPath = path.join(distDir, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Build output not found. Run npm run build.');
      }
    });
  }

  const port = Number(process.env.PORT) || 3000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`FolioPress server listening on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Server startup failed:', err);
  process.exit(1);
});
