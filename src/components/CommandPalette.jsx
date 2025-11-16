import React, { useState, useEffect, useRef } from 'react';

const CommandPalette = ({ onClose, onCommand }) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = [
    { id: 'grab-selector', name: 'Grab CSS Selector', icon: '🎯', action: 'toggleHover' },
    { id: 'view-config', name: 'View CSAE Config', icon: '⚙️', action: 'viewConfig' },
    { id: 'color-picker', name: 'Color Picker', icon: '🎨', action: 'colorPicker' },
    { id: 'storage-manager', name: 'Toggle Storage Manager', icon: '💾', action: 'toggleStorage' },
    { id: 'copy-history', name: 'Toggle Copy History', icon: '📋', action: 'toggleHistory' },
    { id: 'settings', name: 'Toggle Settings', icon: '⚙️', action: 'toggleSettings' },
    { id: 'user-guide', name: 'Toggle User Guide', icon: '📖', action: 'toggleGuide' },
    { id: 'csae-web', name: 'Navigate to CSAE Web', icon: '🌐', action: 'csaeWeb' },
    { id: 'admin-portal', name: 'Launch Admin Portal', icon: '🔐', action: 'adminPortal' },
  ];

  const filteredCommands = commands.filter(cmd =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands.length > 0) {
      e.preventDefault();
      handleCommand(filteredCommands[selectedIndex]);
    }
  };

  const handleCommand = (cmd) => {
    onCommand(cmd.action);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 bg-gray-700 text-white rounded border-2 border-blue-500 focus:outline-none text-lg"
            aria-label="Command search"
          />
        </div>
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                onClick={() => handleCommand(cmd)}
                className={`p-4 cursor-pointer flex items-center gap-3 ${
                  index === selectedIndex
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
                role="button"
                tabIndex={0}
                aria-label={cmd.name}
              >
                <span className="text-2xl">{cmd.icon}</span>
                <span className="text-lg font-medium">{cmd.name}</span>
              </div>
            ))
          )}
        </div>
        <div className="p-3 bg-gray-900 text-gray-400 text-sm flex justify-between">
          <span>↑↓ Navigate</span>
          <span>↵ Select</span>
          <span>Esc Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
