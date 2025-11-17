import React, { useState, useEffect } from 'react';

/**
 * Technology Stack Detector for CSAE Toolkit v5.0
 *
 * Auto-detects frameworks, libraries, CMS, and technologies used on web pages
 * Similar to Wappalyzer but integrated into CSAE Toolkit
 */
const TechStackDetector = ({ onClose }) => {
  const [technologies, setTechnologies] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    detectTechnologies();
  }, []);

  const detectTechnologies = () => {
    setIsScanning(true);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          func: performTechDetection,
        },
        (results) => {
          if (results && results[0]) {
            setTechnologies(results[0].result);
          }
          setIsScanning(false);
        }
      );
    });
  };

  const getCategoryIcon = (category) => {
    const icons = {
      framework: '⚛️',
      library: '📚',
      cms: '📄',
      analytics: '📊',
      cdn: '🌐',
      font: '🔤',
      ui: '🎨',
      build: '🔧',
      server: '🖥️',
      database: '🗄️',
      ecommerce: '🛒',
      marketing: '📢',
      hosting: '☁️',
      security: '🔒',
    };
    return icons[category] || '🔹';
  };

  const exportReport = () => {
    const blob = new Blob([JSON.stringify(technologies, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tech-stack-${technologies.url.replace(/[^a-z0-9]/gi, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isScanning || !technologies) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center">
        <div className="bg-[#282A33] rounded-lg p-8 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <div className="text-xl font-semibold mb-2">Detecting Technologies...</div>
          <div className="animate-spin text-4xl">⚙️</div>
        </div>
      </div>
    );
  }

  const categories = [...new Set(technologies.detected.map(t => t.category))];
  const filteredTech = filter === 'all'
    ? technologies.detected
    : technologies.detected.filter(t => t.category === filter);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-4xl mx-auto bg-[#282A33] rounded-lg shadow-2xl">
          {/* Header */}
          <div className="p-6 border-b border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center">
                  <span className="text-4xl mr-3">🔍</span>
                  Technology Stack Detector
                </h2>
                <p className="text-sm text-gray-400 mt-1">
                  {technologies.detected.length} technologies detected
                </p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
            </div>
          </div>

          {/* Summary */}
          <div className="p-6 border-b border-gray-600">
            <div className="mb-4 p-3 bg-[#353945] rounded">
              <div className="text-gray-400 text-sm">Analyzing:</div>
              <div className="text-white truncate">{technologies.url}</div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => {
                const count = technologies.detected.filter(t => t.category === cat).length;
                return (
                  <div key={cat} className="bg-[#353945] p-3 rounded">
                    <div className="text-2xl mb-1">{getCategoryIcon(cat)}</div>
                    <div className="text-sm text-gray-400 capitalize">{cat}</div>
                    <div className="text-xl font-bold text-white">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-600 flex items-center gap-3">
            <div className="text-sm font-semibold text-gray-400">Filter:</div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>

            <div className="ml-auto flex gap-2">
              <button
                onClick={detectTechnologies}
                className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
              >
                🔄 Re-scan
              </button>
              <button
                onClick={exportReport}
                className="px-4 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] text-sm font-semibold"
              >
                📥 Export
              </button>
            </div>
          </div>

          {/* Technologies List */}
          <div className="p-6">
            <div className="grid gap-4">
              {filteredTech.map((tech, index) => (
                <div key={index} className="bg-[#353945] rounded-lg p-4 hover:bg-[#464b54] transition">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{getCategoryIcon(tech.category)}</div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-white text-lg">{tech.name}</div>
                          {tech.version && (
                            <div className="text-sm text-[#4ADC71] mt-1">Version: {tech.version}</div>
                          )}
                        </div>
                        <div className="text-xs px-2 py-1 bg-[#464b54] rounded text-gray-300 capitalize">
                          {tech.category}
                        </div>
                      </div>

                      {tech.description && (
                        <div className="mt-2 text-sm text-gray-300">{tech.description}</div>
                      )}

                      {tech.confidence && (
                        <div className="mt-2">
                          <div className="text-xs text-gray-400 mb-1">
                            Confidence: {tech.confidence}%
                          </div>
                          <div className="w-full bg-[#1a1d24] rounded-full h-2">
                            <div
                              className="bg-[#4ADC71] h-2 rounded-full"
                              style={{ width: `${tech.confidence}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {tech.detectedFrom && tech.detectedFrom.length > 0 && (
                        <details className="mt-2">
                          <summary className="text-xs text-blue-400 cursor-pointer hover:text-blue-300">
                            Show Detection Details
                          </summary>
                          <div className="mt-2 space-y-1">
                            {tech.detectedFrom.map((source, i) => (
                              <div key={i} className="text-xs text-gray-400">• {source}</div>
                            ))}
                          </div>
                        </details>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Perform technology detection
 */
function performTechDetection() {
  const detected = [];
  const url = window.location.href;

  // Helper to add technology
  const addTech = (name, category, details = {}) => {
    detected.push({
      name,
      category,
      confidence: 100,
      detectedFrom: [],
      ...details,
    });
  };

  // Detect React
  if (window.React || document.querySelector('[data-reactroot], [data-reactid]')) {
    const version = window.React?.version;
    addTech('React', 'framework', {
      version,
      description: 'JavaScript library for building user interfaces',
      detectedFrom: version ? ['window.React.version'] : ['DOM attributes'],
    });
  }

  // Detect Vue
  if (window.Vue || document.querySelector('[data-v-]')) {
    const version = window.Vue?.version;
    addTech('Vue.js', 'framework', {
      version,
      description: 'Progressive JavaScript framework',
      detectedFrom: version ? ['window.Vue.version'] : ['DOM attributes'],
    });
  }

  // Detect Angular
  if (window.ng || document.querySelector('[ng-version], [ng-app]')) {
    addTech('Angular', 'framework', {
      description: 'Platform for building web applications',
      detectedFrom: ['DOM attributes'],
    });
  }

  // Detect jQuery
  if (window.jQuery || window.$) {
    const version = window.jQuery?.fn?.jquery;
    addTech('jQuery', 'library', {
      version,
      description: 'JavaScript library for DOM manipulation',
      detectedFrom: ['window.jQuery'],
    });
  }

  // Detect WordPress
  const wpMeta = document.querySelector('meta[name="generator"][content*="WordPress"]');
  if (wpMeta || window.wp) {
    const versionMatch = wpMeta?.content.match(/WordPress ([\d.]+)/);
    addTech('WordPress', 'cms', {
      version: versionMatch?.[1],
      description: 'Content management system',
      detectedFrom: wpMeta ? ['meta generator'] : ['window.wp'],
    });
  }

  // Detect Google Analytics
  if (window.ga || window.gtag || document.querySelector('script[src*="google-analytics"]')) {
    addTech('Google Analytics', 'analytics', {
      description: 'Web analytics service',
      detectedFrom: ['Script tag / Global object'],
    });
  }

  // Detect Tailwind CSS
  const tailwindClasses = ['flex', 'grid', 'bg-', 'text-', 'p-', 'm-', 'w-', 'h-'];
  const hasTailwind = tailwindClasses.some(cls =>
    document.querySelector(`[class*="${cls}"]`)
  );
  if (hasTailwind) {
    addTech('Tailwind CSS', 'ui', {
      description: 'Utility-first CSS framework',
      detectedFrom: ['CSS classes'],
      confidence: 80,
    });
  }

  // Detect Bootstrap
  if (typeof window.bootstrap !== 'undefined' || document.querySelector('link[href*="bootstrap"]')) {
    addTech('Bootstrap', 'ui', {
      description: 'CSS framework',
      detectedFrom: ['CSS link / window.bootstrap'],
    });
  }

  // Detect Font Awesome
  if (document.querySelector('link[href*="font-awesome"], i[class*="fa-"]')) {
    addTech('Font Awesome', 'font', {
      description: 'Icon library',
      detectedFrom: ['CSS link / Icon classes'],
    });
  }

  // Detect Webpack
  if (document.querySelector('script[src*="webpack"]') || window.webpackJsonp) {
    addTech('Webpack', 'build', {
      description: 'Module bundler',
      detectedFrom: ['Script bundles'],
    });
  }

  // Detect Vite
  if (document.querySelector('script[type="module"][src*="vite"]')) {
    addTech('Vite', 'build', {
      description: 'Fast build tool',
      detectedFrom: ['Module scripts'],
    });
  }

  // Detect Cloudflare
  const cfHeaders = Array.from(document.querySelectorAll('script')).some(s =>
    s.src.includes('cloudflare')
  );
  if (cfHeaders) {
    addTech('Cloudflare', 'cdn', {
      description: 'CDN and security service',
      detectedFrom: ['Script sources'],
    });
  }

  // Detect Next.js
  if (window.__NEXT_DATA__ || document.querySelector('#__next')) {
    addTech('Next.js', 'framework', {
      description: 'React framework',
      detectedFrom: ['window.__NEXT_DATA__', 'DOM element'],
    });
  }

  // Detect Gatsby
  if (window.___gatsby) {
    addTech('Gatsby', 'framework', {
      description: 'React-based static site generator',
      detectedFrom: ['window.___gatsby'],
    });
  }

  // Detect TypeScript (by checking for sourcemaps)
  const hasTypeScript = Array.from(document.querySelectorAll('script')).some(s =>
    s.src.includes('.ts.') || s.src.includes('typescript')
  );
  if (hasTypeScript) {
    addTech('TypeScript', 'library', {
      description: 'Typed superset of JavaScript',
      detectedFrom: ['Script sources'],
      confidence: 70,
    });
  }

  // Detect GraphQL
  if (window.__APOLLO_CLIENT__ || document.querySelector('script[src*="graphql"]')) {
    addTech('GraphQL', 'library', {
      description: 'Query language for APIs',
      detectedFrom: ['Apollo Client / Script sources'],
    });
  }

  // Detect Redis (server-side, less reliable)
  if (document.querySelector('meta[content*="redis"]')) {
    addTech('Redis', 'database', {
      description: 'In-memory data store',
      detectedFrom: ['Meta tags'],
      confidence: 50,
    });
  }

  // Detect Shopify
  if (window.Shopify || document.querySelector('meta[content*="Shopify"]')) {
    addTech('Shopify', 'ecommerce', {
      description: 'E-commerce platform',
      detectedFrom: ['window.Shopify / Meta tags'],
    });
  }

  // Detect Stripe
  if (window.Stripe || document.querySelector('script[src*="stripe"]')) {
    addTech('Stripe', 'ecommerce', {
      description: 'Payment processing',
      detectedFrom: ['window.Stripe / Script sources'],
    });
  }

  // Detect Material-UI
  if (document.querySelector('[class*="MuiButton"], [class*="MuiBox"]')) {
    addTech('Material-UI', 'ui', {
      description: 'React component library',
      detectedFrom: ['CSS classes'],
    });
  }

  // Detect Lodash
  if (window._ && window._.VERSION) {
    addTech('Lodash', 'library', {
      version: window._.VERSION,
      description: 'Utility library',
      detectedFrom: ['window._.VERSION'],
    });
  }

  // Detect Moment.js
  if (window.moment) {
    const version = window.moment.version;
    addTech('Moment.js', 'library', {
      version,
      description: 'Date/time library',
      detectedFrom: ['window.moment'],
    });
  }

  // Detect Axios
  if (window.axios) {
    addTech('Axios', 'library', {
      description: 'HTTP client',
      detectedFrom: ['window.axios'],
    });
  }

  return {
    url,
    timestamp: new Date().toISOString(),
    detected,
    summary: {
      total: detected.length,
      byCategory: detected.reduce((acc, tech) => {
        acc[tech.category] = (acc[tech.category] || 0) + 1;
        return acc;
      }, {}),
    },
  };
}

export default TechStackDetector;
