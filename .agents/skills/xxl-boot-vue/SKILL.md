---
name: xxl-boot-vue
description: 在 XXL-Boot 前后端分离的 Vue3 模式（xxl-boot-api 端口 8090 + xxl-boot-ui-vue 端口 3000，Element Plus + TypeScript）下新增或改造业务模块。当任务涉及修改 xxl-boot-api/src/main/java/com/xxl/boot/api/business 或 xxl-boot-ui-vue/src/modules 时加载本技能。
---

# XXL-Boot · Vue3 分离模式开发 Skill

目标：把 `xxl-boot-api` + `xxl-boot-ui-vue` 当作脚手架，规范、快速地新增/改造业务模块。本 Skill 只写 Vue 模式差异；跨模式共性（需求落盘、数据库、接口通道、i18n 原则、验收）见仓库根 `AGENTS.md`。

## 何时使用

- 前后端分离，前端是 Vue3（Element Plus + TS）。
- 新增带列表页的标准 CRUD 业务模块。
- 只改后端接口、不动前端时同样适用（取「后端落位」一节）。
- 前端是 React 用 `xxl-boot-react`；改 `xxl-boot-admin` 用 `xxl-boot-monolith`。

## 前置：工程结构速览

```
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…                      ← 平台内置
├── java/com/xxl/boot/api/business/{module}/{business}/    ← 新增业务（与前端双层镜像）
└── resources/mapper/framework/{module}/                   ← 平台内置 Mapper XML
└── resources/mapper/business/{module}/{business}/         ← 业务 Mapper XML

xxl-boot-ui/xxl-boot-ui-vue/src
├── modules/framework/{domain}/{module}/                   ← 平台内置（pages + api + types）
├── modules/business/{module}/{business}/                  ← 业务模块（pages + api + types）
├── composables/                                           ← usePageParams / useEnumOption / useDict / useFormReset
├── components/                                            ← Editor / ImageUpload / Pagination / RightToolbar…
└── types/index.ts                                         ← Response / PageModel / ListQuery / TableState / FormState…
```

后端与 React 模式**完全共用**，落位规则一致；前端差异见本 Skill。

## 实现原则（Vue）

遵循 `AGENTS.md`「设计原则」与「通用约定」，Vue 侧落地：
- 优先复用 `@/composables`、`@/components`、`@/utils/modal`；同一逻辑第三次出现才新增 Composable，不提前封装。
- 列表页只负责编排；复杂表单、详情、多页签拆到 `pages/` 下独立组件，避免渲染/交互/状态混在一个文件。
- 状态统一 `ref` + `queryParams/table/formState` 收敛；不引入第二套状态或弹窗方案。

## 初始化与启动

- 数据库：按 `AGENTS.md`「SQL 执行规范」执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_vue.sql`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090，Redis 需先启动）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-vue && npm i && npm run dev`（3000，代理 `/api` → 8090）。
- 类型检查/构建：`npm run type-check` / `npm run build`。

## 执行要点

- 本模式端口：api `8090`、vue `3000`。
- 后端落 `business/{module}/{business}`，Mapper XML 落 `resources/mapper/business/{module}/{business}/`，前端落 `modules/business/{module}/{business}/`。
- 菜单 SQL、页面定位与权限写法按本 Skill 后续章节执行；需求落盘与标准流程按 `AGENTS.md`。

## 后端落位（与 React 共用）

以业务 `Demo`、模块 `demo`、接口路径 `/demo/demo` 为例，包名 `com.xxl.boot.api.business.demo.demo`：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Demo.java` | `java/.../business/demo/demo/model/Demo.java` | 实体，字段驼峰；`Date` 字段加 `@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="GMT+8")` |
| `DemoMapper.java` | `java/.../business/demo/demo/mapper/DemoMapper.java` | `insert/delete/update/load/pageList/pageListCount` |
| `DemoMapper.xml` | `resources/mapper/business/demo/demo/DemoMapper.xml` | `resultMap` 显式映射；`add_time/update_time` 用 `NOW()`；查询用 `<if>` 动态拼条件 |
| `DemoService.java` / `DemoServiceImpl.java` | `java/.../business/demo/demo/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `DemoController.java` | `java/.../business/demo/demo/controller/DemoController.java` | `@RestController @RequestMapping("/demo/demo")`，全部方法 `@XxlSso` |

接口契约（路径、参数通道、返回结构、校验、方法顺序）按 `AGENTS.md`「后端通用规范」；本模式只需保证包路径与 Mapper XML 双层镜像。

### 代码生成器产物的 Vue 专属修正

- Vue 模板会生成「导出」按钮与 `exportDemo` 接口，但后端默认没有 `export` 接口：要么补实现，要么删按钮/API。
- 其余固定缺口（查询条件、校验、i18n、树表）按 `AGENTS.md`「代码生成器」逐项补齐。

## 前端落位（3 文件 + 页内组件）

以 `/demo/demo` 为例：

