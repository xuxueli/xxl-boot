---
name: xxl-boot-vue
description: 在 XXL-Boot 前后端分离的 Vue3 模式（xxl-boot-ui-vue 端口 3000，Element Plus + TypeScript）下新增或改造业务模块时加载。触发信号：修改 xxl-boot-ui-vue/src/modules、编辑 .vue 页面、使用 Element Plus/usePageParams/useEnumOption/useDict，或用户明确选择 Vue 分离模式。React 任务改用 xxl-boot-react；单体任务改用 xxl-boot-monolith。
---

# XXL-Boot · Vue3 分离模式开发 SKILL

> 适用范围：`xxl-boot-api` + `xxl-boot-ui-vue` 的前后端分离业务开发。公共契约（设计原则、通用约定、需求落盘、接口通道、数据库/菜单模型、验收）见仓库根 `AGENTS.md`；本文件只维护 Vue 模式差异。

## 一、模式概览

| 项 | 内容 |
|---|---|
| 运行模式 | 前后端分离 · Vue3 |
| 组成 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-vue` |
| 端口 | api `8090`、vue `3000`（Vite 代理 `/api` → 8090） |
| 技术栈 | Spring Boot + MyBatis；Vue3 + Element Plus + TypeScript + Vite |
| 登录态 | XXL-SSO，登录态存 Redis（需先启动 Redis） |
| 后端落位 | Java `business/{module}/{business}`；Mapper XML `resources/mapper/business/{module}/{business}` |
| 前端落位 | `src/modules/business/{module}/{business}/{types,api,pages}` |
| 数据库脚本 | `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_vue.sql` |

## 二、何时使用

- 前后端分离，前端是 Vue3（Element Plus + TS）。
- 新增带列表页的标准 CRUD 业务模块。
- 只改后端接口、不动前端时同样适用（取「后端落位」一节）。
- 不适用：前端是 React 用 `xxl-boot-react`；改 `xxl-boot-admin` 用 `xxl-boot-monolith`。

## 三、工程结构速览

```
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…                      ← 平台内置
├── java/com/xxl/boot/api/business/{module}/{business}/    ← 新增业务（与前端双层镜像）
└── resources/mapper/framework/{module}/                   ← 平台内置 Mapper XML
└── resources/mapper/business/{module}/{business}/         ← 业务 Mapper XML

