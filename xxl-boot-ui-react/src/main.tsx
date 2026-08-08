/**
 * 入口文件（main.tsx）
 *
 * 职责：
 *   1. 创建 React 根节点并挂载 App；
 *   2. 引入全局样式（antd reset + 项目 SCSS）与 SVG sprite 注册。
 */
import { createRoot } from 'react-dom/client'
import 'antd/dist/reset.css'
import '@/assets/styles/index.scss'
import 'virtual:svg-icons-register'
import App from './App'

createRoot(document.getElementById('app')!).render(<App />)
