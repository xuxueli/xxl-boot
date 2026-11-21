# XXL-Boot 开发规范（公共契约）

> 本文件**只维护跨模式公共契约**。三种运行模式的作业细则（工程结构、代码落位、页面骨架、启动/构建命令、菜单 SQL、i18n、代码生成器修正、校验清单）统一维护在 `.agents/skills/xxl-boot-{monolith|vue|react}/SKILL.md`。
>
> AI 编程助手进入仓库后，先按「一、AI 助手加载约定」选择并加载对应 SKILL，再按本文件 + SKILL 执行；未加载 SKILL 不得直接生成业务代码。

## 一、AI 助手加载约定（必读）

### 1.1 模式识别与 SKILL 选择

| 运行模式 | 涉及模块 | 触发信号 | 必读 SKILL |
|---|---|---|---|
| 单体 Monolith | `xxl-boot-admin` | 改动 `xxl-boot-admin`；FreeMarker / `.ftl`；`$.adminTable`；AdminLTE 页面 | `xxl-boot-monolith` |
| Vue 分离 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-vue` | 改动 `xxl-boot-ui-vue/src/modules`；`.vue`；Element Plus | `xxl-boot-vue` |
| React 分离 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-react` | 改动 `xxl-boot-ui-react/src/modules`；`.tsx`；ProTable | `xxl-boot-react` |

### 1.2 加载与执行顺序

1. 读本文件，确认公共契约。
2. 加载**且仅加载**与任务匹配的模式 SKILL；多模式任务拆成子任务，分别加载，禁止混用两套模式写法。
3. 按 SKILL 的「参考文件」抽样阅读现有实现，同类场景以当前代码为准。
4. 按「需求落盘 → 建表 → 后端 → 前端/页面 → 菜单授权 → 联调验证 → 规范复核」执行。
5. 交付前逐项勾选对应 SKILL 的「校验清单」。
6. 模式无法判定时先向用户确认，禁止猜测。

### 1.3 冲突与维护

- **公共契约**（设计原则、通用约定、接口通道、数据库/菜单模型、验收）以本文件为准。
- **模式细节**（路径、骨架、命令、菜单 SQL、i18n、生成器修正）以对应 SKILL + 当前代码为准。
- 文档与代码不一致时，以代码为准，并在本次变更中回写 `AGENTS.md` / SKILL。
- 新增或调整模式专属内容只写进对应 SKILL；本文件不得新增模式专属实现细节。
- 两处不得重复维护同一内容；发现重复时，保留单一权威位置，另一处改为引用。

## 二、项目概览

XXL-Boot 是一个快速开发平台 / 脚手架，采用 Monorepo 统一托管「单体项目」与「前后端分离项目」。

| 模块 | 定位 |
|---|---|
| `xxl-boot-admin` | 单体模式：后端与页面同工程 |
| `xxl-boot-api` | 前后端分离模式：纯 API 后端 |
| `xxl-boot-ui/xxl-boot-ui-vue` | 前后端分离模式：Vue3 前端 |
| `xxl-boot-ui/xxl-boot-ui-react` | 前后端分离模式：React 前端 |

- 环境：JDK 17+、Maven 3.6+、Node 18+、MySQL 8、Redis（前后端分离模式必需）。
- 通用依赖：`xxl-tool`（工具与统一响应）、`xxl-sso`（登录鉴权，`@XxlSso`）、MyBatis（Mapper + XML）、MySQL、Redis。
- 各模式技术栈、端口、登录态存储、数据库初始化脚本、启动与构建命令，见对应 SKILL「模式概览」「初始化与启动」。
- 推荐交付形态：`xxl-boot-api` + `xxl-boot-ui-vue`（或 `-react`）的前后端分离模式，业务扩展最顺滑。

## 三、设计原则

四条原则按优先级执行；冲突时先满足简单与职责清晰，再考虑复用。

> 速记：能删就删 → 第三次再抽 → 一个变更理由 → 已有方案优先。

