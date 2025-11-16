import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#23282e] flex items-center justify-center p-4">
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 max-w-2xl">
            <h2 className="text-2xl font-bold text-red-400 mb-4">
              ⚠️ Something went wrong
            </h2>
            <p className="text-gray-300 mb-4">
              The CSAE Toolkit encountered an unexpected error. Please try refreshing the extension.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4">
                <summary className="text-red-300 cursor-pointer hover:text-red-200">
                  Error Details (Development Mode)
                </summary>
                <pre className="mt-2 p-4 bg-black/50 rounded text-xs text-red-200 overflow-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
            >
              Reload Extension
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
