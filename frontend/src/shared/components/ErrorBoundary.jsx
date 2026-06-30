import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center p-4">
          <div className="text-center space-y-6 max-w-md">
            <h1 className="text-3xl font-bold text-white tracking-tight">Something went wrong.</h1>
            <p className="text-gray-400">An unexpected error occurred in the application. Please try reloading the page.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-3 bg-[#2563EB] text-white rounded-xl font-bold shadow-[0_0_15px_rgba(37,99,235,0.4)] hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
