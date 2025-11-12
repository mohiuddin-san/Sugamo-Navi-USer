// app/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    // Ignore known DOM errors during navigation
    if (
      error.name === 'NotFoundError' ||
      error.message.includes('removeChild') ||
      error.message.includes('startViewTransition')
    ) {
      console.warn('Ignoring navigation DOM error:', error.message);
      return { hasError: false };
    }
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>エラーが発生しました。リロードしてください。</div>;
    }
    return this.props.children;
  }
}