| 原则 | 核心要求 | 落地判据 / 禁止 |
|---|---|---|
| **KISS 优先** | 先写最直接能工作的实现，能删就删 | 禁止非必要接口、工厂、配置项、包装函数；禁止为假想需求预留扩展点 |
| **DRY，但只在必要时抽象** | 同一逻辑出现**第三次**再抽公共实现 | 两处相似但边界不同的代码可保留；禁止提前建抽象层 |
| **单一职责** | 一个文件/函数/组件只承担一个变更理由 | 渲染、消毒、交互、状态等边界混在一起就拆；拆到能一句话描述职责 |
| **同类场景同一方案** | 已有工具/组件/模式能覆盖就不另起一套 | 新方案必须说明旧方案为何不适用；禁止同一问题多套写法并存 |

补充约束：

- 抽象前先回答：是否已重复第三次？现有工具是否已覆盖？现在是否真的需要？三个答案不成立就不抽象。
- 不新增“仅转发”的 Service/Controller/函数；不为一次性逻辑建工具类。
- 修复问题时优先改现有实现，不平行复制一份“新版本”。

## 四、通用约定

- 使用中文沟通、中文注释。
- 命名表达真实语义：类名大驼峰、变量/方法小驼峰、常量全大写下划线；避免无意义单字母与拼音；布尔属性不用 `isXxx` 前缀（避免与 getter 冲突）。
- 注释：文件顶部一行功能描述 + 空行 + `@author 作者 yyyy-mm-dd`；方法用 `/* xxx */` 多行注释；属性注释右侧 `/* xxx */` 垂直对齐；分支逻辑需注释；无死代码、无调试残留。
- **依赖版本一律固定**：
  - `package.json` 写精确版本（如 `"yaml": "2.9.1"`），禁止 `^`、`~`、`*`、区间；
  - `pom.xml` 的依赖与版本属性写精确版本（如 `<xxl-sso.version>2.4.1</xxl-sso.version>`），禁止 `LATEST`、`RELEASE`、区间；
  - 新增或升级依赖必须同步 `package-lock.json`，根 `packages[""]` 与依赖项同样精确；上游传递依赖由 lock 固化。
- 新增依赖前先确认现有依赖/工具能否覆盖；不能覆盖才新增，并在变更说明中写清用途。
- 文档同步：公共规则改本文件，模式规则改对应 SKILL；不得在代码注释中长期保留与文档冲突的“临时约定”。

## 五、开发流程与需求落盘

### 5.1 需求落盘

每个需求在项目根目录 `xxl-boot-spec/` 下建独立子目录，沉淀「方案 + SQL」：

1. 目录：`xxl-boot-spec/{yyyyMMdd}-{business}/`（同日多需求用业务名区分）。
2. 方案：`plan.md`，覆盖「需求相关 / 数据库设计 / 菜单·授权 / 后端改造 / 前端改造 / 验证结果」六大块，随实现同步回填。
3. SQL：建表与菜单/权限 SQL 一并落盘（如 `{business}-table.sql`、`{business}-init.sql`）；如需进总库初始化，再同步到 `doc/db/`。

`plan.md` 通用骨架：

```markdown
# {业务名}开发方案（{module}/{business}）

> 需求目录：`xxl-boot-spec/{yyyyMMdd}-{business}/` | 日期：{yyyy-MM-dd}

## 一、需求相关
| 项 | 结论 |
|---|---|
| 运行模式 | Vue 分离 / React 分离 / 单体 |
| 模块与命名 | `{module}/{business}`；后端包名、前端目录 |
| 核心字段与规则 | 字段清单 + 必填/唯一/模糊搜索规则 |
| 状态/枚举/字典 | 无 / 枚举 `{XxxEnum}` / 字典 `{dictType}` |
| 特殊组件与页面形态 | 富文本/上传等；标准 CRUD / 详情 / 多页签 |
| 出码方式 | AI 按模板直生 / 后台「代码生成」 |
| 验证范围 | 编译 / 起服务联调（端口） |

## 二、数据库设计
表、字段、索引、状态取值；SQL 脚本：`{business}-table.sql`

## 三、菜单 / 授权
菜单、按钮权限、角色授权；SQL 脚本：`{business}-init.sql`

## 四、后端改造
文件落位、接口路径、查询条件、校验与业务规则

## 五、前端改造
页面/接口/类型文件落位，权限与 i18n 处理

## 六、验证结果 / 变更记录
- [ ] 需求确认并回填第一节
- [ ] 建表 SQL 执行通过，字段与实体一致
- [ ] 菜单/按钮/授权已插库且可见
- [ ] 后端编译通过
- [ ] 前端类型检查/构建通过
- [ ] 联调：菜单可见、CRUD/搜索可用、无权限项隐藏、空参数友好提示
- [ ] 变更记录（时间与说明）
```

