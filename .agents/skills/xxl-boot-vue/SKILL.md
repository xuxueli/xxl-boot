---
name: xxl-boot-vue
description: 在 XXL-Boot 前后端分离的 Vue3 模式（xxl-boot-ui-vue 端口 3000，Element Plus + TypeScript）下新增或改造业务模块时加载。触发信号：修改 xxl-boot-ui-vue/src/modules、编辑 .vue 页面、新增标准 CRUD 模块、使用 Element Plus/useEnumOption/useDict。React 任务改用 xxl-boot-react；单体任务改用 xxl-boot-monolith。
---

# XXL-Boot · Vue3 分离模式开发 SKILL

> 适用范围：`xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-vue` 的前后端分离业务开发。
>
> 公共契约（设计原则、通用约定、需求落盘、接口通道、数据库/菜单模型、验收）见仓库根 `AGENTS.md`；本文件只维护 Vue 模式差异与业务模块落地模板。
>
> **标准范本**：平台内置 `system/config` 是当前 Vue 侧最新、最完整的标准 CRUD 实现。新增业务模块时，前端以
> `xxl-boot-ui-vue/src/modules/framework/system/config/{types,api,pages}` 为基线，后端以
> `xxl-boot-api/.../framework/{controller/service/mapper/model}` 下的 Config 实现为基线，仅替换命名与业务字段。

## 一、何时使用

| 场景 | 动作 |
|---|---|
| 前端为 Vue3（Element Plus + TS），新增带列表页的标准 CRUD 模块 | 按本文件第四、五节完整落地 |
| 改造现有 `xxl-boot-ui-vue/src/modules/**` 页面 | 按第四节的页面与状态约定对齐，不做无关重构 |
| 只新增/修改 `xxl-boot-api` 接口，不涉及前端 | 取第五节；仍需确认前端形态后再加载对应模式 |
| 前端为 React | 改用 `xxl-boot-react` |
| 改动 `xxl-boot-admin`（FreeMarker） | 改用 `xxl-boot-monolith` |

## 二、模式概览

| 项 | 内容 |
|---|---|
| 运行模式 | 前后端分离 · Vue3 |
| 组成 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-vue` |
| 端口 | api `8090`、vue `3000`（Vite 代理 `/api` → 8090） |
| 技术栈 | Spring Boot + MyBatis；Vue3 + Element Plus + TypeScript + Vite |
| 登录态 | XXL-SSO，登录态存 Redis（需先启动 Redis） |
| 后端落位 | Java `business/{module}/{business}`；Mapper XML `resources/mapper/business/{module}/{business}` |
| 前端落位 | `src/modules/business/{module}/{business}/{types,api,pages}` |
| 页面定位 | 菜单 `url` → `loadView` 按 `pages/index.vue` 映射，无需改路由 |
| 权限模型 | 按钮统一 `v-hasPermi`；平台页用资源表菜单级权限（如 `system:config`），业务页用 `{module}:{business}:add\|edit\|remove`；`v-hasRole` 仅限超管专属入口 |
| 数据库脚本 | `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_vue.sql` |

## 三、工程结构

```text
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…                      ← 平台内置
├── java/com/xxl/boot/api/business/{module}/{business}/    ← 新增业务（与前端双层镜像）
├── resources/mapper/framework/{module}/                   ← 平台内置 Mapper XML
└── resources/mapper/business/{module}/{business}/         ← 业务 Mapper XML

