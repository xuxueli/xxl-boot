---
name: xxl-boot-vue
description: 在 XXL-Boot 前后端分离的 Vue3 模式（xxl-boot-api 端口 8090 + xxl-boot-ui-vue 端口 3000，Element Plus + TypeScript）下新增或改造业务模块。当任务涉及修改 xxl-boot-api/src/main/java/com/xxl/boot/api/business 或 xxl-boot-ui-vue/src/views|api|types 时加载本技能。
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
├── java/com/xxl/boot/api/business/{module}  ← 新增业务落此（可经后台代码生成器产出或按模板直生）
└── resources/mapper/{module}/               ← 业务 Mapper XML
xxl-boot-ui-vue/src
├── views/{module}/{page}/index.vue          ← 页面（DB 菜单 url 驱动，零路由改动）
├── api/{module}/{page}.ts                   ← 接口封装
└── types/{module}/{page}.ts → 在 types/api.ts barrel 登记
```

通用规范（返回结构、注释、命名、DB）见仓库根 `AGENTS.md` 第六节。

## 标准流程

0. **需求落盘（先建立）**：先按「需求落盘（xxl-boot-spec）」一节在项目根 `xxl-boot-spec/{yyyyMMdd}-{business}/` 创建需求子目录，随后确认的需求结论、方案、SQL 全部落入该目录（见下文专属章节）。
1. **需求确认（第一步，必须）**：接到任务先不写代码，主动向用户确认需求细节，用户确认后再执行。至少确认：模块与业务命名（`{module}/{business}`）及目录归属；核心字段、状态/枚举下拉、是否需文件上传/富文本等特殊组件；页面形态（标准 CRUD / 详情页 / 多页签，仅动后端时则不动前端）；菜单+按钮+角色授权是否一并处理；出码方式（AI 按模板直生 or 后台「代码生成」）；验证范围与启动端口（api 8090 / vue 3000）。确认结果即时回填到子目录 `方案.md`。
2. **建表**：`xxl_boot_*` SQL，公共字段 `id/add_time/update_time`，TINYINT 状态，`COMMENT` 注释；SQL 脚本写入该需求子目录（如 `{business}-table.sql`、`{business}-init.sql`）。
3. **生成或手写代码**：本 Skill 缺省策略为 AI 直接按内置模板（`xxl-boot-api/src/main/resources/templates/tool/codegen/{java,vue3}/*.ftl`）渲染等价代码落位；同时提示用户可后台「工具-代码生成」走内置生成器（见第六节）。
4. **落位**：后端 Java 落 `business/{module}`，Mapper XML 落 `resources/mapper/{module}/`；前端三个文件落 `views|api|types/{module}/{page}`，并在 `types/api.ts` barrel 补一行。
5. **菜单/权限**：插 `xxl_boot_resource` 菜单(type=1)+按钮(type=2)+`xxl_boot_role_res` 授权；页面按钮用 `v-hasPermi`。
6. **验证**：起 `xxl-boot-api`(8090) + `xxl-boot-ui-vue`(3000，代理 /api→8090)，菜单可见、CRUD 可用、权限生效；验证结果回填 `方案.md`。

## 需求落盘（xxl-boot-spec）

每个需求在项目根目录 `xxl-boot-spec/` 下生成一个需求子目录，把执行中产出的「方案 + SQL」沉淀其中，便于追溯与复用：

1. **目录命名**：`xxl-boot-spec/{yyyyMMdd}-{business}/`（同日多个需求用业务名区分，如 `20260830-product`）。
2. **方案**：`方案.md`，记录需求确认结论（`{module}/{business}` 命名、核心字段、状态/枚举下拉、页面形态、菜单/权限、出码方式、验证范围）、落位清单（后端 7 件套 + 前端三文件）与验证结果/变更记录。
3. **SQL**：建表 SQL 与菜单/权限 SQL 一并落盘（如 `{business}-table.sql`、`{business}-init.sql`），作为本需求专属脚本；如需进总库初始化，再同步一份到 `doc/db/`。

执行全程保持该目录与实现同步：先建目录落方案骨架 → 建表写 SQL → 落位实现 → 验证后回填结论。

## 后端落位清单（7 件套）

以业务 `Demo`、模块 `demo` 为例，包名 `com.xxl.boot.api.business.demo`：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Demo.java` | `java/.../business/demo/model/Demo.java` | 实体，字段驼峰 |
| `DemoMapper.java` | `java/.../business/demo/mapper/DemoMapper.java` | insert/delete/update/load/pageList/pageListCount |
| `DemoMapper.xml` | `resources/mapper/demo/DemoMapper.xml` | resultMap 显式映射；`add_time/update_time` 用 `NOW()` |
| `DemoService.java` / `DemoServiceImpl.java` | `java/.../business/demo/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `DemoController.java` | `java/.../business/demo/controller/DemoController.java` | `@RestController @RequestMapping("/demo/demo")`，全 `@XxlSso` |

**直生入口**：直接读模板 `templates/tool/codegen/java/*.ftl`（controller/service/service_impl/mapper/mapper.xml/entity 六文件）即可得到准确骨架与落位路径。

后端要点：

- Controller 分页方法签名：`int offset(默认0)`、`int pagesize(默认10)` + 查询参数，返回 `Response<PageModel<XxxDTO/Entity>>`。
- 参数校验用 `StringTool/RegexTool/CollectionTool`，失败 `Response.ofFail("提示")`；唯一性校验库中查一遍再插。
- DTO 时间展示转字符串（`DateTool.formatDateTime`），用 Adaptor 完成 entity→dto。
- 接口路径**全小写**：`/{module}/{business}/pageList|load|insert|delete|update`；删除批量 `@RequestParam("ids[]") List<Integer>`。

## 前端落位清单（3 文件 + barrel）

| 文件 | 位置 | 说明 |
|---|---|---|
| types | `src/types/{module}/{page}.ts` | `Xxx` 实体 + `XxxQuery`(pageNum/pageSize 表单形态) + `XxxListQuery = ListQuery<XxxQuery>` |
| api | `src/api/{module}/{page}.ts` | `request({url:'/{module}/{page}/pageList',params:...})` |
| view | `src/views/{module}/{page}/index.vue` | 三段式列表页 |

`src/types/api.ts` barrel 补一行 `export * from './{module}/{page}'`。

types 参考 `src/types/system/message.ts` 封口写法；api 参考 `src/api/system/message.ts`。

### index.vue 骨架（三段式，template 略）

```ts
<script setup lang="ts">
defineOptions({ name: 'Demo' })
import { listDemo, getDemo, addDemo, delDemo, updateDemo } from '@/api/demo/demo'
import { useFormReset } from '@/composables/useFormReset'
import { usePageParams } from '@/composables/usePageParams'
import { useEnumOption } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import { RightToolbar, Pagination } from '@/components'
import type { FormState, TableState } from '@/types'
import type { Demo, DemoQuery } from '@/types/demo/demo'
import type { FormInstance } from 'element-plus'
import { ref } from 'vue'

const resetForm = useFormReset()

// --------------------------------- ref data ---------------------------------
const demoRef = ref<FormInstance>()            /* 编辑表单 ref */
const { DemoStatusEnum: statusOptions } = useEnumOption('DemoStatusEnum')

