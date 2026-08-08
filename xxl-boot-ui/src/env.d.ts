/**
 * 环境变量与静态资源类型声明（env.d.ts）
 * 职责：为 Vite 工程提供类型安全的环境变量与资源模块声明：
 *   1. ImportMetaEnv / ImportMeta —— 声明 VITE_* 自定义环境变量，供 import.meta.env 类型化访问；
 *   2. *.vue —— 声明 Vue 单文件组件的模块类型；
 *   3. *.scss / *.png / *.jpg / *.svg —— 声明样式与图片资源的模块类型，使导入获得类型。
 *
 * <reference types="vite/client" />
 */

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

/** Vite 环境变量挂载点：import.meta.env */
interface ImportMeta {
  readonly env: ImportMetaEnv
}

/**
 * Vue 单文件组件模块声明
 * 兜底 .vue 导入的类型（严格类型由 vue-tsc 的 SFC 编译提供）
 */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

/** SCSS 模块声明（CSS Modules 导入返回类名映射） */
declare module '*.scss' {
  const classes: Record<string, string>
  export default classes
}

/** PNG 图片资源模块声明 */
declare module '*.png' {
  const src: string
  export default src
}

/** JPG 图片资源模块声明 */
declare module '*.jpg' {
  const src: string
  export default src
}

/** SVG 图片资源模块声明 */
declare module '*.svg' {
  const src: string
  export default src
}
