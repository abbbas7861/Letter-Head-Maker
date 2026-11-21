import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bookmark,
  Check,
  Download,
  FileCode2,
  Printer,
  Trash2,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { EditorSidebar } from './components/EditorSidebar';
import { LetterheadSheet } from './components/LetterheadSheet';
import { AiLogoData, LetterheadData, PAPER_DIMENSIONS } from './types/letterhead';
import { exportAsPng, exportAsSvg } from './utils/exportLetterhead';

const STORAGE_CURRENT_KEY = 'foliopress_current_letterhead_v2';
const STORAGE_SAVED_KEY = 'foliopress_saved_letterheads_v2';

const DEFAULT_SAMPLE: LetterheadData = {
  id: 'default-sample',
  shopName: 'Al-Noor Hardware & Sanitary',
  proprietorName: 'Muhammad Tariq',
  contactNo: '+92 300 4128900',
  address: 'Shop #14, Main Liberty Market, Gulberg III, Lahore',
  logoMode: 'auto',
  logoFrame: 'rounded',
  layout: 'classic',
  paperSize: 'a4',
  fontPreset: 'editorial',
  inkId: 'navy',
  showBottomRule: false,
};

const QUICK_EXAMPLES: { label: string; patch: Partial<LetterheadData> }[] = [
  {
    label: 'Hardware Store',
    patch: {
      shopName: 'Al-Noor Hardware & Sanitary',
      proprietorName: 'Muhammad Tariq',
      contactNo: '+92 300 4128900',
      address: 'Shop #14, Main Liberty Market, Gulberg III, Lahore',
      logoMode: 'auto',
      logoFrame: 'hexagon',
      layout: 'classic',
      inkId: 'navy',
      fontPreset: 'editorial',
    },
  },
  {
    label: 'Poultry & Hatchery',
    patch: {
      shopName: 'Green Valley Poultry & Hatchery',
      proprietorName: 'Chaudhry Aslam',
      contactNo: '+92 321 8451920',
      address: 'Plot 7, Chak Shahzad Agri Zone, Islamabad',
      logoMode: 'auto',
      logoFrame: 'circle',
      layout: 'modern',
      inkId: 'forest',
      fontPreset: 'modern',
    },
  },
  {
    label: 'Jewellers',
    patch: {
      shopName: 'Royal Heritage Jewellers',
      proprietorName: 'Haji Abdul Rehman',
      contactNo: '+92 333 5510294',
      address: 'Plot 22, Sarafa Bazaar, Rawalpindi',
      logoMode: 'auto',
      logoFrame: 'shield',
      layout: 'centered',
      inkId: 'bronze',
      fontPreset: 'formal',
    },
  },
  {
    label: 'Solar & Energy',
    patch: {
      shopName: 'SunRay Solar & Inverters',
      proprietorName: 'Bilal Mahmood',
      contactNo: '+92 345 9012388',
      address: 'Shop #8, Hall Road Tech Plaza, Lahore',
      logoMode: 'auto',
      logoFrame: 'rounded',
      layout: 'framed',
      inkId: 'slate',
      fontPreset: 'modern',
    },
  },
];