const queryParams = ref<DemoQuery>({ pageNum: 1, pageSize: 10, status: -1, name: undefined })

const table = ref<TableState<Demo>>({ list: [], total: 0, loading: true, showSearch: true, ids: [], single: true, multiple: true })

const formState = ref<FormState<Demo>>({ visible: false, title: '', form: {}, rules: { name: [{ required: true, message: '名称不能为空', trigger: 'blur' }] } })

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

- 模板：搜索表单（`queryParams`）、`<el-table>` + 操作列用 `v-hasPermi="['demo:demo:add|edit|remove']"`、`<Pagination>`、`<el-dialog :title="formState.title" v-model="formState.visible">` + `@/components` 的 Editor/ImageUpload 等按需引入。**完整样例看 `src/views/system/message/index.vue`。**
- `getList()` 一律经 `usePageParams(queryParams)()` 转 `offset/pagesize`；从 `response.data.data / response.data.total` 取值。

## 菜单 / 权限注册 SQL

模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`（生成 `{business}-init.sql`）。要点：

```sql
-- 菜单（type=1；url 同时充当路由 path 与 views/ 组件定位 key）
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

页面文件 `src/views/demo/demo/index.vue` 建好后前端 `loadView` 自动映射，**无需改路由**。

## 枚举下拉（可选）

需要下拉的业务枚举统一放 `com.xxl.boot.api.framework.constant.enums`（`loadEnumItem` 扫描该包，枚举实现 `EnumTool.IEnum(getCode/getTitle)`），前端 `useEnumOption('XxxEnum')` 自动取 `{code,title}`；不需要下拉的枚举可放 `business/{module}/enums`。数据字典场景改用 `useDict('dictType')`（录入 `xxl_boot_dict`）。

## 内置代码生成器（快速出码）

后台「工具-代码生成」或接口 `POST /tool/codegen/createTable`：

```json
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "tplWebType": "element-plus-typescript" }
```

→ `update` 编辑字段（htmlType/queryType/dictType/isQuery/isList/isInsert/isEdit/isRequired）→ `preview` 逐文件预览 / `batchGenCode` 下载 zip（后端 6 件套 + vue3 三文件 + `-init.sql`）。落位见上文两张清单。

## 校验清单

- [ ] 需求子目录 `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`方案.md` + SQL 已落盘并同步。
- [ ] `xxl-boot-api` 下 `mvn -q compile` 通过。
- [ ] 后端：Controller 全 `@XxlSso`，方法顺序 `pageList/load/insert/delete/update`，分页 `offset/pagesize`，XML resultMap + `NOW()`，校验 `Response.ofFail`。
- [ ] 前端：types 三件齐（实体/Query/ListQuery）并登记 barrel；api 封装 `Promise<Response<PageModel<T>>>`；列表页三段式 + `ref` 收敛 + `usePageParams`。
- [ ] 权限：按钮 `v-hasPermi`，资源表菜单+按钮已插且已授权。注释符合 AGENTS.md 6.1。
- [ ] 联调：菜单可见、列表/新增/修改/删除/搜索可用、权限失效项按钮隐藏、空参数后端友好提示。

## 参考文件（绝对路径）

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-vue/src/views/system/message/index.vue`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-vue/src/api/system/message.ts`、`src/types/system/message.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
- 代码生成前端页：`xxl-boot-ui/xxl-boot-ui-vue/src/views/tool/codegen/{index,editTable}.vue`