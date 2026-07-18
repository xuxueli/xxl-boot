# xxl-boot-ui

xxl-boot 前端管理后台，基于 **Vue 3 (Composition API + `<script setup>`)**、**Element Plus 2**、**Pinia**、**Vite 8** 构建的企业级中后台解决方案。

---

## 技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 核心框架 | Vue 3.5 + Composition API | UI 框架 |
| 构建工具 | Vite 8 | 开发服务器与打包 |
| UI 组件库 | Element Plus 2.13 | 组件库与图标 |
| 状态管理 | Pinia 3 | 响应式状态管理 |
| 路由 | vue-router 5 (HTML5 History) | 客户端路由 |
| HTTP 客户端 | Axios 1.16 | API 通信 |
| 图标 | @element-plus/icons-vue + 自定义 SVG 图标 | 图标系统 |
| CSS 预处理器 | SCSS (sass-embedded) | 样式表 |
| 工具库 | @vueuse/core 14 (dark mode, window size), js-cookie, fuse.js, clipboard, file-saver, jsencrypt, js-beautify, vuedraggable, vue-cropper | 通用工具 |
| 富文本 | @vueup/vue-quill (Quill 2) | WYSIWYG 编辑器 |
| 图表 | ECharts 5 | 数据可视化 |

---

## 熟悉步骤

     1. 项目入口 — 先读 src/main.js（应用启动过程）和 src/App.vue（根组件），了解整体框架拼装                                                               
     2. 路由 — 读 src/router/index.js 看页面有哪些、src/router/guards.js 看页面跳转流程（登录拦截等）                                                       
     3. 登录流程 — 读 src/views/login.vue + src/api/login.js + src/store/modules/user.js，串联"点击登录 → API                                               
        请求 → 存 Token → 跳转首页"的完整链路                                                                                                               
     4. 布局 — 读 src/layout/index.vue 和 src/layout/components/Sidebar/、TagsView/，理解页面框架                                                           
     5. 一个完整 CRUD 页面 — 以 src/views/system/user/index.vue 为例，看列表/搜索/新增/编辑如何组织，配合 src/                                              
        api/system/user.js 和 Element Plus 组件                                                                                                             
     6. 权限 — 最后看 store/modules/permission.js + directive/，理解后端菜单驱动路由和按钮级权限                                                            
                                                                                                                                                            
     核心建议：先不要纠结 Sass/构建配置等细节，先理解数据流（API → Store → 组件），能跑通一个页面流程后，                                                   
     再逐个模块深入。  

