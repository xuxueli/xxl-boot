/**
 * 布局组件统一导出
 *
 *  1、“Barrel 模式”（Barrel Pattern）：前端工程化中通常指‌统一导出文件‌（也称为 Index 文件或聚合文件）。
 *  2、组件目录结构说明：
 *  <pre>
 *      layout/index.vue（根布局）
 *        ├── Sidebar     ← 左侧菜单（Logo + 菜单树）
 *        ├── Navbar      ← 顶部导航栏（含3种导航模式、功能图标）
 *        ├── TagsView    ← 多标签页
 *        ├── AppMain     ← 主内容区（路由出口 + 底部版权）
 *        └── Settings    ← 布局设置面板
 *
 *      外部（store/modules/routes.js）:
 *        ├── InnerLink   ← iframe 容器
 *        └── ParentView  ← 多级菜单中间容器
 *  </pre>
 */
export { default as AppMain } from './AppMain/index.vue'
export { default as Navbar } from './Navbar/index.vue'
export { default as Settings } from './Settings/index.vue'
export { default as TagsView } from './TagsView/index.vue'
export { default as Sidebar } from './Sidebar/index.vue'
export { default as InnerLink } from './InnerLink/index.vue'
export { default as ParentView } from './ParentView/index.vue'
