import React from 'react';

// Catches render-time errors so a single broken panel does not blank the whole
// side panel with no explanation.
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('CSAE Toolkit crashed:', error, info);
  }

  handleReload = () => {
    this.setState({ error: null });
    if (typeof window !== 'undefined') window.location.reload();
  };

  render() {
    if (this.state.error) {
      return (
        <div className="p-4 bg-[#23282e] text-white h-screen" role="alert">
          <h1 className="text-xl font-bold mb-2">Something went wrong</h1>
          <p className="text-sm mb-4">
            The CSAE Toolkit panel hit an unexpected error. Reloading usually clears it.
          </p>
          <pre className="text-xs bg-gray-800 p-3 rounded overflow-x-auto whitespace-pre-wrap mb-4">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            type="button"
            onClick={this.handleReload}
            className="px-4 py-2 bg-[#649ef5] text-white text-sm rounded hover:bg-blue-600 transition duration-300"
          >
            Reload panel
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
