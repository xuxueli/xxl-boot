# xxl-boot-ui JavaScript → TypeScript 迁移方案

> 创建时间：2026-08-08
> 状态：✅ 已完成（全部 6 个阶段执行完毕）

## 一、目标与原则

- **范围**：`src/` 下全部 48 个 `.js` + 62 个 `.vue` 全量迁移为 TS（含 `utils/generator` 代码生成器）
- **严格度**：`tsconfig` 开启 `strict` 全量
- **方式**：渐进式，先基建后分层，每阶段保证编译通过（`vue-tsc --noEmit` + `vite build`）
- **类型来源**：`Response<T>` / `PageModel<T>` 及业务实体类型手动定义，参照后端 Java 实体（`xxl-boot-admin`/`xxl-boot-api` 的 `framework/model/entity/*.java`）
- **文件重命名**：`git mv xx.js xx.ts`，保留 Git 历史；`.vue` 的 `<script>` 改 `<script setup lang="ts">`
- **口径**：不改动既有业务逻辑，仅做类型化；迁移中发现既有 bug 顺带修复

## 二、现状要点（迁移前置约束）

| 项 | 现状 | 迁移必须动作 |
|---|---|---|
| TS 基建 | 无 tsconfig / typescript / vue-tsc | 新建全部 |
| auto-import | `unplugin-auto-import` 配置 `dts: false`，`ref/computed/defineStore/useRoute` 全隐式 | 改 `dts: true` 生成 `auto-imports.d.ts` |
| 请求层 | 拦截器返回 `res.data`（`Response`），分页 `Response<PageModel>`；POST 多用 `params`，前端 `pageNum/pageSize → offset/pagesize` | 泛型封装 |
| 动态路由 | `import.meta.glob` + `markRaw` + 后端菜单字符串 → 组件 | 需路由类型 + meta 扩展 |
| 全局组件 | 12 个业务组件 + Element Plus 全量图标 `app.component` 注册 | `GlobalComponents` 声明 |
| 缺类型库 | `js-beautify`、`file-saver`、`vuedraggable`(dist)、`sortablejs` | 装 `@types/*` 或写 shim |
| 特殊扩展 | `Math.easeInOutQuad`、`el.$copyValue`、`document.startViewTransition`、`import.meta.env.*` | 全局类型声明 |

## 三、迁移阶段划分（自底向上）

### Phase 0 — 基础设施
1. `package.json` 增加：`typescript`、`vue-tsc`、`@types/node`、`@types/js-beautify`、`@types/file-saver`、`@types/sortablejs`；新增脚本 `"type-check": "vue-tsc --noEmit --skipLibCheck"`、`"build": "vue-tsc --noEmit && vite build"`
2. 新建 `tsconfig.json`、`tsconfig.node.json`
3. `vite.config.js` → `vite.config.ts`；`autoImport` 配置 `dts: './auto-imports.d.ts'`
4. 新建 `src/env.d.ts`、`src/types/global.d.ts`
5. `index.html` 入口 `src/main.js` → `src/main.ts`
6. 安装依赖后跑通 `vue-tsc --noEmit`

### Phase 1 — 类型定义 + 请求层 + api 层
1. `src/types/index.ts`：`Response<T>`、`PageModel<T>`、分页参数 `PageQuery`
2. `src/types/api/*.ts`：参照 Java 实体定义业务实体
3. `src/utils/request.js` → `request.ts`：泛型封装
4. `src/api/**/*.js` → `.ts`（11 个文件）
5. 编译验证

### Phase 2 — 纯函数工具层
1. `src/utils/`：validate、auth、cache、common、modal、download、theme、tab、scroll-to → `.ts`
2. `src/composables/`：useDict、useFormReset、usePasswordRule → `.ts`
3. `src/directive/`：index + 三个指令模块 → `.ts`
4. 编译验证

### Phase 3 — 状态层 + 路由层
1. `src/store/modules/*.js` → `.ts`（6 个 Options API store）
2. `src/store/index.js` → `.ts`
3. `src/router/business.js`、`index.js` → `.ts`（RouteMeta 扩展、MenuRoute 类型）
4. `src/settings.js` → `settings.ts`
5. 编译验证

