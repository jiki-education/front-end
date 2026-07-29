"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import styles from "./SubscriptionErrorBoundary.module.css";

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
        <div className={styles.errorCard}>
          <div className={styles.header}>
            <div className={styles.iconDot}></div>
            <h3 className={styles.title}>{messages.title}</h3>
          </div>

          <div className={styles.message}>
            <p>{messages.messagePart1}</p>
            <p>{messages.messagePart2}</p>
          </div>

          <div className={styles.buttons}>
            <button onClick={() => window.location.reload()} className={`${styles.refreshButton} focus-ring`}>
              {messages.refresh}
            </button>
            <button
              onClick={() => this.setState({ hasError: false })}
              className={`${styles.tryAgainButton} focus-ring`}
            >
              {messages.tryAgain}
            </button>
          </div>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className={styles.details}>
              <summary className={styles.detailsSummary}>{messages.detailsSummary}</summary>
              <pre className={styles.detailsPre}>
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
