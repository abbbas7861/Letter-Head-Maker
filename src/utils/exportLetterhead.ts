import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { LogoEmblem } from '../components/LogoEmblem';
import {
  FONT_PRESETS,
  INK_PALETTES,
  LetterheadData,
  PAPER_DIMENSIONS,
} from '../types/letterhead';

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  if (!text.trim()) return [];
  const words = text.trim().split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width <= maxWidth) {
      current = test;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function getSafeFileName(shopName: string, ext: string): string {
  const slug = (shopName || 'letterhead')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `${slug || 'letterhead'}-letterhead.${ext}`;
}

function triggerDownload(url: string, filename: string) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function buildRenderedLogoSvg(
  data: LetterheadData,
  primaryColor: string,
  tintColor: string,
  size = 64
): string {
  return renderToStaticMarkup(
    React.createElement(LogoEmblem, {
      shopName: data.shopName.trim(),
      logoMode: data.logoMode === 'custom' ? 'auto' : data.logoMode,
      logoFrame: data.logoFrame,
      selectedIconName: data.selectedIconName,
      aiLogo: data.aiLogo,
      primaryColor,
      tintColor,
      size,
    })
  );
}

export async function exportAsPng(data: LetterheadData): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts?.ready) {
    await document.fonts.ready;
  }

  const paper = PAPER_DIMENSIONS[data.paperSize];
  const ink = INK_PALETTES.find((p) => p.id === data.inkId) ?? INK_PALETTES[0];
  const font = FONT_PRESETS.find((f) => f.id === data.fontPreset) ?? FONT_PRESETS[0];

  const scale = paper.exportWidth / paper.pxWidth;
  const canvas = document.createElement('canvas');
  canvas.width = paper.exportWidth;
  canvas.height = paper.exportHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not initialize canvas context');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.scale(scale, scale);

  const W = paper.pxWidth;
  const H = paper.pxHeight;

  const shopName = data.shopName.trim();
  const proprietorName = data.proprietorName.trim();
  const contactNo = data.contactNo.trim();
  const address = data.address.trim();

  let logoImg: HTMLImageElement | null = null;
  try {
    if (data.logoMode === 'custom' && data.customLogoUrl) {
      logoImg = await loadImage(data.customLogoUrl);
    } else {
      const svgMarkup = buildRenderedLogoSvg(data, ink.primary, ink.tint, 128);
      const encoded = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgMarkup)}`;
      logoImg = await loadImage(encoded);
    }
  } catch {
    logoImg = null;
  }

  if (data.layout === 'framed') {
    ctx.strokeStyle = ink.rule;
    ctx.lineWidth = 1;
    ctx.strokeRect(24, 24, W - 48, H - 48);
  }

  if (data.layout === 'classic' || data.layout === 'modern') {
    ctx.fillStyle = ink.primary;
    ctx.fillRect(0, 0, W, data.layout === 'modern' ? 6 : 4);
  }

  const padX = data.layout === 'framed' ? 56 : 48;
  const padTop = data.layout === 'framed' ? 48 : 40;

  if (data.layout === 'centered') {
    const centerX = W / 2;
    let cursorY = padTop;
    const logoSize = 54;

    if (logoImg) {
      drawContainedImage(ctx, logoImg, centerX - logoSize / 2, cursorY, logoSize, logoSize);
      cursorY += logoSize + 12;
    }

    if (shopName) {
      ctx.font = `${font.headingWeight} 28px ${font.headingFamily}`;
      ctx.fillStyle = ink.primary;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const titleLines = wrapLines(ctx, shopName, W - padX * 2);
      for (const line of titleLines) {
        ctx.fillText(line, centerX, cursorY);
        cursorY += 34;
      }
    }

    if (proprietorName) {
      cursorY += 2;
      ctx.font = `500 13px ${font.bodyFamily}`;
      ctx.fillStyle = ink.muted;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.fillText(`Prop. ${proprietorName}`, centerX, cursorY);
      cursorY += 20;
    }

    const contactLineParts: string[] = [];
    if (contactNo) contactLineParts.push(`Tel: ${contactNo}`);
    if (address) contactLineParts.push(address);
    const combinedContact = contactLineParts.join('  |  ');

    if (combinedContact) {
      cursorY += 4;
      ctx.font = `400 12px ${font.bodyFamily}`;
      ctx.fillStyle = '#44403C';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      const cLines = wrapLines(ctx, combinedContact, 540);
      for (const line of cLines) {
        ctx.fillText(line, centerX, cursorY);
        cursorY += 17;
      }
    }

    cursorY += 16;
    ctx.fillStyle = ink.primary;
    ctx.fillRect(padX, cursorY, W - padX * 2, 1.5);
    ctx.fillStyle = ink.rule;
    ctx.fillRect(padX, cursorY + 4.5, W - padX * 2, 0.5);
  } else {
    const logoSize = data.layout === 'classic' ? 58 : data.layout === 'framed' ? 54 : 52;
    const rightColMaxW = 250;
    const leftGap = 16;
    const leftTextMaxW = W - padX * 2 - rightColMaxW - 24 - (logoImg ? logoSize + leftGap : 0);

    let leftTextH = 0;
    let titleLines: string[] = [];
    if (shopName) {
      const titleSize = data.layout === 'classic' ? 27 : 25;
      ctx.font = `${font.headingWeight} ${titleSize}px ${font.headingFamily}`;
      titleLines = wrapLines(ctx, shopName, Math.max(200, leftTextMaxW));
      leftTextH += titleLines.length * (titleSize + 6);
    }
    if (proprietorName) {
      leftTextH += 18;
    }

    ctx.font = `400 12px ${font.bodyFamily}`;
    const addrLines = address ? wrapLines(ctx, address, rightColMaxW) : [];
    const rightH = (contactNo ? 18 : 0) + addrLines.length * 18;

    const headerBlockH = Math.max(logoSize, leftTextH, rightH);
    const centerY = padTop + headerBlockH / 2;

    if (logoImg) {
      drawContainedImage(ctx, logoImg, padX, centerY - logoSize / 2, logoSize, logoSize);
    }

    const textStartX = padX + (logoImg ? logoSize + leftGap : 0);
    let leftY = centerY - leftTextH / 2;

    if (titleLines.length > 0) {
      const titleSize = data.layout === 'classic' ? 27 : 25;
      ctx.font = `${font.headingWeight} ${titleSize}px ${font.headingFamily}`;
      ctx.fillStyle = ink.primary;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      for (const line of titleLines) {
        ctx.fillText(line, textStartX, leftY);
        leftY += titleSize + 5;
      }
    }

    if (proprietorName) {
      leftY += 2;
      ctx.font = `500 12.5px ${font.bodyFamily}`;
      ctx.fillStyle = ink.muted;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const propLabel =
        data.layout === 'modern' ? `Proprietor: ${proprietorName}` : `Prop. ${proprietorName}`;
      ctx.fillText(propLabel, textStartX, leftY);
    }

    let rightY = data.layout === 'modern' ? padTop + 2 : centerY - rightH / 2;
    const rightX = W - padX;

    if (contactNo) {
      ctx.font = `600 12px ${font.bodyFamily}`;
      ctx.fillStyle = ink.primary;
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      const phoneLabel = data.layout === 'classic' ? `Ph: ${contactNo}` : contactNo;
      ctx.fillText(phoneLabel, rightX, rightY);
      rightY += 18;
    }

    if (addrLines.length > 0) {
      ctx.font = `400 12px ${font.bodyFamily}`;
      ctx.fillStyle = '#44403C';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'top';
      for (const line of addrLines) {
        ctx.fillText(line, rightX, rightY);
        rightY += 17;
      }
    }

    const dividerY = padTop + headerBlockH + 20;

    if (data.layout === 'modern') {
      ctx.fillStyle = ink.primary;
      ctx.globalAlpha = 0.85;
      ctx.fillRect(padX, dividerY, W - padX * 2, 1.5);
      ctx.globalAlpha = 1;
    } else if (data.layout === 'framed') {
      const midX = W / 2;
      ctx.fillStyle = ink.primary;
      ctx.fillRect(padX, dividerY, W / 2 - padX - 14, 1);
      ctx.fillRect(midX + 14, dividerY, W / 2 - padX - 14, 1);
      ctx.save();
      ctx.translate(midX, dividerY + 0.5);
      ctx.rotate(Math.PI / 4);
      ctx.fillRect(-3, -3, 6, 6);
      ctx.restore();
    } else {
      ctx.fillStyle = ink.primary;
      ctx.fillRect(padX, dividerY, W - padX * 2, 1.5);
      ctx.fillStyle = ink.rule;
      ctx.fillRect(padX, dividerY + 4.5, W - padX * 2, 0.5);
    }
  }

  if (data.showBottomRule) {
    const bottomPad = data.layout === 'framed' ? 40 : 32;
    ctx.fillStyle = ink.rule;
    ctx.fillRect(padX, H - bottomPad, W - padX * 2, 1);
  }

  ctx.restore();

  const dataUrl = canvas.toDataURL('image/png', 1.0);
  triggerDownload(dataUrl, getSafeFileName(data.shopName, 'png'));
}

function drawContainedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  boxW: number,
  boxH: number
) {
  const ratio = Math.min(boxW / img.width, boxH / img.height);
  const drawW = img.width * ratio;
  const drawH = img.height * ratio;
  const offsetX = x + (boxW - drawW) / 2;
  const offsetY = y + (boxH - drawH) / 2;
  ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function exportAsSvg(data: LetterheadData): void {
  const paper = PAPER_DIMENSIONS[data.paperSize];
  const ink = INK_PALETTES.find((p) => p.id === data.inkId) ?? INK_PALETTES[0];
  const font = FONT_PRESETS.find((f) => f.id === data.fontPreset) ?? FONT_PRESETS[0];

  const W = paper.pxWidth;
  const H = paper.pxHeight;
  const shopName = data.shopName.trim();
  const proprietorName = data.proprietorName.trim();
  const contactNo = data.contactNo.trim();
  const address = data.address.trim();

  let logoEmbed = '';
  const padX = data.layout === 'framed' ? 56 : 48;
  const padTop = data.layout === 'framed' ? 48 : 40;
  const logoSize =
    data.layout === 'centered'
      ? 54
      : data.layout === 'classic'
      ? 58
      : data.layout === 'framed'
      ? 54
      : 52;

  const logoX = data.layout === 'centered' ? W / 2 - logoSize / 2 : padX;
  const logoY = padTop;

  if (data.logoMode === 'custom' && data.customLogoUrl) {
    logoEmbed = `<image href="${escapeXml(data.customLogoUrl)}" x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>`;
  } else {
    const rawSvg = buildRenderedLogoSvg(data, ink.primary, ink.tint, logoSize);
    logoEmbed = `<svg x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" viewBox="0 0 64 64">${rawSvg
      .replace(/^<svg[^>]*>/, '')
      .replace(/<\/svg>$/, '')}</svg>`;
  }

  let bodySvg = '';

  if (data.layout === 'framed') {
    bodySvg += `<rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="${ink.rule}" stroke-width="1"/>`;
  }
  if (data.layout === 'classic' || data.layout === 'modern') {
    bodySvg += `<rect x="0" y="0" width="${W}" height="${data.layout === 'modern' ? 6 : 4}" fill="${ink.primary}"/>`;
  }

  if (data.layout === 'centered') {
    const cx = W / 2;
    let y = padTop + logoSize + 34;
    if (shopName) {
      bodySvg += `<text x="${cx}" y="${y}" text-anchor="middle" fill="${ink.primary}" font-family="${escapeXml(font.headingFamily)}" font-weight="${font.headingWeight}" font-size="28">${escapeXml(shopName)}</text>`;
      y += 22;
    }
    if (proprietorName) {
      bodySvg += `<text x="${cx}" y="${y}" text-anchor="middle" fill="${ink.muted}" font-family="${escapeXml(font.bodyFamily)}" font-weight="500" font-size="13">Prop. ${escapeXml(proprietorName)}</text>`;
      y += 22;
    }
    const contactJoined = [contactNo ? `Tel: ${contactNo}` : '', address]
      .filter(Boolean)
      .join('  |  ');
    if (contactJoined) {
      bodySvg += `<text x="${cx}" y="${y}" text-anchor="middle" fill="#44403C" font-family="${escapeXml(font.bodyFamily)}" font-size="12">${escapeXml(contactJoined)}</text>`;
      y += 20;
    }
    bodySvg += `<rect x="${padX}" y="${y}" width="${W - padX * 2}" height="1.5" fill="${ink.primary}"/>`;
    bodySvg += `<rect x="${padX}" y="${y + 4.5}" width="${W - padX * 2}" height="0.5" fill="${ink.rule}"/>`;
  } else {
    const leftTextX = padX + logoSize + 16;
    const titleY = padTop + 26;
    if (shopName) {
      bodySvg += `<text x="${leftTextX}" y="${titleY}" fill="${ink.primary}" font-family="${escapeXml(font.headingFamily)}" font-weight="${font.headingWeight}" font-size="${data.layout === 'classic' ? 27 : 25}">${escapeXml(shopName)}</text>`;
    }
    if (proprietorName) {
      const propLabel =
        data.layout === 'modern' ? `Proprietor: ${proprietorName}` : `Prop. ${proprietorName}`;
      bodySvg += `<text x="${leftTextX}" y="${titleY + 22}" fill="${ink.muted}" font-family="${escapeXml(font.bodyFamily)}" font-weight="500" font-size="12.5">${escapeXml(propLabel)}</text>`;
    }
    const rightX = W - padX;
    let rightY = padTop + 18;
    if (contactNo) {
      const phoneLabel = data.layout === 'classic' ? `Ph: ${contactNo}` : contactNo;
      bodySvg += `<text x="${rightX}" y="${rightY}" text-anchor="end" fill="${ink.primary}" font-family="${escapeXml(font.bodyFamily)}" font-weight="600" font-size="12">${escapeXml(phoneLabel)}</text>`;
      rightY += 18;
    }
    if (address) {
      bodySvg += `<text x="${rightX}" y="${rightY}" text-anchor="end" fill="#44403C" font-family="${escapeXml(font.bodyFamily)}" font-size="12">${escapeXml(address)}</text>`;
    }
    const divY = padTop + logoSize + 24;
    if (data.layout === 'modern') {
      bodySvg += `<rect x="${padX}" y="${divY}" width="${W - padX * 2}" height="1.5" fill="${ink.primary}" opacity="0.85"/>`;
    } else if (data.layout === 'framed') {
      const mid = W / 2;
      bodySvg += `<rect x="${padX}" y="${divY}" width="${mid - padX - 14}" height="1" fill="${ink.primary}"/>`;
      bodySvg += `<rect x="${mid + 14}" y="${divY}" width="${mid - padX - 14}" height="1" fill="${ink.primary}"/>`;
      bodySvg += `<rect x="${mid - 3}" y="${divY - 2.5}" width="6" height="6" transform="rotate(45 ${mid} ${divY + 0.5})" fill="${ink.primary}"/>`;
    } else {
      bodySvg += `<rect x="${padX}" y="${divY}" width="${W - padX * 2}" height="1.5" fill="${ink.primary}"/>`;
      bodySvg += `<rect x="${padX}" y="${divY + 4.5}" width="${W - padX * 2}" height="0.5" fill="${ink.rule}"/>`;
    }
  }

  if (data.showBottomRule) {
    const bottomPad = data.layout === 'framed' ? 40 : 32;
    bodySvg += `<rect x="${padX}" y="${H - bottomPad}" width="${W - padX * 2}" height="1" fill="${ink.rule}"/>`;
  }

  const svgDoc = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${paper.mmWidth}mm" height="${paper.mmHeight}mm" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="#FFFFFF"/>
  ${logoEmbed}
  ${bodySvg}
</svg>`;

  const blob = new Blob([svgDoc], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  triggerDownload(url, getSafeFileName(data.shopName, 'svg'));
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
