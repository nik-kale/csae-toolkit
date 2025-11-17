import React, { useState } from 'react';

/**
 * JSON/XML Formatter & Viewer for CSAE Toolkit v5.0
 *
 * Format, validate, and explore JSON/XML data structures
 * Supports minify, beautify, validation, and tree view
 */
const JSONFormatter = ({ onClose }) => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState('json');
  const [view, setView] = useState('formatted');
  const [error, setError] = useState(null);

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const validateJSON = () => {
    try {
      JSON.parse(input);
      setError(null);
      alert('✅ Valid JSON!');
    } catch (err) {
      setError(err.message);
      alert('❌ Invalid JSON: ' + err.message);
    }
  };

  const formatXML = () => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(input, 'text/xml');

      if (xmlDoc.querySelector('parsererror')) {
        throw new Error('Invalid XML');
      }

      const serializer = new XMLSerializer();
      const formatted = formatXMLString(serializer.serializeToString(xmlDoc));
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const formatXMLString = (xml) => {
    let formatted = '';
    let indent = '';
    xml.split(/>\s*</).forEach(node => {
      if (node.match(/^\/\w/)) indent = indent.substring(2);
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/)) indent += '  ';
    });
    return formatted.substring(1, formatted.length - 3);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    alert('Copied to clipboard!');
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const loadSample = () => {
    const sampleJSON = {
      name: 'CSAE Toolkit',
      version: '5.0.0',
      features: ['Accessibility Audit', 'Network Viewer', 'Snippet Manager'],
      config: {
        theme: 'dark',
        autoSave: true,
      },
      stats: {
        tools: 30,
        users: 1000,
      },
    };
    setInput(JSON.stringify(sampleJSON, null, 2));
  };

  const downloadOutput = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `formatted.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-hidden">
      <div className="h-screen flex flex-col bg-[#282A33]">
        {/* Header */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="text-3xl mr-2">📋</span>
                JSON/XML Formatter
              </h2>
              <p className="text-xs text-gray-400 mt-1">Format, validate, and beautify your data</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-600 flex flex-wrap items-center gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-2 rounded text-sm font-semibold ${
                format === 'json' ? 'bg-[#649ef5] text-white' : 'bg-[#353945] text-gray-300'
              }`}
            >
              JSON
            </button>
            <button
              onClick={() => setFormat('xml')}
              className={`px-3 py-2 rounded text-sm font-semibold ${
                format === 'xml' ? 'bg-[#649ef5] text-white' : 'bg-[#353945] text-gray-300'
              }`}
            >
              XML
            </button>
          </div>

          <div className="h-8 w-px bg-gray-600"></div>

          {format === 'json' ? (
            <>
              <button
                onClick={formatJSON}
                className="px-3 py-2 bg-[#4ADC71] text-white rounded hover:bg-green-600 text-sm font-semibold"
              >
                ✨ Format/Beautify
              </button>
              <button
                onClick={minifyJSON}
                className="px-3 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] text-sm"
              >
                🗜️ Minify
              </button>
              <button
                onClick={validateJSON}
                className="px-3 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm"
              >
                ✅ Validate
              </button>
            </>
          ) : (
            <button
              onClick={formatXML}
              className="px-3 py-2 bg-[#4ADC71] text-white rounded hover:bg-green-600 text-sm font-semibold"
            >
              ✨ Format XML
            </button>
          )}

          <div className="h-8 w-px bg-gray-600"></div>

          <button
            onClick={loadSample}
            className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
          >
            📄 Load Sample
          </button>

          <button
            onClick={copyToClipboard}
            disabled={!output}
            className={`px-3 py-2 rounded text-sm ${
              output ? 'bg-[#353945] text-white hover:bg-[#464b54]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            📋 Copy
          </button>

          <button
            onClick={downloadOutput}
            disabled={!output}
            className={`px-3 py-2 rounded text-sm ${
              output ? 'bg-[#353945] text-white hover:bg-[#464b54]' : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            📥 Download
          </button>

          <button
            onClick={clearAll}
            className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            🗑️ Clear
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Input */}
          <div className="w-1/2 flex flex-col border-r border-gray-600">
            <div className="p-3 border-b border-gray-600 bg-[#353945]">
              <div className="text-sm font-semibold text-white">Input</div>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={format === 'json' ? 'Paste your JSON here...' : 'Paste your XML here...'}
              className="flex-1 p-4 bg-[#1a1d24] text-white font-mono text-sm focus:outline-none resize-none"
            />
          </div>

          {/* Output */}
          <div className="w-1/2 flex flex-col">
            <div className="p-3 border-b border-gray-600 bg-[#353945] flex items-center justify-between">
              <div className="text-sm font-semibold text-white">Output</div>
              {output && (
                <div className="text-xs text-green-400">
                  {output.split('\n').length} lines • {output.length} chars
                </div>
              )}
            </div>

            {error ? (
              <div className="flex-1 p-4 bg-[#1a1d24] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">❌</div>
                  <div className="text-xl font-semibold text-red-400 mb-2">Validation Error</div>
                  <div className="text-sm text-gray-300 max-w-md">{error}</div>
                </div>
              </div>
            ) : output ? (
              <pre className="flex-1 p-4 bg-[#1a1d24] text-white font-mono text-sm overflow-auto">
                {output}
              </pre>
            ) : (
              <div className="flex-1 p-4 bg-[#1a1d24] flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <div className="text-6xl mb-4">📋</div>
                  <div className="text-lg">Formatted output will appear here</div>
                  <div className="text-sm mt-2">Paste {format.toUpperCase()} and click Format</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-600 text-center text-xs text-gray-400">
          Tip: Use Ctrl+A to select all, Ctrl+C to copy
        </div>
      </div>
    </div>
  );
};

export default JSONFormatter;
