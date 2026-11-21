import React from 'react';
import { icons } from 'lucide-react';
import {
  AiLogoData,
  AiSvgShape,
  LogoFrame,
  LogoMode,
} from '../types/letterhead';
import {
  detectBestLogo,
  extractInitials,
  LucideIconName,
} from '../utils/logoMatcher';

interface LogoEmblemProps {
  shopName: string;
  logoMode: LogoMode;
  logoFrame?: LogoFrame;
  selectedIconName?: string;
  aiLogo?: AiLogoData;
  customLogoUrl?: string;
  primaryColor: string;
  tintColor: string;
  size?: number;
  className?: string;
}

function renderFrameBackground(
  frame: LogoFrame,
  primaryColor: string,
  tintColor: string
) {
  switch (frame) {
    case 'circle':
      return (
        <circle
          cx="32"
          cy="32"
          r="28"
          fill={tintColor}
          stroke={primaryColor}
          strokeWidth="2.2"
        />
      );
    case 'hexagon':
      return (
        <polygon
          points="32,4 56,18 56,46 32,60 8,46 8,18"
          fill={tintColor}
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      );
    case 'shield':
      return (
        <path
          d="M32 4L54 12V31C54 45 44.5 54.5 32 60C19.5 54.5 10 45 10 31V12L32 4Z"
          fill={tintColor}
          stroke={primaryColor}
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
      );
    case 'minimal':
      return null;
    case 'rounded':
    default:
      return (
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="12"
          fill={tintColor}
          stroke={primaryColor}
          strokeWidth="2.2"
        />
      );
  }
}

function renderAiShape(
  shape: AiSvgShape,
  idx: number,
  primaryColor: string
) {
  const fill = shape.filled ? primaryColor : 'none';
  const stroke = primaryColor;
  const sw = shape.strokeWidth ?? 2.2;

  switch (shape.kind) {
    case 'path':
      return shape.d ? (
        <path
          key={idx}
          d={shape.d}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : null;
    case 'circle':
      return (
        <circle
          key={idx}
          cx={shape.cx ?? 32}
          cy={shape.cy ?? 32}
          r={shape.r ?? 8}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case 'rect':
      return (
        <rect
          key={idx}
          x={shape.x ?? 18}
          y={shape.y ?? 18}
          width={shape.width ?? 20}
          height={shape.height ?? 20}
          rx={shape.rx ?? 0}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
        />
      );
    case 'polygon':
      return shape.points ? (
        <polygon
          key={idx}
          points={shape.points}
          fill={fill}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinejoin="round"
        />
      ) : null;
    case 'line':
      return (
        <line
          key={idx}
          x1={shape.x1 ?? 18}
          y1={shape.y1 ?? 32}
          x2={shape.x2 ?? 46}
          y2={shape.y2 ?? 32}
          stroke={stroke}
          strokeWidth={sw}
          strokeLinecap="round"
        />
      );
    default:
      return null;
  }
}

export const LogoEmblem: React.FC<LogoEmblemProps> = ({
  shopName,
  logoMode,
  logoFrame = 'rounded',
  selectedIconName,
  aiLogo,
  customLogoUrl,
  primaryColor,
  tintColor,
  size = 56,
  className = '',
}) => {
  if (logoMode === 'custom' && customLogoUrl) {
    return (
      <div
        className={`flex items-center justify-center overflow-hidden rounded-md shrink-0 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={customLogoUrl}
          alt={`${shopName || 'Company'} logo`}
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
    );
  }

  if (logoMode === 'monogram') {
    const initials = extractInitials(shopName);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        className={`shrink-0 ${className}`}
        aria-label={`${shopName || 'Company'} monogram`}
      >
        <rect x="5" y="5" width="54" height="54" rx="10" fill={primaryColor} />
        <rect
          x="9"
          y="9"
          width="46"
          height="46"
          rx="7"
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <text
          x="32"
          y="39"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Georgia, serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="1.5"
        >
          {initials}
        </text>
      </svg>
    );
  }

  if (logoMode === 'ai' && aiLogo && aiLogo.shapes.length > 0) {
    const innerScale = logoFrame === 'minimal' ? 1.15 : 0.92;
    const offset = 32 * (1 - innerScale);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        fill="none"
        className={`shrink-0 ${className}`}
        aria-label={`${shopName || 'Company'} custom logo`}
      >
        {renderFrameBackground(logoFrame, primaryColor, tintColor)}
        <g transform={`translate(${offset}, ${offset}) scale(${innerScale})`}>
          {aiLogo.shapes.map((shape, i) => renderAiShape(shape, i, primaryColor))}
        </g>
      </svg>
    );
  }

  // Resolve Lucide icon for 'auto' or 'icon'
  const autoMatch = detectBestLogo(shopName);
  const resolvedName: LucideIconName =
    logoMode === 'icon' &&
    selectedIconName &&
    Object.prototype.hasOwnProperty.call(icons, selectedIconName)
      ? (selectedIconName as LucideIconName)
      : autoMatch.iconName;

  const IconComp = icons[resolvedName] ?? icons.Store;
  const iconSize = logoFrame === 'minimal' ? 42 : 28;
  const iconOffset = (64 - iconSize) / 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      className={`shrink-0 ${className}`}
      aria-label={`${shopName || 'Company'} emblem`}
    >
      {renderFrameBackground(logoFrame, primaryColor, tintColor)}
      <g transform={`translate(${iconOffset}, ${iconOffset})`}>
        <IconComp
          size={iconSize}
          color={primaryColor}
          strokeWidth={1.9}
        />
      </g>
    </svg>
  );
};
