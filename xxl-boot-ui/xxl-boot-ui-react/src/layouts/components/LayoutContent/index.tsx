/**
 * @fileoverview LayoutContent（内容区）
 * @description 路由页面出口，独立组件便于后续扩展页面缓存（keep-alive）等能力
 * @author xuxueli 2026-11-21
 */
import { Outlet } from 'react-router-dom';

/**
 * 内容区组件：渲染当前匹配的路由页面
 */
const LayoutContent = () => <Outlet />;

export default LayoutContent;
