# XXL-Boot 脚手架使用与开发规范

以 XXL-Boot 为脚手架开发业务，请先明确自己的运行模式，再按对应 Skill 的标准流程作业。

## 一、项目概览

XXL-Boot 是一个快速开发平台 / 脚手架，采用 Monorepo 统一托管「单体项目」与「前后端分离项目」，可一键构建、按模式拆分使用。

| 模块 | 说明 |
|---|---|
| `xxl-boot-admin` | 单体模式：Spring Boot + FreeMarker 服务端渲染（AdminLTE/jQuery），端口 8080，SSO 登录态存 DB |
| `xxl-boot-api` | 前后端分离模式：Spring Boot 纯 API，端口 8090，SSO 登录态存 Redis |
| `xxl-boot-ui/xxl-boot-ui-vue` | Vue3 前端（Element Plus + TypeScript + Vite），端口 3000 |
| `xxl-boot-ui/xxl-boot-ui-react` | React 前端（Ant Design ProTable + TypeScript + Vite），端口 4000 |

通用依赖：`xxl-tool`（工具与统一响应）、`xxl-sso`（登录鉴权，注解 `@XxlSso`）、MyBatis（Mapper + XML）、MySQL、Redis（api 模式必需）。

> 推荐对外交付形态：`xxl-boot-api` + `xxl-boot-ui-vue`（或 `-react`）的前后端分离模式，做业务扩展最顺滑。

## 二、三种运行模式与 Skill 速查

| 运行模式 | 组成 | 什么时候用 | 加载 Skill |
|---|---|---|---|
| 单体 Monolith | `xxl-boot-admin` | 写 FreeMarker 页面、改动 `xxl-boot-admin` | `xxl-boot-monolith` |
| Vue 分离 | `xxl-boot-api` + `xxl-boot-ui-vue` | 前后端分离，前端用 Vue3 | `xxl-boot-vue` |
| React 分离 | `xxl-boot-api` + `xxl-boot-ui-react` | 前后端分离，前端用 React | `xxl-boot-react` |

三个 Skill 均位于 `.agents/skills/`，描述了「新增/改造一个业务模块」的完整落位与模板；本项目已内置可复现的执行环境会自动发现并加载匹配的 Skill。启动项目前先看第三节，写代码前先加载对应 Skill。

## 三、快速开始

前置环境：JDK 17+、Maven 3.6+、Node 18+、MySQL 8、Redis（api 模式）。

### 3.1 初始化数据库

```sql
-- 1. 建库 + 全量框架表 + 种子数据
source doc/db/tables_xxl_boot.sql;

-- 2. 按运行模式替换菜单图标（三选一）
source doc/db/tables_xxl_boot_modular_vue.sql;     -- Vue 分离模式
source doc/db/tables_xxl_boot_modular_react.sql;   -- React 分离模式
source doc/db/tables_xxl_boot_monolith.sql;        -- 单体模式
```

数据库连接配置分别在 `xxl-boot-api/src/main/resources/application.properties`、`xxl-boot-admin/src/main/resources/application.properties`（默认 `jdbc:mysql://127.0.0.1:3306/xxl_boot`，root）。默认账号 `admin`。

### 3.2 单体模式（可选）

```bash
cd xxl-boot-admin && mvn spring-boot:run   # 8080
```

### 3.3 Vue / React 分离模式

```bash
# 后端 API（Redis 需先启动）
cd xxl-boot-api && mvn spring-boot:run     # 8090

# 前端 Vue（本地代理 /api → 8090）
cd xxl-boot-ui/xxl-boot-ui-vue && npm i && npm run dev   # 3000
# 或前端 React
cd xxl-boot-ui/xxl-boot-ui-react && npm i && npm run dev # 4000
```

## 四、工程结构与业务代码落位

### 4.1 后端（xxl-boot-admin / xxl-boot-api）

框架代码按分层分包（两套包名镜像）：`com.xxl.boot.admin.framework` 与 `com.xxl.boot.api.framework`：

```
framework
├── controller/{system,authz,tool,base}      /* 接口入口，只做参数接收与校验 */
├── service/  +  service/impl/               /* 业务逻辑：接口 + 实现 */
├── mapper/{system,authz,tool}               /* 数据访问接口 */
├── model/{entity,dto,adaptor}               /* 实体 / 展示DTO / 实体转DTO */
├── constant/{enums,consts}                  /* 枚举与常量 */
├── web/{xxlsso,xxllog,error}                /* 登录态、审计日志、错误页 */
├── annotation · config · util               /* 注解、配置、工具 */
```

