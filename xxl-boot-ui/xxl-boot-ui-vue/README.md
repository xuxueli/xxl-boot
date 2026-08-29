# XXL-Boot Vue 版（xxl-boot-ui-vue）

> xxl-boot 前端管理后台，基于 **Vue 3 (Composition API + `<script setup lang="ts">`)**、**TypeScript**、**Element Plus**、**Pinia**、**Vite** 构建的企业级中后台解决方案。

---

## 技术栈

| 类别 | 技术                                                                                                                                   | 用途 |
|------|----------------------------------------------------------------------------------------------------------------------------------------|------|
| 核心框架 | Vue 3 + Composition API                                                                                                                | UI 框架 |
| 开发语言 | TypeScript 5（strict 全开）                                                                                                            | 静态类型检查 |
| 构建工具 | Vite                                                                                                                                   | 开发服务器与打包 |
| UI 组件库 | Element Plus                                                                                                                           | 组件库与图标 |
| 状态管理 | Pinia                                                                                                                                  | 响应式状态管理 |
| 路由 | vue-router                                                                                                                             | 客户端路由 |
| HTTP 客户端 | Axios                                                                                                                                  | API 通信 |
| 类型检查 | vue-tsc                                                                                                                                | SFC 类型校验 |
| 图标 | @element-plus/icons-vue + 自定义 SVG 图标                                                                                              | 图标系统 |
| CSS 预处理器 | SCSS (sass-embedded)                                                                                                                   | 样式表 |
| 工具库 | @vueuse/core 14 (dark mode, window size), js-cookie, fuse.js, clipboard, file-saver, jsencrypt, js-beautify, vuedraggable, vue-cropper | 通用工具 |
| 富文本 | @vueup/vue-quill (Quill 2)                                                                                                             | WYSIWYG 编辑器 |
| 图表 | ECharts 5                                                                                                                              | 数据可视化 |

---

## 常用命令

```bash
npm run dev          # 开发模式
npm run prebuild     # TypeScript 类型检查
npm run build        # 类型检查 + 生产构建
npm run build:stage  # 类型检查 + 预发布构建
```
