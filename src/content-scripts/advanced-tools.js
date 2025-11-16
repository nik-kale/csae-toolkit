/**
 * Advanced Developer Tools
 * Comprehensive toolkit for web development and design
 */

// Import utilities
const { getUniqueSelector, createSafeElement, showNotification, copyToClipboard } = window.csaeUtils || {};

// ============================================================================
// LIVE CSS EDITOR
// ============================================================================

class LiveCSSEditor {
  constructor() {
    this.isActive = false;
    this.panel = null;
    this.selectedElement = null;
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    this.createPanel();
    document.addEventListener('click', this.handleElementClick.bind(this), true);
    showNotification('Live CSS Editor activated - Click any element', 'success');
  }

  deactivate() {
    if (this.panel) this.panel.remove();
    this.panel = null;
    this.selectedElement = null;
    document.removeEventListener('click', this.handleElementClick.bind(this), true);
  }

  handleElementClick(e) {
    if (this.panel && this.panel.contains(e.target)) return;
    e.preventDefault();
    e.stopPropagation();

    this.selectedElement = e.target;
    this.updatePanel(this.selectedElement);
  }

  createPanel() {
    this.panel = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '400px',
        maxHeight: '500px',
        backgroundColor: '#282a36',
        color: '#f8f8f2',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: '10000',
        padding: '20px',
        fontFamily: 'monospace',
        fontSize: '13px',
        overflow: 'auto',
      },
    });

    const title = createSafeElement('h3', 'Live CSS Editor', {
      style: { margin: '0 0 15px 0', color: '#4ADC71', fontSize: '16px' },
    });

    const closeBtn = createSafeElement('button', '×', {
      style: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        color: '#f8f8f2',
        fontSize: '24px',
        cursor: 'pointer',
      },
    });
    closeBtn.onclick = () => this.deactivate();

    this.panel.appendChild(title);
    this.panel.appendChild(closeBtn);
    document.body.appendChild(this.panel);
  }

  updatePanel(element) {
    const computed = window.getComputedStyle(element);
    const importantProps = [
      'display', 'position', 'width', 'height', 'margin', 'padding',
      'background-color', 'color', 'font-size', 'font-family', 'font-weight',
      'border', 'border-radius', 'box-shadow', 'z-index', 'opacity',
    ];

    const content = createSafeElement('div', '');
    content.innerHTML = `
      <div style="margin-bottom: 10px;">
        <strong style="color: #4ADC71;">Element:</strong> ${getUniqueSelector(element)}
      </div>
      <div style="max-height: 350px; overflow-y: auto;">
        ${importantProps
          .map(
            (prop) => `
          <div style="margin: 8px 0; padding: 8px; background: #44475a; border-radius: 4px;">
            <label style="display: block; color: #bd93f9; margin-bottom: 4px;">${prop}:</label>
            <input
              type="text"
              value="${computed.getPropertyValue(prop)}"
              data-property="${prop}"
              style="width: 100%; padding: 6px; background: #282a36; border: 1px solid #6272a4; color: #f8f8f2; border-radius: 4px; font-family: monospace;"
            />
          </div>
        `
          )
          .join('')}
      </div>
    `;

    // Clear old content
    while (this.panel.children.length > 2) {
      this.panel.removeChild(this.panel.lastChild);
    }

    this.panel.appendChild(content);

    // Add event listeners to inputs
    content.querySelectorAll('input').forEach((input) => {
      input.addEventListener('input', (e) => {
        const property = e.target.dataset.property;
        element.style[property] = e.target.value;
      });
    });
  }
}

// ============================================================================
// PAGE RULER
// ============================================================================