**新增业务一律落 `business/{module}/{business}` 双层镜像包**（`framework` 仅属于平台内置能力，不要塞业务）：

- api 模式：前端 `src/modules/business/{module}/{business}/`（pages/api/types）与后端 `com.xxl.boot.api.business.{module}.{business}`（controller/service/mapper/model/enums 子包）**双层镜像**，业务后缀与接口路径 `/{module}/{business}` 一致；首个模块可走内置代码生成器产出（模板见第七节与对应 Skill）
- 单体模式：`com.xxl.boot.admin.business.{module}`，参考 `.../business/ai`

Mapper XML 对应：统一按首层 `framework/` 与 `business/` 区分——平台内置落 `resources/mapper/framework/{module}`（如 framework/authz、framework/system）；业务模块落 `resources/mapper/business/{module}`（单体，如 business/ai）或 `resources/mapper/business/{module}/{business}`（前后端分离双层镜像）。

### 4.2 前端 Vue（xxl-boot-ui-vue）

模块化统一管理：全部模块按「模块自包含」落位 `src/modules`，顶级用 `framework/`（平台内置：authz/system/tool/dashboard/…）与 `business/`（项目业务）隔离；同一模块的页面、接口、类型按 `pages/`、`api/`、`types/` 三个子目录聚合维护。

```
src
├── modules/{framework|business}/{domain}/{module}/   /* 模块自包含目录 */
│   ├── pages/                    /* 页面 + 页内组件（index.vue、data.vue、XxxFormModal.vue…） */
│   ├── api/                      /* 接口封装（index.ts，同目录聚合） */
│   └── types/                    /* 类型定义（index.ts，同目录聚合） */
├── composables                   /* usePageParams / useDict / useEnumOption / useFormReset */
├── i18n                          /* 文案中心：locales/{zh,en}.json（JSON 数据纯存储，t() 引用） */
├── components / directive / utils / store   /* 平台公共层（框架与业务共用） */
└── types/index.ts                /* 全局基础类型（Response/PageModel/PageQuery…） */
```

- 平台内置示例：`src/modules/framework/auth/`（登录：pages/login.vue + api/）、`src/modules/framework/authz/org/`、`src/modules/framework/system/dict/`（pages/{index,data}.vue + api/ + types/）、`src/modules/framework/dashboard/`（pages/index.vue + api/）等。
- 业务新增示例：`src/modules/business/{module}/{business}/`（pages/index.vue + api/index.ts + types/index.ts + FormModal.vue），与后端 `com.xxl.boot.api.business.{module}.{business}` 双层镜像。

### 4.3 前端 React（xxl-boot-ui-react）

与 Vue 同套模块化规范，结构、命名与学生完全镜像，且与后端 `com.xxl.boot.api.business.{module}.{business}` 双层镜像：

```
src
├── modules/{framework|business}/{domain}/{module}/   /* 模块自包含目录 */
│   ├── pages/                    /* 页面 + 页内组件（index.tsx、XxxFormModal.tsx…） */
│   ├── api/                      /* 接口封装（index.ts，同目录聚合） */
│   └── types/                    /* 类型定义（index.d.ts，declare namespace API 全局合并） */
├── i18n / hooks / utils / components / stores / router   /* 平台公共层（i18n 文案中心 + 公共 hook/组件） */
└── types/index.d.ts              /* 全局基础类型（API.Response/PageModel…） */
```

### 4.4 菜单零路由改动约定

前端菜单完全由数据库 `xxl_boot_resource` 驱动，**新增页面无需动路由代码**：

- Vue：界面文件 `modules/{framework|business}/{domain}/{module}/pages/{xxx}(/index).vue` 建好后，在资源表插入 `type=1` 菜单并配置 `url='/module/xxx'`（url 同时充当路由 path 与前端组件定位 key），前端 `loadView` 按 `modules/` 下相对路径（自动剥离 `framework/`/`business/` 与 `pages/` 段）映射对应页面；
- React：同理映射到 `modules/{framework|business}/{domain}/{module}/pages/{xxx}(/index).tsx`；
- 单体：`index.ftl` 遍历资源表 `type=0`（目录）/`type=1`（菜单）渲染侧边栏，url 为上下文路径下的相对地址。

新菜单需在 `xxl_boot_role_res` 中给角色授权（默认管理员 `role_id=1`）。

## 五、新功能开发标准流程

1. **建表**：数据库新建 `xxl_boot_*` 业务表（规范见 6.6）。
2. **生成/手写代码**：可后台使用内置代码生成器（见七），或按对应 Skill 模板直生等价代码。
3. **落位与权限**：按对应 Skill 落位后端/前端文件；插入资源表菜单 + 按钮 + 角色授权。
4. **联调验证**：起后端 + 前端，验证菜单可见、CRUD 可用、权限生效。
5. **规范复核**：对照第六节规范与 Skill 内「校验清单」过一遍再提交。