xxl-boot-ui/xxl-boot-ui-vue/src
├── modules/framework/{domain}/{module}/                   ← 平台内置（pages + api + types）
├── modules/business/{module}/{business}/                  ← 业务模块（pages + api + types）
├── composables/                                           ← usePageParams / useEnumOption / useDict
├── components/                                            ← Editor / ImageUpload / Pagination / RightToolbar…
└── types/index.ts                                         ← Response / PageModel / ListQuery / TableState / FormState…
```

后端与 React 模式**完全共用**，落位规则一致；前端差异见本 SKILL。

## 四、实现原则（Vue）

遵循 `AGENTS.md`「设计原则」与「通用约定」，Vue 侧落地：

- 优先复用 `@/composables`、`@/components`、`@/utils/modal`；同一逻辑第三次出现才新增 Composable，不提前封装。
- 列表页只负责编排；复杂表单、详情、多页签拆到 `pages/` 下独立组件，避免渲染/交互/状态混在一个文件。
- 状态统一 `ref` + `queryParams/table/formState` 收敛；不引入第二套状态或弹窗方案。

## 五、初始化与启动

- 数据库：按 `AGENTS.md`「SQL 执行规范」依次执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_vue.sql`。
- 环境：Node 20+。
- 数据源：`xxl-boot-api/src/main/resources/application.properties`（默认 `127.0.0.1:3306/xxl_boot`，`root/root_pwd`）；默认账号 `admin`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090，Redis 需先启动）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-vue && npm i && npm run dev`（3000）。
- 编译/类型检查/构建：`mvn -q compile`（`xxl-boot-api` 下）/ `npm run type-check` / `npm run build`（前端目录下）。

## 六、后端落位（与 React 共用）

> 命名约定：`{module}` 是业务域（父目录），`{business}` 是业务页/实体（子目录）。本示例 module=`{module}`、business=`{business}`，对应 `business/{module}/{business}`；避免父子同名。代码与 SQL 中的 `{module}`、`{business}`、`{businessName}`、`Xxx`/`xxx` 均为占位符，落地时替换为实际命名。

以业务 `Xxx`、模块 `{module}`、接口路径 `/{module}/{business}` 为例，包名 `com.xxl.boot.api.business.{module}.{business}`：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Xxx.java` | `java/.../business/{module}/{business}/model/Xxx.java` | 实体，字段驼峰；`Date` 字段加 `@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="GMT+8")` |
| `XxxMapper.java` | `java/.../business/{module}/{business}/mapper/XxxMapper.java` | `insert/delete/update/load/pageList/pageListCount` |
| `XxxMapper.xml` | `resources/mapper/business/{module}/{business}/XxxMapper.xml` | `resultMap` 显式映射；`add_time/update_time` 用 `NOW()`；查询用 `<if>` 动态拼条件 |
| `XxxService.java` / `XxxServiceImpl.java` | `java/.../business/{module}/{business}/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `XxxController.java` | `java/.../business/{module}/{business}/controller/XxxController.java` | `@RestController @RequestMapping("/{module}/{business}")`，全部方法 `@XxlSso` |

接口契约（路径、参数通道、返回结构、校验、方法顺序）按 `AGENTS.md`「后端通用规范」；本模式只需保证包路径与 Mapper XML 双层镜像。
- 用户可见错误文案统一 `I18nUtil.getString("key")`，禁止硬编码中文；键维护在 `xxl-boot-api/src/main/resources/i18n/message_zh.properties` / `message_en.properties`（存量代码逐步迁移，新增/修改代码必须遵守）。

## 七、前端落位（3 文件 + 页内组件）

以 `/{module}/{business}` 为例：

| 文件 | 位置 | 说明 |
|---|---|---|
| types | `src/modules/business/{module}/{business}/types/index.ts` | 实体 + Query + Form + ListQuery |
| api | `src/modules/business/{module}/{business}/api/index.ts` | `{business}Api` 命名空间封装，方法名对齐后端 Controller |
| view | `src/modules/business/{module}/{business}/pages/index.vue` | 三段式列表页 |
| 页内组件 | 同 `pages/` 下，如 `XxxFormModal.vue` | 弹窗独立文件时使用 |

页面、接口、类型同模块聚合，**没有 barrel 登记**；全局基础类型统一从 `@/types` 引用。

### 7.1 types：`types/index.ts`

```ts
/**
 * @fileoverview Xxx 类型定义
 * @description 实体、查询、表单与列表查询类型
 * @author xuxueli 2026-11-21
 */
import type { ListQuery } from '@/types'

/** Xxx 实体 */
export interface Xxx {
  /** 主键 */
  id?: number
  /** 名称 */
  name?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 新增时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索栏查询参数（前端表单形态） */
export interface XxxQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 名称，模糊匹配 */
  name?: string
  /** 状态筛选，-1 表示全部 */
  status?: number
}