xxl-boot-ui/xxl-boot-ui-vue/src
├── modules/framework/{domain}/{module}/                   ← 平台内置（types + api + pages）
├── modules/business/{module}/{business}/                  ← 新增业务（types + api + pages）
├── composables/                                           ← useEnumOption / useDict
├── components/                                            ← Pagination / RightToolbar / Editor / DictTag…
├── types/index.ts                                         ← Response / PageModel / TableState / FormState
├── directive/                                             ← v-hasPermi / v-hasRole
└── i18n/locales/{zh,en}.json                              ← 文案
```

规则：

- `{module}` 为业务域（父目录），`{business}` 为业务页/实体（子目录），均使用小写；避免父子同名。
- 后端包路径、Mapper XML 路径、前端模块目录三者保持 `{module}/{business}` 镜像。
- 业务代码只落 `business`，不落 `framework`。

## 四、标准业务模块规范（Vue，核心）

> **唯一范本**：`xxl-boot-ui-vue/src/modules/framework/system/config`（`types` / `api` / `pages/index.vue`）。
> 范本与本节冲突时，先以实际代码为准修正本节；新增规范先改范本，再回写本节。
>
> 新模块把 `Config` 替换为 `Xxx`、`system/config` 替换为 `{module}/{business}`，并按业务增删字段。

### 4.0 提炼基线（范本映射）

| 范本 | 提炼出的规范 | 对应章节 |
|---|---|---|
| `system/config/types/index.ts` | 实体 / Query / Form(`Pick`) 三类导出 | 4.3 |
| `system/config/api/index.ts` | `{business}Api` 命名空间、方法顺序、分页在 API 内转换 | 4.4 |
| `system/config/pages/index.vue` | 模板五区、script 四区、交互与状态约定 | 4.5 |
| 后端 `framework/.../system/Config*` | 文件清单、接口契约、Service 校验、Mapper XML | 五 |

复制范本后的替换清单：

| 范本符号 | 新模块替换为 |
|---|---|
| `Config` / `ConfigForm` / `ConfigQuery` | `Xxx` / `XxxForm` / `XxxQuery` |
| `configApi` | `{business}Api`（如 `customerApi`） |
| `ConfigStatusEnum` | `XxxStatusEnum` |
| `system/config` | `{module}/{business}` |
| `system.config.*` | `business.{module}.{business}.*` |
| `v-hasPermi="['system:config']"`（平台页） | `v-hasPermi="['{module}:{business}:add\|edit\|remove']"`（业务页） |

### 4.1 文件清单与职责

| 文件 | 路径 | 职责 | 范本 |
|---|---|---|---|
| types | `src/modules/business/{module}/{business}/types/index.ts` | 实体、搜索参数、表单、列表请求类型 | `system/config/types/index.ts` |
| api | `src/modules/business/{module}/{business}/api/index.ts` | `{business}Api` 命名空间，方法名对齐后端 Controller | `system/config/api/index.ts` |
| view | `src/modules/business/{module}/{business}/pages/index.vue` | 列表页 + 页内编辑弹窗 | `system/config/pages/index.vue` |
| 子页面 | `pages/{sub}.vue` 或 `pages/{sub}/index.vue` | 详情、多页签、复杂独立交互 | `system/message/pages/ReadUsers.vue` |

- 标准 CRUD 的编辑弹窗**保留在 `index.vue`**，用 `formState` 管理，不单独拆文件。
- 只有详情、多页签、复杂独立交互才拆到 `pages/` 下独立组件。
- 页面、接口、类型同模块聚合，没有 barrel 登记；全局基础类型统一从 `@/types` 引用。

### 4.2 命名与路由

| 项 | 规则 | 示例 |
|---|---|---|
| 目录 | `{module}/{business}` 小写 | `demo/customer` |
| 接口路径 | `/{module}/{business}` | `/demo/customer` |
| 菜单 url | `/{module}/{business}` | `/demo/customer` |
| API 命名空间 | `{business}Api` 小驼峰 | `customerApi` |
| 组件名 | `defineOptions({ name: 'Xxx' })`，PascalCase | `Customer` |
| 权限标识 | `{module}:{business}:add\|edit\|remove` | `demo:customer:add` |
| i18n 节点 | `business.{module}.{business}` | `business.demo.customer` |

### 4.3 types：`types/index.ts`

固定三类导出：

| 类型 | 用途 | 约定 |
|---|---|---|
| `Xxx` | 实体，对应后端 Entity/DTO | 字段全部可选；`Date` 对应 `string` |
| `XxxQuery` | 搜索栏 + 列表接口入参 | 分页列表必含 `pageNum`、`pageSize`；树形/不分页接口只需筛选项；筛选项可选；分页字段由 API 内部转换 |
| `XxxForm` | 新增/修改入参 | `Pick<Xxx, 可编辑字段>`，避免重复定义 |

> 多实体模块（如字典类型 + 字典项）在同一个 `types/index.ts` 内按实体分组追加 `XxxItem` / `XxxItemQuery` / `XxxItemForm`；只读模块（如日志）只保留实体与 `XxxQuery`，不要为对称而造无用的 Form。

```ts
/**
 * @fileoverview Xxx 类型定义
 * @description 实体、查询与表单类型，对应后端 Xxx.java
 * @author xuxueli 2026-11-22
 */

