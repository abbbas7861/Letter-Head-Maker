import React from 'react';
import {
  FONT_PRESETS,
  INK_PALETTES,
  LetterheadData,
  PAPER_DIMENSIONS,
} from '../types/letterhead';
import { LogoEmblem } from './LogoEmblem';

interface LetterheadSheetProps {
  data: LetterheadData;
  scale?: number;
}

export const LetterheadSheet: React.FC<LetterheadSheetProps> = ({ data, scale = 1 }) => {
  const paper = PAPER_DIMENSIONS[data.paperSize];
  const ink = INK_PALETTES.find((p) => p.id === data.inkId) ?? INK_PALETTES[0];
  const font = FONT_PRESETS.find((f) => f.id === data.fontPreset) ?? FONT_PRESETS[0];

  const shopName = data.shopName.trim();
  const proprietorName = data.proprietorName.trim();
  const contactNo = data.contactNo.trim();
  const address = data.address.trim();

  const hasAnyInfo = Boolean(shopName || proprietorName || contactNo || address);

  return (
    <div
      className="print-sheet-wrapper origin-top transition-transform duration-150 ease-out"
      style={{
        width: `${paper.pxWidth}px`,
        height: `${paper.pxHeight}px`,
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
      }}
    >
      <div
        className="letterhead-sheet relative bg-white flex flex-col justify-between overflow-hidden shadow-[0_14px_45px_-12px_rgba(28,25,23,0.18),0_0_0_1px_rgba(28,25,23,0.06)]"
        style={{
          width: `${paper.pxWidth}px`,
          height: `${paper.pxHeight}px`,
          fontFamily: font.bodyFamily,
          color: '#1C1917',
        }}
      >
        {/* Framed Heritage outer hairline frame */}
        {data.layout === 'framed' && (
          <div
            className="pointer-events-none absolute inset-6 border"
            style={{ borderColor: ink.rule }}
          />
        )}

        {/* Top subtle accent edge for Classic & Modern */}
        {(data.layout === 'classic' || data.layout === 'modern') && (
          <div
            className="w-full shrink-0"
            style={{
              height: data.layout === 'modern' ? '6px' : '4px',
              backgroundColor: ink.primary,
            }}
          />
        )}

        {/* Header Region */}
        <div
          className={`relative z-10 shrink-0 ${
            data.layout === 'framed' ? 'px-14 pt-12 pb-5' : 'px-12 pt-10 pb-5'
          }`}
        >
          {!hasAnyInfo ? (
            <div className="py-6 text-center border border-dashed border-stone-200 rounded-lg no-print">
              <p className="text-sm text-stone-400">
                Enter your shop name, proprietor, contact number, and address on the left to generate your letterhead.
              </p>
            </div>
          ) : data.layout === 'centered' ? (
            /* Centered Formal Layout */
            <div className="flex flex-col items-center text-center">
              <div className="mb-3">
                <LogoEmblem
                  shopName={shopName}
                  logoMode={data.logoMode}
                  logoFrame={data.logoFrame}
                  selectedIconName={data.selectedIconName}
                  aiLogo={data.aiLogo}
                  customLogoUrl={data.customLogoUrl}
                  primaryColor={ink.primary}
                  tintColor={ink.tint}
                  size={54}
                />
              </div>

              {shopName && (
                <h1
                  className="text-[28px] leading-tight tracking-tight"
                  style={{
                    fontFamily: font.headingFamily,
                    fontWeight: font.headingWeight,
                    color: ink.primary,
                  }}
                >
                  {shopName}
                </h1>
              )}

              {proprietorName && (
                <p
                  className="mt-1 text-[13px] font-medium tracking-wide"
                  style={{ color: ink.muted }}
                >
                  Prop. {proprietorName}
                </p>
              )}

              {(contactNo || address) && (
                <div
                  className="mt-2.5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-[12px] leading-snug max-w-[540px]"
                  style={{ color: '#44403C' }}
                >
                  {contactNo && (
                    <span className="font-medium tabular-nums whitespace-nowrap">
                      Tel: {contactNo}
                    </span>
                  )}
                  {contactNo && address && (
                    <span aria-hidden="true" style={{ color: ink.rule }}>
                      |
                    </span>
                  )}
                  {address && <span>{address}</span>}
                </div>
              )}

              <div className="w-full mt-5 space-y-[3px]">
                <div className="h-[1.5px] w-full" style={{ backgroundColor: ink.primary }} />
                <div className="h-[0.5px] w-full" style={{ backgroundColor: ink.rule }} />
              </div>
            </div>
          ) : data.layout === 'modern' ? (
            /* Modern Minimal Layout */
            <div>
              <div className="flex items-start justify-between gap-8">
                <div className="flex items-center gap-4 min-w-0">
                  <LogoEmblem
                    shopName={shopName}
                    logoMode={data.logoMode}
                    logoFrame={data.logoFrame}
                    selectedIconName={data.selectedIconName}
                    aiLogo={data.aiLogo}
                    customLogoUrl={data.customLogoUrl}
                    primaryColor={ink.primary}
                    tintColor={ink.tint}
                    size={52}
                  />
                  <div className="min-w-0">
                    {shopName && (
                      <h1
                        className="text-[25px] leading-tight tracking-tight"
                        style={{
                          fontFamily: font.headingFamily,
                          fontWeight: font.headingWeight,
                          color: ink.primary,
                        }}
                      >
                        {shopName}
                      </h1>
                    )}
                    {proprietorName && (
                      <p
                        className="mt-1 text-[12.5px] font-medium"
                        style={{ color: ink.muted }}
                      >
                        Proprietor: {proprietorName}
                      </p>
                    )}
                  </div>
                </div>

                {(contactNo || address) && (
                  <div
                    className="text-right text-[12px] leading-relaxed max-w-[260px] shrink-0"
                    style={{ color: '#44403C' }}
                  >
                    {contactNo && (
                      <p className="font-semibold tabular-nums" style={{ color: ink.primary }}>
                        {contactNo}
                      </p>
                    )}
                    {address && <p className="mt-0.5">{address}</p>}
                  </div>
                )}
              </div>

              <div
                className="mt-5 h-[1.5px] w-full"
                style={{ backgroundColor: ink.primary, opacity: 0.85 }}
              />
            </div>
          ) : data.layout === 'framed' ? (
            /* Framed Heritage Layout */
            <div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <LogoEmblem
                    shopName={shopName}
                    logoMode={data.logoMode}
                    logoFrame={data.logoFrame}
                    selectedIconName={data.selectedIconName}
                    aiLogo={data.aiLogo}
                    customLogoUrl={data.customLogoUrl}
                    primaryColor={ink.primary}
                    tintColor={ink.tint}
                    size={54}
                  />
                  <div className="min-w-0">
                    {shopName && (
                      <h1
                        className="text-[25px] leading-tight tracking-tight"
                        style={{
                          fontFamily: font.headingFamily,
                          fontWeight: font.headingWeight,
                          color: ink.primary,
                        }}
                      >
                        {shopName}
                      </h1>
                    )}
                    {proprietorName && (
                      <p className="mt-1 text-[12.5px] font-medium" style={{ color: ink.muted }}>
                        Prop. {proprietorName}
                      </p>
                    )}
                  </div>
                </div>

                {(contactNo || address) && (
                  <div
                    className="text-right text-[12px] leading-relaxed max-w-[250px] shrink-0"
                    style={{ color: '#44403C' }}
                  >
                    {contactNo && (
                      <p className="font-medium tabular-nums" style={{ color: ink.primary }}>
                        {contactNo}
                      </p>
                    )}
                    {address && <p className="mt-0.5">{address}</p>}
                  </div>
                )}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-[1px] flex-1" style={{ backgroundColor: ink.primary }} />
                <div
                  className="w-1.5 h-1.5 rotate-45 shrink-0"
                  style={{ backgroundColor: ink.primary }}
                />
                <div className="h-[1px] flex-1" style={{ backgroundColor: ink.primary }} />
              </div>
            </div>
          ) : (
            /* Classic Executive Layout (Default) */
            <div>
              <div className="flex items-center justify-between gap-6">
                <div className="flex items-center gap-4 min-w-0">
                  <LogoEmblem
                    shopName={shopName}
                    logoMode={data.logoMode}
                    logoFrame={data.logoFrame}
                    selectedIconName={data.selectedIconName}
                    aiLogo={data.aiLogo}
                    customLogoUrl={data.customLogoUrl}
                    primaryColor={ink.primary}
                    tintColor={ink.tint}
                    size={58}
                  />
                  <div className="min-w-0">
                    {shopName && (
                      <h1
                        className="text-[27px] leading-tight tracking-tight"
                        style={{
                          fontFamily: font.headingFamily,
                          fontWeight: font.headingWeight,
                          color: ink.primary,
                        }}
                      >
                        {shopName}
                      </h1>
                    )}
                    {proprietorName && (
                      <p className="mt-1 text-[13px] font-medium" style={{ color: ink.muted }}>
                        Prop. {proprietorName}
                      </p>
                    )}
                  </div>
                </div>

                {(contactNo || address) && (
                  <div
                    className="text-right text-[12px] leading-relaxed max-w-[260px] shrink-0"
                    style={{ color: '#44403C' }}
                  >
                    {contactNo && (
                      <p className="font-semibold tabular-nums" style={{ color: ink.primary }}>
                        Ph: {contactNo}
                      </p>
                    )}
                    {address && <p className="mt-0.5">{address}</p>}
                  </div>
                )}
              </div>

              <div className="mt-5 space-y-[3px]">
                <div className="h-[1.5px] w-full" style={{ backgroundColor: ink.primary }} />
                <div className="h-[0.5px] w-full" style={{ backgroundColor: ink.rule }} />
              </div>
            </div>
          )}
        </div>

        {/* Remaining Page: Intentionally Clean & Blank Writing Space */}
        <div className="flex-1" />

        {/* Optional ultra-clean bottom hairline */}
        {data.showBottomRule && (
          <div
            className={`relative z-10 shrink-0 ${
              data.layout === 'framed' ? 'px-14 pb-10' : 'px-12 pb-8'
            }`}
          >
            <div className="h-[1px] w-full" style={{ backgroundColor: ink.rule }} />
          </div>
        )}
      </div>
    </div>
  );
};
