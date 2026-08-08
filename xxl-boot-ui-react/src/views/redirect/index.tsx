/**
 * 页面：Redirect（内部重定向承载页）
 * 功能：读取 /redirect 前缀后的路径并重定向（用于 TagsView 刷新页面重挂载）
 */
import { Navigate, useLocation } from 'react-router-dom'

export default function Redirect() {
  const location = useLocation()
  // 去掉 /redirect 前缀，拼接查询参数后重定向
  const path = location.pathname.replace('/redirect', '') + location.search
  return <Navigate to={path} replace />
}