export default function App() {
  const [data, setData] = useState<LetterheadData>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_CURRENT_KEY);
      if (raw) {
        return { ...DEFAULT_SAMPLE, ...JSON.parse(raw) };
      }
    } catch {
      // Ignore storage errors
    }
    return DEFAULT_SAMPLE;
  });

  const [savedList, setSavedList] = useState<LetterheadData[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore storage errors
    }
    return [];
  });

  const [showSavedDrawer, setShowSavedDrawer] = useState(false);
  const [zoomMode, setZoomMode] = useState<'fit' | number>('fit');
  const [fitScale, setFitScale] = useState(0.72);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [isFetchingLogo, setIsFetchingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const deskRef = useRef<HTMLDivElement>(null);
  const variationRef = useRef(0);
  const abortRef = useRef<AbortController | null>(null);
  const initialShopRef = useRef(data.shopName.trim());

  // Persist active draft locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors
    }
  }, [data]);

  // Persist saved letterheads locally
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(savedList));
    } catch {
      // Ignore quota errors
    }
  }, [savedList]);

  // Compute responsive fit scale for the preview desk
  useEffect(() => {
    const updateScale = () => {
      if (!deskRef.current) return;
      const rect = deskRef.current.getBoundingClientRect();
      const paper = PAPER_DIMENSIONS[data.paperSize];
      const availW = Math.max(300, rect.width - 64);
      const availH = Math.max(400, rect.height - 88);
      const scaleW = availW / paper.pxWidth;
      const scaleH = availH / paper.pxHeight;
      const computed = Math.min(1, Math.max(0.36, Math.min(scaleW, scaleH)));
      setFitScale(Number(computed.toFixed(3)));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (deskRef.current) observer.observe(deskRef.current);
    window.addEventListener('resize', updateScale);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateScale);
    };
  }, [data.paperSize]);

  const fetchCustomLogoForName = useCallback(
    async (targetName: string, variation: number, isManual: boolean) => {
      const cleaned = targetName.trim();
      if (cleaned.length < 2) return;

      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      setIsFetchingLogo(true);
      if (isManual) setLogoError(null);

      try {
        const res = await fetch('/api/logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shopName: cleaned, variation }),
          signal: controller.signal,
        });

        const payload = (await res.json()) as Partial<AiLogoData> & {
          error?: string;
        };

        if (!res.ok) {
          throw new Error(payload.error || 'Failed to fetch custom logo.');
        }

        if (!Array.isArray(payload.shapes) || payload.shapes.length === 0) {
          throw new Error('No emblem shapes returned for this company.');
        }

        const aiLogo: AiLogoData = {
          forShopName: payload.forShopName || cleaned,
          businessWork: payload.businessWork || 'Custom Company Emblem',
          shapes: payload.shapes,
        };

        setLogoError(null);
        setData((prev) => {
          if (prev.shopName.trim() !== cleaned) return prev;
          return {
            ...prev,
            logoMode: 'ai',
            aiLogo,
          };
        });
      } catch (err: unknown) {
        if (err instanceof DOMException && err.name === 'AbortError') {
          return;
        }
        const msg =
          err instanceof Error ? err.message : 'Unable to fetch custom logo.';
        setLogoError(msg);
      } finally {
        if (abortRef.current === controller) {
          setIsFetchingLogo(false);
        }
      }
    },
    []
  );

  // Automatically fetch a custom company-tailored logo when the user types a new shop name
  useEffect(() => {
    const trimmed = data.shopName.trim();
    if (!trimmed || trimmed.length < 4) {
      setLogoError(null);
      return;
    }

    if (data.logoMode !== 'auto' && data.logoMode !== 'ai') {
      return;
    }

    // Skip on very first initial load of the default sample
    if (trimmed === initialShopRef.current && !data.aiLogo) {
      return;
    }

    // Already fetched for this exact shop name
    if (
      data.aiLogo &&
      data.aiLogo.forShopName.trim().toLowerCase() === trimmed.toLowerCase()
    ) {
      return;
    }

    initialShopRef.current = '';
    const timer = window.setTimeout(() => {
      variationRef.current = 0;
      fetchCustomLogoForName(trimmed, 0, false);
    }, 950);

    return () => window.clearTimeout(timer);
  }, [data.shopName, data.logoMode, data.aiLogo, fetchCustomLogoForName]);

  const showToast = (message: string) => {
    setNotice(message);
    window.setTimeout(() => {
      setNotice((prev) => (prev === message ? null : prev));
    }, 2400);
  };

  const handlePatch = (patch: Partial<LetterheadData>) => {
    if (patch.logoMode && patch.logoMode !== 'ai') {
      setLogoError(null);
    }
    setData((prev) => ({ ...prev, ...patch }));
  };

  const handleClearFields = () => {
    if (abortRef.current) abortRef.current.abort();
    setIsFetchingLogo(false);
    setLogoError(null);
    setData((prev) => ({
      ...prev,
      id: `draft-${Date.now()}`,
      shopName: '',
      proprietorName: '',
      contactNo: '',
      address: '',
      logoMode: 'auto',
      aiLogo: undefined,
      selectedIconName: undefined,
      customLogoUrl: undefined,
    }));
  };

  const handleResetSample = () => {
    if (abortRef.current) abortRef.current.abort();
    setIsFetchingLogo(false);
    setLogoError(null);
    initialShopRef.current = DEFAULT_SAMPLE.shopName;
    setData({ ...DEFAULT_SAMPLE, id: `sample-${Date.now()}` });
  };

  const handleManualFetchCustomLogo = () => {
    variationRef.current += 1;
    fetchCustomLogoForName(data.shopName, variationRef.current, true);
  };

  const handleSaveCurrent = () => {
    if (!data.shopName.trim()) {
      showToast('Enter a shop name before saving.');
      return;
    }
    const entry: LetterheadData = {
      ...data,
      id: `lh-${Date.now()}`,
    };
    setSavedList((prev) => [entry, ...prev.slice(0, 19)]);
    showToast(`Saved "${data.shopName.trim()}"`);
  };

  const handleDeleteSaved = (id: string) => {
    setSavedList((prev) => prev.filter((item) => item.id !== id));
  };

  const handleLoadSaved = (item: LetterheadData) => {
    initialShopRef.current = item.shopName.trim();
    setLogoError(null);
    setData({ ...DEFAULT_SAMPLE, ...item });
    setShowSavedDrawer(false);
    showToast(`Loaded "${item.shopName || 'Letterhead'}"`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPng = async () => {
    try {
      setIsExportingPng(true);
      await exportAsPng(data);
      showToast('Downloaded print-ready PNG');
    } catch {
      showToast('Unable to export PNG. Please try again.');
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadSvg = () => {
    exportAsSvg(data);
    showToast('Downloaded vector SVG');
  };

  const activeScale = zoomMode === 'fit' ? fitScale : zoomMode;
  const paper = PAPER_DIMENSIONS[data.paperSize];

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-stone-100 text-stone-900 overflow-x-hidden print:block print:h-auto print:bg-white">
      <style>{`@media print { @page { size: ${paper.cssSize}; margin: 0; } }`}</style>

      {/* Top Navigation Bar: Strict 3-Zone Contract */}
      <header className="no-print h-14 px-6 bg-white border-b border-stone-200 flex items-center justify-between gap-8 shrink-0">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            handleResetSample();
          }}
          className="font-ui-display text-lg font-bold tracking-tight text-stone-900 whitespace-nowrap shrink-0"
        >
          FolioPress
        </a>

        <nav
          aria-label="Primary actions"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600"
        >
          <button
            type="button"
            onClick={handleClearFields}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            New Blank
          </button>
          <button
            type="button"
            onClick={() => setShowSavedDrawer((v) => !v)}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer tabular-nums"
          >
            Saved ({savedList.length})
          </button>
          <button
            type="button"
            onClick={handleDownloadPng}
            disabled={isExportingPng}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
          >
            {isExportingPng ? 'Exporting PNG…' : 'Export PNG'}
          </button>
          <button
            type="button"
            onClick={handleDownloadSvg}
            className="hover:text-stone-900 hover:underline underline-offset-4 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Export SVG
          </button>
        </nav>

        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 print:block">
        <EditorSidebar
          data={data}
          onChange={handlePatch}
          onResetSample={handleResetSample}
          onClearFields={handleClearFields}
          onFetchCustomLogo={handleManualFetchCustomLogo}
          isFetchingLogo={isFetchingLogo}
          logoError={logoError}
        />

        <main
          ref={deskRef}
          className="flex-1 flex flex-col min-w-0 min-h-[640px] lg:min-h-0 studio-desk-bg relative print-container"
        >
          {/* Compact Desk Toolbar */}
          <div className="no-print px-6 py-3 bg-white/80 backdrop-blur-sm border-b border-stone-200/80 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto">
              <span className="text-xs text-stone-500 whitespace-nowrap shrink-0">
                Try example:
              </span>
              {QUICK_EXAMPLES.map((ex, idx) => (
                <React.Fragment key={ex.label}>
                  {idx > 0 && (
                    <span className="text-stone-300 text-xs" aria-hidden="true">
                      ·
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      initialShopRef.current = '';
                      handlePatch({
                        ...ex.patch,
                        aiLogo: undefined,
                        selectedIconName: undefined,
                      });
                    }}
                    className="text-xs font-medium text-stone-700 hover:text-stone-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {ex.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="hidden sm:inline text-xs text-stone-500 font-mono-tabular whitespace-nowrap shrink-0">
                {paper.label}
              </span>

              <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded-lg border border-stone-200/80">
                <button
                  type="button"
                  title="Zoom out"
                  aria-label="Zoom out"
                  onClick={() =>
                    setZoomMode(
                      Math.max(0.45, Number((activeScale - 0.1).toFixed(2)))
                    )
                  }
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setZoomMode('fit')}
                  className={`px-2 py-1 text-xs font-mono-tabular font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    zoomMode === 'fit'
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {Math.round(activeScale * 100)}%
                </button>
                <button
                  type="button"
                  title="Zoom in"
                  aria-label="Zoom in"
                  onClick={() =>
                    setZoomMode(
                      Math.min(1.15, Number((activeScale + 0.1).toFixed(2)))
                    )
                  }
                  className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md hover:bg-white transition-colors cursor-pointer"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleSaveCurrent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>

              <div className="flex md:hidden items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  aria-label="Export PNG"
                  className="p-1.5 text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  aria-label="Export SVG"
                  className="p-1.5 text-stone-700 bg-white border border-stone-200 rounded-lg hover:bg-stone-50 cursor-pointer"
                >
                  <FileCode2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Scrollable Paper Sheet Canvas */}
          <div className="flex-1 overflow-auto p-6 lg:p-8 flex justify-center items-start print-container">
            <div
              className="print-sheet-box"
              style={{
                width: `${paper.pxWidth * activeScale}px`,
                height: `${paper.pxHeight * activeScale}px`,
              }}
            >
              <LetterheadSheet data={data} scale={activeScale} />
            </div>
          </div>

          {notice && (
            <div
              role="status"
              className="no-print fixed bottom-5 right-5 z-30 inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 text-white text-xs font-medium rounded-lg shadow-lg"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>{notice}</span>
            </div>
          )}
        </main>
      </div>

      {/* Saved Letterheads Drawer */}
      {showSavedDrawer && (
        <div className="no-print fixed inset-0 z-40 flex justify-end bg-stone-900/25 backdrop-blur-[1px]">
          <div className="w-full max-w-sm bg-white h-full border-l border-stone-200 shadow-xl flex flex-col">
            <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-stone-900">
                Saved Letterheads
              </h2>
              <button
                type="button"
                onClick={() => setShowSavedDrawer(false)}
                aria-label="Close saved letterheads"
                className="p-1.5 text-stone-500 hover:text-stone-900 rounded-md hover:bg-stone-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {savedList.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-sm font-medium text-stone-700">
                    No saved letterheads yet
                  </p>
                  <p className="mt-1.5 text-xs text-stone-500 max-w-[240px] mx-auto leading-relaxed">
                    Click Save in the preview bar to store a shop letterhead here for quick reuse later.
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-stone-200">
                  {savedList.map((item) => (
                    <li
                      key={item.id}
                      className="py-3.5 flex items-start justify-between gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleLoadSaved(item)}
                        className="text-left min-w-0 flex-1 group cursor-pointer"
                      >
                        <p className="text-sm font-semibold text-stone-900 group-hover:underline truncate">
                          {item.shopName || 'Untitled Shop'}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-500 truncate">
                          {item.proprietorName
                            ? `Prop. ${item.proprietorName}`
                            : 'No proprietor'}
                          {item.contactNo ? ` · ${item.contactNo}` : ''}
                        </p>
                        {item.address && (
                          <p className="mt-0.5 text-xs text-stone-400 truncate">
                            {item.address}
                          </p>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteSaved(item.id)}
                        aria-label={`Delete ${item.shopName}`}
                        className="p-1.5 text-stone-400 hover:text-red-700 rounded-md hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
