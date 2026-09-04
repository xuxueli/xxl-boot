---
name: xxl-boot-vue
description: 在 XXL-Boot 前后端分离的 Vue3 模式（xxl-boot-api 端口 8090 + xxl-boot-ui-vue 端口 3000，Element Plus + TypeScript）下新增或改造业务模块。当任务涉及修改 xxl-boot-api/src/main/java/com/xxl/boot/api/business 或 xxl-boot-ui-vue/src/modules 时加载本技能。
---

# XXL-Boot · Vue3 分离模式开发 Skill

目标：把 XXL-Boot 的 `xxl-boot-api` + `xxl-boot-ui-vue` 当作脚手架，规范、快速地新增/改造一个业务模块。本 Skill 覆盖「建表 → 后端 → 前端 → 菜单/权限 → 验证」全流程，含落位清单、代码骨架与校验清单。

## 何时使用

- 前后端分离，前端是 Vue3（Element Plus + TS）。
- 需要新增一个带列表页的业务模块（标准 CRUD）。
- 只需要动后端接口而不动前端时，同样适用（取「后端落位」一节）。

如运行对象是 `xxl-boot-admin` 单人渲染，用 `xxl-boot-monolith`；如前端是 React，用 `xxl-boot-react`。

## 前置：工程结构速览

```
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…        ← 平台内置（controller/service/mapper/model/constant/enums/web）
├── java/com/xxl/boot/api/business/{module}/{business}  ← 新增业务落此（与前端双层镜像；可经后台代码生成器产出或按模板直生）
└── resources/mapper/{module}/{business}/    ← 业务 Mapper XML（与前/后端目录镜像）
xxl-boot-ui-vue/src
├── modules/framework/{domain}/{module}/     ← 平台内置模块（authz/system/tool/…，同目录聚合 pages+api+types）
├── modules/business/{module}/{business}/    ← 业务模块（pages/ + api/ + types/ 三子目录，与后端双层镜像）
└── types/index.ts                           ← 全局基础类型（Response/PageModel/PageQuery…）
```

通用规范（返回结构、注释、命名、DB）见仓库根 `AGENTS.md` 第六节。

## 标准流程

0. **需求落盘（先建立）**：先按「需求落盘（xxl-boot-spec）」一节在项目根 `xxl-boot-spec/{yyyyMMdd}-{business}/` 创建需求子目录，随后确认的需求结论、方案、SQL 全部落入该目录（见下文专属章节）。
1. **需求确认（第一步，必须）**：接到任务先不写代码，主动向用户确认需求细节，用户确认后再执行。至少确认：模块与业务命名（`{module}/{business}`）及目录归属；核心字段、状态/枚举下拉、是否需文件上传/富文本等特殊组件；页面形态（标准 CRUD / 详情页 / 多页签，仅动后端时则不动前端）；菜单+按钮+角色授权是否一并处理；出码方式（AI 按模板直生 or 后台「代码生成」）；验证范围与启动端口（api 8090 / vue 3000）。确认结果即时回填到子目录 `plan.md`。
2. **建表**：`xxl_boot_*` SQL，公共字段 `id/add_time/update_time`，TINYINT 状态，`COMMENT` 注释；SQL 脚本写入该需求子目录（如 `{business}-table.sql`、`{business}-init.sql`）。
3. **生成或手写代码**：本 Skill 缺省策略为 AI 直接按内置模板（`xxl-boot-api/src/main/resources/templates/tool/codegen/{java,vue3}/*.ftl`）渲染等价代码落位；同时提示用户可后台「工具-代码生成」走内置生成器（见第六节）。
4. **落位**：前后端双层镜像——后端 Java 落 `business/{module}/{business}`，Mapper XML 落 `resources/mapper/{module}/{business}/`；前端业务模块聚合落 `modules/business/{module}/{business}/`（pages/index.vue + api/index.ts + types/index.ts）。
5. **菜单/权限**：插 `xxl_boot_resource` 菜单(type=1)+按钮(type=2)+`xxl_boot_role_res` 授权；页面按钮用 `v-hasPermi`。
6. **验证**：起 `xxl-boot-api`(8090) + `xxl-boot-ui-vue`(3000，代理 /api→8090)，菜单可见、CRUD 可用、权限生效；验证结果回填 `plan.md`。

