/**
 * 组件：ErrorBoundary（错误边界）
 * 功能：捕获渲染/动态导入错误，展示友好提示并支持重试/刷新
 */
import { Button, Card, Result } from 'antd';
import React from 'react';

function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    /(?:loading|failed to load) (?:css )?chunk/i.test(error.message) ||
    /Failed to fetch dynamically imported module/i.test(error.message)
  );
}

function renderErrorFallback(
  error: Error,
  isOnline: boolean,
  onRetry: () => void,
  onReload: () => void,
) {
  const isOffline = !isOnline;
  const isChunkError = isChunkLoadError(error);

  const title = isChunkError ? '页面加载失败' : '页面出错了';
  const subTitle = isChunkError && isOffline
    ? '网络连接已断开，请检查网络后刷新重试。'
    : isChunkError
      ? '页面资源加载失败，请刷新重试。'
      : '抱歉，页面发生异常，请刷新或返回首页。';

  return (
    <Card variant="borderless" style={{ margin: 24 }}>
      <Result
        status="error"
        title={title}
        subTitle={subTitle}
        extra={[
          isChunkError && (
            <Button type="primary" key="retry" onClick={onRetry}>
              重试
            </Button>
          ),
          <Button
            type={isChunkError ? 'default' : 'primary'}
            key="reload"
            onClick={onReload}
          >
            刷新页面
          </Button>,
          <Button href="/" key="home">
            返回首页
          </Button>,
        ].filter(Boolean)}
      />
    </Card>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  isOnline: boolean;
  retryCount: number;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidMount() {
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline = () => {
    this.setState({ isOnline: true });
    if (
      this.state.hasError &&
      this.state.error &&
      isChunkLoadError(this.state.error)
    ) {
      window.location.reload();
    }
  };

  handleOffline = () => {
    this.setState({ isOnline: false });
  };

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError || !this.state.error) {
      return (
        <React.Fragment key={this.state.retryCount}>
          {this.props.children}
        </React.Fragment>
      );
    }
    return renderErrorFallback(
      this.state.error,
      this.state.isOnline,
      this.handleRetry,
      this.handleReload,
    );
  }
}