/** Xxx 实体（对应后端 Xxx.java） */
export interface Xxx {
  /** 主键 */
  id?: number
  /** 名称 */
  name?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 备注 */
  remark?: string
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索栏查询参数（含分页，前端表单形态） */
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

/** 新增/修改表单：复用实体中的可编辑字段，避免字段定义重复 */
export type XxxForm = Pick<Xxx, 'id' | 'name' | 'status' | 'remark'>
```

注意：

- `XxxForm` 排除 `addTime`、`updateTime`；后端不依赖前端回传时间。
- 搜索参数与表单不要复用同一个类型：搜索含分页、表单不含分页。
- 筛选项在页面有默认值时可声明为可选（`status?: number`），避免 API 或调用方被迫补默认值；默认值只保留在页面初始状态。
- 字段注释写清含义与枚举取值；状态字段统一 `0-正常、1-停用`（按业务可替换，但需写清）。

### 4.4 api：`api/index.ts`

| 规则 | 说明 |
|---|---|
| 导出形态 | 只导出一个 `{business}Api` 对象，页面按 `xxxApi.method(...)` 调用 |
| 方法命名 | 与后端 Controller 方法名一致，不二次改名 |
| 方法顺序 | `pageList / load / [业务方法] / insert / delete / update` |
| 通道 | `pageList/load` 用 `params`；`insert/update/delete` 用 `data` |
| 分页 | 入参收 `XxxQuery`；在 `pageList` 内去掉 `pageNum/pageSize`，替换为后端约定的 `offset/pagesize` |
| 删除 | 接收集合，`data: Array.isArray(ids) ? ids : [ids]` |

平台/特殊模块例外（不得扩散到普通业务模块）：

| 场景 | 例外 |
|---|---|
| 树形模块（组织、资源） | 用 `treeList` 代替 `pageList`，无 `load` 时保留 `load` + `updateSort`，业务方法仍放在 `insert` 之前 |
| 用户模块 | 后端沿用 `/add`，前端方法名保持 `add`，并与后端 Controller 对齐；无 `/load` 时用列表行回填 |
| 只读模块（日志） | 只有 `pageList / delete`，不补 `load/insert/update` |
| 多实体模块（字典） | 先列主实体 `pageList/load`，再列子实体 `itemPageList/itemLoad/itemInsert/itemDelete/itemUpdate` 与查询辅助方法，最后主实体 `insert/delete/update` |
| 代码生成器 | 沿用后端 `/tool/codegen` 的分页键 `pageSize`（非 `pagesize`）与 `detail/createTable/preview` 业务方法 |

```ts
/**
 * @fileoverview Xxx API
 * @description Xxx 接口，方法名与后端 XxxController 对齐
 * @author xuxueli 2026-11-22
 */
import { request } from '@/utils/request'
import type { Xxx, XxxForm, XxxQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** Xxx API，调用方式：xxxApi.pageList(...) */
export const xxxApi = {
  /**
   * 分页查询 Xxx
   *
   * 入参为页面查询对象（pageNum/pageSize + 筛选项），在此过滤前端分页字段，
   * 替换为后端约定的 offset/pagesize。
   *
   * @param query 页面查询条件
   * @returns 分页结果
   */
  pageList(query: XxxQuery): Promise<Response<PageModel<Xxx>>> {
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/{module}/{business}/pageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
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

业务方法（如 `loadByKey`、`markRead`、`updateSort`）插在 `load` 之后、`insert` 之前，命名与后端一致；页面引入多个模块 API 时用命名空间区分，禁止 `import as` 改名。

### 4.5 页面：`pages/index.vue`

#### 4.5.1 模板五区

模板固定按「搜索栏 → 操作按钮 → 数据列表 → 分页 → 编辑弹窗」排列，区块注释保留：

```html
<!--
  Xxx（业务名称）
  功能：分页查询 + 新增/修改/删除
  @author xuxueli 2026-11-22
-->
<template>
  <div class="app-container">
    <!-- 搜索栏 -->
    <el-form :model="queryParams" ref="queryRef" :inline="true" label-width="auto" v-show="table.showSearch">
      <el-form-item :label="t('business.xxx.name')" prop="name">
        <el-input v-model="queryParams.name" :placeholder="t('common.inputPlaceholder', [t('business.xxx.name')])" clearable style="width: 200px" @keyup.enter="handleQuery" />
      </el-form-item>
      <el-form-item :label="t('common.status')" prop="status">
        <el-select v-model="queryParams.status" :placeholder="t('business.xxx.statusPlaceholder')" clearable style="width: 200px">
          <el-option :label="t('common.all')" :value="-1" />
          <el-option v-for="item in statusOptions" :key="item.code" :label="item.title" :value="item.code" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="Search" @click="handleQuery">{{ t('common.search') }}</el-button>
        <el-button icon="Refresh" @click="resetQuery">{{ t('common.reset') }}</el-button>
      </el-form-item>
    </el-form>

    <!-- 操作按钮 -->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="Plus" @click="openCreateForm" v-hasPermi="['{module}:{business}:add']">{{ t('common.add') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="success" plain icon="Edit" :disabled="table.single" @click="openEditForm()" v-hasPermi="['{module}:{business}:edit']">{{ t('common.modify') }}</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button type="danger" plain icon="Delete" :disabled="table.multiple" @click="removeXxx()" v-hasPermi="['{module}:{business}:remove']">{{ t('common.delete') }}</el-button>
      </el-col>
      <RightToolbar v-model:showSearch="table.showSearch" @queryTable="getList" />
    </el-row>

    <!-- 数据列表 -->
    <el-table v-loading="table.loading" :data="table.list" @selection-change="syncSelection">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column :label="t('common.id')" prop="id" align="center" width="80" />
      <el-table-column :label="t('business.xxx.name')" align="center" prop="name" width="180" show-overflow-tooltip />
      <el-table-column :label="t('common.status')" align="center" width="100">
        <template #default="scope">
          <el-tag :type="scope.row.status === 0 ? 'success' : 'danger'" size="small">
            {{ enumTitle(statusOptions, scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('common.remark')" align="center" prop="remark" show-overflow-tooltip />
      <el-table-column :label="t('common.addTime')" align="center" prop="addTime" width="170" />
      <el-table-column :label="t('common.operation')" align="center" width="160" class-name="small-padding fixed-width">
        <template #default="scope">
          <el-button link type="primary" icon="Edit" @click="openEditForm(scope.row)" v-hasPermi="['{module}:{business}:edit']">{{ t('common.modify') }}</el-button>
          <el-button link type="primary" icon="Delete" @click="removeXxx(scope.row)" v-hasPermi="['{module}:{business}:remove']">{{ t('common.delete') }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <Pagination
      v-show="table.total > 0"
      :total="table.total"
      v-model:page="queryParams.pageNum"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 新增或修改对话框 -->
    <el-dialog :title="formState.title" v-model="formState.visible" width="500px" append-to-body :close-on-click-modal="false" @closed="resetForm">
      <el-form ref="formRef" :model="formState.form" :rules="formState.rules" label-width="100px">
        <el-form-item :label="t('business.xxx.name')" prop="name">
          <el-input v-model="formState.form.name" :placeholder="t('common.inputPlaceholder', [t('business.xxx.name')])" clearable />
        </el-form-item>
        <el-form-item :label="t('common.status')">
          <el-radio-group v-model="formState.form.status">
            <el-radio v-for="item in statusOptions" :key="item.code" :value="item.code">{{ item.title }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="t('common.remark')">
          <el-input v-model="formState.form.remark" type="textarea" :placeholder="t('common.inputPlaceholder', [t('common.remark')])" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveForm">{{ t('modal.confirmButton') }}</el-button>
          <el-button @click="closeForm">{{ t('modal.cancelButton') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
```

平台内置页面（`modules/framework/**`）按钮使用菜单级权限，如 `v-hasPermi="['system:config']"`；业务页面使用
`v-hasPermi="['{module}:{business}:add|edit|remove']"`。`v-hasRole="['admin']"` 只用于超管专属入口，不要作为平台页的默认写法。

#### 4.5.2 script 四区

`<script setup lang="ts">` 固定按「响应式数据 → 分页检索 → 数据操作（增删改） → 页面初始化」分区：

```ts
<script setup lang="ts">
defineOptions({ name: 'Xxx' })
import { ref } from 'vue'
import { t } from '@/i18n'
import { Pagination, RightToolbar } from '@/components'
import { useEnumOption, enumTitle } from '@/composables/useEnumOption'
import modal from '@/utils/modal'
import { xxxApi } from '../api'
import type { Xxx, XxxForm, XxxQuery } from '../types'
import type { FormInstance } from 'element-plus'
import type { FormState, TableState } from '@/types'

// ---------------------- 响应式数据 ----------------------

const queryRef = ref<FormInstance>() /* 搜索栏表单 */
const formRef = ref<FormInstance>() /* 编辑表单 */

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

// 编辑表单默认值：新增初始值与每次重置共用
const FORM_DEFAULTS: Readonly<XxxForm> = { status: 0 }

// 编辑弹窗状态
const formState = ref<FormState<XxxForm>>({
  visible: false, // 弹窗显隐
  title: '', // 弹窗标题
  form: { ...FORM_DEFAULTS }, // 表单数据
  rules: {
    // 校验规则
    name: [{ required: true, message: t('common.requiredMsg', [t('business.xxx.name')]), trigger: 'blur' }]
  }
})

// ---------------------- 分页检索 ----------------------

/**
 * 查询 Xxx 分页数据
 *
 * 失败提示由请求层统一处理，此处只负责复位 loading
 */
function getList() {
  table.value.loading = true
  // 分页参数由 API 内部转换为后端约定的 offset/pagesize
  xxxApi.pageList(queryParams.value)
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

// ---------------------- 数据操作（增删改） ----------------------

/**
 * 同步表格勾选结果，驱动批量修改/删除按钮状态
 *
 * @param selection 当前勾选行
 */
function syncSelection(selection: Xxx[]) {
  table.value.ids = selection.map((item) => item.id as number)
  table.value.single = selection.length !== 1
  table.value.multiple = !selection.length
}

/** 重置编辑表单：重置表单数据为默认值 + 清除表单校验状态 */
function resetForm() {
  formState.value.form = { ...FORM_DEFAULTS }
  formRef.value?.clearValidate()
}

/** 打开新增弹窗 */
function openCreateForm() {
  resetForm()
  formState.value.visible = true
  formState.value.title = t('common.titleAdd', [t('business.xxx.title')])
}

/**
 * 打开修改弹窗并回填详情
 *
 * @param row 行数据；顶部按钮调用时为空，此时回退到勾选行
 */
function openEditForm(row?: Xxx) {
  // 行按钮传行数据；顶部按钮取勾选的第一行
  const id = row ? row.id : table.value.ids[0]
  // 缺少 id 时直接返回，避免无效请求或误用勾选行
  if (id == null) return
  resetForm()
  xxxApi.load(id)
    .then((response) => {
      // 记录已被删除时不打开弹窗
      if (!response.data) return
      // 表单只保留可编辑字段，避免把时间/联查字段回传到后端
      const { addTime, updateTime, ...form } = response.data
      formState.value.form = form
      formState.value.visible = true
      formState.value.title = t('common.titleEdit', [t('business.xxx.title')])
    })
    .catch(() => {})
}

/** 校验通过后保存：有 id 走修改，否则新增 */
function saveForm() {
  formRef.value?.validate((valid) => {
    // 校验失败时保持弹窗打开，等待用户修正
    if (!valid) return
    const isEdit = formState.value.form.id != null
    const request = isEdit ? xxxApi.update(formState.value.form) : xxxApi.insert(formState.value.form)
    request
      .then(() => {
        modal.msgSuccess(t(isEdit ? 'common.updateSuccess' : 'common.addSuccess'))
        closeForm()
        getList()
      })
      .catch(() => {})
  })
}

/** 关闭弹窗：重置统一交给 @closed，保证 X / ESC / 按钮三条路径一致 */
function closeForm() {
  formState.value.visible = false
}

/**
 * 删除 Xxx（单条或批量），成功后刷新列表
 *
 * @param row 行数据；顶部按钮调用时为空，此时删除勾选行
 */
function removeXxx(row?: Xxx) {
  // 行按钮只删当前行；顶部按钮删除勾选行
  const ids = row ? (row.id != null ? [row.id] : []) : table.value.ids
  // 无记录可删时直接返回，避免弹出空删除确认框
  if (ids.length === 0) return
  const confirmText = row
    ? t('business.xxx.confirmDelete', [row.name ?? String(row.id)])
    : t('business.xxx.confirmBatchDelete', [ids.length])
  modal
    .confirm(confirmText)
    .then(() => xxxApi.delete(ids))
    .then(() => {
      // 删除当前页最后一条时回退一页，避免停留在空页
      if (table.value.list.length === ids.length && queryParams.value.pageNum > 1) {
        queryParams.value.pageNum -= 1
      }
      getList()
      modal.msgSuccess(t('common.deleteSuccess'))
    })
    .catch(() => {})
}

// ---------------------- 页面初始化 ----------------------

getList()
</script>
```

#### 4.5.3 交互与状态约定

| 主题 | 约定 |
|---|---|
| 响应式 | 一律 `ref`；禁止 `reactive`、`toRefs(data)` 解构 |
| 状态收敛 | 搜索 `queryParams`、表格 `table`、表单 `formState` 三块，不散落 |
| 分页 | 直接传 `queryParams.value`，分页字段由 API 内部转换；取 `response.data.data/total`；`finally` 复位 loading |
| 搜索 | 查询前 `pageNum = 1`；重置用 `queryRef.value?.resetFields()` |
| 编辑表单 | 默认值收敛为 `FORM_DEFAULTS`；重置直接替换对象 + `clearValidate()`；详情回填时剥离 `addTime/updateTime` 与联查字段（`const { addTime, updateTime, ...form } = response.data`） |
| 校验 | 前端 `rules` 与后端校验一致（必填、长度、格式）；不可变字段（如配置 Key）编辑时 `:disabled="formState.form.id != null"` |
| 弹窗 | `:close-on-click-modal="false"`，`@closed="resetForm"`，`closeForm()` 只隐藏 |
| 修改入口 | `openEditForm(row?)`；顶部按钮取勾选行，行按钮传行数据；无 id 直接返回 |
| 删除 | 单条确认展示业务名称（回退主键），批量展示条数；删完当前页最后一条先回退一页 |
| 勾选 | `@selection-change="syncSelection"` 同步 `ids/single/multiple`；列表刷新后如出现残留，可在 `getList` 成功回调显式复位 |
| 请求链 | `load/insert/update/delete` 的 `then` 后补 `catch(() => {})`，错误由请求层提示 |
| 列表主键 | 首列 `prop="id"` 展示数据库主键，文案用 `common.id`（编号/ID），不用 `type="index"`；仅真实行号列（如拖拽排序的字段表）才用 `common.serialNo`（序号） |
| 枚举 | 用 `enumTitle(statusOptions, code)`，禁止页面内重复写 `statusText` |

### 4.6 注释与结构

- `.vue` 文件头用 HTML 注释，包含页面名、功能、`@author 作者 yyyy-MM-dd`。
- 模板区块用 `<!-- 搜索栏 -->`、`<!-- 操作按钮 -->`、`<!-- 数据列表 -->`、`<!-- 分页 -->`、`<!-- 新增或修改对话框 -->`；树表/只读/子页可按业务命名（如 `<!-- 配置列表 -->`），但区块注释必须保留。
- script 保留 `// ---------------------- 响应式数据 ----------------------` 等四段分区。
- 函数用 JSDoc；复杂函数补 `@param` / `@returns`；核心分支用 `//` 说明原因。
- 禁止无意义注释、注释掉的死代码、调试输出。

### 4.7 禁止项

- 禁止在页面内自行拼 `offset/pagesize`（统一由 `api.pageList` 内部转换）。
- 禁止用 `resetFields()` 重置编辑表单（会带回上次编辑值，且不重置未声明 `prop` 的字段）。
- 禁止每个页面重复实现枚举文案查找、删除确认、弹窗状态等通用逻辑。
- 禁止把标准 CRUD 弹窗拆成多份碎片文件；也禁止把详情/多页签硬塞进列表页。
- 禁止用 import alias 规避 API 重名；用命名空间区分。
- 禁止硬编码中文文案。

### 4.8 新模块落地顺序

1. 建 `xxl-boot-spec/{yyyyMMdd}-{business}/plan.md`，确认字段、枚举、权限、页面形态。
2. 建表并落盘 SQL；后端按第五节生成 Entity/Mapper/Service/Controller。
3. 前端复制 `system/config` 三件套，替换命名、路径、字段。
4. 补 i18n `business.{module}.{business}` 节点（zh/en 成对）。
5. 插菜单/按钮并授权，打开页面联调。
6. 按第十一节清单逐项复核。

## 五、后端落位（Vue / React 共用）

> 公共接口契约以 `AGENTS.md`「后端通用规范」为准；本节给出业务模块的文件清单与骨架。后端以
> `framework/.../system/Config*` 为范本。

### 5.1 文件清单

| 文件 | 位置 | 说明 |
|---|---|---|
| `Xxx.java` | `java/.../business/{module}/{business}/model/Xxx.java` | 实体，字段驼峰 |
| `XxxDTO.java` | 同目录 `model/dto/` | 可选；列表需格式化时间/裁剪字段时使用 |
| `XxxAdaptor.java` | 同目录 `model/adaptor/` | 可选；Entity → DTO 转换 |
| `XxxMapper.java` | 同目录 `mapper/` | `insert/delete/update/load/pageList/pageListCount` |
| `XxxMapper.xml` | `resources/mapper/business/{module}/{business}/` | `resultMap` + 动态条件 |
| `XxxService.java` / `XxxServiceImpl.java` | 同目录 `service/(impl/)` | 业务校验与编排 |
| `XxxController.java` | 同目录 `controller/` | `@RestController @RequestMapping("/{module}/{business}")` |

### 5.2 接口契约

| 方法 | 通道 | 入参 | 返回 |
|---|---|---|---|
| `pageList` | GET/POST 均可 | `offset`（默认 0）、`pagesize`（默认 10）、筛选项（状态默认 `-1`） | `Response<PageModel<XxxDTO>>` |
| `load` | GET | `id` | `Response<Xxx>` |
| `insert` | JSON Body | `Xxx` | `Response<String>` |
| `delete` | JSON 裸数组 | `List<Integer> ids` | `Response<String>` |
| `update` | JSON Body | `Xxx`（含 id） | `Response<String>` |

- 全部方法加 `@XxlSso`；方法顺序固定 `pageList / load / insert / delete / update`。
- 用户可见错误文案统一 `I18nUtil.getString("key")`，键维护在
  `xxl-boot-api/src/main/resources/i18n/message_zh.properties` / `message_en.properties`。

### 5.3 Entity / DTO / Adaptor

- Entity 字段与表字段一一对应，驼峰命名；`Date` 字段按代码生成器默认加
  `@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")`。
- 列表需要统一格式化时间或隐藏敏感字段时，新增 DTO + Adaptor（参考 `ConfigDTO` / `ConfigAdaptor`）。
- `serialVersionUID` 可省略；set/get 使用正常方法体，不折叠。

### 5.4 Service 校验

- 空值与必填：`StringTool.isBlank`；集合：`CollectionTool.isEmpty`；格式：`RegexTool.matches`。
- 唯一性字段先查再插/改，返回 `Response.ofFail(I18nUtil.getString("..."))`。
- 更新时先按主键回查：记录不存在、必填缺失、不可变字段（如配置 Key）被修改都要拒绝。
- `pageList` 在 Service 内完成 Entity → DTO；Controller 不写业务规则。
- `insert/update/delete` 按影响行数返回 `Response.ofSuccess()` / `Response.ofFail()`。

### 5.5 Mapper / XML

- Mapper 方法参数用 `@Param` 显式命名；XML 显式 `resultMap`，并抽 `Base_Column_List`。
- `insert/update` 的 `add_time`、`update_time` 用 `NOW()`；`delete` 用 `<foreach>`。
- `pageList` / `pageListCount` 复用同一组 `<if>` 条件，`trim` 处理 `WHERE`，`LIMIT #{offset}, #{pagesize}`。
- 模糊查询：`LIKE CONCAT(CONCAT('%', #{name}), '%')`；状态 `-1` 不过滤。

### 5.6 Controller 骨架

```java
/**
 * Xxx 管理 Controller
 *
 * @author xuxueli 2026-11-22
 */
@RestController
@RequestMapping("/{module}/{business}")
public class XxxController {

    @Resource
    private XxxService xxxService;

    /**
     * 分页查询 Xxx
     *
     * @param offset   偏移量
     * @param pagesize 每页条数
     * @param status   状态筛选，-1 表示全部
     * @param name     名称，模糊匹配
     * @return 分页结果
     */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<XxxDTO>> pageList(
            @RequestParam(required = false, defaultValue = "0") int offset,
            @RequestParam(required = false, defaultValue = "10") int pagesize,
            @RequestParam(required = false, defaultValue = "-1") int status,
            String name) {
        return Response.ofSuccess(xxxService.pageList(status, name, offset, pagesize));
    }

    /**
     * 查询 Xxx 详情
     *
     * @param id 主键
     * @return 详情数据
     */
    @RequestMapping("/load")
    @XxlSso
    public Response<Xxx> load(int id) {
        return xxxService.load(id);
    }

    /**
     * 新增 Xxx
     *
     * @param xxx 表单实体
     * @return 操作结果
     */
    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Xxx xxx) {
        return xxxService.insert(xxx);
    }

    /**
     * 删除 Xxx（支持单条/批量）
     *
     * @param ids 待删除主键集合
     * @return 操作结果
     */
    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestBody List<Integer> ids) {
        return xxxService.delete(ids);
    }

    /**
     * 修改 Xxx
     *
     * @param xxx 表单实体（含主键）
     * @return 操作结果
     */
    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Xxx xxx) {
        return xxxService.update(xxx);
    }
}
```

### 5.7 后端参考文件

- Controller：`xxl-boot-api/src/main/java/com/xxl/boot/api/framework/controller/system/ConfigController.java`
- Service：`.../framework/service/ConfigService.java`、`.../service/impl/ConfigServiceImpl.java`
- Mapper：`.../framework/mapper/system/ConfigMapper.java`、`xxl-boot-api/src/main/resources/mapper/framework/system/ConfigMapper.xml`
- Entity / DTO / Adaptor：`.../framework/model/entity/Config.java`、`.../model/dto/ConfigDTO.java`、`.../model/adaptor/ConfigAdaptor.java`

## 六、菜单、权限与页面定位

### 6.1 菜单 / 按钮 SQL

```sql
SET NAMES utf8mb4;

-- 菜单（type=1；url 同时充当路由 path 与页面定位 key）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, '{businessName}管理', 1, '{module}:{business}', '/{module}/{business}', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

-- 按钮（type=2）
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, '{businessName}新增', 2, '{module}:{business}:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, '{businessName}修改', 2, '{module}:{business}:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, '{businessName}删除', 2, '{module}:{business}:remove', '', '', 3, 0, 0, now(), now());

-- 按钮 ID（多值插入 LAST_INSERT_ID 返回首行，自增连续）
SELECT @btnAddId := LAST_INSERT_ID();
SET @btnEditId = @btnAddId + 1, @btnDelId = @btnAddId + 2;

-- 授权（默认管理员 role_id=1）
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()),
       (1, @btnAddId, now(), now()),
       (1, @btnEditId, now(), now()),
       (1, @btnDelId, now(), now());
```

### 6.2 页面定位

- 菜单 `url='/{module}/{business}'` → `loadView` 匹配 `pages/index.vue`（`loadView` 会自动补 `/index`）。
- 子页面支持 `pages/{sub}.vue`（菜单 `url='/{module}/{business}/{sub}'`）或 `pages/{sub}/index.vue`。
- 页面内的局部弹窗/抽屉用语义化文件名（如 `pages/DictDataDrawer.vue`），不要命名为无意义的 `detail.vue`；它们不会被注册为路由。
- 跨模块共享的详情抽屉/弹窗放 `src/components` 或 `layout/components`，业务模块只引用，不重复实现。
- 页面定位只认 `modules/framework|business/**`，**无需改前端路由代码**。

原则：权限校验优先走 `v-hasPermi`，与资源表 `permission` 一致：
平台页用菜单级权限（`system:config`、`authz:user`、`tool:codegen`），业务页用 `{module}:{business}:add|edit|remove`；
`v-hasRole="['admin']"` 仅用于超管专属入口。新菜单必须在 `xxl_boot_role_res` 授权，否则自定义角色即使有菜单也看不到操作按钮。

## 七、枚举与字典

| 能力 | 用法 | 说明 |
|---|---|---|
| 枚举下拉 | `const { XxxStatusEnum: statusOptions } = useEnumOption('XxxStatusEnum')` | 可一次传多个枚举名 |
| 枚举文案 | `enumTitle(statusOptions, code)` | 编码 → 标题，未匹配回退编码 |
| 数据字典 | `const { sys_user_sex } = useDict('sys_user_sex')` | 返回 `{ label, value }`，带 Pinia 缓存 |

- 后端业务枚举放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 新枚举统一命名为 `XxxStatusEnum`；平台存量 `OrgStatuEnum`、`UserStatuEnum`、`ResourceStatuEnum` 属于历史拼写，调用时按实际类名使用，不要自行改名。
- 下拉选项统一 `:key="item.code" :label="item.title" :value="item.code"`；状态筛选额外提供 `-1` 全部。
- 业务字段能落枚举/字典就不要硬编码数字与文案；标签颜色可按编码映射，文案必须走 `enumTitle`。
- 重置密码等输入弹窗优先用 `modal.prompt`（支持 `inputValidator`），不要直接调用 `ElMessageBox`。

## 八、i18n（Vue）

- 文案文件：`src/i18n/locales/{zh,en}.json`；平台文案按业务域分区（`system.*`、`authz.*`、`tool.*`、`dashboard.*` 等），业务文案按 `business.{module}.{business}.*` 分区。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 由 `zh.json` 推导为 `MessageKey`，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`。
- 禁止在模块顶层（`const/let` 初始化、静态配置对象）直接调用 `t()`：语言切换不会重新执行模块代码；应在组件渲染期或函数内求值（必要时 `useMemo`）。
- 新增业务文案 zh/en 成对提交，页面禁止硬编码中文（注释除外）。

```json
{
  "business": {
    "xxx": {
      "title": "Xxx",
      "name": "名称",
      "statusPlaceholder": "状态",
      "confirmDelete": "是否确认删除\"{0}\"？",
      "confirmBatchDelete": "是否确认删除选中的 {0} 项？"
    }
  }
}
```

通用词优先复用 `common.*`（`add/edit/delete/status/requiredMsg/titleAdd/titleEdit`）与 `common.noun.*`；
业务特有名词才新增节点。

## 九、代码生成器（Vue）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_xxx (...)", "tplWebType": "element-plus-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段（`queryType/htmlType/dictType/isQuery/isList/isInsert/isEdit/isRequired`）
→ `preview` 预览 / `batchGenCode?ids=...` 下载 zip。

> 代码生成器页面本身是生成器控制台，不是标准 CRUD：分页键沿用后端 `pageSize`，弹窗状态为创建/预览，属于 4.4、4.5 的显式例外，不要套用标准模板。

产物：

- 后端：`main/java/.../business/{module}/{business}/{model,mapper,service,service/impl,controller}` +
  `main/resources/mapper/business/{module}/{business}/{Business}Mapper.xml` + `{Business}-init.sql`；
- 前端：`vue/business/{module}/{business}/{types,api,pages}`；
- 字段 `id` 是强依赖；`tplCategory=tree` 时出 `index-tree.vue`。

解压合并后必须修正（生成器只是基线）：

| 缺口 | 修正 |
|---|---|
| 查询条件 | `pageList` 只生成 `offset/pagesize`，按 `isQuery` 补 Controller 参数、Service、Mapper XML `<if>` |
| 导出按钮 | 模板生成「导出」+ `handleExport` → `/export`，但后端不生成该接口；删按钮/方法或补后端实现 |
| 校验 | 只有空值判断；补必填、长度、格式、唯一性与友好提示 |
| i18n | 模板硬编码中文；迁移到 `t()` 与 `business.*` |
| 表单默认值 | 模板未抽 `FORM_DEFAULTS`；按 4.5.2 收敛 |
| 弹窗行为 | 模板缺 `:close-on-click-modal="false"` / `@closed="resetForm"`；补齐 |
| 字段类型 | 确认 `XxxForm` 的 `Pick` 字段与 `isInsert/isEdit` 一致；排除时间字段 |

## 十、初始化与联调

- 数据库：按 `AGENTS.md`「SQL 执行规范」依次执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_vue.sql`。
- 环境：Node 20+、JDK 17+、Maven 3.6+、Redis。
- 数据源：`xxl-boot-api/src/main/resources/application.properties`（默认 `127.0.0.1:3306/xxl_boot`，`root/root_pwd`）；默认账号 `admin`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-vue && npm i && npm run dev`（3000）。
- 校验命令：

```bash
cd xxl-boot-api && mvn -q compile
cd xxl-boot-ui/xxl-boot-ui-vue && npm run type-check && npm run build
```

## 十一、校验清单

**结构与命名**

- [ ] 已加载 `xxl-boot-vue`，未混用 React/单体写法。
- [ ] 目录为 `business/{module}/{business}`，接口路径、菜单 url、权限标识一致。
- [ ] 标准模块只有 `types/api/pages` 三件套；详情/多页签才拆子页面。

**前端**

- [ ] `types` 三类齐全：`Xxx`、`XxxQuery`、`XxxForm`（`Pick` 可编辑字段）；只读/树形/多实体模块按 4.3 使用对应子集。
- [ ] `api` 以 `{business}Api` 导出，方法顺序与后端一致，删除传裸数组；平台例外已按 4.4 核对。
- [ ] 页面模板五区齐全；script 四区齐全；`ref` 收敛为 `queryParams/table/formState`。
- [ ] 列表直接传 `queryParams.value`，分页字段由 API 内部转换；`finally` 复位 loading。
- [ ] 编辑弹窗 `@closed="resetForm"`、`:close-on-click-modal="false"`；重置用 `FORM_DEFAULTS` + `clearValidate()`。
- [ ] 详情回填只提交可编辑字段，已剥离 `addTime/updateTime` 与联查字段。
- [ ] 枚举文案统一走 `enumTitle`，标签颜色可按编码映射；无页面内硬编码状态文案。
- [ ] `v-hasPermi` 与资源表 `permission` 一致（平台菜单级 / 业务按钮级）；`v-hasRole` 只用于超管专属入口；行内操作按钮同样受权限控制。
- [ ] 文案走 `t()`，按业务域分区（`system/authz/tool/business`）zh/en 成对；无硬编码中文。
- [ ] `npm run type-check` 与 `npm run build` 通过。

**后端**

- [ ] `mvn -q compile` 通过；方法顺序 `pageList/load/insert/delete/update`；全部 `@XxlSso`。
- [ ] `pageList` 支持 `isQuery` 字段；Mapper XML 条件与 `pageListCount` 一致。
- [ ] 校验、唯一性、友好提示齐全；错误文案走 `I18nUtil`。
- [ ] Entity/DTO/Adaptor 与表字段一致；时间字段格式统一。

**数据与联调**

- [ ] `plan.md` 六大块与 SQL 已落盘；SQL 含 `SET NAMES utf8mb4;` 且中文无乱码。
- [ ] 菜单/按钮已插库并在 `xxl_boot_role_res` 授权；菜单可见、页面能打开。
- [ ] 列表/新增/修改/删除/搜索可用；无权限按钮隐藏；空参数后端友好提示。
- [ ] 注释符合 `AGENTS.md`：文件头含 `@author`，函数与核心分支注释齐全，无死代码。

## 十二、参考文件

| 用途 | 路径 |
|---|---|
| 前端标准范本 | `xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/system/config/{types,api,pages}` |
| 组合式函数 | `xxl-boot-ui/xxl-boot-ui-vue/src/composables/{useEnumOption,useDict}.ts` |
| 公共组件 | `xxl-boot-ui/xxl-boot-ui-vue/src/components/index.ts` |
| 全局类型 | `xxl-boot-ui/xxl-boot-ui-vue/src/types/index.ts` |
| 权限指令 | `xxl-boot-ui/xxl-boot-ui-vue/src/directive/modules/{hasPermi,hasRole}.ts` |
| i18n | `xxl-boot-ui/xxl-boot-ui-vue/src/i18n/index.ts`、`i18n/locales/{zh,en}.json` |
| 后端范本 | `xxl-boot-api/.../framework/{controller/service/mapper/model}` 下 `Config*` |
| 后端代码生成模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl` |
| Vue 代码生成模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/vue3/*.ftl` |
| 菜单 SQL 模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl` |
| 代码生成前端页 | `xxl-boot-ui/xxl-boot-ui-vue/src/modules/framework/tool/codegen/` |
