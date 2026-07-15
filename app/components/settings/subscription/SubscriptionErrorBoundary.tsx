"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

export interface SubscriptionErrorBoundaryMessages {
  title: string;
  messagePart1: string;
  messagePart2: string;
  refresh: string;
  tryAgain: string;
  detailsSummary: string;
}

interface SubscriptionErrorBoundaryProps {
  children: ReactNode;
  messages: SubscriptionErrorBoundaryMessages;
  fallback?: ReactNode;
}

interface SubscriptionErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class SubscriptionErrorBoundary extends Component<
  SubscriptionErrorBoundaryProps,
  SubscriptionErrorBoundaryState
> {
  constructor(props: SubscriptionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): SubscriptionErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Subscription component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const { messages } = this.props;

      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full mr-12"></div>
            <h3 className="font-medium text-red-900">{messages.title}</h3>
          </div>

          <div className="text-red-800 text-sm mb-4">
            <p className="mb-2">{messages.messagePart1}</p>
            <p>{messages.messagePart2}</p>
          </div>

          <div className="flex gap-12">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors focus-ring"
            >
              {messages.refresh}
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="px-4 py-2 bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200 transition-colors focus-ring"
            >
              {messages.tryAgain}
            </button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-4 p-12 bg-red-100 border border-red-300 rounded text-xs">
              <summary className="cursor-pointer font-medium text-red-900 mb-2">{messages.detailsSummary}</summary>
              <pre className="text-red-800 whitespace-pre-wrap break-words">
                {this.state.error.message}
                {"\n"}
                {this.state.error.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
