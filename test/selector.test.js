import { describe, it, expect, afterEach } from 'vitest';
import {
  getUniqueSelector,
  countMatches,
  getXPath,
  isStableClass,
  cssEscape,
} from '../src/lib/selector.js';

function mount(html) {
  const host = document.createElement('div');
  host.innerHTML = html;
  document.body.appendChild(host);
  return host;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('getUniqueSelector', () => {
  it('prefers a unique id', () => {
    const host = mount('<section><p id="hello">hi</p></section>');
    const el = host.querySelector('#hello');
    expect(getUniqueSelector(el)).toBe('#hello');
    expect(document.querySelectorAll(getUniqueSelector(el))).toHaveLength(1);
  });

  it('prefers data-testid over classes', () => {
    const host = mount(
      '<div class="a b"><button data-testid="submit" class="btn">Go</button></div>'
    );
    const el = host.querySelector('button');
    expect(getUniqueSelector(el)).toBe('[data-testid="submit"]');
  });

  it('computes nth-of-type correctly for classed siblings (regression)', () => {
    const host = mount(
      '<ul id="list"><li class="row">a</li><li class="row">b</li><li class="row">c</li></ul>'
    );
    const second = host.querySelectorAll('li')[1];
    const sel = getUniqueSelector(second);
    const matched = document.querySelectorAll(sel);
    expect(matched).toHaveLength(1);
    expect(matched[0]).toBe(second);
    expect(sel).toContain(':nth-of-type(2)');
  });

  it('escapes fragile identifiers (Tailwind arbitrary values)', () => {
    const host = mount('<div><span class="bg-[#649ef5]">x</span></div>');
    const el = host.querySelector('span');
    const sel = getUniqueSelector(el);
    // Must be a queryable selector that matches exactly the element.
    const matched = document.querySelectorAll(sel);
    expect(matched).toHaveLength(1);
    expect(matched[0]).toBe(el);
  });

  it('ignores framework-hashed classes and still resolves uniquely', () => {
    const host = mount(
      '<main id="root"><div class="css-1a2b3c sc-AxjAm"><b class="css-9z8y7x">t</b></div></main>'
    );
    const el = host.querySelector('b');
    const sel = getUniqueSelector(el);
    expect(sel).not.toContain('css-');
    expect(sel).not.toContain('sc-');
    const matched = document.querySelectorAll(sel);
    expect(matched).toHaveLength(1);
    expect(matched[0]).toBe(el);
  });

  it('always yields a selector that resolves to exactly the target', () => {
    const host = mount(`
      <div class="wrap"><div class="wrap"><span>one</span><span>two</span></div></div>
    `);
    const spans = host.querySelectorAll('span');
    for (const span of spans) {
      const sel = getUniqueSelector(span);
      const matched = document.querySelectorAll(sel);
      expect(matched).toHaveLength(1);
      expect(matched[0]).toBe(span);
    }
  });

  it('returns "" for non-elements', () => {
    expect(getUniqueSelector(null)).toBe('');
    expect(getUniqueSelector(document.createTextNode('x'))).toBe('');
  });
});

describe('countMatches', () => {
  it('counts matching elements', () => {
    mount('<div class="card"></div><div class="card"></div><div class="card"></div>');
    expect(countMatches('.card')).toBe(3);
  });

  it('returns 0 for invalid selectors', () => {
    expect(countMatches('::::nope')).toBe(0);
  });
});

describe('getXPath', () => {
  it('uses an id anchor when present', () => {
    const host = mount('<div id="anchor"><p>x</p></div>');
    expect(getXPath(host.querySelector('#anchor'))).toBe('//*[@id="anchor"]');
  });

  it('builds a positional path otherwise', () => {
    const host = mount('<ol><li>a</li><li>b</li></ol>');
    const li = host.querySelectorAll('li')[1];
    expect(getXPath(li).endsWith('li[2]')).toBe(true);
  });
});

describe('class + escape helpers', () => {
  it('flags framework-generated classes as unstable', () => {
    expect(isStableClass('sc-AxjAm')).toBe(false);
    expect(isStableClass('css-1a2b3c')).toBe(false);
    expect(isStableClass('Button__root__1x2y3')).toBe(false);
    expect(isStableClass('primary-btn')).toBe(true);
  });

  it('escapes special characters', () => {
    expect(cssEscape('a b')).toContain('\\');
  });
});
