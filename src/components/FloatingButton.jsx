import React, { useState, useEffect } from 'react';
import { toolHistoryManager, ALL_TOOLS } from '../utils/toolHistory';

/**
 * Floating Quick Access Button Component for CSAE Toolkit v4.0
 *
 * Provides quick access to favorite and recent tools
 * Draggable to customize position
 */
const FloatingButton = ({ onToolSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ bottom: 20, right: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [recentTools, setRecentTools] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);

  useEffect(() => {
    // Load position from storage
    chrome.storage.local.get(['floatingButtonPosition'], (result) => {
      if (result.floatingButtonPosition) {
        setPosition(result.floatingButtonPosition);
      }
    });

    // Subscribe to tool history changes
    const listener = ({ recentTools, favoriteTools }) => {
      setRecentTools(recentTools.slice(0, 5)); // Top 5 recent
      setFavoriteTools(favoriteTools);
    };

    toolHistoryManager.addListener(listener);

    // Initial load
    setRecentTools(toolHistoryManager.getRecentTools(5));
    setFavoriteTools(toolHistoryManager.getFavoriteTools());

    return () => {
      toolHistoryManager.removeListener(listener);
    };
  }, []);

  const handleMouseDown = (e) => {
    if (e.target.closest('.quick-access-menu')) return; // Don't drag when clicking menu items

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const newRight = window.innerWidth - e.clientX - dragOffset.x;
    const newBottom = window.innerHeight - e.clientY - dragOffset.y;

    setPosition({
      bottom: Math.max(20, Math.min(window.innerHeight - 80, newBottom)),
      right: Math.max(20, Math.min(window.innerWidth - 80, newRight)),
    });
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Save position to storage
      chrome.storage.local.set({ floatingButtonPosition: position });
    }
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const handleToolClick = (tool) => {
    setIsOpen(false);
    onToolSelect(tool);
    toolHistoryManager.recordToolUsage(tool);
  };

  const toggleFavorite = (e, tool) => {
    e.stopPropagation();
    toolHistoryManager.toggleFavorite(tool);
  };

  const isFavorite = (toolId) => {
    return toolHistoryManager.isFavorite(toolId);
  };

  return (
    <div
      className="floating-button-container"
      style={{
        position: 'fixed',
        bottom: `${position.bottom}px`,
        right: `${position.right}px`,
        zIndex: 9999,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Main Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="floating-button w-14 h-14 bg-[#649ef5] hover:bg-[#5080d0] text-white rounded-full shadow-lg flex items-center justify-center transition duration-300 text-2xl"
        title="Quick Access Tools"
        aria-label="Quick Access Tools"
      >
        🛠️
      </button>

      {/* Quick Access Menu */}
      {isOpen && (
        <div
          className="quick-access-menu absolute bottom-16 right-0 bg-[#282A33] rounded-lg shadow-xl p-4 w-64"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Favorites Section */}
          {favoriteTools.length > 0 && (
            <div className="mb-4">
              <div className="text-xs font-semibold text-[#4ADC71] mb-2">⭐ Favorites</div>
              <div className="space-y-1">
                {favoriteTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="w-full px-3 py-2 bg-[#353945] hover:bg-[#464b54] text-white rounded text-sm text-left transition duration-200 flex items-center justify-between"
                  >
                    <span>
                      <span className="mr-2">{tool.icon}</span>
                      {tool.name}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(e, tool)}
                      className="text-yellow-400 hover:text-yellow-300"
                      title="Remove from favorites"
                    >
                      ★
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recent Tools Section */}
          {recentTools.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-[#649ef5] mb-2">🕐 Recent</div>
              <div className="space-y-1">
                {recentTools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => handleToolClick(tool)}
                    className="w-full px-3 py-2 bg-[#353945] hover:bg-[#464b54] text-white rounded text-sm text-left transition duration-200 flex items-center justify-between"
                  >
                    <span>
                      <span className="mr-2">{tool.icon}</span>
                      {tool.name}
                    </span>
                    <button
                      onClick={(e) => toggleFavorite(e, tool)}
                      className={`${isFavorite(tool.id) ? 'text-yellow-400' : 'text-gray-500'} hover:text-yellow-300`}
                      title={isFavorite(tool.id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite(tool.id) ? '★' : '☆'}
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {favoriteTools.length === 0 && recentTools.length === 0 && (
            <div className="text-center text-gray-400 text-sm py-4">
              <div className="mb-2">No recent or favorite tools</div>
              <div className="text-xs">Use tools to see them here</div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-600 text-center">
            <div className="text-xs text-gray-400">Drag to reposition</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloatingButton;
