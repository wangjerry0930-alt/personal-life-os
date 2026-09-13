import { Component, type ErrorInfo, type ReactNode } from 'react';

type Props = { children: ReactNode };
type State = { hasError: boolean; message: string };

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };

  static getDerivedStateFromError(error: unknown): State {
    return { hasError: true, message: error instanceof Error ? error.message : 'Unexpected application error' };
  }

  componentDidCatch(error: unknown, info: ErrorInfo) {
    console.error('Personal Life OS recovered from a render error', error, info.componentStack);
  }

  retry = () => this.setState({ hasError: false, message: '' });

  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="error-screen"><div className="error-card"><span className="pill purple">RECOVERABLE ERROR</span><h1>This page needs a refresh.</h1><p className="muted">Your saved data is still stored. Try rendering the page again, or reload the app if the problem continues.</p><p className="error-detail">{this.state.message}</p><div className="modal-actions"><button className="secondary" onClick={this.retry}>Try again</button><button className="primary" onClick={() => window.location.reload()}>Reload app</button></div></div></main>;
  }
}
