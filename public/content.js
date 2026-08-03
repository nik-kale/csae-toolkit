// CSAE Toolkit content script.
//
// Injected on demand via chrome.scripting.executeScript from the side panel and
// runs in the page's isolated world as a classic script (no ES module imports).
// All DOM that embeds page-derived data is built with createElement/textContent
// rather than innerHTML, so a hostile page cannot inject markup into this context.

(() => {
  'use strict';

  // Injection sentinel: executeScript re-runs this whole file on every tool
  // invocation. Registering document-level listeners more than once would stack
  // handlers, so one-time setup is guarded and re-injection returns early.
  if (window.__csaeToolkitInjected) return;
  window.__csaeToolkitInjected = true;

  const HISTORY_KEY = 'csae_selector_history';
  const HISTORY_LIMIT = 25;

  const state = {
    hoverActive: false,
    currentTarget: null,
    notificationTimeout: null,
    pinnedHoverBoxes: [],
  };

  let hoverBox = null;

  // ---------------------------------------------------------------------------
  // Small DOM helpers (XSS-safe: never interpolate page data into innerHTML)
  // ---------------------------------------------------------------------------

  function styleEl(node, styles) {
    Object.assign(node.style, styles);
    return node;
  }

  function makeEl(tag, styles, text) {
    const node = document.createElement(tag);
    if (styles) styleEl(node, styles);
    if (text != null) node.textContent = text;
    return node;
  }

  function checkmarkIcon() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('width', '20px');
    svg.setAttribute('height', '20px');
    svg.setAttribute('fill', '#4ADC71');
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M9 16.17l-4.17-4.17-1.41 1.41L9 19 20.59 7.41l-1.41-1.41z');
    svg.appendChild(path);
    return svg;
  }

  // ===========================================================================
  // SELECTOR ENGINE
  //
  // Mirror of src/lib/selector.js (kept in sync by tests). Duplicated here
  // because a content script is a classic file and cannot import ES modules.
  // ===========================================================================

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

  function cssEscape(value) {
    const str = String(value);
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(str);
    }
    return str.replace(/[^\w-]/g, (ch) => `\\${ch}`);
  }

  function attrValueEscape(value) {
    return String(value).replace(/(["\\])/g, '\\$1');
  }

  function isStableClass(cls) {
    if (!cls) return false;
    if (/^sc-[A-Za-z0-9]+$/.test(cls)) return false;
    if (/^css-[A-Za-z0-9]+$/.test(cls)) return false;
    if (/^[A-Za-z][\w-]*__[A-Za-z0-9]{5,}$/.test(cls)) return false;
    if (/(?:^|[-_])[0-9a-f]{6,}$/i.test(cls)) return false;
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
    const direct = attributeSelector(el);
    if (direct && isUnique(direct, root)) return direct;

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

  function getUniqueSelector(el) {
    if (!el || el.nodeType !== 1) return '';
    const root = el.getRootNode ? el.getRootNode() : document;

    if (typeof ShadowRoot !== 'undefined' && root instanceof ShadowRoot) {
      return `${getUniqueSelector(root.host)} >>> ${buildWithinRoot(el, root)}`;
    }
    return buildWithinRoot(el, root);
  }

  function countMatches(selector, root = document) {
    if (!selector) return 0;
    try {
      return root.querySelectorAll(selector.split(' >>> ').pop()).length;
    } catch {
      return 0;
    }
  }

  function getXPath(el) {
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

  function getElementValue(el) {
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      return el.value;
    }
    return el.textContent.trim();
  }

  // Returns [{ name, value }] rather than pre-built HTML so the caller can
  // render each cell with textContent.
  function getCssProperties(el) {
    const computed = window.getComputedStyle(el);
    return Array.from(computed).map((name) => ({
      name,
      value: computed.getPropertyValue(name),
    }));
  }

  // ===========================================================================
  // HOVER BOX
  // ===========================================================================

  function ensureHoverBox() {
    if (hoverBox && document.body.contains(hoverBox)) return hoverBox;
    hoverBox = makeEl('div', {
      position: 'fixed',
      zIndex: '2147483646',
      backgroundColor: '#282A33',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      pointerEvents: 'none',
      display: 'none',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      lineHeight: '1.5',
      maxWidth: '600px',
    });
    document.body.appendChild(hoverBox);
    return hoverBox;
  }

  function buildHoverContent(target) {
    const path = getUniqueSelector(target);
    const value = getElementValue(target);
    const cssProps = getCssProperties(target);
    const matches = countMatches(path);
    const xpath = getXPath(target);

    const frag = document.createDocumentFragment();

    const top = makeEl('div', {
      marginBottom: '10px',
      padding: '10px',
      backgroundColor: '#3a3f4b',
      borderRadius: '8px',
      position: 'relative',
    });

    const selectorLabel = makeEl('div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
    });
    selectorLabel.appendChild(
      makeEl('strong', { color: '#4ADC71', fontWeight: 'bold' }, 'Selector:')
    );
    // Live match count: green when the selector is unique, amber when it is not,
    // so an ambiguous selector is obvious before it is copied.
    const unique = matches === 1;
    selectorLabel.appendChild(
      makeEl(
        'span',
        {
          fontSize: '12px',
          fontWeight: 'bold',
          padding: '1px 8px',
          borderRadius: '10px',
          color: '#23282e',
          backgroundColor: unique ? '#4ADC71' : '#f0b429',
        },
        matches === 1 ? '1 match' : `${matches} matches`
      )
    );
    top.appendChild(selectorLabel);
    top.appendChild(makeEl('div', { wordBreak: 'break-all', margin: '4px 0 10px' }, path));

    top.appendChild(makeEl('strong', { color: '#00BCEA', fontWeight: 'bold' }, 'XPath:'));
    top.appendChild(makeEl('div', { wordBreak: 'break-all', margin: '4px 0 10px' }, xpath));

    top.appendChild(makeEl('strong', { color: '#4ADC71', fontWeight: 'bold' }, 'Value:'));
    top.appendChild(makeEl('div', { wordBreak: 'break-all', marginTop: '4px' }, value));

    top.appendChild(
      makeEl(
        'div',
        { fontSize: '11px', color: '#9aa4b2', marginTop: '8px' },
        'Click: copy selector · Shift+Click: copy XPath · Alt+Click: pin'
      )
    );
    frag.appendChild(top);

    const bottom = makeEl('div', {
      padding: '10px',
      backgroundColor: '#353945',
      borderRadius: '8px',
      maxHeight: '300px',
      overflowY: 'auto',
      position: 'relative',
    });
    bottom.appendChild(
      makeEl('strong', { color: '#4ADC71', fontWeight: 'bold' }, 'CSS Properties:')
    );

    const columns = makeEl('div', { display: 'flex', flexWrap: 'wrap', marginTop: '6px' });
    const half = Math.ceil(cssProps.length / 2);
    [cssProps.slice(0, half), cssProps.slice(half)].forEach((group) => {
      const col = makeEl('div', { flex: '1', minWidth: '200px' });
      group.forEach(({ name, value: v }) => {
        const row = makeEl('div');
        row.appendChild(makeEl('span', { color: '#00BCEA' }, name));
        row.appendChild(document.createTextNode(`: ${v};`));
        col.appendChild(row);
      });
      columns.appendChild(col);
    });
    bottom.appendChild(columns);
    frag.appendChild(bottom);

    return frag;
  }

  function closeButton(onClick) {
    const btn = makeEl(
      'button',
      {
        position: 'absolute',
        top: '5px',
        right: '5px',
        background: 'transparent',
        border: 'none',
        color: 'white',
        fontSize: '16px',
        cursor: 'pointer',
      },
      'x'
    );
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Close');
    btn.onclick = onClick;
    return btn;
  }

  function renderHoverBox(target, clientX, clientY) {
    const box = ensureHoverBox();
    box.replaceChildren(buildHoverContent(target));
    box.appendChild(
      closeButton(() => {
        box.style.display = 'none';
        if (state.currentTarget) {
          state.currentTarget.style.outline = '';
          state.currentTarget = null;
        }
      })
    );
    box.style.display = 'block';
    box.style.left = `${clientX + 10}px`;
    box.style.top = `${clientY + 10}px`;
  }

  function pinHoverBox(target) {
    const box = ensureHoverBox();
    const clone = box.cloneNode(true);
    const rect = target.getBoundingClientRect();
    styleEl(clone, {
      pointerEvents: 'auto',
      position: 'absolute',
      left: `${rect.left + window.scrollX}px`,
      top: `${rect.top + window.scrollY}px`,
      zIndex: '2147483647',
      display: 'block',
    });
    clone.appendChild(
      closeButton(() => {
        clone.remove();
        state.pinnedHoverBoxes = state.pinnedHoverBoxes.filter((b) => b !== clone);
      })
    );
    document.body.appendChild(clone);
    state.pinnedHoverBoxes.push(clone);
  }

  function clearAllHoverBoxes() {
    if (hoverBox) hoverBox.style.display = 'none';
    state.pinnedHoverBoxes.forEach((box) => box.remove());
    state.pinnedHoverBoxes = [];
    if (state.currentTarget) {
      state.currentTarget.style.outline = '';
      state.currentTarget = null;
    }
  }

  function isInsidePinned(node) {
    return state.pinnedHoverBoxes.some((box) => box.contains(node));
  }

  // ---------------------------------------------------------------------------
  // Selector history (persisted; requires the "storage" permission)
  // ---------------------------------------------------------------------------

  function recordSelector(selector, value, kind = 'css') {
    if (!selector || !chrome.storage?.local) return;
    chrome.storage.local.get({ [HISTORY_KEY]: [] }, (data) => {
      if (chrome.runtime.lastError) return;
      const entry = {
        selector,
        kind,
        value: typeof value === 'string' ? value.slice(0, 200) : '',
        url: location.href,
        at: Date.now(),
      };
      const next = [entry, ...(data[HISTORY_KEY] || []).filter((e) => e.selector !== selector)];
      chrome.storage.local.set({ [HISTORY_KEY]: next.slice(0, HISTORY_LIMIT) });
    });
  }

  // ===========================================================================
  // NOTIFICATIONS
  // ===========================================================================

  function showNotification(message) {
    const existing = document.querySelector('.csae-toolkit-notification');
    if (existing) {
      existing.remove();
      clearTimeout(state.notificationTimeout);
    }

    const note = makeEl('div', {
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: '2147483647',
      backgroundColor: '#23282e',
      color: '#4ADC71',
      padding: '10px 20px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      fontSize: '14px',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
    });
    note.className = 'csae-toolkit-notification';
    note.appendChild(checkmarkIcon());
    note.appendChild(makeEl('span', { marginLeft: '10px' }, message));
    document.body.appendChild(note);

    state.notificationTimeout = setTimeout(() => {
      note.style.transition = 'opacity 0.5s';
      note.style.opacity = '0';
      setTimeout(() => note.remove(), 500);
    }, 2000);
  }

  // ===========================================================================
  // HOVER INTERACTION (document-level listeners registered once)
  // ===========================================================================

  function onMouseOver(event) {
    if (!state.hoverActive) return;
    if (isInsidePinned(event.target)) {
      if (hoverBox) hoverBox.style.display = 'none';
      return;
    }
    if (state.currentTarget) state.currentTarget.style.outline = '';
    state.currentTarget = event.target;
    event.target.style.outline = '2px solid red';
    renderHoverBox(event.target, event.clientX, event.clientY);
  }

  function onMouseMove(event) {
    if (!state.hoverActive || !hoverBox) return;
    if (isInsidePinned(event.target)) {
      hoverBox.style.display = 'none';
      return;
    }
    hoverBox.style.left = `${event.clientX + 10}px`;
    hoverBox.style.top = `${event.clientY + 10}px`;
  }

  function onClick(event) {
    if (!state.hoverActive) return;
    event.preventDefault();
    event.stopPropagation();

    const target = event.target;

    if (event.altKey) {
      pinHoverBox(target);
      return;
    }

    // Copy the selector verbatim; stripping whitespace would corrupt attribute
    // values (e.g. [aria-label="Save changes"]) and child combinators.
    // Shift+Click copies XPath instead of the CSS selector.
    const wantXPath = event.shiftKey;
    const selector = getUniqueSelector(target);
    const copied = wantXPath ? getXPath(target) : selector;
    const kind = wantXPath ? 'xpath' : 'css';

    if (hoverBox) hoverBox.style.display = 'none';
    navigator.clipboard
      .writeText(copied)
      .then(() => showNotification(wantXPath ? 'XPath copied!' : 'Selector copied!'))
      .catch((err) => console.error('CSAE Toolkit: clipboard write failed', err));
    recordSelector(copied, getElementValue(target), kind);
  }

  function onKeyDown(event) {
    if (event.key === 'Escape' && state.hoverActive) {
      state.hoverActive = false;
      clearAllHoverBoxes();
    }
  }

  document.addEventListener('mouseover', onMouseOver, true);
  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown, true);

  // ===========================================================================
  // CONFIG VIEWER
  //
  // Locates the CSAE configuration the page has stored (window globals plus
  // local/session storage) and renders it as a searchable, collapsible,
  // copyable JSON tree. Everything is built with createElement/textContent, so
  // hostile config values cannot inject markup into this context.
  // ===========================================================================

  const CSAE_KEY_PATTERN = /csae|cisco|support[\s_-]?assistant|campaign/i;
  const CSAE_GLOBALS = [
    '__CSAE_CONFIG__',
    '__CISCO_CSAE__',
    'csaeConfig',
    'CSAEConfig',
    'CSAE',
    'supportAssistantConfig',
  ];

  function parseMaybeJson(raw) {
    if (typeof raw !== 'string') return raw;
    const trimmed = raw.trim();
    if (!trimmed || (trimmed[0] !== '{' && trimmed[0] !== '[')) return raw;
    try {
      return JSON.parse(trimmed);
    } catch {
      return raw;
    }
  }

  function collectFromStorage(getStorage, label, out) {
    let storage;
    try {
      storage = getStorage();
      if (!storage) return;
    } catch {
      return; // storage can be blocked by the page's policy
    }
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && CSAE_KEY_PATTERN.test(key)) {
        out.push({ source: `${label}["${key}"]`, value: parseMaybeJson(storage.getItem(key)) });
      }
    }
  }

  function locateCsaeConfig() {
    const found = [];
    CSAE_GLOBALS.forEach((name) => {
      try {
        if (window[name] != null) found.push({ source: `window.${name}`, value: window[name] });
      } catch {
        /* accessing some globals can throw on locked-down pages */
      }
    });
    collectFromStorage(() => window.localStorage, 'localStorage', found);
    collectFromStorage(() => window.sessionStorage, 'sessionStorage', found);
    return found;
  }

  function formatPrimitive(value) {
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value);
  }

  function matchesQuery(value, query) {
    if (!query) return true;
    try {
      return JSON.stringify(value).toLowerCase().includes(query);
    } catch {
      return String(value).toLowerCase().includes(query);
    }
  }

  // Builds a DOM node for `value`, or null when nothing under it matches `query`.
  function buildJsonNode(key, value, query) {
    const isObject = value !== null && typeof value === 'object';

    if (!isObject) {
      const keyHit = key != null && String(key).toLowerCase().includes(query);
      const valHit = String(value).toLowerCase().includes(query);
      if (query && !keyHit && !valHit) return null;
      const row = makeEl('div', { padding: '2px 0', fontFamily: 'monospace', fontSize: '12px' });
      if (key != null) row.appendChild(makeEl('span', { color: '#00BCEA' }, `${key}: `));
      row.appendChild(makeEl('span', { color: '#e6edf3' }, formatPrimitive(value)));
      return row;
    }

    const keyHit = query && key != null && String(key).toLowerCase().includes(query);
    const childQuery = keyHit ? '' : query;
    const entries = Array.isArray(value) ? value.map((v, i) => [i, v]) : Object.entries(value);

    const children = [];
    for (const [k, v] of entries) {
      const child = buildJsonNode(k, v, childQuery);
      if (child) children.push(child);
    }

    if (query && !keyHit && children.length === 0 && !matchesQuery(value, query)) {
      return null;
    }

    const details = document.createElement('details');
    details.open = true;
    const summary = document.createElement('summary');
    styleEl(summary, {
      cursor: 'pointer',
      color: '#4ADC71',
      fontFamily: 'monospace',
      fontSize: '12px',
      fontWeight: 'bold',
    });
    const meta = Array.isArray(value) ? `[${value.length}]` : `{${Object.keys(value).length}}`;
    summary.textContent = key != null ? `${key} ${meta}` : meta;
    details.appendChild(summary);

    const wrap = makeEl('div', {
      paddingLeft: '14px',
      borderLeft: '1px solid #3a3f4b',
      marginLeft: '4px',
    });
    children.forEach((c) => wrap.appendChild(c));
    details.appendChild(wrap);
    return details;
  }

  function renderConfigEntries(container, entries, query) {
    container.replaceChildren();
    const q = (query || '').toLowerCase();
    let shown = 0;

    entries.forEach((entry) => {
      const node = buildJsonNode(null, entry.value, q);
      const sourceHit = entry.source.toLowerCase().includes(q);
      if (!node && !sourceHit) return;
      shown++;

      const block = makeEl('div', {
        marginBottom: '12px',
        padding: '10px',
        backgroundColor: '#1f2530',
        borderRadius: '6px',
      });
      block.appendChild(
        makeEl(
          'div',
          { color: '#9aa4b2', fontSize: '11px', marginBottom: '6px', fontFamily: 'monospace' },
          entry.source
        )
      );
      block.appendChild(node || buildJsonNode(null, entry.value, ''));
      container.appendChild(block);
    });

    if (shown === 0) {
      container.appendChild(makeEl('div', { color: '#9aa4b2', fontSize: '13px' }, 'No matches.'));
    }
  }

  function showConfigModal() {
    const existing = document.getElementById('csae-toolkit-modal');
    if (existing) existing.remove();

    const entries = locateCsaeConfig();

    const modal = makeEl('div', {
      position: 'fixed',
      inset: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: '2147483647',
      background: 'rgba(0,0,0,0.5)',
      fontFamily: 'Arial, sans-serif',
    });
    modal.id = 'csae-toolkit-modal';

    const card = makeEl('div', {
      backgroundColor: '#2d3748',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      padding: '1.25rem',
      color: 'white',
      width: '80%',
      maxWidth: '680px',
      maxHeight: '82vh',
      display: 'flex',
      flexDirection: 'column',
    });

    const header = makeEl('div', {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem',
    });
    header.appendChild(
      makeEl('h2', { fontSize: '1.25rem', fontWeight: '600', color: '#649ef5' }, 'CSAE Config')
    );
    const closeX = closeButton(() => modal.remove());
    styleEl(closeX, { position: 'static', color: 'white', fontSize: '20px' });
    header.appendChild(closeX);
    card.appendChild(header);

    if (entries.length === 0) {
      card.appendChild(
        makeEl(
          'p',
          { fontSize: '13px', color: '#cbd5e0', marginBottom: '0.75rem' },
          'No CSAE configuration was found on this page. Open the page where CSAE stores its config (its keys usually contain "csae" or "cisco") and try again.'
        )
      );
      modal.appendChild(card);
      modal.addEventListener('click', (event) => {
        if (event.target === modal) modal.remove();
      });
      document.addEventListener(
        'keydown',
        function esc(e) {
          if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', esc, true);
          }
        },
        true
      );
      document.body.appendChild(modal);
      return;
    }

    const toolbar = makeEl('div', {
      display: 'flex',
      gap: '8px',
      marginBottom: '0.75rem',
    });
    const search = document.createElement('input');
    search.type = 'search';
    search.placeholder = 'Search keys and values…';
    search.setAttribute('aria-label', 'Search CSAE config');
    styleEl(search, {
      flex: '1',
      padding: '6px 10px',
      borderRadius: '4px',
      border: '1px solid #4a5568',
      background: '#1a202c',
      color: 'white',
      fontSize: '13px',
    });
    toolbar.appendChild(search);

    const copyBtn = makeEl(
      'button',
      {
        padding: '6px 12px',
        backgroundColor: '#4299e1',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: '600',
        fontSize: '13px',
      },
      'Copy JSON'
    );
    copyBtn.type = 'button';
    copyBtn.onclick = () => {
      const payload =
        entries.length === 1
          ? entries[0].value
          : Object.fromEntries(entries.map((e) => [e.source, e.value]));
      navigator.clipboard
        .writeText(JSON.stringify(payload, null, 2))
        .then(() => {
          copyBtn.textContent = 'Copied!';
          setTimeout(() => (copyBtn.textContent = 'Copy JSON'), 1200);
        })
        .catch(() => {
          copyBtn.textContent = 'Copy failed';
          setTimeout(() => (copyBtn.textContent = 'Copy JSON'), 1200);
        });
    };
    toolbar.appendChild(copyBtn);
    card.appendChild(toolbar);

    const content = makeEl('div', { overflowY: 'auto', flex: '1' });
    renderConfigEntries(content, entries, '');
    card.appendChild(content);

    search.addEventListener('input', () => renderConfigEntries(content, entries, search.value));

    modal.appendChild(card);
    modal.addEventListener('click', (event) => {
      if (event.target === modal) modal.remove();
    });
    document.addEventListener(
      'keydown',
      function esc(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', esc, true);
        }
      },
      true
    );
    document.body.appendChild(modal);
    search.focus();
  }

  // ===========================================================================
  // COLOR PICKER
  // ===========================================================================

  // Persisted palette shared with the side panel's Color Tools (src/ColorPicker.jsx).
  const PALETTE_KEY = 'csae_palette_history';
  const PALETTE_LIMIT = 24;

  function recordColor(hex) {
    if (!hex || !chrome.storage?.local) return;
    chrome.storage.local.get({ [PALETTE_KEY]: [] }, (data) => {
      if (chrome.runtime.lastError) return;
      const next = [hex, ...(data[PALETTE_KEY] || []).filter((c) => c !== hex)].slice(
        0,
        PALETTE_LIMIT
      );
      chrome.storage.local.set({ [PALETTE_KEY]: next });
    });
  }

  function pickColor() {
    if (!('EyeDropper' in window)) {
      showNotification('EyeDropper API not supported');
      return;
    }
    const eyeDropper = new window.EyeDropper();
    eyeDropper
      .open()
      .then((result) => {
        const hex = result.sRGBHex;
        recordColor(hex);
        navigator.clipboard
          .writeText(hex)
          .then(() => showNotification(`Color ${hex} copied to clipboard!`))
          .catch(() => showNotification(`Picked ${hex} (clipboard blocked)`));
      })
      .catch(() => {
        /* user cancelled the eyedropper; nothing to do */
      });
  }

  // ===========================================================================
  // MESSAGE ROUTER (single consolidated listener)
  // ===========================================================================

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message?.action) {
      case 'toggleHover':
        state.hoverActive = message.hoverActive ?? !state.hoverActive;
        if (!state.hoverActive) clearAllHoverBoxes();
        sendResponse({ status: 'success', hoverActive: state.hoverActive });
        break;
      case 'viewConfig':
        showConfigModal();
        sendResponse({ status: 'success' });
        break;
      case 'pickColor':
        pickColor();
        sendResponse({ status: 'success' });
        break;
      case 'ping':
        sendResponse({ status: 'success' });
        break;
      default:
        sendResponse({ status: 'ignored' });
    }
    return true;
  });
})();
