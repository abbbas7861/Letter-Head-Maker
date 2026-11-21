import React, { useMemo, useRef, useState } from 'react';
import {
  icons,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  FONT_PRESETS,
  FontPresetId,
  INK_PALETTES,
  LayoutStyle,
  LetterheadData,
  LogoFrame,
  PAPER_DIMENSIONS,
  PaperSize,
} from '../types/letterhead';
import {
  ALL_ICON_NAMES,
  detectBestLogo,
  searchAllLogos,
} from '../utils/logoMatcher';
import { LogoEmblem } from './LogoEmblem';

interface EditorSidebarProps {
  data: LetterheadData;
  onChange: (patch: Partial<LetterheadData>) => void;
  onResetSample: () => void;
  onClearFields: () => void;
  onFetchCustomLogo: () => void;
  isFetchingLogo: boolean;
  logoError: string | null;
}

const LAYOUT_OPTIONS: { id: LayoutStyle; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'centered', label: 'Centered' },
  { id: 'modern', label: 'Modern' },
  { id: 'framed', label: 'Framed' },
];

const FRAME_OPTIONS: { id: LogoFrame; label: string }[] = [
  { id: 'rounded', label: 'Rounded' },
  { id: 'circle', label: 'Circle' },
  { id: 'hexagon', label: 'Hex' },
  { id: 'shield', label: 'Shield' },
  { id: 'minimal', label: 'Plain' },
];