/** 新增/修改表单 */
export interface XxxForm {
  /** 主键，新增时为空 */
  id?: number
  /** 名称 */
  name?: string
  /** 状态：0-正常、1-停用 */
  status?: number
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type XxxListQuery = ListQuery<XxxQuery>
```

### 7.2 api：`api/index.ts`

每个模块只导出一个命名空间对象，命名 `{business}Api`；对象内方法名直接复用后端 Controller 方法名（`pageList/load/insert/delete/update` 及业务方法），方法顺序尽量与后端保持一致。页面引入多个模块的 API 时通过命名空间区分，不再使用 import alias 规避重名。

```ts
/**
 * @fileoverview Xxx API
 * @description Xxx 接口，方法名与后端 XxxController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Xxx, XxxForm, XxxListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** Xxx API，调用方式：xxxApi.pageList(...) */
export const xxxApi = {
  /**
   * 分页查询 Xxx
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 分页结果
   */
  pageList(query: XxxListQuery): Promise<Response<PageModel<Xxx>>> {
    return request({
      url: '/{module}/{business}/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询 Xxx 详情
   *
   * @param id 主键
   * @returns 详情数据
   */
  load(id: number): Promise<Response<Xxx>> {
    return request({
      url: '/{module}/{business}/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 新增 Xxx
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: XxxForm): Promise<Response<unknown>> {
    return request({
      url: '/{module}/{business}/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除 Xxx（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/{module}/{business}/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新 Xxx
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: XxxForm): Promise<Response<unknown>> {
    return request({
      url: '/{module}/{business}/update',
      method: 'post',
      data
    })
  }
}
```

> 后端方法名不是标准 CRUD 时同样保持一致，例如 `loadByKey`、`markRead`、`updateSort`、`loadRoleRes`；前端只在命名空间内暴露同名方法，不做二次改名。

### 7.3 页面：`pages/index.vue`（script 骨架）

模板部分：搜索表单 + 操作按钮（`v-hasPermi`） + `<el-table>` + `<Pagination>` + `<el-dialog>`；完整范例见 `modules/framework/system/config/pages/index.vue`（平台页面按钮用 `v-hasRole="['admin']"` 控制）。文件头注释按「7.5 注释与 JSDoc」补齐。

```ts
<script setup lang="ts">
defineOptions({ name: 'Xxx' })
import { ref } from 'vue'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import { useEnumOption } from '@/composables/useEnumOption'
import { usePageParams } from '@/composables/usePageParams'
import modal from '@/utils/modal'
import { xxxApi } from '../api'
import type { Xxx, XxxForm, XxxQuery } from '../types'
import type { FormInstance } from 'element-plus'
import type { FormState, TableState } from '@/types'

// ---------------------- ref data ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 ref */
const formRef = ref<FormInstance>() /* 编辑表单 ref */

// 状态选项，由后端枚举接口加载
const { XxxStatusEnum: statusOptions } = useEnumOption('XxxStatusEnum')

// 搜索栏筛选条件与分页参数
const queryParams = ref<XxxQuery>({
  pageNum: 1 /* 当前页码 */,
  pageSize: 10 /* 每页条数 */,
  name: undefined /* 名称，模糊匹配 */,
  status: -1 /* 状态筛选，-1 表示全部 */
})

// 列表数据与勾选状态，勾选结果决定顶部按钮是否可用
const table = ref<TableState<Xxx>>({
  list: [], // 数据列表
  total: 0, // 总条数
  loading: true, // 加载状态
  showSearch: true, // 是否显示搜索栏
  ids: [], // 勾选行主键
  single: true, // 修改按钮是否禁用
  multiple: true // 删除按钮是否禁用
})

// 编辑弹窗状态
const formState = ref<FormState<XxxForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: {}, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('business.xxx.name')]), trigger: 'blur' }]
  }
})

// ---------------------- fun ----------------------

/**
 * 查询 Xxx 分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
  xxxApi.pageList(usePageParams(queryParams)())
    .then((response) => {
      table.value.list = response.data.data
      table.value.total = response.data.total
    })
    .catch(() => {
      // 错误已由请求层提示，继续走到 finally 复位 loading
    })
    .finally(() => {
      table.value.loading = false
    })
}

/**
 * 重置编辑表单
 *
 * resetFields 只会回到表单项首次挂载时的值，因此先复位校验，再覆盖为新增默认值
 */
function reset() {
  formRef.value?.resetFields()
  formState.value.form = {
    id: undefined,
    name: undefined,
    status: 0
  }
}

/** 关闭弹窗，丢弃未提交的编辑内容 */
function cancel() {
  formState.value.visible = false
  reset()
}

/** 搜索：回到第一页后查询 */
function handleQuery() {
  // 筛选条件已变化，回到第一页可避免停留在超出结果范围的页码
  queryParams.value.pageNum = 1
  getList()
}

/** 重置搜索条件后重新查询 */
function resetQuery() {
  queryRef.value?.resetFields()
  handleQuery()
}

/**
 * 状态编码转枚举文案
 *
 * @param status 状态编码
 * @returns 状态文案；未匹配到枚举项时回退显示编码
 */
function statusText(status: number) {
  return statusOptions.value.find((item) => item.code === status)?.title ?? String(status)
}

/**
 * 同步表格勾选结果与顶部按钮可用状态
 *
 * @param selection 当前勾选行
 */
function handleSelectionChange(selection: Xxx[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 打开新增弹窗，表单恢复为新增默认值 */
function handleAdd() {
  reset()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('business.xxx.title')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function handleUpdate(row?: Xxx) {
  const id = row?.id ?? table.value.ids[0]
  // 顶部按钮未勾选或行数据缺少 id 时直接返回，避免无效请求
  if (id == null) return
  reset()
  xxxApi.load(id).then((response) => {
    formState.value.form = response.data
    formState.value.visible = true
    formState.value.title = t('common.titleEdit', [t('business.xxx.title')])
  })
}

/** 校验通过后提交：有 id 走修改，否则新增 */
function submitForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? xxxApi.update(formState.value.form) : xxxApi.insert(formState.value.form)
    request.then(() => {
      modal.msgSuccess(t(isEdit ? 'common.updateSuccess' : 'common.addSuccess'))
      formState.value.visible = false
      getList()
    })
  })
}

/**
 * 删除 Xxx（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function handleDelete(row?: Xxx) {
  const ids = row?.id ?? table.value.ids
  // 无勾选记录时直接返回，避免弹出空删除确认框
  if (ids == null || (Array.isArray(ids) && ids.length === 0)) return
  modal
    .confirm(t('business.xxx.confirmDelete', [Array.isArray(ids) ? ids.join(',') : ids]))
    .then(() => xxxApi.delete(ids))
    .then(() => {
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// ---------------------- page init ----------------------

getList()
</script>
```

> 表单字段较多或含独立校验、提交逻辑时，拆到同目录 `pages/XxxFormDialog.vue`：需要按主键加载详情再打开的弹窗，用 `defineExpose({ open })` 暴露打开方法（父组件 `formDialogRef.value?.open(id)`）；仅展示父级已有数据的弹窗，用 `defineModel('visible')` + 父组件 `v-model:visible`。两种方式都由子组件提交成功后 `emit('success')`，列表页监听后刷新。完整示例见 `modules/framework/system/config/pages/ConfigFormDialog.vue`。

### 7.4 Vue 页面约定

- `script` 除基础 import 外按「ref data → fun → page init」三节组织，节顶注释统一为 `// ---------------------- {功能} ----------------------`；`fun` 内按「列表查询 → 重置 → 搜索 → 勾选 → 新增/修改/提交/删除」排列，与样例保持一致。
- 响应式数据一律 `ref`，禁止 `reactive` 与 `toRefs(data)` 解构；搜索栏、表格状态、表单状态分别收敛为 `queryParams`、`table`、`formState`。
- 列表固定经 `usePageParams(queryParams)()` 把 `pageNum/pageSize` 转 `offset/pagesize`；取 `response.data.data` 与 `response.data.total`，并在 `finally` 中复位 `loading`，避免请求失败后表格一直处于加载态。
- 组件 import 名称与模板标签统一 PascalCase；业务页面按钮权限用 `v-hasPermi="['{module}:{business}:add']"`，平台内置页面按角色用 `v-hasRole="['admin']"`。
- API 统一按 `{business}Api.method(...)` 调用，方法名与后端 Controller 保持一致；一个页面引入多个模块 API 时直接用命名空间区分，禁止用 import alias 改名。
- 页内直接写 `<el-dialog>` 时用 `formState.visible` 控制显隐；拆成独立弹窗组件时，需要按主键加载详情的用 `defineExpose({ open })`，仅展示父级已有数据的用 `defineModel('visible')` + `v-model:visible`；提交成功统一 `emit('success')` 通知列表页刷新。通用能力复用 `@/composables/*`、`@/components`、`@/utils/modal`。
- 表单重置直接用已声明的模板 ref：`queryRef.value?.resetFields()` / `formRef.value?.resetFields()`；搜索栏与编辑表单都要声明 `const xxxRef = ref<FormInstance>()`，不要再包一层按字符串名取 `$refs` 的工具。
- 编辑弹窗重置时**先** `formRef.value?.resetFields()`，**再**把表单数据（页内弹窗的 `formState.value.form` 或独立弹窗内的 `form.value`）覆盖为新增默认值：`resetFields()` 只会回到表单项首次挂载时的值，先赋值会被它覆盖回上一次编辑的数据。

### 7.5 注释与 JSDoc

遵循 `AGENTS.md`「注释规范」。Vue 侧落地：

- `.vue` 文件头用 HTML 注释，必须包含 `@author 作者 yyyy-MM-dd`：

```html
<!--
  配置管理页面
  功能：分页表格 + 搜索 + 新增/修改/删除
  @author xuxueli 2026-11-21
-->
```

- `<script setup>` 中的导出函数、事件处理、Composable 使用 JSDoc；复杂函数补 `@param` / `@returns`。
- 保留 `// ---------------------- ref data ----------------------` 等三段式结构注释。
- 模板区块用 `<!-- 搜索栏 -->` 标注；核心分支用 `//` 说明原因，不逐行注释。

```ts
/**
 * 同步表格勾选结果与顶部按钮可用状态
 *
 * @param selection 当前勾选行
 */
function handleSelectionChange(selection: Xxx[]) { ... }
```

## 八、菜单 / 权限

```sql
SET NAMES utf8mb4;

-- 菜单（type=1；url 同时充当路由 path 与 modules/ 组件定位 key）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, '{businessName}管理', 1, '{module}:{business}', '/{module}/{business}', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

-- 按钮（type=2）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, '{businessName}新增', 2, '{module}:{business}:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, '{businessName}修改', 2, '{module}:{business}:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, '{businessName}删除', 2, '{module}:{business}:remove', '', '', 3, 0, 0, now(), now());

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

