import React, { useState, useEffect, useRef } from 'react';
import { searchTools, ALL_TOOLS, toolHistoryManager } from '../utils/toolHistory';

/**
 * Tool Search Component for CSAE Toolkit v4.0
 *
 * Provides instant search across all tools
 * Shows keyboard shortcuts and allows quick execution
 */
const ToolSearch = ({ onToolSelect, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(ALL_TOOLS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);

  useEffect(() => {
    // Focus input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }

    // Handle keyboard shortcuts
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (results[selectedIndex]) {
          handleToolSelect(results[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [results, selectedIndex, onClose]);

  useEffect(() => {
    // Search tools
    const searchResults = searchTools(query);
    setResults(searchResults);
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    // Scroll selected item into view
    if (resultsRef.current && results[selectedIndex]) {
      const selectedElement = resultsRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, results]);

  const handleToolSelect = (tool) => {
    onToolSelect(tool);
    toolHistoryManager.recordToolUsage(tool);
    onClose();
  };

  const handleFavoriteToggle = (e, tool) => {
    e.stopPropagation();
    toolHistoryManager.toggleFavorite(tool);
  };

  const getCategoryColor = (category) => {
    const colors = {
      inspector: 'text-blue-400',
      editor: 'text-green-400',
      layout: 'text-purple-400',
      storage: 'text-yellow-400',
    };
    return colors[category] || 'text-gray-400';
  };

  const getCategoryLabel = (category) => {
    const labels = {
      inspector: 'Inspector',
      editor: 'Editor',
      layout: 'Layout',
      storage: 'Storage',
    };
    return labels[category] || category;
  };

  return (
    <div className="tool-search-overlay fixed inset-0 bg-black bg-opacity-70 z-50 flex items-start justify-center pt-20">
      <div className="tool-search-modal bg-[#282A33] rounded-lg shadow-2xl max-w-2xl w-full max-h-[70vh] overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-600">
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-2xl">
              🔍
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools by name, category, or shortcut..."
              className="w-full pl-12 pr-4 py-3 bg-[#353945] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#649ef5]"
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
            <div>
              <kbd className="bg-[#464b54] px-2 py-1 rounded">↑↓</kbd> Navigate
              <kbd className="bg-[#464b54] px-2 py-1 rounded ml-2">Enter</kbd> Select
              <kbd className="bg-[#464b54] px-2 py-1 rounded ml-2">ESC</kbd> Close
            </div>
            <div>{results.length} tools found</div>
          </div>
        </div>

        {/* Results */}
        <div ref={resultsRef} className="overflow-y-auto max-h-[50vh] p-2">
          {results.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <div className="text-4xl mb-2">🔍</div>
              <div className="text-sm">No tools found</div>
              <div className="text-xs mt-1">Try a different search term</div>
            </div>
          ) : (
            results.map((tool, index) => (
              <button
                key={tool.id}
                onClick={() => handleToolSelect(tool)}
                className={`w-full p-3 rounded-lg mb-1 text-left transition duration-200 flex items-center justify-between ${
                  index === selectedIndex
                    ? 'bg-[#649ef5] text-white'
                    : 'bg-[#353945] text-white hover:bg-[#464b54]'
                }`}
              >
                <div className="flex items-center flex-1">
                  <span className="text-2xl mr-3">{tool.icon}</span>
                  <div>
                    <div className="font-semibold">{tool.name}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${
                          index === selectedIndex ? 'bg-white/20' : 'bg-[#464b54]'
                        } ${getCategoryColor(tool.category)}`}
                      >
                        {getCategoryLabel(tool.category)}
                      </span>
                      {tool.shortcut && (
                        <kbd
                          className={`text-xs px-2 py-0.5 rounded ${
                            index === selectedIndex ? 'bg-white/20' : 'bg-[#464b54]'
                          }`}
                        >
                          {tool.shortcut}
                        </kbd>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={(e) => handleFavoriteToggle(e, tool)}
                  className={`text-xl ml-2 ${
                    toolHistoryManager.isFavorite(tool.id)
                      ? 'text-yellow-400'
                      : index === selectedIndex
                      ? 'text-white/50 hover:text-yellow-400'
                      : 'text-gray-500 hover:text-yellow-400'
                  }`}
                  title={
                    toolHistoryManager.isFavorite(tool.id)
                      ? 'Remove from favorites'
                      : 'Add to favorites'
                  }
                >
                  {toolHistoryManager.isFavorite(tool.id) ? '★' : '☆'}
                </button>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-600 text-center">
          <div className="text-xs text-gray-400">
            Pro Tip: Press <kbd className="bg-[#464b54] px-2 py-1 rounded">Ctrl+K</kbd> to open tool search anywhere
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolSearch;
