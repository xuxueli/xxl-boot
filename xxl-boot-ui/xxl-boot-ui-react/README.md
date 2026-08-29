# XXL-Boot React 版（xxl-boot-ui-react）

> 基于 Ant Design 设计体系实现，采用 **Vite + React Router + Zustand + TanStack Query** 组合；后端统一对接 xxl-boot-api。

---

## 技术栈

| 能力 | 方案                                                   | 说明 |
| --- |--------------------------------------------------------| --- |
| 构建/开发服务器 | **Vite ** + `@vitejs/plugin-react`                     | 替代原 Umi Max；`vite.config.ts` 配置别名/代理/构建 |
| 语言 | TypeScript 7                                           | 全量类型 |
| 路由 | **React Router                                         | 替代 Umi 路由；含 RequireAuth / RequirePermission 守卫 |
| 状态管理 | **Zustand **                                           | 会话、权限、菜单、布局设置（替代 Umi model + @@initialState） |
| 服务端状态 | **TanStack Query **                                    | 枚举加载、首页统计/趋势/消息等数据缓存 |
| 请求 | **axios 1**                                            | 替代 Umi request；token 注入/参数序列化/301/防重复提交 |
| UI 组件库 | `antd` 6 + `@ant-design/pro-components` 3              | ProLayout / ProTable / ProForm / PageContainer |
| 样式方案 | `antd-style`（createStyles / CSS-in-JS）+ `global.css` | 替代 Umi 的样式接入 |
| 图标 | `@ant-design/icons`                                    | 全局图标 |
| 图表 | `echarts`                                              | 首页审计日志折线图（对齐 Vue 版） |
| 富文本 | `react-quill`                                          | 站内消息内容编辑（对齐 Vue 版 vue-quill） |
| 拖拽 | `@dnd-kit/core/sortable/utilities`                     | 代码生成字段排序、表单构建画布 |
| 会话存储 | `js-cookie`                                            | Cookie `Admin-Token`，请求头 `xxl-sso-login-token` |
| 时间 | `dayjs`                                                | antd 联动 |
| 代码规范 | Biome + `type-check`                                   | `npm run lint` |
| 运行环境 | Node >= 22.12                                          | Vite 8 要求 |

---

## 重构

    - /assets                           done   
    - /stores                           done
    - /layouts（menu/header/foot/set）  done      
    - default-settings.ts               done
    - main.tsx                          done
    - /router                           --22
    - /components                       --
    - /hooks                            --
    - /utils                            --
    - /types                            --
    - /services                         --
    - /pages                            /
        - 首页                          done
        - 权限管理：                    --
        - 系统管理：                    --
        - 帮助中心                      done
        - 其他：
            - profile：密码/个人        --11
            - login                     done

改造：
    - 模块化改造：types/service/pages 合并到 modules
    - 开发 SKILL + 文档 + 文章；