class PageRuler {
  constructor() {
    this.isActive = false;
    this.startPoint = null;
    this.ruler = null;
    this.overlay = null;
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    document.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));
    showNotification('Page Ruler activated - Click and drag to measure', 'success');
  }

  deactivate() {
    document.removeEventListener('mousedown', this.handleMouseDown.bind(this));
    document.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    document.removeEventListener('mouseup', this.handleMouseUp.bind(this));
    if (this.ruler) this.ruler.remove();
    if (this.overlay) this.overlay.remove();
  }

  handleMouseDown(e) {
    this.startPoint = { x: e.clientX, y: e.clientY };

    this.overlay = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        border: '2px dashed #4ADC71',
        backgroundColor: 'rgba(74, 220, 113, 0.1)',
        pointerEvents: 'none',
        zIndex: '9999',
      },
    });
    document.body.appendChild(this.overlay);

    this.ruler = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        backgroundColor: '#282a36',
        color: '#4ADC71',
        padding: '8px 12px',
        borderRadius: '6px',
        fontSize: '14px',
        fontFamily: 'monospace',
        fontWeight: 'bold',
        zIndex: '10000',
        pointerEvents: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      },
    });
    document.body.appendChild(this.ruler);
  }

  handleMouseMove(e) {
    if (!this.startPoint || !this.overlay) return;

    const width = Math.abs(e.clientX - this.startPoint.x);
    const height = Math.abs(e.clientY - this.startPoint.y);
    const left = Math.min(e.clientX, this.startPoint.x);
    const top = Math.min(e.clientY, this.startPoint.y);

    this.overlay.style.left = `${left}px`;
    this.overlay.style.top = `${top}px`;
    this.overlay.style.width = `${width}px`;
    this.overlay.style.height = `${height}px`;

    this.ruler.style.left = `${e.clientX + 10}px`;
    this.ruler.style.top = `${e.clientY + 10}px`;
    this.ruler.textContent = `${width}px × ${height}px`;
  }

  handleMouseUp() {
    this.startPoint = null;
    setTimeout(() => {
      if (this.overlay) this.overlay.remove();
      if (this.ruler) this.ruler.remove();
    }, 2000);
  }
}

// ============================================================================
// ELEMENT OUTLINER
// ============================================================================

class ElementOutliner {
  constructor() {
    this.isActive = false;
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.activate();
    } else {
      this.deactivate();
    }
  }

  activate() {
    const style = document.createElement('style');
    style.id = 'csae-outliner';
    style.textContent = `
      * { outline: 1px solid rgba(255, 0, 0, 0.3) !important; }
      *:hover { outline: 2px solid rgba(74, 220, 113, 0.8) !important; }
    `;
    document.head.appendChild(style);
    showNotification('Element Outliner activated', 'success');
  }

  deactivate() {
    const style = document.getElementById('csae-outliner');
    if (style) style.remove();
  }
}

// ============================================================================
// IMAGE EXTRACTOR
// ============================================================================

class ImageExtractor {
  extract() {
    const images = Array.from(document.querySelectorAll('img'));
    const bgImages = this.extractBackgroundImages();
    const allImages = [...images.map((img) => img.src), ...bgImages];
    const uniqueImages = [...new Set(allImages)].filter((src) => src && !src.startsWith('data:'));

    this.showImagePanel(uniqueImages);
  }

  extractBackgroundImages() {
    const elements = Array.from(document.querySelectorAll('*'));
    const bgImages = [];

    elements.forEach((el) => {
      const bg = window.getComputedStyle(el).backgroundImage;
      if (bg && bg !== 'none') {
        const matches = bg.match(/url\(['"]?([^'"]+)['"]?\)/);
        if (matches && matches[1]) {
          bgImages.push(matches[1]);
        }
      }
    });

    return bgImages;
  }