### Phase 4 — 全局组件 + layout 布局
1. `src/components/*/index.vue`（12 个）+ `index.js` → `lang="ts"`
2. `src/layout/**`（20 个组件）→ `lang="ts"`
3. 编译验证

### Phase 5 — views 业务页面 + generator
1. 普通业务页（`org/`、`system/` 等）→ `lang="ts"`
2. `utils/generator/`：css、drawingDefault（低）、config（中，类型地基）、html、js（中高）、render（高，最后攻坚）
3. `views/tool/pagegen/`、`views/tool/codegen/` → `lang="ts"`
4. 编译验证

### Phase 6 — 收尾
1. 全量 `vue-tsc --noEmit` 归零、`vite build` 成功、`npm run dev` 冒烟
2. 删除 `allowJs`/`checkJs` 过渡配置
3. 检查无残留 `.js`，更新 `README.md`
4. 各阶段独立提交

## 四、关键类型设计（示例）

```ts
// src/types/index.ts —— 统一返回结构（对应后端 com.xxl.tool.response.Response）
export interface Response<T = unknown> {
  code: number            // 200 成功，301 未授权，其余失败
  msg: string
  data: T
}
export interface PageModel<T> {
  data: T[]               // 数据列表（response.data.data）
  total: number           // 总条数（response.data.total）
}
export interface PageQuery {
  offset: number
  pagesize: number
  [key: string]: unknown  // 兼容各页面扩展查询字段
}
```

```ts
// src/types/api/user.ts —— 参照 Java 实体 User.java
export interface User {
  id?: number
  orgId?: number
  username?: string
  realName?: string
  status?: number
  addTime?: string
  updateTime?: string
}
```

```ts
// src/types/router.d.ts —— 路由 meta 扩展
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    activeMenu?: string
    affix?: boolean
    hidden?: boolean
    query?: Record<string, string>
  }
}
```

```jsonc
// tsconfig.json（关键项）
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "preserve",
    "noImplicitAny": true,
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": { "@/*": ["src/*"], "~/*": ["./*"] },
    "types": ["vite/client", "element-plus/global"],
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowImportingTsExtensions": true,
    "noEmit": true
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "auto-imports.d.ts"],
  "exclude": ["node_modules", "dist"]
}
```

## 五、风险与对策

| 风险 | 对策 |
|---|---|
| auto-import 无类型导致大面积报错 | Phase 0 先开 `dts: true`，生成 `auto-imports.d.ts` 并纳入 tsconfig |
| `generator/render.js` render 函数 + 动态组件难类型化 | 最后攻坚；函数表用精确 VNode 签名 + 局部断言；备选用 `<component :is>` 重写（不默认） |
| `js.js`/`html.js` 字符串拼代码 + 原地改 conf | conf 用索引签名兜底，保持行为不变 |
| `pagegen/RightPanel.vue` 超 3 万行 | 单独提交、小步迁移；先用宽松断言过渡，最后收紧 |
| 全局组件/图标模板无类型 | `GlobalComponents` 声明 + `@element-plus/icons-vue` 类型遍历注册 |
| `$refs` 访问子组件方法 | `InstanceType<typeof 组件>`、`FormInstance`、局部断言 |
| 第三方缺类型库 | 装 `@types/js-beautify`、`@types/file-saver`、`@types/sortablejs`；vuedraggable 改主入口或 shim |
| strict 下隐式 any 过多 | 按层分批收紧；每阶段 `vue-tsc` 清零再进下一层 |
| 迁移期间项目不可用 | 渐进式 + 每阶段可编译可运行 |

## 六、验收标准

1. `npm run type-check`：0 错误 0 警告（strict 全开）
2. `npm run build:prod` / `npm run build:stage` 成功
3. `npm run dev` 全页面冒烟：登录 → 各菜单 CRUD → 消息/字典/代码生成器（pagegen 拖拽）→ 布局切换正常
4. `src/` 下无残留 `.js`
5. 各阶段 Git 提交记录清晰可回滚
