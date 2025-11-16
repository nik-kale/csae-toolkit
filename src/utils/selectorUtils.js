/**
 * Selector Utilities - Format Conversion and Optimization
 * Converts between CSS, XPath, and JS Path formats
 * Optimizes selectors for brevity and reliability
 */

/**
 * Convert CSS selector to XPath
 */
export function cssToXPath(cssSelector) {
  if (!cssSelector) return '';

  let xpath = '.';

  // Handle ID selector
  if (cssSelector.startsWith('#')) {
    const id = cssSelector.slice(1).split(/[\s>+~]/)[0];
    return `//*[@id="${id}"]`;
  }

  // Split by descendant combinator
  const parts = cssSelector.split(/\s*>\s*/);

  parts.forEach((part, index) => {
    part = part.trim();

    // Extract tag, classes, and attributes
    const tagMatch = part.match(/^([a-z][\w-]*)/i);
    const classMatch = part.match(/\.([^\s.#[]+)/g);
    const attrMatch = part.match(/\[([^\]]+)\]/g);
    const nthMatch = part.match(/:nth-of-type\((\d+)\)/);

    const tag = tagMatch ? tagMatch[1] : '*';

    if (index > 0) xpath += '/';
    xpath += tag;

    // Add class conditions
    if (classMatch) {
      classMatch.forEach(cls => {
        const className = cls.slice(1);
        xpath += `[contains(concat(' ', @class, ' '), ' ${className} ')]`;
      });
    }

    // Add attribute conditions
    if (attrMatch) {
      attrMatch.forEach(attr => {
        const attrContent = attr.slice(1, -1);
        const [name, value] = attrContent.split('=');
        if (value) {
          xpath += `[@${name}=${value}]`;
        } else {
          xpath += `[@${name}]`;
        }
      });
    }

    // Add nth-of-type
    if (nthMatch) {
      xpath += `[${nthMatch[1]}]`;
    }
  });

  return xpath;
}

/**
 * Convert CSS selector to JS Path (querySelector format)
 */
export function cssToJSPath(cssSelector) {
  if (!cssSelector) return '';
  return `document.querySelector('${cssSelector.replace(/'/g, "\\'")}')`;
}

/**
 * Optimize CSS selector for brevity
 */
export function optimizeSelector(selector) {
  if (!selector) return '';

  const parts = selector.split(/\s*>\s*/);
  const optimized = [];

  parts.forEach((part, index) => {
    // If part has an ID, we can stop here (IDs are unique)
    if (part.includes('#')) {
      optimized.push(part);
      return;
    }

    // Remove excessive nth-of-type if there are class names
    if (part.includes('.') && part.includes(':nth-of-type')) {
      // Keep only if necessary
      const withoutNth = part.replace(/:nth-of-type\(\d+\)/, '');
      optimized.push(withoutNth);
    } else {
      optimized.push(part);
    }
  });

  // If we have an ID anywhere, we can simplify
  const idIndex = optimized.findIndex(p => p.includes('#'));
  if (idIndex >= 0) {
    return optimized.slice(idIndex).join(' > ');
  }

  return optimized.join(' > ');
}

/**
 * Validate selector uniqueness
 */
export function validateSelectorUniqueness(selector) {
  try {
    const elements = document.querySelectorAll(selector);
    return {
      isUnique: elements.length === 1,
      count: elements.length,
      elements: Array.from(elements)
    };
  } catch (error) {
    return {
      isUnique: false,
      count: 0,
      elements: [],
      error: error.message
    };
  }
}

/**
 * Generate alternative selectors
 */
export function generateAlternativeSelectors(element) {
  if (!element) return [];

  const alternatives = [];

  // ID-based selector
  if (element.id) {
    alternatives.push({
      type: 'id',
      selector: `#${element.id}`,
      priority: 1,
      description: 'Unique ID selector (most reliable)'
    });
  }

  // Data attribute selectors
  const dataAttrs = Array.from(element.attributes)
    .filter(attr => attr.name.startsWith('data-'));
  dataAttrs.forEach(attr => {
    alternatives.push({
      type: 'data-attr',
      selector: `[${attr.name}="${attr.value}"]`,
      priority: 2,
      description: `Data attribute: ${attr.name}`
    });
  });

  // Class-based selector
  if (element.className && typeof element.className === 'string') {
    const classes = element.className.trim().split(/\s+/).join('.');
    if (classes) {
      alternatives.push({
        type: 'class',
        selector: `${element.tagName.toLowerCase()}.${classes}`,
        priority: 3,
        description: 'Class-based selector'
      });
    }
  }

  // Name attribute
  if (element.name) {
    alternatives.push({
      type: 'name',
      selector: `[name="${element.name}"]`,
      priority: 2,
      description: `Name attribute: ${element.name}`
    });
  }

  // ARIA label
  const ariaLabel = element.getAttribute('aria-label');
  if (ariaLabel) {
    alternatives.push({
      type: 'aria',
      selector: `[aria-label="${ariaLabel}"]`,
      priority: 3,
      description: `ARIA label: ${ariaLabel}`
    });
  }

  return alternatives.sort((a, b) => a.priority - b.priority);
}

/**
 * Get selector reliability score
 */
export function getSelectorReliability(selector) {
  let score = 0;
  const feedback = [];

  // ID selector is most reliable
  if (selector.includes('#')) {
    score += 40;
    feedback.push('✅ Uses ID (very reliable)');
  }

  // Data attributes are reliable
  if (selector.includes('[data-')) {
    score += 30;
    feedback.push('✅ Uses data attributes (reliable)');
  }

  // Class names are moderately reliable
  if (selector.includes('.')) {
    score += 20;
    feedback.push('✓ Uses classes (moderately reliable)');
  }

  // Nth-of-type can be fragile
  if (selector.includes(':nth-of-type')) {
    score -= 10;
    feedback.push('⚠️ Uses nth-of-type (may break if DOM changes)');
  }

  // Generic tags are less reliable
  if (/^(div|span)/.test(selector)) {
    score -= 5;
    feedback.push('⚠️ Starts with generic tag (div/span)');
  }

  // Long selectors can be fragile
  const depth = (selector.match(/>/g) || []).length;
  if (depth > 4) {
    score -= 10;
    feedback.push('⚠️ Deep selector (may be fragile)');
  }

  return {
    score: Math.max(0, Math.min(100, score)),
    rating: score >= 60 ? 'Good' : score >= 30 ? 'Fair' : 'Poor',
    feedback
  };
}

export default {
  cssToXPath,
  cssToJSPath,
  optimizeSelector,
  validateSelectorUniqueness,
  generateAlternativeSelectors,
  getSelectorReliability
};
