/**
 * 布局组件：FullscreenButton（全屏切换）
 * 功能：顶部导航栏右侧全屏/退出全屏切换按钮，浏览器不支持时自动隐藏
 */
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
} from '@ant-design/icons';
import { createStyles } from 'antd-style';
import React, { useEffect, useState } from 'react';

/** 全屏按钮样式 */
const useStyles = createStyles(({ token, css }) => ({
  trigger: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 48px;
    cursor: pointer;
    font-size: 20px;
    color: ${token.colorText};

    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
}));

/**
 * 浏览器是否支持全屏 API
 */
const isFullscreenSupported = (): boolean => document.fullscreenEnabled;

/**
 * 全屏切换按钮组件：点击进入/退出全屏，图标随状态切换
 */
const FullscreenButton = () => {
  const { styles } = useStyles();
  /* 当前是否处于全屏状态 */
  const [isFullscreen, setIsFullscreen] = useState(false);

  /* 监听全屏状态变化，同步图标 */
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  /**
   * 切换全屏：全屏中则退出，否则请求进入全屏
   */
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  /* 浏览器不支持全屏时隐藏按钮 */
  if (!isFullscreenSupported()) return null;

  return (
    <div className={styles.trigger} onClick={toggleFullscreen}>
      {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
    </div>
  );
};

export default FullscreenButton;
