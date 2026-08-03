// Canonical CSS-selector engine.
//
// public/content.js inlines an equivalent copy because a content script is a
// classic file that cannot import ES modules. This module is the tested source
// of truth; keep the two in sync when changing the algorithm.

// Attributes that tend to be stable across renders, most-specific first.
const ATTR_PRIORITY = [
  'data-testid',
  'data-qa',
  'data-test',
  'data-cy',
  'id',
  'name',
  'aria-label',
  'role',
];

// CSS.escape with a fallback for environments that lack it. Correctly escapes
// ids/classes like `:r1:` (React) or `bg-[#649ef5]` (Tailwind arbitrary values).
export function cssEscape(value) {
  const str = String(value);
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(str);
  }
  return str.replace(/[^\w-]/g, (ch) => `\\${ch}`);
}

function attrValueEscape(value) {
  return String(value).replace(/(["\\])/g, '\\$1');
}

// Filters out framework-generated class names that change between builds and so
// make brittle selectors: styled-components, emotion, CSS Modules, hash suffixes.
export function isStableClass(cls) {
  if (!cls) return false;
  if (/^sc-[A-Za-z0-9]+$/.test(cls)) return false; // styled-components
  if (/^css-[A-Za-z0-9]+$/.test(cls)) return false; // emotion
  if (/^[A-Za-z][\w-]*__[A-Za-z0-9]{5,}$/.test(cls)) return false; // CSS Modules name__hash
  if (/(?:^|[-_])[0-9a-f]{6,}$/i.test(cls)) return false; // trailing hex hash
  return true;
}

function stableClasses(node) {
  const list = node.classList ? Array.from(node.classList) : [];
  return list.filter(isStableClass);
}

function attributeSelector(node) {
  for (const attr of ATTR_PRIORITY) {
    const value = attr === 'id' ? node.id : node.getAttribute(attr);
    if (value) {
      return attr === 'id' ? `#${cssEscape(value)}` : `[${attr}="${attrValueEscape(value)}"]`;
    }
  }
  return null;
}

function sameTagSiblingCount(node) {
  const parent = node.parentNode;
  if (!parent || !parent.children) return 1;
  let count = 0;
  for (const child of parent.children) {
    if (child.localName === node.localName) count++;
  }
  return count;
}

// nth-of-type index: counts only same-tag previous siblings. The original bug
// compared the tag name against a selector that already had classes appended,
// so the index was wrong whenever an element carried a class.
function nthOfType(node) {
  let index = 1;
  let sib = node.previousElementSibling;
  while (sib) {
    if (sib.localName === node.localName) index++;
    sib = sib.previousElementSibling;
  }
  return index;
}

function tokenFor(node) {
  const tag = node.localName;
  const attr = attributeSelector(node);
  if (attr) return attr.startsWith('#') ? attr : `${tag}${attr}`;

  const classes = stableClasses(node);
  let token = classes.length ? `${tag}.${classes.map(cssEscape).join('.')}` : tag;

  if (sameTagSiblingCount(node) > 1) {
    token += `:nth-of-type(${nthOfType(node)})`;
  }
  return token;
}

function isUnique(selector, root) {
  try {
    return root.querySelectorAll(selector).length === 1;
  } catch {
    return false;
  }
}

function buildWithinRoot(el, root) {
  // A globally-unique stable attribute is the shortest possible selector.
  const direct = attributeSelector(el);
  if (direct && isUnique(direct, root)) return direct;

  // Otherwise walk up, emitting the shortest ancestor chain that is unique.
  const parts = [];
  let node = el;
  while (node && node.nodeType === 1 && node !== root) {
    parts.unshift(tokenFor(node));
    const candidate = parts.join(' > ');
    if (isUnique(candidate, root)) return candidate;
    node = node.parentElement;
  }
  return parts.join(' > ');
}

// Returns the shortest selector that uniquely identifies `el`, validated with
// querySelectorAll. Shadow DOM cannot be crossed by standard CSS, so a
// shadow-piercing " >>> " path is emitted for elements inside a shadow root.
export function getUniqueSelector(el) {
  if (!el || el.nodeType !== 1) return '';
  const root = el.getRootNode ? el.getRootNode() : document;

  if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
    const host = getUniqueSelector(root.host);
    const inner = buildWithinRoot(el, root);
    return `${host} >>> ${inner}`;
  }
  return buildWithinRoot(el, root);
}

// How many elements a selector matches in the given root. For shadow-piercing
// selectors only the final segment is counted (best-effort).
export function countMatches(selector, root = document) {
  if (!selector) return 0;
  try {
    const last = selector.split(' >>> ').pop();
    return root.querySelectorAll(last).length;
  } catch {
    return 0;
  }
}

// Absolute XPath, using an id anchor when available for a shorter expression.
export function getXPath(el) {
  if (!el || el.nodeType !== 1) return '';
  if (el.id) return `//*[@id="${attrValueEscape(el.id)}"]`;

  const segments = [];
  let node = el;
  while (node && node.nodeType === 1) {
    let index = 1;
    let sib = node.previousElementSibling;
    while (sib) {
      if (sib.localName === node.localName) index++;
      sib = sib.previousElementSibling;
    }
    segments.unshift(`${node.localName}[${index}]`);
    node = node.parentElement;
  }
  return `/${segments.join('/')}`;
}