> ⚠️ **SQL 执行规范（强制，防乱码）**：写/执行任何含中文的 SQL（建表、菜单/权限初始化、联调造测试数据 INSERT 等）前，必须确保连接字符集为 utf8mb4，否则中文 `COMMENT`/表名/`INSERT` 数据落库会乱码。本项目 MySQL 跑在 docker 容器（容器名 `mysql`），其 CLI 默认连接字符集是 **latin1**，必须按下列姿势执行：

## 需求落盘（xxl-boot-spec）

每个需求在项目根目录 `xxl-boot-spec/` 下生成一个需求子目录，把执行中产出的「方案 + SQL」沉淀其中，便于追溯与复用：

1. **目录命名**：`xxl-boot-spec/{yyyyMMdd}-{business}/`（同日多个需求用业务名区分，如 `20260830-product`）。
2. **方案**：`plan.md`，一份完整开发方案文档，须覆盖「需求相关 / 数据库设计 / 菜单·授权 / 后端改造 / 前端改造 / 验证结果」六大块，按下方「plan.md 模板」生成骨架后随实现同步回填；
3. **SQL**：建表 SQL 与菜单/权限 SQL 一并落盘（如 `{business}-table.sql`、`{business}-init.sql`），作为本需求专属脚本；如需进总库初始化，再同步一份到 `doc/db/`。

执行全程保持该目录与实现同步：先建目录落方案骨架 → 建表写 SQL → 落位实现 → 验证后回填结论。

### plan.md 模板（Vue 分离模式）

```markdown
# {业务名}开发方案（{module}/{business}）

> 需求目录：`xxl-boot-spec/{yyyyMMdd}-{business}/` | 日期：{yyyy-MM-dd}

## 一、需求相关
| 项 | 结论 |
|---|---|
| 运行模式 | Vue3 分离（xxl-boot-api 8090 + xxl-boot-ui-vue 3000） |
| 模块/业务命名 | `{module}/{business}`，包 `com.xxl.boot.api.business.{module}` |
| 核心字段与业务规则 | 字段清单 + 必填/唯一/模糊搜索规则 |
| 状态/枚举下拉 | 无 / 枚举 `{XxxEnum}`（business/{module}/{business}/enums）/ 字典 `{dictType}` |
| 特殊组件 | 无 / Editor 富文本 / ImageUpload 图片上传 |
| 页面形态 | 标准 CRUD / 详情页 / 多页签 |
| 出码方式 | AI 按模板直生 / 后台「工具-代码生成」 |
| 验证范围 | 编译验证 or 起 api+vue 联调 |

## 二、数据库设计
表：`xxl_boot_{business}`
| 字段 | 类型 | 说明 | 备注 |
|---|---|---|---|
| id | BIGINT | 主键自增 | 框架约定 |
| {field} | {type} | {说明} | {必填/模糊/唯一/下拉} |
| add_time | DATETIME | 新增时间 | NOW() |
| update_time | DATETIME | 更新时间 | NOW() |

索引/约束：`i_` 前缀唯一索引（如有）。
状态枚举取值：`{code-title}`（存 `xxl_boot_*` 之外用框架枚举或字典）。
SQL 脚本：`{business}-table.sql`

## 三、菜单 / 授权
- 菜单（type=1）：`{名称}` permission=`{module}:{business}` url=`/{module}/{business}`
- 按钮（type=2）：新增 `:add` / 修改 `:edit` / 删除 `:remove`
- 角色授权：`xxl_boot_role_res` role_id=1
- SQL 脚本：`{business}-init.sql`

## 四、后端改造
| 文件 | 位置 | 要点 |
|---|---|---|
| `{Business}.java` | business/{module}/{business}/model/ | 实体驼峰；Date 字段 @JsonFormat |
| `{Business}Mapper.java` | business/{module}/{business}/mapper/ | insert/delete/update/load/pageList/pageListCount |
| `{Business}Mapper.xml` | resources/mapper/{module}/{business}/ | resultMap 显式映射；add/update_time 用 NOW()；查询 <if> 动态拼条件 |
| `{Business}Service.java` | business/{module}/{business}/service/ | 方法顺序 pageList/load/insert/delete/update |
| `{Business}ServiceImpl.java` | business/{module}/{business}/service/impl/ | StringTool 校验，失败 Response.ofFail |
| `{Business}Controller.java` | business/{module}/{business}/controller/ | 全 @XxlSso；分页 offset/pagesize；删除 ids[] |

接口：`/{module}/{business}/pageList|load|insert|delete|update`

## 五、前端改造
| 文件 | 位置 | 要点 |
|---|---|---|
| `types/index.ts` | modules/business/{module}/{business}/ | 实体+Query(pageNum/pageSize)+ListQuery |
| `api/index.ts` | modules/business/{module}/{business}/ | list/get/add/del/update，Promise<Response<PageModel<T>>> |
| `pages/index.vue` | modules/business/{module}/{business}/ | 三段式；usePageParams 转 offset/pagesize；按钮 v-hasPermi |

## 六、验证结果 / 变更记录
- [ ] 需求结论确认并回填第一节
- [ ] 建表 SQL 执行通过，字段与实体一致
- [ ] 菜单/按钮/授权已插库且终端可见
- [ ] 后端 `mvn -q compile` 通过
- [ ] 前端 vue-tsc / eslint 通过
- [ ] 联调：菜单可见、CRUD/搜索可用、无权限按钮隐藏、空参数友好提示
- [ ] 变更记录（本次改动时间与说明）
```