  showImagePanel(images) {
    const panel = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '800px',
        maxHeight: '80%',
        backgroundColor: '#282a36',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: '10000',
        padding: '20px',
        overflow: 'auto',
      },
    });

    const title = createSafeElement('h3', `Found ${images.length} images`, {
      style: { margin: '0 0 15px 0', color: '#4ADC71', fontSize: '18px' },
    });

    const closeBtn = createSafeElement('button', '×', {
      style: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        background: 'transparent',
        border: 'none',
        color: '#f8f8f2',
        fontSize: '24px',
        cursor: 'pointer',
      },
    });
    closeBtn.onclick = () => panel.remove();

    const downloadAllBtn = createSafeElement('button', 'Download All', {
      style: {
        padding: '10px 20px',
        backgroundColor: '#4ADC71',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        marginBottom: '15px',
      },
    });
    downloadAllBtn.onclick = () => this.downloadAll(images);

    const grid = createSafeElement('div', '', {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '15px',
      },
    });

    images.forEach((src) => {
      const card = createSafeElement('div', '', {
        style: {
          backgroundColor: '#44475a',
          borderRadius: '8px',
          padding: '10px',
          textAlign: 'center',
          cursor: 'pointer',
        },
      });

      const img = createSafeElement('img', '', {
        src,
        style: {
          width: '100%',
          height: '100px',
          objectFit: 'cover',
          borderRadius: '4px',
          marginBottom: '8px',
        },
      });

      const downloadBtn = createSafeElement('button', '⬇', {
        style: {
          width: '100%',
          padding: '6px',
          backgroundColor: '#6272a4',
          color: '#fff',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        },
      });
      downloadBtn.onclick = () => this.downloadImage(src);

      card.appendChild(img);
      card.appendChild(downloadBtn);
      grid.appendChild(card);
    });

    panel.appendChild(title);
    panel.appendChild(closeBtn);
    panel.appendChild(downloadAllBtn);
    panel.appendChild(grid);
    document.body.appendChild(panel);
  }

  downloadImage(src) {
    const a = document.createElement('a');
    a.href = src;
    a.download = src.split('/').pop() || 'image.jpg';
    a.click();
    showNotification('Downloading image...', 'success');
  }

  downloadAll(images) {
    images.forEach((src, index) => {
      setTimeout(() => this.downloadImage(src), index * 200);
    });
    showNotification(`Downloading ${images.length} images...`, 'success');
  }
}

// ============================================================================
// SCREENSHOT TOOL
// ============================================================================

class ScreenshotTool {
  async capture(type = 'viewport') {
    try {
      if (type === 'viewport') {
        await this.captureViewport();
      } else if (type === 'fullpage') {
        await this.captureFullPage();
      } else if (type === 'element') {
        this.captureElement();
      }
    } catch (error) {
      showNotification('Screenshot failed: ' + error.message, 'error');
    }
  }

  async captureViewport() {
    // Request screenshot from background script
    chrome.runtime.sendMessage({ action: 'captureScreenshot', type: 'viewport' }, (response) => {
      if (response && response.dataUrl) {
        this.downloadScreenshot(response.dataUrl, 'viewport-screenshot.png');
      }
    });
  }

  async captureFullPage() {
    showNotification('Capturing full page...', 'info');
    // This would require more complex implementation with scrolling and stitching
    chrome.runtime.sendMessage({ action: 'captureScreenshot', type: 'fullpage' }, (response) => {
      if (response && response.dataUrl) {
        this.downloadScreenshot(response.dataUrl, 'fullpage-screenshot.png');
      }
    });
  }

  captureElement() {
    showNotification('Click an element to screenshot it', 'info');
    const handler = (e) => {
      e.preventDefault();
      e.stopPropagation();
      document.removeEventListener('click', handler, true);

      const element = e.target;
      const rect = element.getBoundingClientRect();

      chrome.runtime.sendMessage({
        action: 'captureScreenshot',
        type: 'element',
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }
      }, (response) => {
        if (response && response.dataUrl) {
          this.downloadScreenshot(response.dataUrl, 'element-screenshot.png');
        }
      });
    };

    document.addEventListener('click', handler, true);
  }

  downloadScreenshot(dataUrl, filename) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
    showNotification('Screenshot downloaded!', 'success');
  }
}

// ============================================================================
// SEO META INSPECTOR
// ============================================================================

