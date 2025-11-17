import React, { useState, useEffect } from 'react';

/**
 * Network Request Viewer Component for CSAE Toolkit v5.0
 *
 * Monitors and displays network requests with filtering and detailed inspection
 * Supports HAR export and request/response analysis
 */
const NetworkViewer = ({ onClose }) => {
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecording, setIsRecording] = useState(true);
  const [sortBy, setSortBy] = useState('time');

  useEffect(() => {
    // Capture current network requests
    captureNetworkRequests();

    // Listen for new requests
    const interval = setInterval(() => {
      if (isRecording) {
        captureNetworkRequests();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isRecording]);

  const captureNetworkRequests = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: getNetworkRequests,
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              setRequests(prev => {
                const newRequests = results[0].result;
                const merged = [...prev];

                newRequests.forEach(newReq => {
                  const existing = merged.find(r => r.id === newReq.id);
                  if (!existing) {
                    merged.push(newReq);
                  }
                });

                return merged.slice(-200); // Keep last 200 requests
              });
            }
          }
        );
      }
    });
  };

  const getMethodColor = (method) => {
    const colors = {
      GET: 'text-blue-400',
      POST: 'text-green-400',
      PUT: 'text-yellow-400',
      DELETE: 'text-red-400',
      PATCH: 'text-purple-400',
    };
    return colors[method] || 'text-gray-400';
  };

  const getStatusColor = (status) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 300 && status < 400) return 'text-blue-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    if (status >= 500) return 'text-red-400';
    return 'text-gray-400';
  };

  const getResourceType = (url) => {
    const extension = url.split('.').pop().split('?')[0].toLowerCase();
    const types = {
      js: 'JavaScript',
      css: 'Stylesheet',
      json: 'JSON',
      xml: 'XML',
      png: 'Image',
      jpg: 'Image',
      jpeg: 'Image',
      gif: 'Image',
      svg: 'Image',
      woff: 'Font',
      woff2: 'Font',
      ttf: 'Font',
    };
    return types[extension] || (url.includes('/api/') ? 'API' : 'Document');
  };

  const filterRequests = () => {
    let filtered = requests;

    // Filter by type
    if (filter !== 'all') {
      filtered = filtered.filter(req => {
        const type = getResourceType(req.url).toLowerCase();
        if (filter === 'xhr') return req.method !== 'GET' || type === 'api' || type === 'json';
        return type === filter.toLowerCase();
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(req =>
        req.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.method.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    if (sortBy === 'time') {
      filtered.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'duration') {
      filtered.sort((a, b) => (b.duration || 0) - (a.duration || 0));
    } else if (sortBy === 'size') {
      filtered.sort((a, b) => (b.size || 0) - (a.size || 0));
    }

    return filtered;
  };

  const clearRequests = () => {
    setRequests([]);
    setSelectedRequest(null);
  };

  const exportHAR = () => {
    const har = {
      log: {
        version: '1.2',
        creator: {
          name: 'CSAE Toolkit',
          version: '5.0.0',
        },
        pages: [{
          startedDateTime: new Date().toISOString(),
          id: 'page_1',
          title: document.title,
        }],
        entries: requests.map(req => ({
          startedDateTime: new Date(req.timestamp).toISOString(),
          time: req.duration || 0,
          request: {
            method: req.method,
            url: req.url,
            httpVersion: 'HTTP/1.1',
            headers: req.requestHeaders || [],
            queryString: [],
            cookies: [],
            headersSize: -1,
            bodySize: -1,
          },
          response: {
            status: req.status || 0,
            statusText: req.statusText || '',
            httpVersion: 'HTTP/1.1',
            headers: req.responseHeaders || [],
            content: {
              size: req.size || 0,
              mimeType: req.contentType || 'application/octet-stream',
            },
            redirectURL: '',
            headersSize: -1,
            bodySize: req.size || -1,
          },
          cache: {},
          timings: {
            send: 0,
            wait: req.duration || 0,
            receive: 0,
          },
        })),
      },
    };

    const blob = new Blob([JSON.stringify(har, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `network-${new Date().toISOString().slice(0, 10)}.har`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRequests = filterRequests();
  const totalSize = requests.reduce((sum, req) => sum + (req.size || 0), 0);
  const avgDuration = requests.length > 0
    ? requests.reduce((sum, req) => sum + (req.duration || 0), 0) / requests.length
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-hidden">
      <div className="h-screen flex flex-col bg-[#282A33]">
        {/* Header */}
        <div className="p-4 border-b border-gray-600 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center">
              <span className="text-3xl mr-2">📡</span>
              Network Request Viewer
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              {filteredRequests.length} requests • {(totalSize / 1024).toFixed(2)} KB •{' '}
              Avg {avgDuration.toFixed(0)}ms
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
            title="Close"
          >
            ✕
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-600 flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`px-3 py-2 rounded text-sm font-semibold ${
              isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-600 hover:bg-gray-700'
            } text-white`}
          >
            {isRecording ? '⏸️ Pause' : '▶️ Record'}
          </button>

          <button
            onClick={clearRequests}
            className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm font-semibold"
          >
            🗑️ Clear
          </button>

          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5] text-sm"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
            >
              <option value="all">All Types</option>
              <option value="xhr">XHR/API</option>
              <option value="javascript">JavaScript</option>
              <option value="stylesheet">CSS</option>
              <option value="image">Images</option>
              <option value="font">Fonts</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
            >
              <option value="time">Sort by Time</option>
              <option value="duration">Sort by Duration</option>
              <option value="size">Sort by Size</option>
            </select>
          </div>

          <button
            onClick={exportHAR}
            className="px-3 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
          >
            📥 Export HAR
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Requests List */}
          <div className="w-1/2 border-r border-gray-600 overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-6xl mb-4">📡</div>
                <div className="text-lg">No requests captured</div>
                <div className="text-sm mt-2">
                  {isRecording ? 'Waiting for network activity...' : 'Click Record to start capturing'}
                </div>
              </div>
            ) : (
              <div>
                {filteredRequests.map((req, index) => (
                  <div
                    key={req.id || index}
                    onClick={() => setSelectedRequest(req)}
                    className={`p-3 border-b border-gray-700 cursor-pointer hover:bg-[#353945] ${
                      selectedRequest === req ? 'bg-[#353945]' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold ${getMethodColor(req.method)}`}>
                          {req.method}
                        </span>
                        {req.status && (
                          <span className={`text-xs font-semibold ${getStatusColor(req.status)}`}>
                            {req.status}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {getResourceType(req.url)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {req.duration ? `${req.duration}ms` : '-'}
                      </div>
                    </div>
                    <div className="text-sm text-white truncate">{req.url}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-400">
                        {new Date(req.timestamp).toLocaleTimeString()}
                      </div>
                      {req.size && (
                        <div className="text-xs text-gray-400">
                          {(req.size / 1024).toFixed(2)} KB
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request Details */}
          <div className="w-1/2 overflow-y-auto p-4">
            {selectedRequest ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Request Details</h3>

                {/* General Info */}
                <div className="mb-4 p-4 bg-[#353945] rounded">
                  <div className="font-semibold text-sm text-[#4ADC71] mb-2">General</div>
                  <div className="space-y-2 text-sm">
                    <div><span className="text-gray-400">URL:</span> <span className="text-white break-all">{selectedRequest.url}</span></div>
                    <div><span className="text-gray-400">Method:</span> <span className={getMethodColor(selectedRequest.method)}>{selectedRequest.method}</span></div>
                    {selectedRequest.status && (
                      <div><span className="text-gray-400">Status:</span> <span className={getStatusColor(selectedRequest.status)}>{selectedRequest.status} {selectedRequest.statusText}</span></div>
                    )}
                    {selectedRequest.duration && (
                      <div><span className="text-gray-400">Duration:</span> <span className="text-white">{selectedRequest.duration}ms</span></div>
                    )}
                    {selectedRequest.size && (
                      <div><span className="text-gray-400">Size:</span> <span className="text-white">{(selectedRequest.size / 1024).toFixed(2)} KB</span></div>
                    )}
                    <div><span className="text-gray-400">Time:</span> <span className="text-white">{new Date(selectedRequest.timestamp).toLocaleString()}</span></div>
                  </div>
                </div>

                {/* Request Headers */}
                {selectedRequest.requestHeaders && selectedRequest.requestHeaders.length > 0 && (
                  <div className="mb-4 p-4 bg-[#353945] rounded">
                    <div className="font-semibold text-sm text-[#4ADC71] mb-2">Request Headers</div>
                    <div className="space-y-1 text-xs font-mono">
                      {selectedRequest.requestHeaders.map((header, i) => (
                        <div key={i}>
                          <span className="text-gray-400">{header.name}:</span>{' '}
                          <span className="text-white">{header.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Headers */}
                {selectedRequest.responseHeaders && selectedRequest.responseHeaders.length > 0 && (
                  <div className="mb-4 p-4 bg-[#353945] rounded">
                    <div className="font-semibold text-sm text-[#4ADC71] mb-2">Response Headers</div>
                    <div className="space-y-1 text-xs font-mono">
                      {selectedRequest.responseHeaders.map((header, i) => (
                        <div key={i}>
                          <span className="text-gray-400">{header.name}:</span>{' '}
                          <span className="text-white">{header.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Response Data */}
                {selectedRequest.response && (
                  <div className="mb-4 p-4 bg-[#353945] rounded">
                    <div className="font-semibold text-sm text-[#4ADC71] mb-2">Response Preview</div>
                    <pre className="text-xs bg-[#1a1d24] p-3 rounded overflow-x-auto max-h-96 overflow-y-auto">
                      {typeof selectedRequest.response === 'object'
                        ? JSON.stringify(selectedRequest.response, null, 2)
                        : selectedRequest.response.substring(0, 10000)}
                    </pre>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-6xl mb-4">📄</div>
                <div className="text-lg">Select a request to view details</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Capture network requests from the page
 * This function intercepts fetch and XMLHttpRequest
 */
function getNetworkRequests() {
  // This is a simplified version - real network monitoring requires
  // background script and chrome.webRequest API

  if (!window.__csaeNetworkRequests) {
    window.__csaeNetworkRequests = [];

    // Intercept fetch
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const method = args[1]?.method || 'GET';

      const requestData = {
        id: `${Date.now()}-${Math.random()}`,
        url,
        method,
        timestamp: startTime,
        requestHeaders: args[1]?.headers ? Object.entries(args[1].headers).map(([name, value]) => ({ name, value })) : [],
      };

      return originalFetch.apply(this, args).then(response => {
        const duration = Date.now() - startTime;
        const clonedResponse = response.clone();

        requestData.status = response.status;
        requestData.statusText = response.statusText;
        requestData.duration = duration;
        requestData.contentType = response.headers.get('content-type');
        requestData.responseHeaders = Array.from(response.headers.entries()).map(([name, value]) => ({ name, value }));

        // Try to get size from content-length
        const contentLength = response.headers.get('content-length');
        if (contentLength) {
          requestData.size = parseInt(contentLength);
        }

        window.__csaeNetworkRequests.push(requestData);

        return response;
      }).catch(error => {
        requestData.error = error.message;
        window.__csaeNetworkRequests.push(requestData);
        throw error;
      });
    };

    // Intercept XMLHttpRequest
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url) {
      this.__csaeRequestData = {
        id: `${Date.now()}-${Math.random()}`,
        method,
        url,
        timestamp: Date.now(),
        requestHeaders: [],
      };
      return originalXHROpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function() {
      const requestData = this.__csaeRequestData;
      const startTime = Date.now();

      this.addEventListener('loadend', () => {
        requestData.duration = Date.now() - startTime;
        requestData.status = this.status;
        requestData.statusText = this.statusText;
        requestData.responseHeaders = this.getAllResponseHeaders().split('\r\n')
          .filter(h => h)
          .map(h => {
            const [name, ...value] = h.split(': ');
            return { name, value: value.join(': ') };
          });

        window.__csaeNetworkRequests.push(requestData);
      });

      return originalXHRSend.apply(this, arguments);
    };
  }

  // Return captured requests
  return window.__csaeNetworkRequests || [];
}

export default NetworkViewer;
