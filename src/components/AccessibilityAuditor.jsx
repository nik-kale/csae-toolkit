import React, { useState, useEffect } from 'react';

/**
 * Accessibility Auditor Component for CSAE Toolkit v5.0
 *
 * Performs comprehensive WCAG 2.1/2.2 accessibility audits
 * Checks for common accessibility issues and provides remediation guidance
 */
const AccessibilityAuditor = ({ onClose }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showOnlyErrors, setShowOnlyErrors] = useState(false);

  const runAudit = () => {
    setIsScanning(true);

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: performAccessibilityAudit,
        },
        (results) => {
          if (results && results[0]) {
            setResults(results[0].result);
          }
          setIsScanning(false);
        }
      );
    });
  };

  useEffect(() => {
    runAudit();
  }, []);

  const getCategorySeverity = (issues) => {
    const errors = issues.filter(i => i.severity === 'error').length;
    const warnings = issues.filter(i => i.severity === 'warning').length;
    const info = issues.filter(i => i.severity === 'info').length;
    return { errors, warnings, info };
  };

  const getSeverityColor = (severity) => {
    const colors = {
      error: 'text-red-400',
      warning: 'text-yellow-400',
      info: 'text-blue-400',
      success: 'text-green-400',
    };
    return colors[severity] || 'text-gray-400';
  };

  const getSeverityIcon = (severity) => {
    const icons = {
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅',
    };
    return icons[severity] || '•';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      images: '🖼️',
      forms: '📝',
      headings: '📑',
      contrast: '🎨',
      aria: '♿',
      keyboard: '⌨️',
      links: '🔗',
      language: '🌐',
      structure: '🏗️',
      interactive: '🖱️',
    };
    return icons[category] || '📋';
  };

  const filterIssues = (issues) => {
    if (!issues) return [];

    let filtered = issues;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(i => i.category === selectedCategory);
    }

    if (showOnlyErrors) {
      filtered = filtered.filter(i => i.severity === 'error');
    }

    return filtered;
  };

  const exportReport = () => {
    if (!results) return;

    const report = {
      timestamp: new Date().toISOString(),
      url: results.url,
      summary: results.summary,
      issues: results.issues,
      score: results.score,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `accessibility-audit-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!results) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-[#282A33] rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">♿</div>
          <div className="text-xl font-semibold mb-2">Accessibility Audit</div>
          {isScanning ? (
            <>
              <div className="text-sm text-gray-400 mb-4">Scanning page...</div>
              <div className="animate-spin text-4xl">⚙️</div>
            </>
          ) : (
            <div className="text-sm text-gray-400">Loading...</div>
          )}
        </div>
      </div>
    );
  }

  const filteredIssues = filterIssues(results.issues);
  const categories = [...new Set(results.issues.map(i => i.category))];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-6xl mx-auto bg-[#282A33] rounded-lg shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">♿</span>
                  Accessibility Audit Report
                </h2>
                <p className="text-sm text-gray-400 mt-1">WCAG 2.1 Level AA Compliance</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl"
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="p-6 border-b border-gray-600">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-[#353945] p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">{results.score}%</div>
                <div className="text-xs text-gray-400 mt-1">Accessibility Score</div>
              </div>
              <div className="bg-[#353945] p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-400">{results.summary.errors}</div>
                <div className="text-xs text-gray-400 mt-1">Errors</div>
              </div>
              <div className="bg-[#353945] p-4 rounded-lg">
                <div className="text-3xl font-bold text-yellow-400">{results.summary.warnings}</div>
                <div className="text-xs text-gray-400 mt-1">Warnings</div>
              </div>
              <div className="bg-[#353945] p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-400">{results.summary.info}</div>
                <div className="text-xs text-gray-400 mt-1">Info</div>
              </div>
              <div className="bg-[#353945] p-4 rounded-lg">
                <div className="text-3xl font-bold text-white">{results.summary.total}</div>
                <div className="text-xs text-gray-400 mt-1">Total Issues</div>
              </div>
            </div>

            {/* URL */}
            <div className="mt-4 p-3 bg-[#353945] rounded text-sm">
              <div className="text-gray-400">Audited URL:</div>
              <div className="text-white truncate">{results.url}</div>
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-600">
            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-semibold text-gray-400">Filter:</div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
              >
                <option value="all">All Categories ({results.issues.length})</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)} (
                    {results.issues.filter(i => i.category === cat).length})
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnlyErrors}
                  onChange={(e) => setShowOnlyErrors(e.target.checked)}
                  className="form-checkbox"
                />
                Show Errors Only
              </label>

              <div className="ml-auto flex gap-2">
                <button
                  onClick={runAudit}
                  className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
                  disabled={isScanning}
                >
                  {isScanning ? '⚙️ Scanning...' : '🔄 Re-scan'}
                </button>
                <button
                  onClick={exportReport}
                  className="px-4 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] text-sm font-semibold"
                >
                  📥 Export Report
                </button>
              </div>
            </div>
          </div>

          {/* Issues List */}
          <div className="p-6 max-h-[500px] overflow-y-auto">
            {filteredIssues.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <div className="text-xl font-semibold text-green-400">
                  {showOnlyErrors ? 'No Errors Found!' : 'No Issues Found!'}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  {showOnlyErrors
                    ? 'This page has no critical accessibility errors in the selected category.'
                    : 'This page passes all accessibility checks!'}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.map((issue, index) => (
                  <div
                    key={index}
                    className="bg-[#353945] rounded-lg p-4 hover:bg-[#464b54] transition duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{getSeverityIcon(issue.severity)}</span>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className={`font-semibold ${getSeverityColor(issue.severity)}`}>
                              {issue.title}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              <span className="bg-[#464b54] px-2 py-1 rounded mr-2">
                                {getCategoryIcon(issue.category)} {issue.category}
                              </span>
                              <span className="bg-[#464b54] px-2 py-1 rounded">
                                WCAG {issue.wcag}
                              </span>
                            </div>
                          </div>
                          <div className={`text-xs font-semibold px-2 py-1 rounded ${
                            issue.severity === 'error' ? 'bg-red-900/30 text-red-400' :
                            issue.severity === 'warning' ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-blue-900/30 text-blue-400'
                          }`}>
                            {issue.severity.toUpperCase()}
                          </div>
                        </div>

                        <div className="mt-2 text-sm text-gray-300">{issue.description}</div>

                        {issue.element && (
                          <details className="mt-2">
                            <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                              Show Element
                            </summary>
                            <pre className="mt-2 p-2 bg-[#1a1d24] rounded text-xs overflow-x-auto">
                              {issue.element}
                            </pre>
                          </details>
                        )}

                        {issue.howToFix && (
                          <div className="mt-3 p-3 bg-[#1a1d24] rounded">
                            <div className="text-xs font-semibold text-[#4ADC71] mb-1">
                              ✅ How to Fix:
                            </div>
                            <div className="text-xs text-gray-300">{issue.howToFix}</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-600 text-center text-xs text-gray-400">
            Audit completed at {new Date().toLocaleString()} •{' '}
            {filteredIssues.length} issues shown
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Perform accessibility audit on the current page
 * This function runs in the context of the web page
 */
function performAccessibilityAudit() {
  const issues = [];
  const url = window.location.href;

  // Helper function to get element selector
  function getSelector(element) {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = Array.from(element.classList).join('.');
      return `${element.tagName.toLowerCase()}.${classes}`;
    }
    return element.tagName.toLowerCase();
  }

  // Helper function to get outer HTML safely
  function getOuterHTML(element) {
    const div = document.createElement('div');
    div.appendChild(element.cloneNode(true));
    let html = div.innerHTML;
    if (html.length > 200) {
      html = html.substring(0, 200) + '...';
    }
    return html;
  }

  // 1. Check images for alt text
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        category: 'images',
        severity: 'error',
        wcag: '1.1.1',
        title: 'Image missing alt attribute',
        description: `Image without alternative text found. This makes it inaccessible to screen readers.`,
        element: getOuterHTML(img),
        howToFix: 'Add an alt attribute to the image. Use alt="" for decorative images.',
      });
    } else if (img.alt === '' && !img.hasAttribute('role') && !img.hasAttribute('aria-hidden')) {
      // This might be intentional for decorative images
      issues.push({
        category: 'images',
        severity: 'info',
        wcag: '1.1.1',
        title: 'Image has empty alt text',
        description: 'Image has empty alt text. Verify this is a decorative image.',
        element: getOuterHTML(img),
        howToFix: 'If decorative, add role="presentation" or aria-hidden="true". Otherwise, add descriptive alt text.',
      });
    }
  });

  // 2. Check form inputs for labels
  const inputs = document.querySelectorAll('input:not([type="hidden"]), textarea, select');
  inputs.forEach(input => {
    const hasLabel = document.querySelector(`label[for="${input.id}"]`) !== null;
    const hasAriaLabel = input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');

    if (!hasLabel && !hasAriaLabel && input.id) {
      issues.push({
        category: 'forms',
        severity: 'error',
        wcag: '1.3.1, 3.3.2',
        title: 'Form input missing label',
        description: 'Form control without associated label found.',
        element: getOuterHTML(input),
        howToFix: 'Add a <label for="inputId"> element or aria-label attribute.',
      });
    }
  });

  // 3. Check heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach(heading => {
    const level = parseInt(heading.tagName[1]);
    if (level - lastLevel > 1) {
      issues.push({
        category: 'headings',
        severity: 'warning',
        wcag: '1.3.1',
        title: 'Heading level skipped',
        description: `Heading jumped from H${lastLevel} to H${level}. Headings should not skip levels.`,
        element: getOuterHTML(heading),
        howToFix: 'Ensure heading levels increase by only one level at a time (H1 → H2 → H3).',
      });
    }
    lastLevel = level;
  });

  // Check for H1
  const h1Count = document.querySelectorAll('h1').length;
  if (h1Count === 0) {
    issues.push({
      category: 'headings',
      severity: 'warning',
      wcag: '1.3.1',
      title: 'No H1 heading found',
      description: 'Page should have one H1 heading as the main title.',
      howToFix: 'Add an H1 element as the main page heading.',
    });
  } else if (h1Count > 1) {
    issues.push({
      category: 'headings',
      severity: 'warning',
      wcag: '1.3.1',
      title: 'Multiple H1 headings found',
      description: `Found ${h1Count} H1 headings. Best practice is to have only one H1 per page.`,
      howToFix: 'Use only one H1 for the main page title. Use H2-H6 for subsections.',
    });
  }

  // 4. Check color contrast (simplified)
  const textElements = document.querySelectorAll('p, span, div, a, button, li');
  const checkedElements = new Set();

  textElements.forEach(el => {
    if (checkedElements.has(el) || !el.textContent.trim()) return;
    checkedElements.add(el);

    const style = window.getComputedStyle(el);
    const color = style.color;
    const bgColor = style.backgroundColor;

    // Only flag if both colors are set and background isn't transparent
    if (color && bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
      // This is a simplified check - real contrast ratio calculation is complex
      issues.push({
        category: 'contrast',
        severity: 'info',
        wcag: '1.4.3',
        title: 'Check color contrast',
        description: `Text color: ${color}, Background: ${bgColor}. Verify contrast ratio is at least 4.5:1.`,
        element: getOuterHTML(el),
        howToFix: 'Use online tools like WebAIM Contrast Checker to verify contrast ratio.',
      });
    }
  });

  // Limit contrast checks to avoid overwhelming results
  const contrastIssues = issues.filter(i => i.category === 'contrast');
  if (contrastIssues.length > 10) {
    issues.splice(issues.indexOf(contrastIssues[10]), contrastIssues.length - 10);
  }

  // 5. Check links for meaningful text
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    const text = link.textContent.trim().toLowerCase();
    const genericTexts = ['click here', 'here', 'read more', 'more', 'link'];

    if (genericTexts.includes(text)) {
      issues.push({
        category: 'links',
        severity: 'warning',
        wcag: '2.4.4',
        title: 'Link has non-descriptive text',
        description: `Link text "${text}" is not descriptive. Links should describe their destination.`,
        element: getOuterHTML(link),
        howToFix: 'Use descriptive link text that makes sense out of context. Add aria-label if needed.',
      });
    }

    if (!text && !link.hasAttribute('aria-label') && !link.hasAttribute('title')) {
      issues.push({
        category: 'links',
        severity: 'error',
        wcag: '2.4.4, 4.1.2',
        title: 'Link has no accessible name',
        description: 'Link with no text or accessible name found.',
        element: getOuterHTML(link),
        howToFix: 'Add text content, aria-label, or title attribute to describe the link purpose.',
      });
    }
  });

  // 6. Check for language attribute
  const htmlElement = document.documentElement;
  if (!htmlElement.hasAttribute('lang')) {
    issues.push({
      category: 'language',
      severity: 'error',
      wcag: '3.1.1',
      title: 'Page missing language attribute',
      description: 'The <html> element does not have a lang attribute.',
      element: '<html>',
      howToFix: 'Add lang="en" (or appropriate language code) to the <html> tag.',
    });
  }

  // 7. Check ARIA usage
  const elementsWithAria = document.querySelectorAll('[role], [aria-label], [aria-labelledby], [aria-describedby]');
  elementsWithAria.forEach(el => {
    const role = el.getAttribute('role');

    // Check for invalid ARIA roles (basic check)
    if (role && !['button', 'link', 'navigation', 'main', 'banner', 'contentinfo', 'complementary',
                   'search', 'form', 'region', 'article', 'list', 'listitem', 'img', 'presentation',
                   'alert', 'dialog', 'menu', 'menuitem', 'tab', 'tabpanel', 'tablist'].includes(role)) {
      issues.push({
        category: 'aria',
        severity: 'warning',
        wcag: '4.1.2',
        title: 'Potentially invalid ARIA role',
        description: `Element has role="${role}" which may not be a standard ARIA role.`,
        element: getOuterHTML(el),
        howToFix: 'Verify the ARIA role is valid and appropriate for this element.',
      });
    }
  });

  // 8. Check for keyboard accessibility
  const interactiveElements = document.querySelectorAll('div[onclick], span[onclick]');
  interactiveElements.forEach(el => {
    const hasTabIndex = el.hasAttribute('tabindex');
    const hasRole = el.hasAttribute('role');

    if (!hasTabIndex || !hasRole) {
      issues.push({
        category: 'keyboard',
        severity: 'error',
        wcag: '2.1.1, 4.1.2',
        title: 'Interactive element not keyboard accessible',
        description: 'Element with onclick handler may not be keyboard accessible.',
        element: getOuterHTML(el),
        howToFix: 'Add tabindex="0" and role="button". Also add keyboard event handlers (onKeyPress).',
      });
    }
  });

  // 9. Check buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(btn => {
    const text = btn.textContent.trim();
    const hasAriaLabel = btn.hasAttribute('aria-label');
    const hasTitle = btn.hasAttribute('title');

    if (!text && !hasAriaLabel && !hasTitle) {
      issues.push({
        category: 'interactive',
        severity: 'error',
        wcag: '4.1.2',
        title: 'Button has no accessible name',
        description: 'Button without text or accessible name found.',
        element: getOuterHTML(btn),
        howToFix: 'Add text content, aria-label, or title attribute to describe the button purpose.',
      });
    }
  });

  // 10. Check for skip links
  const skipLinks = Array.from(document.querySelectorAll('a')).filter(a =>
    a.textContent.toLowerCase().includes('skip') || a.getAttribute('href') === '#main-content'
  );

  if (skipLinks.length === 0) {
    issues.push({
      category: 'structure',
      severity: 'info',
      wcag: '2.4.1',
      title: 'No skip link found',
      description: 'Consider adding a "Skip to main content" link for keyboard users.',
      howToFix: 'Add a skip link as the first focusable element: <a href="#main-content">Skip to main content</a>',
    });
  }

  // Calculate summary
  const errors = issues.filter(i => i.severity === 'error').length;
  const warnings = issues.filter(i => i.severity === 'warning').length;
  const info = issues.filter(i => i.severity === 'info').length;
  const total = issues.length;

  // Calculate score (simple formula)
  const score = Math.max(0, Math.round(100 - (errors * 5) - (warnings * 2) - (info * 0.5)));

  return {
    url,
    timestamp: new Date().toISOString(),
    score,
    summary: {
      errors,
      warnings,
      info,
      total,
    },
    issues,
  };
}

export default AccessibilityAuditor;