export const EditorSidebar: React.FC<EditorSidebarProps> = ({
  data,
  onChange,
  onResetSample,
  onClearFields,
  onFetchCustomLogo,
  isFetchingLogo,
  logoError,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [iconSearch, setIconSearch] = useState('');
  const [showBrowser, setShowBrowser] = useState(false);

  const currentInk =
    INK_PALETTES.find((p) => p.id === data.inkId) ?? INK_PALETTES[0];
  const autoMatch = detectBestLogo(data.shopName);

  const searchResults = useMemo(() => {
    return searchAllLogos(iconSearch, 84);
  }, [iconSearch]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setShowBrowser(false);
        onChange({
          logoMode: 'custom',
          customLogoUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const statusText =
    data.logoMode === 'custom'
      ? 'Custom uploaded image'
      : data.logoMode === 'monogram'
      ? 'Monogram initials'
      : data.logoMode === 'ai' && data.aiLogo
      ? `Fetched · ${data.aiLogo.businessWork}`
      : data.logoMode === 'icon' && data.selectedIconName
      ? `Icon · ${data.selectedIconName}`
      : `Auto · ${autoMatch.matchedLabel}`;

  const activeTab =
    showBrowser || data.logoMode === 'icon'
      ? 'browse'
      : data.logoMode === 'monogram'
      ? 'monogram'
      : 'auto';

  return (
    <aside className="w-full lg:w-[400px] xl:w-[420px] shrink-0 bg-white border-r border-stone-200 flex flex-col h-full overflow-y-auto no-print">
      <div className="p-6 space-y-6">
        {/* Section 1: The 4 Essential Inputs */}
        <section aria-labelledby="company-details-heading">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2
              id="company-details-heading"
              className="text-sm font-semibold text-stone-900 tracking-tight"
            >
              Company Details
            </h2>
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={onResetSample}
                className="inline-flex items-center gap-1 text-stone-500 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Sample</span>
              </button>
              <span className="text-stone-300" aria-hidden="true">
                /
              </span>
              <button
                type="button"
                onClick={onClearFields}
                className="inline-flex items-center gap-1 text-stone-500 hover:text-red-700 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          <div className="space-y-3.5">
            <div>
              <label
                htmlFor="shop-name"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Shop / Company Name
              </label>
              <input
                id="shop-name"
                type="text"
                value={data.shopName}
                onChange={(e) => onChange({ shopName: e.target.value })}
                placeholder="e.g. Green Valley Poultry & Hatchery"
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="proprietor-name"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Proprietor Name
              </label>
              <input
                id="proprietor-name"
                type="text"
                value={data.proprietorName}
                onChange={(e) => onChange({ proprietorName: e.target.value })}
                placeholder="e.g. Muhammad Tariq"
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-no"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Contact No.
              </label>
              <input
                id="contact-no"
                type="text"
                value={data.contactNo}
                onChange={(e) => onChange({ contactNo: e.target.value })}
                placeholder="e.g. +92 300 4128900"
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg placeholder:text-stone-400 tabular-nums focus:outline-none focus:bg-white focus:border-stone-900 transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="shop-address"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Address
              </label>
              <textarea
                id="shop-address"
                rows={2}
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="e.g. Shop #14, Main Liberty Market, Gulberg III, Lahore"
                className="w-full px-3.5 py-2.5 text-sm text-stone-900 bg-stone-50 border border-stone-200 rounded-lg placeholder:text-stone-400 resize-none focus:outline-none focus:bg-white focus:border-stone-900 transition-colors"
              />
            </div>
          </div>
        </section>

        <hr className="border-stone-200" />

        {/* Section 2: Smart Company Logo (Unlimited via Name + 1,638+ Searchable Library) */}
        <section aria-labelledby="logo-heading" className="space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h2
              id="logo-heading"
              className="text-sm font-semibold text-stone-900 tracking-tight"
            >
              Company Logo
            </h2>
            <span className="text-xs text-stone-500 truncate max-w-[210px]">
              {isFetchingLogo ? 'Fetching logo for company…' : statusText}
            </span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-lg border border-stone-200 bg-stone-50 flex items-center justify-center shrink-0 p-1 relative">
              {isFetchingLogo ? (
                <Loader2 className="w-5 h-5 text-stone-500 animate-spin" />
              ) : (
                <LogoEmblem
                  shopName={data.shopName}
                  logoMode={data.logoMode}
                  logoFrame={data.logoFrame}
                  selectedIconName={data.selectedIconName}
                  aiLogo={data.aiLogo}
                  customLogoUrl={data.customLogoUrl}
                  primaryColor={currentInk.primary}
                  tintColor={currentInk.tint}
                  size={38}
                />
              )}
            </div>

            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 rounded-lg flex-1">
              <button
                type="button"
                onClick={() => {
                  setShowBrowser(false);
                  onChange({
                    logoMode:
                      data.aiLogo &&
                      data.aiLogo.forShopName.toLowerCase() ===
                        data.shopName.trim().toLowerCase()
                        ? 'ai'
                        : 'auto',
                  });
                }}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'auto'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Auto Match
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBrowser(true);
                  if (data.logoMode !== 'icon') {
                    onChange({
                      logoMode: 'icon',
                      selectedIconName:
                        data.selectedIconName || autoMatch.iconName,
                    });
                  }
                }}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums ${
                  activeTab === 'browse'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Browse {ALL_ICON_NAMES.length.toLocaleString()}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowBrowser(false);
                  onChange({ logoMode: 'monogram' });
                }}
                className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  activeTab === 'monogram'
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Initials
              </button>
            </div>
          </div>

          {/* Searchable 1,638+ Logo Library Browser */}
          {showBrowser && (
            <div className="space-y-2.5 pt-1">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={iconSearch}
                  onChange={(e) => setIconSearch(e.target.value)}
                  placeholder="Search logos by business or object (e.g. poultry, solar, car)…"
                  className="w-full pl-8 pr-3 py-2 text-xs text-stone-900 bg-stone-50 border border-stone-200 rounded-lg placeholder:text-stone-400 focus:outline-none focus:bg-white focus:border-stone-900"
                />
              </div>

              {searchResults.length === 0 ? (
                <p className="text-xs text-stone-500 py-4 text-center border border-stone-200 rounded-lg">
                  No icons found for &ldquo;{iconSearch}&rdquo;. Try another keyword or click Fetch Custom Logo below.
                </p>
              ) : (
                <div className="grid grid-cols-7 gap-1.5 max-h-44 overflow-y-auto p-1 border border-stone-200 rounded-lg bg-stone-50/60">
                  {searchResults.map((iconName) => {
                    const IconComp = icons[iconName];
                    const selected =
                      data.logoMode === 'icon' &&
                      data.selectedIconName === iconName;
                    return (
                      <button
                        key={iconName}
                        type="button"
                        title={iconName}
                        onClick={() =>
                          onChange({
                            logoMode: 'icon',
                            selectedIconName: iconName,
                          })
                        }
                        className={`h-9 rounded-md border flex items-center justify-center transition-colors cursor-pointer ${
                          selected
                            ? 'border-stone-900 bg-white shadow-xs'
                            : 'border-transparent hover:border-stone-300 hover:bg-white'
                        }`}
                      >
                        <IconComp
                          size={18}
                          color={currentInk.primary}
                          strokeWidth={1.9}
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Frame Style selector (applicable when not monogram or custom image) */}
          {data.logoMode !== 'monogram' && data.logoMode !== 'custom' && (
            <div>
              <span className="block text-xs font-medium text-stone-600 mb-1.5">
                Emblem Frame
              </span>
              <div className="grid grid-cols-5 gap-1 p-1 bg-stone-100 rounded-lg">
                {FRAME_OPTIONS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => onChange({ logoFrame: f.id })}
                    className={`px-1.5 py-1 text-[11px] font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      data.logoFrame === f.id
                        ? 'bg-white text-stone-900 shadow-sm'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fetch Custom Logo by Company Name + Upload Image */}
          <div className="flex items-center gap-2 pt-0.5">
            <button
              type="button"
              onClick={() => {
                setShowBrowser(false);
                onFetchCustomLogo();
              }}
              disabled={isFetchingLogo || !data.shopName.trim()}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-800 disabled:opacity-50 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {isFetchingLogo ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              <span>
                {data.logoMode === 'ai'
                  ? 'New Custom Logo'
                  : 'Fetch Custom Logo'}
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload</span>
            </button>

            {data.customLogoUrl && data.logoMode === 'custom' && (
              <button
                type="button"
                onClick={() =>
                  onChange({ logoMode: 'auto', customLogoUrl: undefined })
                }
                className="px-2.5 py-2 text-xs font-medium text-stone-500 hover:text-red-700 border border-stone-200 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          {logoError && (
            <p className="text-xs text-red-700 leading-snug" role="alert">
              {logoError}
            </p>
          )}
        </section>

        <hr className="border-stone-200" />

        {/* Section 3: Stationery Design */}
        <section aria-labelledby="style-heading" className="space-y-4">
          <h2
            id="style-heading"
            className="text-sm font-semibold text-stone-900 tracking-tight"
          >
            Stationery Style
          </h2>

          <div>
            <span className="block text-xs font-medium text-stone-700 mb-1.5">
              Header Layout
            </span>
            <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-lg">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onChange({ layout: opt.id })}
                  className={`px-2 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    data.layout === opt.id
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-stone-700">
                Ink Color
              </span>
              <span className="text-xs text-stone-500">{currentInk.name}</span>
            </div>
            <div className="flex items-center gap-2.5">
              {INK_PALETTES.map((palette) => {
                const active = data.inkId === palette.id;
                return (
                  <button
                    key={palette.id}
                    type="button"
                    title={palette.name}
                    aria-label={palette.name}
                    onClick={() => onChange({ inkId: palette.id })}
                    className={`w-8 h-8 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                      active
                        ? 'ring-2 ring-offset-2 ring-stone-900 scale-105'
                        : 'hover:scale-105 ring-1 ring-stone-200'
                    }`}
                    style={{ backgroundColor: palette.primary }}
                  />
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="font-preset"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Typography
              </label>
              <select
                id="font-preset"
                value={data.fontPreset}
                onChange={(e) =>
                  onChange({ fontPreset: e.target.value as FontPresetId })
                }
                className="w-full px-3 py-2 text-xs font-medium text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                {FONT_PRESETS.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="paper-size"
                className="block text-xs font-medium text-stone-700 mb-1.5"
              >
                Paper Size
              </label>
              <select
                id="paper-size"
                value={data.paperSize}
                onChange={(e) =>
                  onChange({ paperSize: e.target.value as PaperSize })
                }
                className="w-full px-3 py-2 text-xs font-medium text-stone-900 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-stone-900 cursor-pointer"
              >
                <option value="a4">A4 (210 × 297 mm)</option>
                <option value="letter">US Letter (8.5 × 11 in)</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 pt-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={data.showBottomRule}
              onChange={(e) =>
                onChange({ showBottomRule: e.target.checked })
              }
              className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-900 cursor-pointer"
            />
            <span className="text-xs text-stone-600">
              Add subtle bottom margin line
            </span>
          </label>
        </section>
      </div>
    </aside>
  );
};
