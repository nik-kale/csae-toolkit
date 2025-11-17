import React, { useState, useEffect } from 'react';

/**
 * Code Snippet Manager for CSAE Toolkit v5.0
 *
 * Save, organize, and inject JavaScript/CSS snippets
 * Supports auto-run, keyboard shortcuts, and snippet sharing
 */
const SnippetManager = ({ onClose }) => {
  const [snippets, setSnippets] = useState([]);
  const [selectedSnippet, setSelectedSnippet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    code: '',
    language: 'javascript',
    autoRun: false,
    tags: [],
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadSnippets();
  }, []);

  const loadSnippets = () => {
    chrome.storage.local.get(['codeSnippets'], (result) => {
      setSnippets(result.codeSnippets || []);
    });
  };

  const saveSnippets = (newSnippets) => {
    chrome.storage.local.set({ codeSnippets: newSnippets }, () => {
      setSnippets(newSnippets);
    });
  };

  const createOrUpdateSnippet = () => {
    if (!editForm.name || !editForm.code) {
      alert('Name and code are required');
      return;
    }

    const snippet = {
      id: selectedSnippet?.id || `snippet-${Date.now()}`,
      ...editForm,
      createdAt: selectedSnippet?.createdAt || Date.now(),
      updatedAt: Date.now(),
      runCount: selectedSnippet?.runCount || 0,
    };

    const newSnippets = selectedSnippet
      ? snippets.map(s => s.id === snippet.id ? snippet : s)
      : [...snippets, snippet];

    saveSnippets(newSnippets);
    setIsEditing(false);
    setSelectedSnippet(snippet);
    resetForm();
  };

  const deleteSnippet = (id) => {
    if (confirm('Delete this snippet?')) {
      const newSnippets = snippets.filter(s => s.id !== id);
      saveSnippets(newSnippets);
      if (selectedSnippet?.id === id) {
        setSelectedSnippet(null);
      }
    }
  };

  const runSnippet = (snippet) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        const code = snippet.language === 'javascript'
          ? snippet.code
          : `(function(){
              const style = document.createElement('style');
              style.textContent = ${JSON.stringify(snippet.code)};
              document.head.appendChild(style);
            })()`;

        chrome.scripting.executeScript(
          {
            target: { tabId: tabs[0].id },
            func: (codeToRun) => eval(codeToRun),
            args: [code],
          },
          () => {
            if (chrome.runtime.lastError) {
              alert(`Error: ${chrome.runtime.lastError.message}`);
            } else {
              // Increment run count
              const newSnippets = snippets.map(s =>
                s.id === snippet.id ? { ...s, runCount: (s.runCount || 0) + 1, lastRun: Date.now() } : s
              );
              saveSnippets(newSnippets);
              alert('Snippet executed successfully!');
            }
          }
        );
      }
    });
  };

  const editSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    setEditForm({
      name: snippet.name,
      description: snippet.description || '',
      code: snippet.code,
      language: snippet.language,
      autoRun: snippet.autoRun || false,
      tags: snippet.tags || [],
    });
    setIsEditing(true);
  };

  const resetForm = () => {
    setEditForm({
      name: '',
      description: '',
      code: '',
      language: 'javascript',
      autoRun: false,
      tags: [],
    });
    setSelectedSnippet(null);
  };

  const exportSnippets = () => {
    const blob = new Blob([JSON.stringify(snippets, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `snippets-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importSnippets = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          const merged = [...snippets, ...imported];
          saveSnippets(merged);
          alert(`Imported ${imported.length} snippets`);
        } catch (err) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const filterSnippets = () => {
    let filtered = snippets;

    if (filter !== 'all') {
      filtered = filtered.filter(s => s.language === filter);
    }

    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered.sort((a, b) => b.updatedAt - a.updatedAt);
  };

  const filteredSnippets = filterSnippets();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-50 overflow-hidden">
      <div className="h-screen flex flex-col bg-[#282A33]">
        {/* Header */}
        <div className="p-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center">
                <span className="text-3xl mr-2">📝</span>
                Code Snippet Manager
              </h2>
              <p className="text-xs text-gray-400 mt-1">{snippets.length} snippets saved</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-600 flex flex-wrap items-center gap-3">
          <button
            onClick={() => { resetForm(); setIsEditing(true); }}
            className="px-3 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm font-semibold"
          >
            ➕ New Snippet
          </button>

          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5] text-sm"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-[#353945] text-white rounded hover:bg-[#464b54] text-sm"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="css">CSS</option>
          </select>

          <button
            onClick={exportSnippets}
            className="px-3 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] text-sm"
          >
            📥 Export
          </button>

          <button
            onClick={importSnippets}
            className="px-3 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] text-sm"
          >
            📤 Import
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Snippets List */}
          <div className="w-1/3 border-r border-gray-600 overflow-y-auto">
            {filteredSnippets.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <div className="text-6xl mb-4">📝</div>
                <div className="text-lg">No snippets yet</div>
                <div className="text-sm mt-2">Create your first snippet to get started</div>
              </div>
            ) : (
              filteredSnippets.map(snippet => (
                <div
                  key={snippet.id}
                  onClick={() => setSelectedSnippet(snippet)}
                  className={`p-4 border-b border-gray-700 cursor-pointer hover:bg-[#353945] ${
                    selectedSnippet?.id === snippet.id ? 'bg-[#353945]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-white">{snippet.name}</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      snippet.language === 'javascript' ? 'bg-yellow-900/30 text-yellow-400' : 'bg-blue-900/30 text-blue-400'
                    }`}>
                      {snippet.language}
                    </div>
                  </div>
                  {snippet.description && (
                    <div className="text-xs text-gray-400 mb-2">{snippet.description}</div>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div>Updated {new Date(snippet.updatedAt).toLocaleDateString()}</div>
                    {snippet.runCount > 0 && <div>Runs: {snippet.runCount}</div>}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Snippet Details / Editor */}
          <div className="w-2/3 overflow-y-auto p-4">
            {isEditing ? (
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  {selectedSnippet ? 'Edit Snippet' : 'New Snippet'}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Name *</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5]"
                      placeholder="My Awesome Snippet"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Description</label>
                    <input
                      type="text"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5]"
                      placeholder="What does this snippet do?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Language *</label>
                    <select
                      value={editForm.language}
                      onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                      className="w-full px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5]"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="css">CSS</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Code *</label>
                    <textarea
                      value={editForm.code}
                      onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                      className="w-full h-96 px-3 py-2 bg-[#353945] text-white rounded focus:outline-none focus:ring-2 focus:ring-[#649ef5] font-mono text-sm"
                      placeholder={editForm.language === 'javascript'
                        ? "console.log('Hello World!');"
                        : "body { background: #000; }"}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={createOrUpdateSnippet}
                      className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] font-semibold"
                    >
                      💾 Save
                    </button>
                    <button
                      onClick={() => { setIsEditing(false); resetForm(); }}
                      className="px-4 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : selectedSnippet ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{selectedSnippet.name}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => runSnippet(selectedSnippet)}
                      className="px-3 py-2 bg-[#4ADC71] text-white rounded hover:bg-green-600 text-sm font-semibold"
                    >
                      ▶️ Run
                    </button>
                    <button
                      onClick={() => editSnippet(selectedSnippet)}
                      className="px-3 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] text-sm"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => deleteSnippet(selectedSnippet.id)}
                      className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {selectedSnippet.description && (
                  <div className="mb-4 p-3 bg-[#353945] rounded text-sm text-gray-300">
                    {selectedSnippet.description}
                  </div>
                )}

                <div className="mb-4 flex items-center gap-4 text-xs text-gray-400">
                  <div>Language: <span className="text-white">{selectedSnippet.language}</span></div>
                  <div>Created: <span className="text-white">{new Date(selectedSnippet.createdAt).toLocaleDateString()}</span></div>
                  <div>Updated: <span className="text-white">{new Date(selectedSnippet.updatedAt).toLocaleDateString()}</span></div>
                  {selectedSnippet.runCount > 0 && (
                    <div>Runs: <span className="text-white">{selectedSnippet.runCount}</span></div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">Code:</div>
                  <pre className="p-4 bg-[#1a1d24] rounded overflow-x-auto text-sm">
                    {selectedSnippet.code}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 mt-20">
                <div className="text-6xl mb-4">📝</div>
                <div className="text-lg">Select a snippet to view details</div>
                <div className="text-sm mt-2">or create a new one</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SnippetManager;