## 后端落位清单（7 件套）

以业务 `Demo`、模块 `demo` 为例，包名 `com.xxl.boot.api.business.demo.demo`（模块+业务双层镜像）：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Demo.java` | `java/.../business/demo/demo/model/Demo.java` | 实体，字段驼峰 |
| `DemoMapper.java` | `java/.../business/demo/demo/mapper/DemoMapper.java` | insert/delete/update/load/pageList/pageListCount |
| `DemoMapper.xml` | `resources/mapper/demo/demo/DemoMapper.xml` | resultMap 显式映射；`add_time/update_time` 用 `NOW()` |
| `DemoService.java` / `DemoServiceImpl.java` | `java/.../business/demo/demo/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `DemoController.java` | `java/.../business/demo/demo/controller/DemoController.java` | `@RestController @RequestMapping("/demo/demo")`，全 `@XxlSso` |

**直生入口**：直接读模板 `templates/tool/codegen/java/*.ftl`（controller/service/service_impl/mapper/mapper.xml/entity 六文件）即可得到准确骨架与落位路径。

后端要点：

- Controller 分页方法签名：`int offset(默认0)`、`int pagesize(默认10)` + 查询参数，返回 `Response<PageModel<XxxDTO/Entity>>`。
- 参数校验用 `StringTool/RegexTool/CollectionTool`，失败 `Response.ofFail("提示")`；唯一性校验库中查一遍再插。
- DTO 时间展示转字符串（`DateTool.formatDateTime`），用 Adaptor 完成 entity→dto。
- 接口路径**全小写**：`/{module}/{business}/pageList|load|insert|delete|update`；删除批量 `@RequestParam("ids[]") List<Integer>`。

## 前端落位清单（3 文件 + barrel）

| 文件 | 位置 | 说明 |
|---|---|---|
| types | `src/modules/business/{module}/{business}/types/index.ts` | `Xxx` 实体 + `XxxQuery`(pageNum/pageSize 表单形态) + `XxxListQuery = ListQuery<XxxQuery>` |
| api | `src/modules/business/{module}/{business}/api/index.ts` | `request({url:'/{module}/{page}/pageList',params:...})` |
| view | `src/modules/business/{module}/{business}/pages/index.vue` | 三段式列表页 |