### 5.2 标准流程

0. **需求落盘**：建需求目录与 `plan.md` 骨架。
1. **需求确认（先确认后编码）**：命名与归属、字段与规则、枚举/字典、特殊组件、页面形态、菜单与授权、出码方式、验证范围；结论回填 `plan.md`。
2. **建表**：新增 `xxl_boot_*` 业务表，遵守「数据与资源」规范；SQL 落盘并按「SQL 执行规范」执行。
3. **生成 / 手写代码**：先加载对应模式 SKILL，按 SKILL 的落位与模板实现，或用代码生成器产出基线。
4. **落位与权限**：按 SKILL 落位；插入菜单/按钮并授权。
5. **联调验证**：按 SKILL 的启动命令验证菜单、CRUD、搜索、权限、i18n 与空参数提示。
6. **规范复核**：对照本文件、对应 SKILL 与「校验清单」逐项确认后提交。

### 5.3 SQL 执行规范（强制，防乱码）

含中文的 SQL（建表、菜单/权限初始化、测试数据）必须：

1. `.sql` 文件首行加 `SET NAMES utf8mb4;`；
2. 执行时显式指定客户端字符集 `--default-character-set=utf8mb4`；
3. 不依赖 MySQL CLI 默认字符集（可能为 latin1）。

```bash
# 容器方式（容器名/密码以本机 compose 为准；当前默认 xxl-boot-mysql / root_pwd）
docker exec -i xxl-boot-mysql mysql -uroot -proot_pwd \
  --default-character-set=utf8mb4 xxl_boot \
  < xxl-boot-spec/{yyyyMMdd}-{business}/{business}-table.sql

# 本机 CLI 方式
mysql -h127.0.0.1 -uroot -proot_pwd --default-character-set=utf8mb4 xxl_boot \
  < xxl-boot-spec/{yyyyMMdd}-{business}/{business}-table.sql
```

## 六、后端通用规范

- 分层职责：Controller 只做参数接收/校验与响应，Service 承载业务，Mapper 只做数据访问，不跨层越权。
- 平台能力放 `framework`，业务代码放 `business`；业务代码禁止塞入 `framework`。具体包路径与 Mapper XML 落位见对应 SKILL。
- 接口路径：`/{module}/{business}/{pageList|load|insert|delete|update}`；业务 Controller 统一 `@RequestMapping("/{module}/{business}")`，全部方法 `@XxlSso`。
- CRUD 参数通道：
  - 分页、查询条件与简单标量走 URL（`@RequestParam`，前端 `params`）；
  - `insert`/`update` 走 JSON 实体（`@RequestBody`，前端 `data`）；
  - `delete` 走 JSON 集合（`@RequestBody List<Integer> ids`，前端 `data` 裸数组），不再包一层 `IdsRequest`。
- 返回结构：统一 `Response{ code, msg, data }`，code 200 成功；分页 `Response<PageModel>`，入参统一 `offset`、`pagesize`。
- 参数校验用 `StringTool`、`RegexTool`、`CollectionTool` 等，失败返回 `Response.ofFail("提示")`；唯一性字段先查再插/改。
- 业务方法顺序固定：`pageList / load / insert / delete / update`。
- Mapper XML 显式 `resultMap`；`add_time`/`update_time` 写入用 `NOW()`；查询条件用 `<if>` 动态拼接。
- Java set/get 不折叠，使用正常方法体。

## 七、数据与资源

### 7.1 数据库