> 标准动作在开发前加载对应模式 Skill：`xxl-boot-monolith` / `xxl-boot-vue` / `xxl-boot-react`。

## 六、代码规范

### 6.1 通用约定

- 使用中文沟通、中文注释。
- 命名：类名大驼峰、变量/方法小驼峰；命名表达真实语义，避免无意义单字母与拼音；常量全大写 + 下划线。
- 布尔属性不使用 `isXxx` 前缀命名，避免与 getter 冲突。
- 注释覆盖 Java 与前端文件：文件顶部一行功能描述，间隔一行加 `@author 作者 yyyy-mm-dd`；方法注释用 `/* xxx */` 多行；属性注释在右侧 `/* xxx */` 垂直对齐；方法内部分支逻辑也需注释；已有注释需符合上述要求。
- 避免过度设计，注重复用、易理解、易维护；同一类场景保持同一套实现方案。

### 6.2 后端分层与接口规范

- 分层职责清晰：Controller 参数接收与校验、Service 业务逻辑、Mapper 数据访问，不跨层越权。
- 接口路径「模块前缀 + 动词式后缀」：`/system/message/pageList`、`/load`、`/insert`、`/delete`、`/update`。
- 业务接口统一 `@RequestMapping("/{module}/{business}")` + `@XxlSso` 鉴权注解。
- Java set/get 方法不折叠，使用正常方法体。
- mapper XML 中显式配置字段映射（resultMap），`add_time`/`update_time` 写入用 `NOW()`。
- 参数校验使用工具类：`StringTool`、`RegexTool`、`CollectionTool` 等，返回 `Response.ofFail("提示")`。
- 业务方法模板顺序固定：`pageList / load / insert / delete / update`（见各 Controller）。

### 6.3 数据结构

- 后端统一返回 `Response{ code、msg、data }`（`com.xxl.tool.response.Response`），code 200 成功。
- 分页返回 `Response<PageModel>`；分页入参统一 `offset`、`pagesize`。
- 前端取值：`response.data`（成功数据）、`response.data.data`（列表）、`response.data.total`（总数），**不要直接拿返回值操作**。

### 6.4 前端 Vue 规范

- 组件 import 名称与模板标签统一 PascalCase（`import NoticeDetailView` 对应 `<NoticeDetailView>`）。
- script 除基础 import 外，按 “ref data → fun → page init” 三节组织，节顶注释为 `/* --- {功能，前后33个-} --- */`，参考 `modules/framework/system/message/pages/index.vue`。
- 响应式数据一律使用 `ref`，禁止 `reactive` 与 `toRefs(data)` 解构；逻辑相关数据收敛为对象：`queryParams`（搜索栏）、`table`（表格数据与状态）、`formState`（表单数据与规则）。
- 避免啰嗦写法：`defineModel('visible')` + 模板 `v-model` 直连，不用 props/emits/computed 桥接；模板直接用 `props.row`，不建冗余 computed 别名。
- 列表页固定套路：`getList()` 经 `usePageParams(queryParams)(产生 offset/pagesize` 后请求，从 `response.data.data / response.data.total` 赋值。
- 通用能力复用 `@/composables/*`、`@/components`（按需 import）、`@/utils/modal`，禁止重复造轮子。

### 6.5 前端 React 规范

- 列表页基于 `ProTable` + `PageContainer`，`request` 从 `res.data?.data`（列表）、`res.data?.total`（总数）取值。
- API 封装统一 `request<API.Response<API.PageModel<T>>>`，入参 `current/pageSize` 需在函数内转换为 `offset/pagesize` 再传后端。
- 类型定义于 `modules/{framework|business}/{domain}/{module}/types/index.d.ts`，统一 `declare namespace API { type Xxx = {...} }`。
- 枚举下拉用 `useEnumOption` + `toValueEnum`/`toSelectOptions`；权限用 `usePermission().hasPermi(...)`。

### 6.6 数据库规范

- 表名前缀 `xxl_boot_`；字段下划线命名，Java 属性对应驼峰。
- 公共字段：`id`（主键自增）、`add_time`、`update_time`；状态字段用 `TINYINT`（0 正常 / 1 停用类）。
- 唯一索引命名 `i_` 前缀；字段一律 `COMMENT` 注释。
- 枚举类存 `xxl_boot_*` 之外的可选值：优先使用框架枚举（见 6.7），状态类下拉选项优先选择框/单选。