页面（含弹窗 XxxFormModal.vue）放 `pages/`，接口放 `api/`，类型放 `types/`，三者同模块聚合、无 barrel 登记；全局基础类型（Response/PageModel/ListQuery…）统一从 `@/types` 引用。「框架」内置模块在 `modules/framework/`，业务禁止混入。

**i18n 落位**：用户可见文案一律 `import { t } from '@/i18n'` 引用，**禁止硬编码中文**（注释除外）；文案 key 统一维护在 `src/i18n/locales/{zh,en}.json` **单一文件**内（按域名节点分区，如 `business.*`；`app` 前置 → 公共组 `common` 等 → 平台业务组 `authz/system` 等 → 常规业务模块，顺序与另一套 UI 保持一致），zh/en 成对补。通用词（新增/修改/删除/搜索/操作/状态/正常/停用/保存成功…）复用 `common.*`，插值用 `t('key',[v])`（`{0}`）。

types 参考 `src/modules/framework/system/message/types/index.ts` 封口写法；api 参考 `src/modules/framework/system/message/api/index.ts`。

### index.vue 骨架（三段式，template 略）

```ts
<script setup lang="ts">
defineOptions({ name: 'Demo' })
import { listDemo, getDemo, addDemo, delDemo, updateDemo } from '../api'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import { useEnumOption } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import { t } from '@/i18n'
import { RightToolbar, Pagination } from '@/components'
import type { FormState, TableState } from '@/types'
import type { Demo, DemoQuery } from '../types'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const resetForm = useFormReset()

// --------------------------------- ref data ---------------------------------
const demoRef = ref<FormInstance>()            /* 编辑表单 ref */
const { DemoStatusEnum: statusOptions } = useEnumOption('DemoStatusEnum')

const queryParams = ref<DemoQuery>({ pageNum: 1, pageSize: 10, status: -1, name: undefined })

const table = ref<TableState<Demo>>({ list: [], total: 0, loading: true, showSearch: true, ids: [], single: true, multiple: true })

const formState = ref<FormState<Demo>>({ visible: false, title: '', form: {}, rules: { name: [{ required: true, message: t('demo.nameRequired'), trigger: 'blur' }] } })

// --------------------------------- fun ---------------------------------
function getList() {
  table.value.loading = true
  const params = usePageParams(queryParams)()   // pageNum/pageSize → offset/pagesize
  listDemo(params).then((response) => {
    table.value.list = response.data.data        // 列表
    table.value.total = response.data.total      // 总数
    table.value.loading = false
  })
}
function reset() { formState.value.form = { id: undefined, name: undefined, status: 0 }; resetForm('demoRef') }
function handleQuery() { queryParams.value.pageNum = 1; getList() }
function resetQuery() { resetForm('queryRef'); handleQuery() }
function handleSelectionChange(selection: Demo[]) { table.value.ids = selection.map(i => i.id as number); table.value.single = selection.length !== 1; table.value.multiple = !selection.length }
function handleAdd() { reset(); formState.value.visible = true; formState.value.title = '新增Demo' }
function handleUpdate(row: any) { reset(); const id = row?.id ?? table.value.ids[0]; if (id == null) return; getDemo(id).then(r => { formState.value.form = r.data; formState.value.visible = true; formState.value.title = '修改Demo' }) }
function handleDelete(row: any) { const ids = row?.id ?? table.value.ids; if (ids == null || (Array.isArray(ids) && ids.length === 0)) return; modal.confirm('是否确认删除编号为"' + ids + '"的数据项？').then(() => delDemo(ids)).then(() => { getList(); modal.msgSuccess('删除成功') }).catch(() => {}) }
function submitForm() { demoRef.value!.validate(valid => { if (!valid) return; (formState.value.form.id != null ? updateDemo(formState.value.form) : addDemo(formState.value.form)).then(() => { modal.msgSuccess(formState.value.form.id != null ? '修改成功' : '新增成功'); formState.value.visible = false; getList() }) }) }

// --------------------------------- page init ---------------------------------
getList()
</script>
```

