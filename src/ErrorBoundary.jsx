import React from 'react';

/**
 * Error Boundary Component for CSAE Toolkit v4.0
 *
 * Catches React errors in component tree and displays fallback UI
 * Logs errors to console and Chrome storage for debugging
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console
    console.error('CSAE Toolkit Error Boundary caught an error:', error, errorInfo);

    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorCount: this.state.errorCount + 1,
    });

    // Log to Chrome storage for debugging
    this.logErrorToStorage(error, errorInfo);
  }

  logErrorToStorage(error, errorInfo) {
    try {
      const errorLog = {
        timestamp: new Date().toISOString(),
        message: error.toString(),
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
      };

      chrome.storage.local.get(['errorLogs'], (result) => {
        const logs = result.errorLogs || [];
        logs.push(errorLog);

        // Keep only last 50 errors
        const trimmedLogs = logs.slice(-50);

        chrome.storage.local.set({ errorLogs: trimmedLogs }, () => {
          console.log('Error logged to Chrome storage');
        });
      });
    } catch (e) {
      console.error('Failed to log error to storage:', e);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-container p-6 bg-[#23282e] text-white min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full bg-[#282A33] rounded-lg p-6 shadow-xl">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-3">⚠️</div>
              <div>
                <h1 className="text-2xl font-bold text-red-400">Something went wrong</h1>
                <p className="text-sm text-gray-400 mt-1">
                  CSAE Toolkit encountered an unexpected error
                </p>
              </div>
            </div>

            <div className="bg-[#1a1d24] p-4 rounded mb-4 max-h-64 overflow-y-auto">
              <div className="text-xs font-mono">
                <div className="text-red-300 font-semibold mb-2">Error Details:</div>
                <div className="text-gray-300 mb-2">
                  {this.state.error && this.state.error.toString()}
                </div>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-blue-400 hover:text-blue-300">
                      Component Stack Trace
                    </summary>
                    <pre className="mt-2 text-xs text-gray-400 whitespace-pre-wrap">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={this.handleReset}
                className="flex-1 px-4 py-2 bg-[#649ef5] text-white rounded hover:bg-[#5080d0] transition duration-300 font-semibold"
              >
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 px-4 py-2 bg-[#44696d] text-white rounded hover:bg-[#353945] transition duration-300 font-semibold"
              >
                Reload Extension
              </button>
            </div>

            <div className="mt-4 p-3 bg-[#353945] rounded text-xs">
              <div className="font-semibold text-[#4ADC71] mb-2">Troubleshooting Tips:</div>
              <ul className="list-disc list-inside space-y-1 text-gray-300">
                <li>Try clicking "Try Again" to reset the component</li>
                <li>If the error persists, click "Reload Extension"</li>
                <li>Check the browser console for more details (F12)</li>
                <li>Error has been logged for debugging purposes</li>
              </ul>
            </div>

            {this.state.errorCount > 3 && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-500/50 rounded text-xs">
                <div className="font-semibold text-red-400 mb-1">⚠️ Multiple Errors Detected</div>
                <div className="text-gray-300">
                  The extension has encountered {this.state.errorCount} errors.
                  Consider reloading or checking for updates.
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