### 6.7 权限、枚举与字典

- 登录鉴权：后端 `@XxlSso`；按钮权限标识 `{module}:{business}:add / edit / remove`。
- 前端权限：Vue `v-hasPermi="['{module}:{business}:add']"`（或 `v-hasRole="['admin']"`）、React `hasPermi('{module}:{business}:add')`。
- 下拉选项两种来源：
  - 业务枚举：在 `business/{module}/{business}/enums` 定义实现 `EnumTool.IEnum` 的枚举（平台内置枚举才放 `framework/constant/enums`），前端 `useEnumOption('XxxEnum')`（React 用 `useEnumOption('XxxEnum')`）自动经 `loadEnumItem` 拉取（loadEnumItem 展开「平台枚举包 + business 根包」内包含 IEnum 枚举的包，按枚举名解析，平台包优先）；
  - 数据字典：录入 `xxl_boot_dict`，前端 `useDict('dictType')`。
- 菜单资源：`xxl_boot_resource`（type 0 目录 / 1 菜单 / 2 按钮），`status`（0 正常 / 1 停用），`visible`（0 显示 / 1 隐藏）。

### 6.8 国际化文案（i18n）

- 文案统一维护于 `src/i18n/locales/{zh,en}.json`（**单一文件**，JSON 数据纯存储不支持注释，按 `domain.module.token` 嵌套、按域名节点分区），业务页面/components/utils/layouts **一律 `import { t } from '@/i18n'` 引用，禁止硬编码中文**（中文注释除外）。
- 文件内模块顺序固定：`app`（应用级常量）前置，其次公共组 `common`/`modal`/`request`/`layout`/`components`，再次平台业务组 `auth`/`authz`/`system`/`tool`/`dashboard`/`help`/`error`，常规业务模块（`business.*` 等）放最后；**Vue 与 React 两套一致**，新增模块按组插入、勿打乱既有顺序。
- 语言由 `default-settings.ts` 的 `language: 'zh' | 'en'` 配置控制，**不支持运行时切换**；element-plus / antd 组件语言随该配置。
- key 复用约定：通用词（新增/修改/删除/搜索/重置/操作/状态/备注/全部/正常/停用/保存成功/删除成功…）统一走 `common.*`，`modal.*`（系统提示/确定/取消）、`request.*`（错误/超时提示）；模块特有词建 `{domain}.{module}.*`。新增文案必须 zh/en **成对**提交，缺失键回退中文再回退 key。
- 插值：`t('key', [v])`（占位 `{0}` 下标）或 `t('key', { name })`（占位 `{name}`），禁止字符串拼接。
- 后端下发的菜单名与 dict/enum 标签不属于前端文案，不进 i18n 文件。

## 七、内置代码生成器

| 模式 | 位置 | 用法 | 产物 |
|---|---|---|---|
| api 分离 | 后台菜单「工具-代码生成」/ `POST /tool/codegen/createTable`（传建表 SQL + `tplWebType`） | 创建表 → 编辑字段（`COLLECT`, import queryType/htmlType/dictType，isQuery/isList/isInsert/isEdit/isRequired）→ preview 预览 / batchGenCode 下载 zip | 后端 `business/{module}/{business}` 6 件套、前端 vue3/react 文件、`-init.sql`（菜单+按钮+授权），落位见对应 Skill |
| 单体 | 后台「代码生成」/ `POST /tool/codegen/genCode` | 传 `tableSql / author / packagePath / businessName` | `controller/service/service_impl/mapper/mapper_xml/entity/page` 7 段代码 |

- vue 前端模板固定传 `tplWebType='element-plus-typescript'`，react 传 `'antd-typescript'`。
- 生成代码强制依赖 `id` 主键；业务代码落 `business/{module}/{business}` 而**不是** `framework`。
- Skill 缺省策略：AI 按模板直生等价代码落位，同时在交付说明中提示可走后台生成器。

## 八、验收与提交

- 后端：`mvn -q compile` 通过；接口用页面/接口工具自测（pageList/load/insert/update/delete、权限、空参数）。
- 前端：Vue `npm run build`（或 eslint）+ 菜单可见 + CRUD 正常；React 同。
- 提交：只提交任务相关文件，不提交 target/dist/node_modules 等产物；提交信息简洁符合仓库风格。

---

- 基础规范条款源参考：GVim 现有 `xxl-boot-admin`、`xxl-boot-api`、`xxl-boot-ui` 各模块既有实现。
- 三模式作业细则、落位清单、模板骨架与校验清单分别在 `.agents/skills/xxl-boot-monolith|vue|react/SKILL.md`。