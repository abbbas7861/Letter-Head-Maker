export type LayoutStyle = 'classic' | 'centered' | 'modern' | 'framed';

export type PaperSize = 'a4' | 'letter';

export type FontPresetId = 'editorial' | 'modern' | 'heritage' | 'formal';

export type LogoMode = 'auto' | 'icon' | 'ai' | 'monogram' | 'custom';

export type LogoFrame = 'rounded' | 'circle' | 'hexagon' | 'shield' | 'minimal';

export interface AiSvgShape {
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

export interface AiLogoData {
  forShopName: string;
  businessWork: string;
  shapes: AiSvgShape[];
}

export interface InkPalette {
  id: string;
  name: string;
  primary: string;
  muted: string;
  rule: string;
  tint: string;
}

export interface FontPreset {
  id: FontPresetId;
  name: string;
  headingFamily: string;
  bodyFamily: string;
  headingWeight: number;
}

export interface LetterheadData {
  id: string;
  shopName: string;
  proprietorName: string;
  contactNo: string;
  address: string;
  logoMode: LogoMode;
  logoFrame: LogoFrame;
  selectedIconName?: string;
  aiLogo?: AiLogoData;
  customLogoUrl?: string;
  layout: LayoutStyle;
  paperSize: PaperSize;
  fontPreset: FontPresetId;
  inkId: string;
  showBottomRule: boolean;
}

export const INK_PALETTES: InkPalette[] = [
  {
    id: 'navy',
    name: 'Executive Navy',
    primary: '#1B365D',
    muted: '#475569',
    rule: '#CBD5E1',
    tint: '#F1F5F9',
  },
  {
    id: 'charcoal',
    name: 'Charcoal Ink',
    primary: '#1C1917',
    muted: '#57534E',
    rule: '#D6D3D1',
    tint: '#F5F5F4',
  },
  {
    id: 'forest',
    name: 'Forest Ink',
    primary: '#14532D',
    muted: '#4B5563',
    rule: '#D1D5DB',
    tint: '#F0FDF4',
  },
  {
    id: 'burgundy',
    name: 'Burgundy',
    primary: '#7F1D1D',
    muted: '#57534E',
    rule: '#E7E5E4',
    tint: '#FEF2F2',
  },
  {
    id: 'bronze',
    name: 'Warm Bronze',
    primary: '#78350F',
    muted: '#57534E',
    rule: '#E7E5E4',
    tint: '#FFFBEB',
  },
  {
    id: 'slate',
    name: 'Prussian Blue',
    primary: '#0F4C81',
    muted: '#475569',
    rule: '#CBD5E1',
    tint: '#F0F9FF',
  },
];

export const FONT_PRESETS: FontPreset[] = [
  {
    id: 'editorial',
    name: 'Editorial Serif',
    headingFamily: '"Playfair Display", Georgia, serif',
    bodyFamily: '"DM Sans", system-ui, sans-serif',
    headingWeight: 700,
  },
  {
    id: 'modern',
    name: 'Modern Sans',
    headingFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    bodyFamily: '"DM Sans", system-ui, sans-serif',
    headingWeight: 700,
  },
  {
    id: 'heritage',
    name: 'Heritage Classic',
    headingFamily: '"Cormorant Garamond", Georgia, serif',
    bodyFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    headingWeight: 700,
  },
  {
    id: 'formal',
    name: 'Formal Crest',
    headingFamily: '"Cinzel", Georgia, serif',
    bodyFamily: '"Source Serif 4", Georgia, serif',
    headingWeight: 700,
  },
];

export const PAPER_DIMENSIONS: Record<
  PaperSize,
  {
    label: string;
    mmWidth: number;
    mmHeight: number;
    pxWidth: number;
    pxHeight: number;
    exportWidth: number;
    exportHeight: number;
    cssSize: string;
  }
> = {
  a4: {
    label: 'A4 (210 × 297 mm)',
    mmWidth: 210,
    mmHeight: 297,
    pxWidth: 794,
    pxHeight: 1123,
    exportWidth: 2480,
    exportHeight: 3508,
    cssSize: 'A4 portrait',
  },
  letter: {
    label: 'US Letter (8.5 × 11 in)',
    mmWidth: 215.9,
    mmHeight: 279.4,
    pxWidth: 816,
    pxHeight: 1056,
    exportWidth: 2550,
    exportHeight: 3300,
    cssSize: 'letter portrait',
  },
};
