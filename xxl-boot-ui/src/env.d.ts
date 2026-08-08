/// <reference types="vite/client" />

/**
 * Vite 环境变量类型声明
 * 补充 VITE_* 自定义环境变量，供 import.meta.env 类型安全访问
 */
interface ImportMetaEnv {
  /** 后端 API 地址 */
  readonly VITE_API_URL?: string
  /** 后端路由前缀 */
  readonly VITE_APP_BASE_API?: string
  /** 环境标识（development/production/staging） */
  readonly VITE_APP_ENV?: string
  /** 开发服务器端口 */
  readonly VITE_APP_PORT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.scss' {
  const classes: Record<string, string>
  export default classes
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.svg' {
  const src: string
  export default src
}
