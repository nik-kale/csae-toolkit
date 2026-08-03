// Color helpers: parsing, hex/rgb/hsl formatting, and WCAG contrast.
// Pure functions with no DOM access so they can be unit-tested directly.

// Parses "#abc", "#aabbcc", or "rgb(r, g, b)" into {r, g, b}, or null.
export function parseColor(input) {
  if (input == null) return null;
  const str = String(input).trim();

  const hexMatch = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(str);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    return {
      r: parseInt(hex.slice(0, 2), 16),
      g: parseInt(hex.slice(2, 4), 16),
      b: parseInt(hex.slice(4, 6), 16),
    };
  }

  const rgbMatch = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/i.exec(str);
  if (rgbMatch) {
    const r = Number(rgbMatch[1]);
    const g = Number(rgbMatch[2]);
    const b = Number(rgbMatch[3]);
    if ([r, g, b].every((n) => n >= 0 && n <= 255)) return { r, g, b };
  }

  return null;
}

function clamp255(n) {
  return Math.max(0, Math.min(255, Math.round(n)));
}

export function rgbToHex({ r, g, b }) {
  const toHex = (n) => clamp255(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl({ r, g, b }) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rn) h = ((gn - bn) / delta) % 6;
    else if (max === gn) h = (bn - rn) / delta + 2;
    else h = (rn - gn) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  return { h, s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function formatHex(color) {
  const rgb = typeof color === 'string' ? parseColor(color) : color;
  return rgb ? rgbToHex(rgb) : '';
}

export function formatRgb(color) {
  const rgb = typeof color === 'string' ? parseColor(color) : color;
  if (!rgb) return '';
  return `rgb(${clamp255(rgb.r)}, ${clamp255(rgb.g)}, ${clamp255(rgb.b)})`;
}

export function formatHsl(color) {
  const rgb = typeof color === 'string' ? parseColor(color) : color;
  if (!rgb) return '';
  const { h, s, l } = rgbToHsl(rgb);
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// WCAG relative luminance (sRGB), per https://www.w3.org/TR/WCAG20/#relativeluminancedef
export function relativeLuminance({ r, g, b }) {
  const channel = (c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

// Contrast ratio (1–21) between two colors, order-independent.
export function contrastRatio(a, b) {
  const ca = typeof a === 'string' ? parseColor(a) : a;
  const cb = typeof b === 'string' ? parseColor(b) : b;
  if (!ca || !cb) return null;
  const la = relativeLuminance(ca);
  const lb = relativeLuminance(cb);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG 2.1 pass/fail for a given contrast ratio.
export function wcagAssessment(ratio) {
  if (ratio == null) return null;
  return {
    ratio: Math.round(ratio * 100) / 100,
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
  };
}