- 表名前缀 `xxl_boot_`；字段下划线命名，Java 属性驼峰。
- 公共字段：`id`（主键自增）、`add_time`、`update_time`；状态字段用 `TINYINT`（0 正常 / 1 停用类）。
- 唯一索引命名 `i_` 前缀；字段一律 `COMMENT` 注释。
- 枚举值不落 `xxl_boot_*` 表：优先使用框架枚举或 `xxl_boot_dict` 字典。

### 7.2 菜单与权限

- 菜单由数据库 `xxl_boot_resource` 驱动，新增页面无需改前端路由代码。
- `type`：`0` 目录、`1` 菜单、`2` 按钮；`status`：`0` 正常、`1` 停用；`visible`：`0` 显示、`1` 隐藏。
- 菜单 `url` 同时充当路由 path 与页面定位 key；按钮以 `permission` 标识，业务标识统一 `{module}:{business}:add|edit|remove`。
- 新菜单必须在 `xxl_boot_role_res` 授权（默认管理员 `role_id=1`）。
- 菜单/按钮 SQL 模板、页面定位规则、前端权限校验语法，见对应 SKILL。

### 7.3 枚举与字典

- 业务枚举放业务模块的 `enums` 包，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 枚举下拉统一经 `loadEnumItem` 按枚举名解析，后端动态扫描平台包与业务包。
- 数据字典录入 `xxl_boot_dict`，前端按对应 SKILL 提供的能力加载。

## 八、前端通用规范

- 前端按「模块自包含」组织：同一模块的页面、接口、类型放在同一模块目录下；业务模块与平台 `framework` 模块隔离。
- 接口通道：遵循第六节，前端请求参数/请求体形态与后端保持一致。
- 列表数据从 `response.data.data` 取，总数从 `response.data.total` 取；不直接操作原始响应。
- 用户可见文案统一走 i18n，禁止硬编码中文（注释除外）；通用词优先复用 `common.*`，新增文案 zh/en 成对提交。
- 组件、Hook/Composable、工具优先复用平台已有实现；重复第三次才抽公共能力。
- 目录结构、页面骨架、状态组织、权限指令/Hook、i18n 文件与语言加载，见对应 SKILL。

## 九、代码生成器

- 代码生成器用于快速产出基线，不是交付标准；产物必须按对应 SKILL 复核、补齐、改造后再提交。
- 生成代码强制依赖 `id` 主键；业务代码落 `business`，不落 `framework`。
- 所有模式共有的固定缺口：
  - `pageList` 默认只生成 `offset/pagesize`，`isQuery` 字段不会自动生成查询条件；需补 Controller 参数、Service 方法、Mapper 参数与 XML `<if>`；
  - 校验通常只有空值判断，需补必填、长度/格式、唯一性与友好提示；
  - 前端模板可能生成硬编码中文，需迁移到 i18n；
  - 树表模板依赖树形接口与字段，需按实际业务补齐。
- 生成器入口、模板类型、产物路径与模式专属修正项，见对应 SKILL「代码生成器」。

## 十、验收与提交

- 后端：编译通过；`pageList/load/insert/delete/update`、权限、空参数提示自测通过。
- 前端/单体：按对应 SKILL 的类型检查或构建命令通过；菜单可见、CRUD/搜索正常、无权限项隐藏、页面无模板/运行错误。
- SQL：脚本首行含 `SET NAMES utf8mb4;`，执行后中文无乱码。
- 质量：符合设计原则与通用约定；无死代码、无调试残留、无多余依赖、版本已固定。
- 文档：新增/调整模式规则已回写对应 SKILL，公共规则已回写本文件，未产生重复维护。
- 提交：只提交任务相关文件，不提交 `target/dist/node_modules` 等产物；提交信息简洁并符合仓库风格。

---

- 模式作业细则（工程结构、落位清单、模板骨架、启动/验证命令、菜单 SQL、i18n、代码生成器修正、校验清单）：
  - 单体：`.agents/skills/xxl-boot-monolith/SKILL.md`
  - Vue 分离：`.agents/skills/xxl-boot-vue/SKILL.md`
  - React 分离：`.agents/skills/xxl-boot-react/SKILL.md`