- 模板：搜索表单（`queryParams`）、`<el-table>` + 操作列用 `v-hasPermi="['demo:demo:add|edit|remove']"`、`<Pagination>`、`<el-dialog :title="formState.title" v-model="formState.visible">` + `@/components` 的 Editor/ImageUpload 等按需引入。**完整样例看 `src/modules/framework/system/message/index.vue`。**
- `getList()` 一律经 `usePageParams(queryParams)()` 转 `offset/pagesize`；从 `response.data.data / response.data.total` 取值。

## 菜单 / 权限注册 SQL

模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`（生成 `{business}-init.sql`）。要点：

```sql
-- 菜单（type=1；url 同时充当路由 path 与 modules/ 组件定位 key）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, 'Demo管理', 1, 'demo:demo', '/demo/demo', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();
-- 按钮（type=2）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, 'Demo新增', 2, 'demo:demo:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, 'Demo修改', 2, 'demo:demo:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, 'Demo删除', 2, 'demo:demo:remove', '', '', 3, 0, 0, now(), now());
-- 授权（默认管理员）
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()), (1, @parentId+1, now(), now()), (1, @parentId+2, now(), now()), (1, @parentId+3, now(), now());
```

页面文件 `src/modules/business/{module}/{business}/pages/index.vue` 建好后前端 `loadView` 自动映射，**无需改路由**。

## 枚举下拉（可选）

业务模块枚举（含下拉）统一放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum(getCode/getTitle)`；`framework/constant/enums` 仅保留平台内置枚举，业务代码一律不侵入。`loadEnumItem` 展开「平台枚举包 + business 根包」内包含 IEnum 枚举的包，按枚举名解析（平台包优先），前端 `useEnumOption('XxxEnum')` 自动取 `{code,title}`。数据字典场景改用 `useDict('dictType')`（录入 `xxl_boot_dict`）。

## 内置代码生成器（快速出码）

后台「工具-代码生成」或接口 `POST /tool/codegen/createTable`：

```json
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "tplWebType": "element-plus-typescript" }
```

→ `update` 编辑字段（htmlType/queryType/dictType/isQuery/isList/isInsert/isEdit/isRequired）→ `preview` 逐文件预览 / `batchGenCode` 下载 zip（后端 6 件套 + vue3 三文件 + `-init.sql`）。落位见上文两张清单。

## 校验清单

- [ ] 需求子目录 `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md`（六大块齐全）+ SQL 已落盘并同步。
- [ ] `xxl-boot-api` 下 `mvn -q compile` 通过。
- [ ] 后端：Controller 全 `@XxlSso`，方法顺序 `pageList/load/insert/delete/update`，分页 `offset/pagesize`，XML resultMap + `NOW()`，校验 `Response.ofFail`。
- [ ] 前端：types 三件齐（实体/Query/ListQuery）并登记 barrel；api 封装 `Promise<Response<PageModel<T>>>`；列表页三段式 + `ref` 收敛 + `usePageParams`。
- [ ] 权限：按钮 `v-hasPermi`，资源表菜单+按钮已插且已授权。注释符合 AGENTS.md 6.1。
- [ ] i18n：页面无硬编码中文（注释除外），`t('key')` 引用且 zh/en 文案已成对维护；通用词复用 `common.*`。语言配置 `default-settings.ts` 的 `language`。
- [ ] 防乱码：所有 `.sql` 首行有 `SET NAMES utf8mb4;`。
- [ ] 联调：菜单可见、列表/新增/修改/删除/搜索可用、权限失效项按钮隐藏、空参数后端友好提示。

## 参考文件（绝对路径）

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/message/pages/index.vue`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/message/{api,types}/index.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
- 代码生成前端页：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/tool/codegen/{index,editTable}.vue`