- 页面文件 `src/modules/business/{module}/{business}/pages/index.vue` 建好后，`loadView` 按 `url` 自动映射；也支持 `pages/{xxx}.vue`（此时菜单 `url` 写到 `/{module}/{business}/{xxx}`）。**无需改路由代码。**
- 权限标识统一 `{module}:{business}:add|edit|remove`，与按钮 `v-hasPermi` 保持一致；新菜单必须在 `xxl_boot_role_res` 授权。

## 九、枚举 / 字典

- 业务枚举放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 枚举下拉：`const { XxxStatusEnum: statusOptions } = useEnumOption('XxxStatusEnum')`，返回 `Record<string, Ref<EnumOption[]>>`，模板用 `statusOptions`，提交用 `item.code`。
- 数据字典：`const { sys_user_sex } = useDict('sys_user_sex')`；字段映射为 `{ label, value }`。

## 十、i18n（Vue）

- 文案文件：`src/i18n/locales/{zh,en}.json`（单一文件，按域名节点分区，`business.*` 放最后）。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 受 `MessageKey` 类型约束，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`，Element Plus 语言随当前语言切换。
- 新增业务文案 zh/en 成对提交，页面禁止硬编码中文（注释除外）。

## 十一、代码生成器（Vue）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_xxx (...)", "tplWebType": "element-plus-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段（`queryType/htmlType/dictType/isQuery/isList/isInsert/isEdit/isRequired`）→ `preview` 逐文件预览 / `batchGenCode?ids=...` 下载 zip。

产物：

- 后端：`main/java/.../business/{module}/{business}/{model,mapper,service,service/impl,controller}` + `main/resources/mapper/business/{module}/{business}/{Business}Mapper.xml` + `{Business}-init.sql`；
- 前端：`vue/business/{module}/{business}/{types,api,pages}`；
- 字段 `id` 是强依赖；`tplCategory=tree` 时前端出 `index-tree.vue`。

> 解压后按项目目录合并，并做 Vue 专属修正：
> - 模板会生成「导出」按钮与 `exportXxx` 接口，但后端默认没有 `export` 接口：要么补实现，要么删按钮/API；
> - 其余固定缺口（查询条件、校验、i18n、树表）按 `AGENTS.md`「代码生成器」逐项补齐。

## 十二、校验清单

- [ ] 已加载 `xxl-boot-vue`，且未混用 React/单体写法。
- [ ] 注释符合规范：Vue 文件头含 `@author`，函数/核心分支注释齐全，无无意义注释和注释掉的死代码。
- [ ] `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md` 六大块与 SQL 已落盘并同步（模板见 `AGENTS.md`「需求落盘」）。
- [ ] 后端 `mvn -q compile` 通过；接口契约与代码生成补齐项符合 `AGENTS.md`「后端通用规范」「代码生成器」。
- [ ] 前端 types 四件（实体/Query/Form/ListQuery）齐全，api 以 `{business}Api` 命名空间导出且方法名与后端 Controller 对齐，页面三段式 + `ref` 收敛 + `usePageParams`。
- [ ] 按钮 `v-hasPermi`；资源表菜单+按钮已插且已授权；菜单可见、页面能打开。
- [ ] i18n：后端错误文案走 `I18nUtil`，前端页面无硬编码中文（注释除外），语言由后端 `system.i18n.language` 控制，前端已由 `/loadBaseConfig` 同步。
- [ ] SQL 按 `AGENTS.md`「SQL 执行规范」执行，中文无乱码。
- [ ] 联调：列表/新增/修改/删除/搜索可用，无权限按钮隐藏，空参数后端友好提示。

## 十三、参考文件

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- Vue 直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/vue3/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/config/pages/index.vue`
- 页内弹窗样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/config/pages/ConfigFormDialog.vue`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/config/{api,types}/index.ts`
- 组合式函数：`xxl-boot-ui/xxl-boot-ui-vue/src/composables/{usePageParams,useEnumOption,useDict}.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
- 代码生成前端页：`xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/tool/codegen/`