class SEOInspector {
  inspect() {
    const data = {
      title: document.title,
      description: this.getMeta('description'),
      keywords: this.getMeta('keywords'),
      ogTitle: this.getMeta('og:title'),
      ogDescription: this.getMeta('og:description'),
      ogImage: this.getMeta('og:image'),
      twitterCard: this.getMeta('twitter:card'),
      canonical: this.getCanonical(),
      robots: this.getMeta('robots'),
      viewport: this.getMeta('viewport'),
      h1: this.getHeadings('h1'),
      h2: this.getHeadings('h2'),
      images: this.countImages(),
      links: this.countLinks(),
    };

    this.showPanel(data);
  }

  getMeta(name) {
    const meta = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
    return meta ? meta.content : 'Not set';
  }

  getCanonical() {
    const link = document.querySelector('link[rel="canonical"]');
    return link ? link.href : 'Not set';
  }

  getHeadings(tag) {
    const headings = Array.from(document.querySelectorAll(tag));
    return headings.map((h) => h.textContent.trim());
  }

  countImages() {
    return document.querySelectorAll('img').length;
  }

  countLinks() {
    return document.querySelectorAll('a').length;
  }

  showPanel(data) {
    const panel = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '700px',
        maxHeight: '80%',
        backgroundColor: '#282a36',
        color: '#f8f8f2',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: '10000',
        padding: '20px',
        overflow: 'auto',
        fontFamily: 'monospace',
        fontSize: '13px',
      },
    });

    const content = `
      <h3 style="color: #4ADC71; margin-bottom: 20px; font-size: 18px;">SEO Meta Inspector</h3>
      <button id="closeBtn" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #f8f8f2; font-size: 24px; cursor: pointer;">×</button>

      <div style="margin-bottom: 15px;">
        <strong style="color: #bd93f9;">Title:</strong>
        <div style="padding: 8px; background: #44475a; border-radius: 4px; margin-top: 4px; word-break: break-word;">${data.title}</div>
      </div>

      <div style="margin-bottom: 15px;">
        <strong style="color: #bd93f9;">Description:</strong>
        <div style="padding: 8px; background: #44475a; border-radius: 4px; margin-top: 4px; word-break: break-word;">${data.description}</div>
      </div>

      <div style="margin-bottom: 15px;">
        <strong style="color: #bd93f9;">Keywords:</strong>
        <div style="padding: 8px; background: #44475a; border-radius: 4px; margin-top: 4px; word-break: break-word;">${data.keywords}</div>
      </div>

      <div style="margin-bottom: 15px;">
        <strong style="color: #bd93f9;">Canonical URL:</strong>
        <div style="padding: 8px; background: #44475a; border-radius: 4px; margin-top: 4px; word-break: break-word;">${data.canonical}</div>
      </div>

      <h4 style="color: #4ADC71; margin: 20px 0 10px 0;">Open Graph</h4>
      <div style="background: #44475a; padding: 12px; border-radius: 6px;">
        <div style="margin-bottom: 8px;"><strong>og:title:</strong> ${data.ogTitle}</div>
        <div style="margin-bottom: 8px;"><strong>og:description:</strong> ${data.ogDescription}</div>
        <div><strong>og:image:</strong> ${data.ogImage}</div>
      </div>

      <h4 style="color: #4ADC71; margin: 20px 0 10px 0;">Page Stats</h4>
      <div style="background: #44475a; padding: 12px; border-radius: 6px;">
        <div style="margin-bottom: 8px;"><strong>H1 Tags:</strong> ${data.h1.length} (${data.h1.slice(0, 3).join(', ')})</div>
        <div style="margin-bottom: 8px;"><strong>H2 Tags:</strong> ${data.h2.length}</div>
        <div style="margin-bottom: 8px;"><strong>Images:</strong> ${data.images}</div>
        <div><strong>Links:</strong> ${data.links}</div>
      </div>
    `;

    panel.innerHTML = content;
    document.body.appendChild(panel);

    document.getElementById('closeBtn').addEventListener('click', () => panel.remove());
  }
}

// ============================================================================
// PERFORMANCE ANALYZER
// ============================================================================

class PerformanceAnalyzer {
  async analyze() {
    const metrics = await this.collectMetrics();
    this.showPanel(metrics);
  }

