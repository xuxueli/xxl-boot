/**
 * 组件：Loading（页面加载占位）
 * 功能：路由懒加载 / 页面初始加载时展示骨架屏兜底
 */
import { Skeleton } from 'antd';

const Loading = () => (
  <Skeleton style={{ padding: '24px 40px', height: '60vh' }} active />
);

export default Loading;
