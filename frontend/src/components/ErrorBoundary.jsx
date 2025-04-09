import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-500 mb-4">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  ></path>
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">
                Something went wrong
              </h2>
              <p className="text-gray-600 mt-2">
                We encountered an error while loading this page.
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Refresh Page
              </button>
              <a
                href="/"
                className="block w-full py-3 text-center bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Go to Home Page
              </a>
            </div>

            {/* Display error info in development environment */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg overflow-auto text-sm">
                <details>
                  <summary className="text-red-600 font-medium cursor-pointer mb-2">
                    Error Details (Development Only)
                  </summary>
                  <p className="text-red-500">{this.state.error?.toString()}</p>
                  <pre className="mt-2 text-gray-700 overflow-auto">
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
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