  async collectMetrics() {
    const perfEntries = performance.getEntriesByType('navigation')[0];
    const paintEntries = performance.getEntriesByType('paint');

    // Get Web Vitals
    const metrics = {
      // Navigation Timing
      dns: Math.round(perfEntries.domainLookupEnd - perfEntries.domainLookupStart),
      tcp: Math.round(perfEntries.connectEnd - perfEntries.connectStart),
      request: Math.round(perfEntries.responseStart - perfEntries.requestStart),
      response: Math.round(perfEntries.responseEnd - perfEntries.responseStart),
      domParsing: Math.round(perfEntries.domInteractive - perfEntries.responseEnd),
      domContentLoaded: Math.round(perfEntries.domContentLoadedEventEnd - perfEntries.domContentLoadedEventStart),
      loadComplete: Math.round(perfEntries.loadEventEnd - perfEntries.loadEventStart),

      // Paint Metrics
      fcp: paintEntries.find((entry) => entry.name === 'first-contentful-paint')?.startTime || 0,

      // Resource Count
      resources: performance.getEntriesByType('resource').length,
      totalSize: this.calculateTotalSize(),
    };

    return metrics;
  }

  calculateTotalSize() {
    const resources = performance.getEntriesByType('resource');
    let total = 0;
    resources.forEach((resource) => {
      total += resource.transferSize || resource.encodedBodySize || 0;
    });
    return Math.round(total / 1024); // KB
  }

  showPanel(metrics) {
    const panel = createSafeElement('div', '', {
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '600px',
        backgroundColor: '#282a36',
        color: '#f8f8f2',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        zIndex: '10000',
        padding: '20px',
        fontFamily: 'monospace',
        fontSize: '13px',
      },
    });

    const content = `
      <h3 style="color: #4ADC71; margin-bottom: 20px; font-size: 18px;">Performance Analyzer</h3>
      <button id="closeBtn" style="position: absolute; top: 10px; right: 10px; background: transparent; border: none; color: #f8f8f2; font-size: 24px; cursor: pointer;">×</button>

      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
        ${this.createMetricCard('DNS Lookup', metrics.dns + 'ms', metrics.dns < 50)}
        ${this.createMetricCard('TCP Connection', metrics.tcp + 'ms', metrics.tcp < 100)}
        ${this.createMetricCard('Request Time', metrics.request + 'ms', metrics.request < 100)}
        ${this.createMetricCard('Response Time', metrics.response + 'ms', metrics.response < 200)}
        ${this.createMetricCard('DOM Parsing', metrics.domParsing + 'ms', metrics.domParsing < 500)}
        ${this.createMetricCard('FCP', Math.round(metrics.fcp) + 'ms', metrics.fcp < 2500)}
      </div>

      <div style="background: #44475a; padding: 15px; border-radius: 6px;">
        <div style="margin-bottom: 10px;"><strong>Resources Loaded:</strong> ${metrics.resources}</div>
        <div><strong>Total Transfer Size:</strong> ${metrics.totalSize} KB</div>
      </div>
    `;

    panel.innerHTML = content;
    document.body.appendChild(panel);

    document.getElementById('closeBtn').addEventListener('click', () => panel.remove());
  }

  createMetricCard(label, value, isGood) {
    const color = isGood ? '#4ADC71' : '#ff6b6b';
    return `
      <div style="background: #44475a; padding: 12px; border-radius: 6px; border-left: 4px solid ${color};">
        <div style="color: #bd93f9; font-size: 11px; margin-bottom: 4px;">${label}</div>
        <div style="font-size: 18px; font-weight: bold; color: ${color};">${value}</div>
      </div>
    `;
  }
}

// ============================================================================
// EXPORT FUNCTIONALITY
// ============================================================================

window.csaeAdvancedTools = {
  liveCSSEditor: new LiveCSSEditor(),
  pageRuler: new PageRuler(),
  elementOutliner: new ElementOutliner(),
  imageExtractor: new ImageExtractor(),
  screenshotTool: new ScreenshotTool(),
  seoInspector: new SEOInspector(),
  performanceAnalyzer: new PerformanceAnalyzer(),
};