| 文件 | 位置 | 说明 |
|---|---|---|
| types | `src/modules/business/demo/demo/types/index.ts` | 实体 + Query + Form + ListQuery |
| api | `src/modules/business/demo/demo/api/index.ts` | `request` 封装，`Promise<Response<PageModel<T>>>` |
| view | `src/modules/business/demo/demo/pages/index.vue` | 三段式列表页 |
| 页内组件 | 同 `pages/` 下，如 `DemoFormModal.vue` | 弹窗独立文件时使用 |

页面、接口、类型同模块聚合，**没有 barrel 登记**；全局基础类型统一从 `@/types` 引用。

### 1. types：`types/index.ts`

```ts
import type { ListQuery } from '@/types'

/** Demo 实体 */
export interface Demo {
  id?: number
  /** 名称 */
  name?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  addTime?: string
  updateTime?: string
}

/** 搜索栏查询参数（前端表单形态） */
export interface DemoQuery {
  pageNum: number
  pageSize: number
  name?: string
  status?: number
}

/** 新增/修改表单 */
export interface DemoForm {
  id?: number
  name?: string
  status?: number
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type DemoListQuery = ListQuery<DemoQuery>
```

### 2. api：`api/index.ts`

```ts
import { request } from '@/utils/request'
import type { Demo, DemoForm, DemoListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 分页查询 Demo */
export function listDemo(query: DemoListQuery): Promise<Response<PageModel<Demo>>> {
  return request({
    url: '/demo/demo/pageList',
    method: 'get',
    params: query
  })
}

/** 查询 Demo 详情 */
export function getDemo(id: number): Promise<Response<Demo>> {
  return request({
    url: '/demo/demo/load',
    method: 'get',
    params: { id }
  })
}

/** 新增 Demo */
export function addDemo(data: DemoForm): Promise<Response<unknown>> {
  return request({
    url: '/demo/demo/insert',
    method: 'post',
    data
  })
}

/** 修改 Demo */
export function updateDemo(data: DemoForm): Promise<Response<unknown>> {
  return request({
    url: '/demo/demo/update',
    method: 'post',
    data
  })
}

/** 删除 Demo（支持单条/批量） */
export function delDemo(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/demo/demo/delete',
    method: 'post',
    data: Array.isArray(id) ? id : [id]
  })
}
```

### 3. 页面：`pages/index.vue`（script 骨架）

模板部分：搜索表单 + 操作按钮（`v-hasPermi`） + `<el-table>` + `<Pagination>` + `<el-dialog>`；完整范例先看 `modules/framework/system/message/pages/index.vue`。

```ts
<script setup lang="ts">
defineOptions({ name: 'Demo' })
import { t } from '@/i18n'
import { ref } from 'vue'
import { listDemo, getDemo, addDemo, updateDemo, delDemo } from '../api'
import { usePageParams } from '@/composables/usePageParams'
import { useEnumOption } from '@/composables/useEnumOption'
import { useFormReset } from '@/composables/useFormReset'
import modal from '@/utils/modal'
import type { Demo, DemoForm, DemoQuery } from '../types'
import type { FormState, TableState } from '@/types'
import type { FormInstance } from 'element-plus'

const resetForm = useFormReset()

// --------------------------------- ref data ---------------------------------
const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */
const formRef = ref<FormInstance>() /* 编辑表单 ref */
const { DemoStatusEnum: statusOptions } = useEnumOption('DemoStatusEnum')

const queryParams = ref<DemoQuery>({ pageNum: 1, pageSize: 10, name: undefined, status: -1 })

const table = ref<TableState<Demo>>({
  list: [],
  total: 0,
  loading: true,
  showSearch: true,
  ids: [],
  single: true,
  multiple: true
})

const formState = ref<FormState<DemoForm>>({
  visible: false,
  title: '',
  form: {},
  rules: {
    name: [{ required: true, message: t('common.requiredMsg', [t('business.demo.name')]), trigger: 'blur' }]
  }
})

// --------------------------------- fun ---------------------------------
function getList() {
  table.value.loading = true
  const params = usePageParams(queryParams)()
  listDemo(params).then((response) => {
    table.value.list = response.data.data
    table.value.total = response.data.total
    table.value.loading = false
  })
}

function reset() {
  formState.value.form = { id: undefined, name: undefined, status: 0 }
  resetForm('formRef')
}

function handleQuery() {
  queryParams.value.pageNum = 1
  getList()
}

function resetQuery() {
  resetForm('queryRef')
  handleQuery()
}

function handleSelectionChange(selection: Demo[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('business.demo.title')])
}

/** 顶部按钮点击传入的是事件对象，需回退到勾选 id */
function handleUpdate(row: any) {
  reset()
  const id = row?.id ?? table.value.ids[0]
  if (id == null) return
  getDemo(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', [t('business.demo.title')])
  })
}

function submitForm() {
  formRef.value?.validate((valid) => {
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? updateDemo(formState.value.form) : addDemo(formState.value.form)
    request.then(() => {
      modal.msgSuccess(isEdit ? t('common.updateSuccess') : t('common.addSuccess'))
      formState.value.visible = false
      getList()
    })
  })
}

/** 顶部按钮点击传入的是事件对象，需回退到勾选 ids */
function handleDelete(row: any) {
  const ids = row?.id ?? table.value.ids
  if (ids == null || (Array.isArray(ids) && ids.length === 0)) return
  modal
    .confirm(t('business.demo.confirmDelete', [ids]))
    .then(() => delDemo(ids))
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// --------------------------------- page init ---------------------------------
getList()
</script>
```

