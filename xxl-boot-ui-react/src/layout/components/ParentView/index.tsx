/**
 * 名称：ParentView
 * 功能：多级菜单的中间容器组件，仅透传路由出口（Outer 子路由渲染）
 */
import { Outlet } from 'react-router-dom'

/**
 * 中间层级路由容器：对应后端菜单中非叶子、非 Layout 的中间节点
 */
export default function ParentView() {
  return <Outlet />
}
