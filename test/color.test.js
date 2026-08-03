import { describe, it, expect } from 'vitest';
import {
  parseColor,
  rgbToHex,
  rgbToHsl,
  formatRgb,
  formatHsl,
  contrastRatio,
  wcagAssessment,
} from '../src/lib/color.js';

describe('color parsing', () => {
  it('parses shorthand and full hex', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor('#649ef5')).toEqual({ r: 100, g: 158, b: 245 });
    expect(parseColor('649ef5')).toEqual({ r: 100, g: 158, b: 245 });
  });

  it('parses rgb() strings', () => {
    expect(parseColor('rgb(100, 158, 245)')).toEqual({ r: 100, g: 158, b: 245 });
    expect(parseColor('rgba(0, 0, 0, 0.5)')).toEqual({ r: 0, g: 0, b: 0 });
  });

  it('rejects garbage', () => {
    expect(parseColor('not-a-color')).toBeNull();
    expect(parseColor('rgb(300, 0, 0)')).toBeNull();
    expect(parseColor(null)).toBeNull();
  });
});

describe('color formatting', () => {
  it('round-trips hex', () => {
    expect(rgbToHex({ r: 100, g: 158, b: 245 })).toBe('#649ef5');
  });

  it('converts to hsl', () => {
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 });
  });

  it('formats rgb and hsl strings from hex', () => {
    expect(formatRgb('#649ef5')).toBe('rgb(100, 158, 245)');
    expect(formatHsl('#ff0000')).toBe('hsl(0, 100%, 50%)');
  });
});

describe('WCAG contrast', () => {
  it('computes the maximum ratio for black on white', () => {
    expect(Math.round(contrastRatio('#000000', '#ffffff'))).toBe(21);
  });

  it('is order independent', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(contrastRatio('#fff', '#000'), 5);
  });

  it('assesses WCAG levels', () => {
    const pass = wcagAssessment(contrastRatio('#000000', '#ffffff'));
    expect(pass.normalAA).toBe(true);
    expect(pass.normalAAA).toBe(true);

    const fail = wcagAssessment(contrastRatio('#777777', '#888888'));
    expect(fail.normalAA).toBe(false);
  });
});
