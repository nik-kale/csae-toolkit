import { useEffect, useMemo, useState } from 'react';
import { formatHex, formatRgb, formatHsl, contrastRatio, wcagAssessment } from './lib/color';

// Must match PALETTE_KEY in public/content.js so quick picks and panel picks
// share one history.
const PALETTE_KEY = 'csae_palette_history';
const PALETTE_LIMIT = 24;

function persistPalette(next) {
  if (chrome?.storage?.local) chrome.storage.local.set({ [PALETTE_KEY]: next });
}

const Badge = ({ ok, label }) => (
  <span
    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
      ok ? 'bg-[#4ADC71] text-[#23282e]' : 'bg-[#f0563a] text-white'
    }`}
  >
    {label} {ok ? 'Pass' : 'Fail'}
  </span>
);

const ColorPicker = () => {
  const [palette, setPalette] = useState([]);
  const [current, setCurrent] = useState(null);
  const [fg, setFg] = useState('#ffffff');
  const [bg, setBg] = useState('#23282e');
  const [copied, setCopied] = useState(null);
  const [unsupported, setUnsupported] = useState(false);

  useEffect(() => {
    if (!chrome?.storage?.local) return undefined;
    chrome.storage.local.get({ [PALETTE_KEY]: [] }, (data) => {
      if (chrome.runtime?.lastError) return;
      setPalette(data[PALETTE_KEY] || []);
    });
    const onChanged = (changes, area) => {
      if (area === 'local' && changes[PALETTE_KEY]) {
        setPalette(changes[PALETTE_KEY].newValue || []);
      }
    };
    chrome.storage.onChanged?.addListener(onChanged);
    return () => chrome.storage.onChanged?.removeListener(onChanged);
  }, []);

  const addToPalette = (hex) => {
    const clean = formatHex(hex);
    if (!clean) return;
    setPalette((prev) => {
      const next = [clean, ...prev.filter((c) => c !== clean)].slice(0, PALETTE_LIMIT);
      persistPalette(next);
      return next;
    });
  };

  const pick = () => {
    if (!('EyeDropper' in window)) {
      setUnsupported(true);
      return;
    }
    const eyeDropper = new window.EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        setCurrent(result.sRGBHex);
        setFg(result.sRGBHex);
        addToPalette(result.sRGBHex);
      })
      .catch(() => {
        /* user cancelled */
      });
  };

  const copy = (text, tag) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied(tag);
        setTimeout(() => setCopied(null), 1200);
      })
      .catch(() => setCopied(null));
  };

  const clearPalette = () => {
    setPalette([]);
    persistPalette([]);
  };

  const assessment = useMemo(() => wcagAssessment(contrastRatio(fg, bg)), [fg, bg]);

  const formats = current
    ? [
        ['HEX', formatHex(current)],
        ['RGB', formatRgb(current)],
        ['HSL', formatHsl(current)],
      ]
    : [];

  return (
    <div className="p-4 bg-[#464b54] rounded-lg shadow-md mt-4 text-white">
      <h2 className="text-lg font-semibold mb-3">Color Tools</h2>

      <button
        type="button"
        onClick={pick}
        className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300"
      >
        Pick a Color
      </button>
      {unsupported && (
        <p className="text-xs text-[#f0b429] mt-2" role="alert">
          The EyeDropper API is not supported in this browser.
        </p>
      )}

      {current && (
        <div className="mt-4">
          <div className="flex items-center gap-3 mb-2">
            <span
              className="inline-block w-10 h-10 rounded border border-gray-500"
              style={{ backgroundColor: formatHex(current) }}
              aria-hidden="true"
            />
            <span className="text-sm">Selected color</span>
          </div>
          <ul className="space-y-1">
            {formats.map(([label, value]) => (
              <li key={label} className="flex items-center justify-between gap-2">
                <code className="text-xs text-[#e6edf3]">
                  <span className="text-[#00BCEA]">{label}</span> {value}
                </code>
                <button
                  type="button"
                  onClick={() => copy(value, label)}
                  className="px-2 py-0.5 bg-[#649ef5] text-white text-[10px] rounded hover:bg-blue-600 transition duration-300"
                >
                  {copied === label ? 'Copied!' : 'Copy'}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">Palette History</h3>
          <button
            type="button"
            onClick={clearPalette}
            disabled={palette.length === 0}
            className="px-2 py-0.5 bg-[#44696d] text-white text-[10px] rounded hover:bg-red-600 transition duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Clear
          </button>
        </div>
        {palette.length === 0 ? (
          <p className="text-xs text-gray-300">No colors yet. Pick one to build a palette.</p>
        ) : (
          <div className="flex flex-wrap gap-1">
            {palette.map((hex) => (
              <button
                key={hex}
                type="button"
                title={`${hex} — click to select, right-click sets background`}
                onClick={() => {
                  setCurrent(hex);
                  setFg(hex);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setBg(hex);
                }}
                className="w-6 h-6 rounded border border-gray-500"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-4 border-t border-gray-600 pt-3">
        <h3 className="text-sm font-semibold mb-2">Contrast Checker (WCAG)</h3>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label htmlFor="fgColor" className="block text-xs mb-1">
              Foreground
            </label>
            <input
              id="fgColor"
              type="text"
              value={fg}
              onChange={(e) => setFg(e.target.value)}
              className="w-full p-1 bg-gray-700 text-white rounded text-xs font-mono"
            />
          </div>
          <div>
            <label htmlFor="bgColor" className="block text-xs mb-1">
              Background
            </label>
            <input
              id="bgColor"
              type="text"
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-full p-1 bg-gray-700 text-white rounded text-xs font-mono"
            />
          </div>
        </div>

        <div
          className="rounded p-3 mb-3 text-center"
          style={{ backgroundColor: formatHex(bg) || '#000', color: formatHex(fg) || '#fff' }}
        >
          <span className="text-base font-semibold">Aa</span>{' '}
          <span className="text-sm">Sample text</span>
        </div>

        {assessment ? (
          <div>
            <p className="text-sm mb-2">
              Contrast ratio: <span className="font-bold">{assessment.ratio}:1</span>
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge ok={assessment.normalAA} label="AA" />
              <Badge ok={assessment.normalAAA} label="AAA" />
              <Badge ok={assessment.largeAA} label="AA Large" />
              <Badge ok={assessment.largeAAA} label="AAA Large" />
            </div>
          </div>
        ) : (
          <p className="text-xs text-[#f0b429]" role="alert">
            Enter two valid colors (hex or rgb) to check contrast.
          </p>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
