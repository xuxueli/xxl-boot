# XXL-BOOT | 快速开发平台（React 版）

> XXL-BOOT 前端 UI 的 React 重构版。功能与交互 100% 对齐 `xxl-boot-ui`（Vue3 版），UI 组件库采用 Ant Design。

## 技术栈

- **构建**：Vite 8 + TypeScript（strict）
- **UI 组件库**：Ant Design v5
- **状态管理**：Zustand
- **路由**：react-router v7（数据驱动动态路由，后端菜单驱动）
- **页面缓存**：react-activation（等价 keep-alive，支持标签页刷新重挂载）
- **HTTP**：axios（token 注入 / 防重复提交 / 301 重登录拦截）
- **富文本**：Quill（react-quill-new）
- **图表**：echarts
- **拖拽**：sortablejs

## 快速开始

```bash
npm install
npm run dev          # 开发环境，端口 3000
npm run build:prod   # 生产构建（tsc 类型检查 + vite build）
npm run lint         # ESLint 检查
```

后端 API 地址在 `.env.development` 中配置（默认 `http://localhost:8081`，代理前缀 `/api`）。

## 目录结构

```
src/
├── api/           # 业务接口（与后端一一对应）
├── assets/        # 图标 / 图片 / 样式
├── components/    # 全局组件（Auth/Pagination/RightToolbar/DictTag/Editor/FileUpload/
│                  #   ImageUpload/ImagePreview/TreePanel/IconSelect/ExcelImportDialog/IFrame/SvgIcon）
├── hooks/         # 组合逻辑（useDict/useEnumOption/buildPageParams/usePasswordRule）
├── layout/        # 布局层（Sidebar/Navbar/TagsView/AppMain/Settings，三种导航模式）
├── router/        # 路由定义 + 守卫（constantRoutes + 后端动态菜单）
├── stores/        # Zustand stores（user/routes/app/settings/tagsView/dict）
├── utils/         # request/auth/cache/modal/common/tab/theme/validate/generator 等
├── utils/generator/# 表单生成器（配置注册表 + React/antd 代码生成 + 画布渲染）
└── views/         # 业务页面
```

## 功能清单（与 Vue 版 100% 对齐）

- **账号安全**：登录（含验证码）、记住密码、退出
- **权限管控**：RBAC，后端动态菜单，按钮级权限（`<Auth perms>` / `<Auth roles>`）
- **用户/角色/资源/组织管理**：增删改查、组织树、菜单授权树、状态切换、重置密码
- **系统配置**：参数配置、字典管理（含字典数据下钻）、审计日志（含详情）、站内消息（含已读用户）
- **工具**：代码生成（建表/预览/编辑字段/生成代码）、表单生成器（拖拽式设计 + React/antd 代码生成）
- **框架能力**：多标签页（TagsView，card/chrome 双风格、右键菜单、关闭/刷新）、三种导航模式、暗色模式、主题色自定义、布局设置抽屉、菜单搜索（Fuse.js）、页面全屏、响应式移动端

## 说明

- 数据结构遵循后端 `Response(code/msg/data)` / `PageModel(data/total)` 约定，分页入参 `offset/pagesize`。
- 页面缓存基于 react-activation，`cachedViews` 白名单由 TagsView store 维护；标签「刷新」等价销毁并重建缓存节点。
- 表单生成器生成的代码为 **React + antd** 风格（区别于 Vue 版输出 Vue 模板）。
