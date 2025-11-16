import React, { useState } from 'react';

const Onboarding = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: '👋 Welcome to CSAE Toolkit v4.2!',
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            A powerful Chrome Extension for CSAE campaign development
          </p>
          <div className="bg-blue-900/30 p-4 rounded border border-blue-500">
            <p className="text-sm mb-2"><strong>What's New in v4.2:</strong></p>
            <ul className="text-sm space-y-1 ml-4">
              <li>✨ Selector format converter (CSS/XPath/JS Path)</li>
              <li>✨ Storage quota monitoring with warnings</li>
              <li>✨ Backup & Restore all settings</li>
              <li>✨ Storage diff comparison tool</li>
              <li>✨ Performance optimizations</li>
              <li>✨ Enhanced security & validation</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: '🎯 Quick Start',
      content: (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="font-semibold mb-1">Press Ctrl/Cmd+K</h3>
              <p className="text-sm text-gray-400">Open the Command Palette for quick access to all features</p>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="font-semibold mb-1">Grab Selectors</h3>
              <p className="text-sm text-gray-400">Click "Grab CSS Selector" to hover and copy element selectors</p>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <h3 className="font-semibold mb-1">Manage Storage</h3>
              <p className="text-sm text-gray-400">Export, import, and search through localStorage/sessionStorage</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: '⌨️ Keyboard Shortcuts',
      content: (
        <div className="space-y-3">
          <div className="bg-gray-700 p-3 rounded space-y-2">
            <div className="flex justify-between text-sm">
              <span>Command Palette:</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl/Cmd + K</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span>Exit Selector Mode:</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">ESC</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span>Pin Hover Box:</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Alt + Click</kbd>
            </div>
            <div className="flex justify-between text-sm">
              <span>Reload DevTools Panel:</span>
              <kbd className="px-2 py-1 bg-gray-800 rounded text-xs">Ctrl/Cmd + R</kbd>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            💡 You can customize shortcuts in Settings
          </p>
        </div>
      )
    },
    {
      title: '💾 Backup Recommended',
      content: (
        <div className="space-y-4">
          <p className="text-sm">
            We recommend creating a backup before making major changes:
          </p>
          <div className="bg-yellow-900/30 p-4 rounded border border-yellow-500">
            <p className="text-sm mb-2"><strong>⚠️ Important:</strong></p>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Backups save all your settings and history</li>
              <li>• Export before clearing storage</li>
              <li>• Backups can be shared across devices</li>
              <li>• Keep backups of working configurations</li>
            </ul>
          </div>
          <p className="text-xs text-gray-400">
            Find Backup & Restore in the main menu
          </p>
        </div>
      )
    },
    {
      title: '🚀 Ready to Go!',
      content: (
        <div className="space-y-4">
          <p className="text-lg">
            You're all set to use CSAE Toolkit!
          </p>
          <div className="bg-green-900/30 p-4 rounded border border-green-500">
            <p className="text-sm mb-2"><strong>Quick Tips:</strong></p>
            <ul className="text-sm space-y-1 ml-4">
              <li>💡 Use Command Palette (Ctrl/Cmd+K) for fastest access</li>
              <li>💡 Check Copy History to see all grabbed selectors</li>
              <li>💡 Export storage before major changes</li>
              <li>💡 Use Storage Diff to track changes</li>
              <li>💡 Enable auto-load in Settings for convenience</li>
            </ul>
          </div>
          <p className="text-xs text-gray-400 text-center mt-4">
            Access this guide anytime from the User Guide button
          </p>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    // Save that onboarding was completed
    chrome.storage.local.set({ onboardingCompleted: true }, () => {
      onComplete();
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-[#23282e] rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-2">
            {steps[currentStep].title}
          </h2>
          <div className="flex gap-1">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded ${
                  index === currentStep ? 'bg-blue-500' :
                  index < currentStep ? 'bg-blue-300' :
                  'bg-gray-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-white">
          {steps[currentStep].content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </div>
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
              >
                Previous
              </button>
            )}
            <button
              onClick={skipOnboarding}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition"
            >
              Skip
            </button>
            <button
              onClick={nextStep}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition font-semibold"
            >
              {currentStep === steps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
