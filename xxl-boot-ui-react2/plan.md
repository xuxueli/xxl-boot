

写一个 React 版本，写在 xxl-boot-ui-react2 下。

1、react 版本完全基于 ant-design-pro 基础上实现， 不改变 ant-design-pro 的代码结构和规范，遵循 ant-design-pro 的样式组件、设计规范和主题设置等。
（代码下载到了：/Users/admin/program/git-space/project/ant-design-pro）
2、react 版本，需要实现 “登录、个人中心（修改个人信息/修改密码）” 功能，样式组件和交互等，遵循 ant-design-pro 的设计规范。非样式交互的 代码逻辑，参考 xxl-boot-ui 版本实现，保障登录功能和 vue 版本一致。
3、react 版本，需要实现 “首页/权限管理/系统管理/系统工具/帮助中心” 功能，样式组件和交互等，遵循 ant-design-pro 的设计规范。非样式交互的 代码逻辑，参考 xxl-boot-ui 版本实现，保障功能和 vue 版本一致。
4、react 版本，后端接口和数据定义不要修改，统一对接 xxl-boot-api。

现在 react 目录下输出个技术方案，我review 后执行。

---

React 主流技术栈：

1、核心框架：
  - React 
  - TypeScript
  - Vite
2、状态、路由与请求：
  - React Router（路由））
  - Zustand (状态管理)
  - TanStack Query（请求库）
3、样式与组件库：
  - Tailwind CSS（样式）
  - Ant Design 6（组件库）
  - @ant-design/pro-components
4、其他：
  - ESLint + Prettier（规范）


专项：整体"去 Umi化"，替换掉 ant-design-pro 中的 Umi 相关依赖和配置，改为 Vite + React Router + Zustand + TanStack Query 的组合。
