"use client";

import { Component, type ReactNode, type ErrorInfo } from "react";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, info: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info);
    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorBoundary]", error, info.componentStack);
    }
  }

  reset = () => this.setState({ hasError: false, error: null });

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center gap-4 py-16 px-6 text-center">
          <div className="text-4xl">⚠️</div>
          <div className="flex flex-col gap-1">
            <p className="font-display font-bold text-text-primary">Something went wrong</p>
            <p className="text-text-secondary text-sm font-sans">
              {this.state.error?.message ?? "An unexpected error occurred."}
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={this.reset}>
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

/** Minimal inline error card — use inside already-bounded sections */
export function ErrorCard({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-3 py-8 px-4 text-center bg-bg-card rounded-3xl border border-border-subtle">
      <span className="text-3xl">😕</span>
      <p className="text-text-secondary text-sm font-sans">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
