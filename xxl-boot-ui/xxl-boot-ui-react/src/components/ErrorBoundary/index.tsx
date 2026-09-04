/**
 * 组件：ErrorBoundary（错误边界）
 * 功能：捕获渲染/动态导入错误，展示友好提示并支持重试/刷新
 */
import { Button, Card, Result } from 'antd';
import React from 'react';
import { t } from '@/i18n';

/**
 * 判断是否动态导入（chunk）加载失败
 * @param error 捕获到的异常
 * @returns 是否为 chunk 加载失败
 */
function isChunkLoadError(error: Error): boolean {
  return (
    error.name === 'ChunkLoadError' ||
    /(?:loading|failed to load) (?:css )?chunk/i.test(error.message) ||
    /Failed to fetch dynamically imported module/i.test(error.message)
  );
}

/**
 * 渲染错误兜底界面
 * @param error      捕获到的异常
 * @param onRetry    重新渲染（针对 chunk 加载失败，重新尝试）
 * @param onReload   刷新整个页面
 */
function renderErrorFallback(
  error: Error,
  onRetry: () => void,
  onReload: () => void,
) {
  const isChunkError = isChunkLoadError(error);

  const title = isChunkError
    ? t('components.errorBoundary.titleChunk')
    : t('components.errorBoundary.titleError');
  const subTitle = isChunkError
    ? t('components.errorBoundary.subTitleChunk')
    : t('components.errorBoundary.subTitleError');

  return (
    <Card variant="borderless" style={{ margin: 24 }}>
      <Result
        status="error"
        title={title}
        subTitle={subTitle}
        extra={[
          isChunkError && (
            <Button type="primary" key="retry" onClick={onRetry}>
              {t('components.errorBoundary.retry')}
            </Button>
          ),
          <Button
            type={isChunkError ? 'default' : 'primary'}
            key="reload"
            onClick={onReload}
          >
            {t('components.errorBoundary.reload')}
          </Button>,
          <Button href="/" key="home">
            {t('components.errorBoundary.backHome')}
          </Button>,
        ].filter(Boolean)}
      />
    </Card>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  retryCount: number;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    retryCount: 0,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  /** 重试：清空错误状态并重新渲染子树 */
  handleRetry = () => {
    this.setState((prev) => ({
      hasError: false,
      error: null,
      retryCount: prev.retryCount + 1,
    }));
  };

  /** 刷新整个页面 */
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
      this.handleRetry,
      this.handleReload,
    );
  }
}
