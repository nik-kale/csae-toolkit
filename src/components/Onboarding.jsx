import React, { useState, useEffect } from 'react';

/**
 * Onboarding Flow Component for CSAE Toolkit v4.0
 *
 * Guides first-time users through the toolkit features
 * Shows keyboard shortcuts, tool categories, and tips
 */
const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    // Check if user has seen onboarding before
    chrome.storage.local.get(['onboardingCompleted'], (result) => {
      if (!result.onboardingCompleted) {
        setShowOnboarding(true);
      }
    });
  }, []);

  const steps = [
    {
      title: 'Welcome to CSAE Toolkit v4.0! 🎉',
      description: 'Your complete professional developer and designer toolkit with 22+ tools.',
      icon: '🛠️',
      content: (
        <div className="space-y-3">
          <div className="text-center">
            <div className="text-6xl mb-4">🛠️</div>
            <div className="text-lg font-semibold text-[#4ADC71] mb-2">
              Enterprise Edition
            </div>
            <div className="text-sm text-gray-300">
              Professional-grade tools for web development, design, and debugging
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="bg-[#353945] p-3 rounded">
              <div className="text-2xl mb-1">22+</div>
              <div className="text-xs text-gray-400">Professional Tools</div>
            </div>
            <div className="bg-[#353945] p-3 rounded">
              <div className="text-2xl mb-1">4</div>
              <div className="text-xs text-gray-400">Tool Categories</div>
            </div>
            <div className="bg-[#353945] p-3 rounded">
              <div className="text-2xl mb-1">6</div>
              <div className="text-xs text-gray-400">Keyboard Shortcuts</div>
            </div>
            <div className="bg-[#353945] p-3 rounded">
              <div className="text-2xl mb-1">∞</div>
              <div className="text-xs text-gray-400">Possibilities</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Four Powerful Categories 📂',
      description: 'Tools organized into intuitive categories for easy access.',
      icon: '📂',
      content: (
        <div className="space-y-3">
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">🔍</span>
              <span className="font-semibold text-[#649ef5]">Inspector Tools (8)</span>
            </div>
            <div className="text-xs text-gray-300">
              CSS Selector Grabber, Color Picker, SEO Inspector, Performance Metrics, and more
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">✏️</span>
              <span className="font-semibold text-[#649ef5]">Page Editor Tools (7)</span>
            </div>
            <div className="text-xs text-gray-300">
              Live CSS Editor, Text Editor, Element Manipulation, Highlighting, and more
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">📐</span>
              <span className="font-semibold text-[#649ef5]">Layout & Design (4)</span>
            </div>
            <div className="text-xs text-gray-300">
              Grid Overlay, Element Outliner, Screenshots, Responsive Testing
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-2xl mr-2">💾</span>
              <span className="font-semibold text-[#649ef5]">Storage & Data (3)</span>
            </div>
            <div className="text-xs text-gray-300">
              LocalStorage, IndexedDB, Cache Management, CSAE Config
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Keyboard Shortcuts ⌨️',
      description: 'Boost productivity with powerful keyboard shortcuts.',
      icon: '⌨️',
      content: (
        <div className="space-y-2">
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">CSS Selector Grabber</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+C</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Color Picker</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+P</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Live CSS Editor</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+E</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Grid Overlay</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+G</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Element Outliner</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+O</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Screenshot</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">Ctrl+Shift+S</kbd>
          </div>
          <div className="bg-[#353945] p-3 rounded flex justify-between items-center">
            <span className="text-sm">Exit Any Tool</span>
            <kbd className="bg-[#464b54] px-2 py-1 rounded text-xs">ESC</kbd>
          </div>
          <div className="mt-3 text-xs text-center text-gray-400">
            Use <kbd className="bg-[#464b54] px-1 rounded">Cmd</kbd> instead of <kbd className="bg-[#464b54] px-1 rounded">Ctrl</kbd> on macOS
          </div>
        </div>
      ),
    },
    {
      title: 'New in v4.0: Enterprise Features 🚀',
      description: 'Powerful new features for professional workflows.',
      icon: '🚀',
      content: (
        <div className="space-y-3">
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🎨</span>
              <span className="font-semibold">Light/Dark Theme Toggle</span>
            </div>
            <div className="text-xs text-gray-300">
              Choose between dark, light, or auto (system preference) themes
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">↩️</span>
              <span className="font-semibold">Undo/Redo System</span>
            </div>
            <div className="text-xs text-gray-300">
              Track element changes with Ctrl+Z to undo and Ctrl+Shift+Z to redo
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">⭐</span>
              <span className="font-semibold">Favorites & Recent Tools</span>
            </div>
            <div className="text-xs text-gray-300">
              Quick access to your most-used tools with favorites and history
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🔍</span>
              <span className="font-semibold">Tool Search</span>
            </div>
            <div className="text-xs text-gray-300">
              Quickly find any tool by name, category, or keyboard shortcut
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🎯</span>
              <span className="font-semibold">Floating Quick Access</span>
            </div>
            <div className="text-xs text-gray-300">
              Draggable floating button for instant access to favorite tools
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Pro Tips 💡',
      description: 'Get the most out of CSAE Toolkit.',
      icon: '💡',
      content: (
        <div className="space-y-3">
          <div className="bg-[#353945] p-3 rounded">
            <div className="font-semibold mb-2 text-[#4ADC71]">✅ Pin Your Favorites</div>
            <div className="text-xs text-gray-300">
              Star your most-used tools for quick access from the floating button
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="font-semibold mb-2 text-[#4ADC71]">✅ Use Keyboard Shortcuts</div>
            <div className="text-xs text-gray-300">
              Master the 6 keyboard shortcuts to boost your productivity
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="font-semibold mb-2 text-[#4ADC71]">✅ Explore Settings</div>
            <div className="text-xs text-gray-300">
              Customize theme, keyboard shortcuts, grid size, and more in Settings
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="font-semibold mb-2 text-[#4ADC71]">✅ Press ESC to Exit</div>
            <div className="text-xs text-gray-300">
              Any active tool can be quickly exited by pressing the ESC key
            </div>
          </div>
          <div className="bg-[#353945] p-3 rounded">
            <div className="font-semibold mb-2 text-[#4ADC71]">✅ Export Your Settings</div>
            <div className="text-xs text-gray-300">
              Backup and share your preferences with Settings Export/Import
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    chrome.storage.local.set({ onboardingCompleted: true });
    setShowOnboarding(false);
    if (onComplete) {
      onComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  if (!showOnboarding) {
    return null;
  }

  const step = steps[currentStep];

  return (
    <div className="onboarding-overlay fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
      <div className="onboarding-modal bg-[#282A33] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-4xl mr-3">{step.icon}</span>
              <div>
                <h2 className="text-xl font-bold text-white">{step.title}</h2>
                <p className="text-sm text-gray-400 mt-1">{step.description}</p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="text-gray-400 hover:text-white text-sm"
              title="Skip onboarding"
            >
              Skip
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {step.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-600">
          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep
                    ? 'w-8 bg-[#649ef5]'
                    : index < currentStep
                    ? 'w-2 bg-[#4ADC71]'
                    : 'w-2 bg-gray-600'
                }`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded transition duration-300 ${
                currentStep === 0
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-[#353945] text-white hover:bg-[#464b54]'
              }`}
            >
              ← Previous
            </button>

            <div className="text-sm text-gray-400">
              Step {currentStep + 1} of {steps.length}
            </div>

            <button
              onClick={handleNext}
              className="px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] transition duration-300 font-semibold"
            >
              {currentStep === steps.length - 1 ? "Let's Go! 🚀" : 'Next →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