### Vue 页面约定

- `script` 除基础 import 外按「ref data → fun → page init」三节组织，节顶注释为 `/* --- {功能，前后33个-} --- */`。
- 响应式数据一律 `ref`，禁止 `reactive` 与 `toRefs(data)` 解构；搜索栏、表格状态、表单状态分别收敛为 `queryParams`、`table`、`formState`。
- 列表固定经 `usePageParams(queryParams)()` 把 `pageNum/pageSize` 转 `offset/pagesize`；取 `response.data.data` 与 `response.data.total`。
- 组件 import 名称与模板标签统一 PascalCase；按钮权限 `v-hasPermi="['demo:demo:add']"`，角色权限 `v-hasRole="['admin']"`。
- 表单弹窗推荐 `defineModel('visible')` + 模板 `v-model` 直连；通用能力复用 `@/composables/*`、`@/components`、`@/utils/modal`。

### i18n（Vue）

- 文案文件：`src/i18n/locales/{zh,en}.json`（单一文件，按域名节点分区，`business.*` 放最后）。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 受 `MessageKey` 类型约束，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`，Element Plus 语言随当前语言切换。

## 菜单 / 权限注册 SQL

```sql
SET NAMES utf8mb4;

-- 菜单（type=1；url 同时充当路由 path 与 modules/ 组件定位 key）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, 'Demo管理', 1, 'demo:demo', '/demo/demo', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

-- 按钮（type=2）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, 'Demo新增', 2, 'demo:demo:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, 'Demo修改', 2, 'demo:demo:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, 'Demo删除', 2, 'demo:demo:remove', '', '', 3, 0, 0, now(), now());

-- 按钮ID（多值插入 LAST_INSERT_ID 返回首行，自增连续）
SELECT @btnAddId := LAST_INSERT_ID();
SET @btnEditId = @btnAddId + 1, @btnDelId = @btnAddId + 2;

-- 授权（默认管理员 role_id=1）
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()),
       (1, @btnAddId, now(), now()),
       (1, @btnEditId, now(), now()),
       (1, @btnDelId, now(), now());
```

页面文件 `src/modules/business/{module}/{business}/pages/index.vue` 建好后，`loadView` 按 `url` 自动映射；也支持 `pages/{xxx}.vue`（此时菜单 `url` 写到 `/{module}/{business}/{xxx}`）。**无需改路由代码。**

## 枚举 / 字典

- 业务枚举放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 枚举下拉：`const { DemoStatusEnum: statusOptions } = useEnumOption('DemoStatusEnum')`，返回 `Record<string, Ref<EnumOption[]>>`，模板用 `statusOptions`，提交用 `item.code`。
- 数据字典：`const { sys_user_sex } = useDict('sys_user_sex')`；字段映射为 `{ label, value }`。

## 内置代码生成器（Vue）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "tplWebType": "element-plus-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段（`queryType/htmlType/dictType/isQuery/isList/isInsert/isEdit/isRequired`）→ `preview` 逐文件预览 / `batchGenCode?ids=...` 下载 zip。

产物：

- 后端：`main/java/.../business/{module}/{business}/{model,mapper,service,service/impl,controller}` + `main/resources/mapper/business/{module}/{business}/{Business}Mapper.xml` + `{Business}-init.sql`；
- 前端：`vue/business/{module}/{business}/{types,api,pages}`；
- 字段 `id` 是强依赖；`tplCategory=tree` 时前端出 `index-tree.vue`。

> 解压后按项目目录合并；生成代码的补齐项见「Vue 专属修正」。

## 校验清单

- [ ] `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md` 六大块与 SQL 已落盘并同步（模板见 `AGENTS.md`「需求落盘」）。
- [ ] 后端 `mvn -q compile` 通过；接口契约与代码生成补齐项符合 `AGENTS.md`「后端通用规范」「代码生成器」。
- [ ] 前端 types 四件（实体/Query/Form/ListQuery）齐全，api 返回 `Promise<Response<PageModel<T>>>`，页面三段式 + `ref` 收敛 + `usePageParams`。
- [ ] 按钮 `v-hasPermi`；资源表菜单+按钮已插且已授权；菜单可见、页面能打开。
- [ ] i18n：页面无硬编码中文（注释除外），语言由后端 `system.i18n.language` 控制，前端已由 `/loadBaseConfig` 同步。
- [ ] SQL 按 `AGENTS.md`「SQL 执行规范」执行，中文无乱码。
- [ ] 联调：列表/新增/修改/删除/搜索可用，无权限按钮隐藏，空参数后端友好提示。

## 参考文件

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- Vue 直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/vue3/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/message/pages/index.vue`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/message/{api,types}/index.ts`
- 组合式函数：`xxl-boot-ui/xxl-boot-ui-vue/src/composables/{usePageParams,useEnumOption,useDict,useFormReset}.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
- 代码生成前端页：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/tool/codegen/`
