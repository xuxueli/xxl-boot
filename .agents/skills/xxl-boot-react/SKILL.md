---
name: xxl-boot-react
description: 在 XXL-Boot 前后端分离的 React 模式（xxl-boot-ui-react 端口 4000，Ant Design ProTable + TypeScript）下新增或改造业务模块时加载。触发信号：修改 xxl-boot-ui-react/src/modules、编辑 .tsx 页面、新增标准 CRUD 模块、使用 ProTable/usePermission/useEnumOption。Vue 任务改用 xxl-boot-vue；单体任务改用 xxl-boot-monolith。
---

# XXL-Boot · React 分离模式开发 SKILL

> 适用范围：`xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-react` 的前后端分离业务开发。
>
> 公共契约（设计原则、通用约定、需求落盘、接口通道、数据库/菜单模型、验收）见仓库根 `AGENTS.md`；本文件只维护 React 模式差异与业务模块落地模板。
>
> **标准范本**：平台内置 `system/config` 是当前 React 侧最新、最完整的标准 CRUD 实现。新增业务模块时，前端以
> `xxl-boot-ui-react/src/modules/framework/system/config/{types,api,pages}` 为基线，后端与 Vue 模式共用同一套
> `xxl-boot-api` 规范，参考 `framework/.../system/Config*`；详情抽屉、关联列表等进阶形态参考 `system/message`。

## 一、何时使用

| 场景 | 动作 |
|---|---|
| 前端为 React（Ant Design ProTable + TS），新增带列表页的标准 CRUD 模块 | 按本文件第四、五节完整落地 |
| 改造现有 `xxl-boot-ui-react/src/modules/**` 页面 | 按第四节的 ProTable/弹窗约定对齐，不做无关重构 |
| 只新增/修改 `xxl-boot-api` 接口，不涉及前端 | 取第五节；仍需确认前端形态后再加载对应模式 |
| 前端为 Vue | 改用 `xxl-boot-vue` |
| 改动 `xxl-boot-admin`（FreeMarker） | 改用 `xxl-boot-monolith` |

React 与 Vue **共用同一个后端 `xxl-boot-api`**，接口契约与后端落位一致。

## 二、模式概览

| 项 | 内容 |
|---|---|
| 运行模式 | 前后端分离 · React |
| 组成 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-react` |
| 端口 | api `8090`、react `4000`（Vite 代理 `/api` → 8090） |
| 技术栈 | Spring Boot + MyBatis；React 19 + Ant Design ProTable + TypeScript + Vite |
| 登录态 | XXL-SSO，登录态存 Redis（需先启动 Redis） |
| 后端落位 | Java `business/{module}/{business}`；Mapper XML `resources/mapper/business/{module}/{business}` |
| 前端落位 | `src/modules/business/{module}/{business}/{types,api,pages}` |
| 页面定位 | 菜单 `url` → `loadView` 只匹配 `pages/**/index.tsx`，无需改路由 |
| 权限模型 | 按钮统一 `hasPermi`；平台页用资源表菜单级权限（如 `system:config`），业务页用 `{module}:{business}:add\|edit\|remove`；`hasRole` 仅限超管专属入口 |
| 数据请求 | `@/utils/request` + TanStack Query（仅枚举等缓存场景） |
| 数据库脚本 | `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_react.sql` |

## 三、工程结构

```text
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…                      ← 平台内置
├── java/com/xxl/boot/api/business/{module}/{business}/    ← 新增业务（与前端双层镜像）
├── resources/mapper/framework/{module}/                   ← 平台内置 Mapper XML
└── resources/mapper/business/{module}/{business}/         ← 业务 Mapper XML

xxl-boot-ui/xxl-boot-ui-react/src
├── modules/framework/{domain}/{module}/                   ← 平台内置（types + api + pages）
├── modules/business/{module}/{business}/                  ← 新增业务（types + api + pages）
├── hooks/                                                 ← useEnumOption / usePermission
├── components/                                            ← Editor / TreePanel / IconSelect…
├── types/index.d.ts                                       ← 全局 API.Response / API.PageModel / API.EnumItem 等
├── utils/                                                 ← request / common
├── assets/styles/global.css                               ← 全局组件样式（含 ProTable 工具栏）
├── router/index.tsx                                       ← loadView（只识别 pages/**/index.tsx）
└── i18n/locales/{zh,en}.json                              ← 文案
```

规则：

- `{module}` 为业务域（父目录），`{business}` 为业务页/实体（子目录），均使用小写；避免父子同名。
- 后端包路径、Mapper XML 路径、前端模块目录三者保持 `{module}/{business}` 镜像。
- 业务代码只落 `business`，不落 `framework`。

## 四、标准业务模块规范（React，核心）

> **唯一范本**：`xxl-boot-ui-react/src/modules/framework/system/config`（`types` / `api` / `pages/index.tsx` /
> `pages/FormModal.tsx`）。范本与本节冲突时，先以实际代码为准修正本节；新增规范先改范本，再回写本节。
>
> 新模块把 `Config` 替换为 `Xxx`、`system/config` 替换为 `{module}/{business}`，并按业务增删字段。

### 4.0 提炼基线（范本映射）

| 范本 | 提炼出的规范 | 对应章节 |
|---|---|---|
| `system/config/types/index.d.ts` | `declare namespace API` 实体、查询（`XxxQuery`）与表单类型 | 4.3 |
| `system/config/api/index.ts` | `{business}Api` 命名空间、方法顺序、分页参数在 API 内转换 | 4.4 |
| `system/config/pages/index.tsx` | `PageContainer + ProTable`、分区注释、勾选、工具栏、删除 | 4.5 |
| `system/config/pages/FormModal.tsx` | 受控 `ModalForm`、内联 props、提交与复位、禁止遮罩关闭 | 4.6 |
| `src/assets/styles/global.css` | ProTable 工具栏全局左对齐，页面不再各自维护样式 | 4.5 |
| `system/message/pages/{MessageDetail,ReadUsersDialog}` | 受控 Drawer / Modal + Table（进阶） | 4.7 |
| 后端 `framework/.../system/Config*` | 文件清单、接口契约、校验、Mapper XML | 五 |

复制范本后的替换清单：

| 范本符号 | 新模块替换为 |
|---|---|
| `Config` / `API.Config` | `Xxx` / `API.Xxx` |
| `configApi` | `{business}Api`（如 `customerApi`） |
| `ConfigStatusEnum` | `XxxStatusEnum` |
| `system/config` | `{module}/{business}` |
| `system.config.*` | `business.{module}.{business}.*` |
| `hasPermi('system:config')`（平台页） | `hasPermi('{module}:{business}:add\|edit\|remove')`（业务页） |

### 4.1 文件清单与职责

| 文件 | 路径 | 职责 | 范本 |
|---|---|---|---|
| types | `src/modules/business/{module}/{business}/types/index.d.ts` | 实体、关联实体、`XxxQuery` / `XxxForm` | `system/config/types/index.d.ts` |
| api | `src/modules/business/{module}/{business}/api/index.ts` | `{business}Api` 命名空间，方法名对齐后端 Controller | `system/config/api/index.ts` |
| view | `src/modules/business/{module}/{business}/pages/index.tsx` | `PageContainer + ProTable` 列表页 | `system/config/pages/index.tsx` |
| 表单弹窗 | `pages/FormModal.tsx` | `ModalForm` 新增/修改（独立文件） | `system/config/pages/FormModal.tsx` |
| 子页面 | `pages/{Sub}/index.tsx` | 详情抽屉、已读列表等可路由子页 | `system/message/pages/{MessageDetail,ReadUsersDialog}/index.tsx` |

- 列表页只负责查询、勾选、顶部操作和弹窗编排；表单放 `FormModal`，详情/关联列表放独立组件。
- 与路由无关的局部组件（如 `FormModal.tsx`）可以平铺在 `pages/` 下；**需要菜单直达的子页必须是
  `pages/{Sub}/index.tsx`**。
- 页面、接口、类型同模块聚合；全局基础类型从 `API` 命名空间直接使用，无需 import。

### 4.2 命名与路由

| 项 | 规则 | 示例 |
|---|---|---|
| 目录 | `{module}/{business}` 小写 | `demo/customer` |
| 接口路径 | `/{module}/{business}` | `/demo/customer` |
| 菜单 url | `/{module}/{business}` | `/demo/customer` |
| API 命名空间 | `{business}Api` 小驼峰 | `customerApi` |
| 组件名 | 普通函数 + PascalCase；模块内局部组件省略模块前缀 | `CustomerList` / `FormModal` |
| 局部组件文件 | 模块目录内不重复模块名 | `pages/FormModal.tsx`（非 `CustomerFormModal.tsx`） |
| 权限标识 | `{module}:{business}:add\|edit\|remove` | `demo:customer:add` |
| i18n 节点 | `business.{module}.{business}` | `business.demo.customer` |

### 4.3 types：`types/index.d.ts`

| 规则 | 说明 |
|---|---|
| 命名空间 | 优先 `declare namespace API { ... }`，多文件自动合并；文件含 `import` 时必须用 `declare global { namespace API { ... } }` 并保留 `export {}` |
| 实体 | `type Xxx = { ... }`，对应后端 Entity/DTO；字段可选 |
| 关联实体 | 同一文件内追加 `type XxxItem` / `type XxxRead` |
| 查询类型 | 分页列表只保留 `API.XxxQuery`（`current/pageSize` + 筛选项），分页字段在 `api.pageList` 内转换，不再派生 `ListQuery` 等中间类型；树形/不分页接口只保留筛选项 |
| 表单类型 | 可编辑模块一律抽 `API.XxxForm = Pick<Xxx, 可编辑字段>`，避免页面回传 `addTime/updateTime` 等只读字段；只读模块不造 Form |

```ts
/**
 * @fileoverview Xxx 类型定义
 * @description 对应后端 Xxx 实体
 * @author xuxueli 2026-11-22
 */
declare namespace API {
  /** Xxx 实体 */
  type Xxx = {
    /** 主键 */
    id?: number;
    /** 名称 */
    name?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 备注 */
    remark?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** Xxx 列表查询条件：ProTable 分页 + 搜索栏字段 */
  type XxxQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 名称，模糊匹配 */
    name?: string;
    /** 状态筛选：不传或 -1 表示全部 */
    status?: number;
  };

  /** Xxx 新增/修改表单：仅保留可编辑字段，避免回传只读字段 */
  type XxxForm = Pick<Xxx, 'id' | 'name' | 'status' | 'remark'>;
}
```

注意：

- `types/index.d.ts` 由 `tsconfig.json` 的 `include` 自动纳入，无需在页面 import。
- 后端时间字段统一 `string`；前端只展示或回传，不做 Date 运算。
- 筛选项在页面有默认值时可声明为可选，默认值只放页面/ProTable；不要为对称给只读模块补 Form。
- 新增关联类型时保持同一文件聚合，避免跨模块引用类型文件。

### 4.4 api：`api/index.ts`

| 规则 | 说明 |
|---|---|
| 导出形态 | 只导出一个 `{business}Api` 对象，页面按 `xxxApi.method(...)` 调用 |
| 方法命名 | 与后端 Controller 方法名一致，不二次改名 |
| 方法顺序 | `pageList / load / [业务方法] / insert / delete / update` |
| 返回类型 | `request<API.Response<API.PageModel<API.Xxx>>>(...)` |
| 分页 | 入参 `API.XxxQuery`；在 `pageList` 内去掉 `current/pageSize`，替换为后端约定的 `offset/pagesize`，页面直接传 ProTable 参数 |
| 表单 | `insert/update` 入参 `API.XxxForm` |
| 删除 | 接收集合，`data: Array.isArray(ids) ? ids : [ids]` |

平台/特殊模块例外（不得扩散到普通业务模块）：

| 场景 | 例外 |
|---|---|
| 树形模块（组织、资源） | 用 `treeList` 代替 `pageList`，业务方法 `updateSort` 放在 `insert` 之前，表格 `pagination={false}` 且可无序号列 |
| 用户模块 | 后端沿用 `/add`，前端方法名保持 `add`；无 `/load` 时用列表行回填 |
| 只读模块（日志） | 只有 `pageList / delete`，不补 `load/insert/update` |
| 多实体模块（字典） | 先列主实体 `pageList/load`，再列子实体 `itemPageList/itemLoad/itemInsert/itemDelete/itemUpdate` 与查询辅助方法，最后主实体 `insert/delete/update` |
| 代码生成器 | 沿用后端 `/tool/codegen` 的分页键 `pageSize`（非 `pagesize`）与 `detail/createTable/preview` 业务方法 |

```ts
/**
 * @fileoverview Xxx API
 * @description Xxx 接口，方法名与后端 XxxController 对齐
 * @author xuxueli 2026-11-22
 */
import { request } from '@/utils/request';

/** Xxx API，调用方式：xxxApi.pageList(...) */
export const xxxApi = {
  /**
   * 分页查询 Xxx
   *
   * 入参为页面查询对象（current/pageSize + 筛选项），在此过滤前端分页字段，
   * 替换为后端约定的 offset/pagesize。
   *
   * @param query 页面查询条件
   * @returns 分页结果
   */
  pageList(query: API.XxxQuery) {
    const { current = 1, pageSize = 10, ...search } = query;
    return request<API.Response<API.PageModel<API.Xxx>>>(
      '/{module}/{business}/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...search,
        },
      },
    );
  },

  /**
   * 查询 Xxx 详情
   *
   * @param id 主键
   * @returns 详情数据
   */
  load(id: number) {
    return request<API.Response<API.Xxx>>('/{module}/{business}/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 新增 Xxx
   *
   * @param data 表单数据（仅可编辑字段）
   * @returns 保存结果
   */
  insert(data: API.XxxForm) {
    return request<API.Response<unknown>>('/{module}/{business}/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除 Xxx（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/{module}/{business}/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新 Xxx
   *
   * @param data 表单数据（仅可编辑字段，含主键）
   * @returns 保存结果
   */
  update(data: API.XxxForm) {
    return request<API.Response<unknown>>('/{module}/{business}/update', {
      method: 'POST',
      data,
    });
  },
};
```

业务方法（如 `loadByKey`、`markRead`、`getReadUsers`）插在 `load` 之后、`insert` 之前，命名与后端一致；
页面引入多个模块 API 时用命名空间区分，禁止 `import as` 改名。

### 4.5 页面：`pages/index.tsx`

`PageContainer + ProTable` 是唯一列表方案；不引入 `ahooks/useRequest`，也不另写表格封装。

```tsx
/**
 * @fileoverview Xxx 管理
 * @description 分页表格 + 新增/修改 + 单条/批量删除
 * @author xuxueli 2026-11-22
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useRef, useState } from 'react';
import { t } from '@/i18n';
import { usePermission } from '@/hooks/usePermission';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { xxxApi } from '@/modules/{module}/{business}/api';
import FormModal from './FormModal';

/** Xxx 列表页 */
const XxxList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [formOpen, setFormOpen] = useState(false); /* 表单弹窗显隐 */
  const [formCurrent, setFormCurrent] = useState<API.Xxx | null>(
    null,
  ); /* 当前编辑行，null 表示新增 */
  const [selectedIds, setSelectedIds] = useState<number[]>([]); /* 勾选行主键 */

  // 状态枚举：valueEnum 供搜索下拉，render 中的 Tag 文案由 common 文案兜底
  const statusOptions = useEnumOption('XxxStatusEnum');
  const statusValueEnum = toValueEnum(statusOptions);

  // ---------------------- 数据操作 ----------------------

  /**
   * 删除 Xxx（单条或批量）
   *
   * @param row 行数据，省略时删除勾选行
   */
  const handleDelete = (row?: API.Xxx) => {
    // 行按钮只删当前行；顶部按钮删除勾选行
    const ids = row ? (row.id != null ? [row.id] : []) : selectedIds;
    // 无可删记录时直接返回，避免弹出空确认框
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: row
        ? t('business.xxx.confirmDelete', [row.name ?? String(row.id)])
        : t('business.xxx.confirmBatchDelete', [ids.length]),
      onOk: async () => {
        await xxxApi.delete(ids);
        message.success(t('common.deleteSuccess'));
        // 删除后清空勾选，避免批量按钮仍处于可用态
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  // ---------------------- 表格“列”定义 ----------------------

  /** 表格列：主键、名称、状态、添加时间、操作 */
  const columns: ProColumns<API.Xxx>[] = [
    { title: t('common.id'), dataIndex: 'id', search: false, width: 80 },
    {
      title: t('business.xxx.name'),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 90,
      valueType: 'select',
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    {
      title: t('common.addTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 140,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setFormCurrent(record);
            setFormOpen(true);
          }}
        >
          <EditOutlined /> {t('common.modify')}
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> {t('common.delete')}
        </a>,
      ],
    },
  ];

  // ---------------------- 数据列表渲染 ----------------------

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Xxx>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        /* 搜索区：查询/重置按钮靠右 */
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        /* 列表数据查询：分页参数由 API 内部转换为后端约定的 offset/pagesize */
        request={async (params) => {
          const res = await xxxApi.pageList(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        /* 工具栏：新增、批量删除 */
        toolBarRender={() => [
          hasPermi('{module}:{business}:add') && (
            <Button
              key="add"
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setFormCurrent(null);
                setFormOpen(true);
              }}
            >
              {t('common.add')}
            </Button>
          ),
          hasPermi('{module}:{business}:remove') && (
            <Button
              key="delete"
              danger
              icon={<DeleteOutlined />}
              disabled={!selectedIds.length}
              onClick={() => handleDelete()}
            >
              {t('common.delete')}
            </Button>
          ),
        ]}
        /* 行勾选：同步主键，供批量删除使用 */
        rowSelection={{
          onChange: (_keys, rows) => {
            setSelectedIds(rows.map((r) => r.id as number));
          },
        }}
        /* 分页配置 */
        pagination={{
          defaultPageSize: 10,
          pageSizeOptions: [10, 20, 50, 100],
          showSizeChanger: true,
          showQuickJumper: false,
          showTotal: (total) => t('common.paginationTotal', [total]),
        }}
        /* 默认批量选择提示隐藏 */
        tableAlertRender={false}
      />
      {/* 新增/编辑弹窗 */}
      <FormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default XxxList;
```

约定：

| 主题 | 约定 |
|---|---|
| 列表容器 | `PageContainer ghost title={false}` + `ProTable` |
| 分区注释 | 按「页面状态 → 数据操作 → 表格“列”定义 → 数据列表渲染」分区，弹窗编排放页面末尾 |
| 请求 | `request` 内直接 `xxxApi.pageList(params)`，分页字段由 API 统一转换；返回 `{ data, total, success: true }`，数据取 `res.data?.data`，总数取 `res.data?.total` |
| 搜索 | `search={{ optionRender: (_, __, dom) => [...dom.reverse()] }}` 让查询/重置靠右或按现有页面保持一致；搜索/重置由 ProTable 自动回到第 1 页 |
| 主键 | 首列 `dataIndex: 'id'`，展示数据库主键，文案用 `common.id`（编号/ID），不用 `render` 生成页内序号；仅真实行号列（如已读用户弹窗 `i+1`）才用 `common.serialNo`；树表可无主键列 |
| 状态列 | `valueEnum` 负责筛选下拉，`render` 负责 Tag 展示；需要行内快速切换时可用受控 `Switch`（如用户管理），但必须受权限控制 |
| 刷新 | 新增/修改/删除成功后统一 `actionRef.current?.reload()` |
| 勾选 | `rowSelection.onChange` 同步 `selectedIds`；删除后清空 |
| 分页 | `pagination` 固定 `defaultPageSize: 10` + `showSizeChanger` + `showTotal`；树表 `pagination={false}` |
| 行内操作 | 工具栏与操作列按钮都必须按 `hasPermi` 隐藏或禁用，不能只控工具栏 |
| 样式 | ProTable 工具栏「按钮靠左、设置项靠右」已由 `src/assets/styles/global.css` 全局统一，页面不要再写 `useStyles` 或包裹 div；其他页面级定制用 `antd-style` 的 `createStyles`，不要新增全局覆盖 |

平台内置页（`modules/framework/**`）用菜单级权限，如 `hasPermi('system:config')`；业务页把工具栏、操作列的条件替换为
`hasPermi('{module}:{business}:add|edit|remove')`。`hasRole('admin')` 只用于超管专属入口，不要作为平台页默认写法。

### 4.6 表单弹窗：`pages/FormModal.tsx`

新增/修改统一用受控 `ModalForm`，通过 props 传入当前行与成功回调，不在父页面用 ref 暴露 `open()`：

```tsx
/**
 * @fileoverview FormModal（Xxx 新增/编辑弹窗）
 * @description 新增/编辑表单
 * @author xuxueli 2026-11-22
 */
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { t } from '@/i18n';
import { xxxApi } from '@/modules/{module}/{business}/api';

// ---------------------- 表单组件 ----------------------

/** Xxx 新增/编辑弹窗 */
function FormModal({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  /** 弹窗显隐 */
  open: boolean;
  /** 显隐变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 当前编辑行，null 表示新增 */
  current?: API.Xxx | null;
  /** 保存成功回调 */
  onSuccess?: () => void;
}) {
  const { message } = App.useApp();

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：决定弹窗标题、不可变字段与提交分支
  const isEdit = current?.id != null;

  // ---------------------- 数据操作 ----------------------

  /**
   * 提交表单：有主键走修改，否则新增
   *
   * @param values 表单值，仅包含可编辑字段
   * @returns 是否提交成功
   */
  const handleFinish = async (values: API.XxxForm) => {
    if (isEdit) {
      await xxxApi.update({ ...values, id: current?.id });
    } else {
      await xxxApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.XxxForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('business.xxx.title')])
          : t('common.titleAdd', [t('business.xxx.title')])
      }
      width={640}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, mask: { closable: false } }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      {/* 基础信息：名称 */}
      <ProFormText
        name="name"
        label={t('business.xxx.name')}
        placeholder={t('common.inputPlaceholder', [t('business.xxx.name')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('business.xxx.name')]) }]}
      />

      {/* 状态与备注 */}
      <ProFormRadio.Group
        name="status"
        label={t('common.status')}
        options={[
          { value: 0, label: t('common.normal') },
          { value: 1, label: t('common.disabled') },
        ]}
      />
      <ProFormTextArea
        name="remark"
        label={t('common.remark')}
        placeholder={t('common.inputPlaceholder', [t('common.remark')])}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
}

export default FormModal;
```

约定：

- `modalProps={{ destroyOnHidden: true, mask: { closable: false } }}`：关闭后销毁并复位，且禁止点击遮罩关闭，避免误触丢失已填内容。
- 派生 `isEdit = current?.id != null`，统一驱动标题、不可变字段与提交分支，避免多处重复判断。
- 代码按 `表单组件 / 表单状态 / 数据操作 / 表单渲染` 分区注释，字段用 JSX 注释分组。
- 表单校验用 `rules`；错误提示走 `t('common.requiredMsg', [...])`。
- 表单类型 `API.XxxForm` 已排除 `addTime/updateTime` 等只读字段，提交时无需手工删除。
- 平台内置页标题优先复用 `common.noun.*`（如 `common.noun.config`）；业务页使用 `business.{module}.{business}.title`。
- 保存成功统一 `message.success(t('common.saveSuccess'))`；宽度按字段数量取 500/640/780，不强制固定值。
- 业务不可变字段（如编码/Key）在修改时 `disabled={isEdit}`，与后端校验保持一致。
- 无权限的提交按钮由父页面控制入口；弹窗本身不重复做权限判断。
- 字段多、需要分组时用 `ProForm.Group` / `Row + Col`；富文本用 `@/components` 的 `Editor`。

### 4.7 子页面：详情 / 关联列表

- 详情优先用 `Drawer`，关联列表用 `Modal + Table`，均为受控 `open` + `onClose`。
- 打开时按 `open`/`payload` 触发 `useEffect` 加载；关闭时清空本地数据。
- 参考 `system/message/pages/MessageDetail/index.tsx`（Drawer + `useEffect` + `destroyOnHidden`）与
  `pages/ReadUsersDialog/index.tsx`（Modal + Table 分页）。
- 需要菜单直达的子页必须是 `pages/{Sub}/index.tsx`（`loadView` 只识别 `index.tsx`）。
- 仅局部复用的弹窗/抽屉推荐平铺为 `pages/{Sub}.tsx`，也允许按 `pages/{Sub}/index.tsx` 分组；两者都不会自动成为路由，除非菜单 `url` 指向它。

### 4.8 组件与 Hooks 约定

| 主题 | 约定 |
|---|---|
| 组件声明 | 普通函数 + 显式 props 类型；仅本文件使用时内联，复杂详情/抽屉可抽未导出的 `interface`；禁止 `React.FC`/`forwardRef`/`propTypes`/函数组件 `defaultProps` |
| React 导入 | `jsx: react-jsx`，无需为 JSX 引入 React；用到 `React.ReactNode` 等类型时按需导入 |
| 状态 | 局部 `useState`；派生数据用 `useMemo`；不引入额外状态库 |
| 数据请求 | 交互类页面用 `useState + request`；只读聚合页（如 dashboard）可用 TanStack Query 的 `useQuery` 缓存 |
| 提示 | `App.useApp().message` / `App.useApp().modal`；不用静态 `message.xxx` |
| 异常 | 请求失败由 `@/utils/request` 统一提示；页面 `await` 失败时保留弹窗，不重复弹错 |
| 权限 | `usePermission().hasPermi / hasRole` |
| 枚举 | `useEnumOption('XxxEnum')` → `toValueEnum`（表格列）/ `toSelectOptions`（Select/ProFormSelect） |
| 字典 | 无 React 版 `useDict`；用 `dictApi.loadDictItem(type)` + `useEffect/useState` 或 ProForm `request` |
| 复用 | 优先 `@/hooks`、`@/components`、`@/utils`（请求 `request`）；同一逻辑第三次出现才新增 Hook |

### 4.9 注释与结构

- 文件头用 JSDoc：`@fileoverview` + 功能 + `@description`（可选）+ `@author 作者 yyyy-MM-dd`。
- 组件、API 函数、Hook 用 JSDoc；props 字段用行内 `/** ... */` 注释。
- 核心分支用 `//` 说明原因；简单内联回调不强制 JSDoc。
- 列表页/弹窗用 `// ---------------------- 分区名 ----------------------` 分区：
  - 列表页固定「页面状态 / 数据操作 / 表格“列”定义 / 数据列表渲染」；
  - 弹窗固定「表单组件 / 表单状态 / 数据操作 / 表单渲染」；
  - 树表、只读页、子页可省略不适用的分区，但保留的分区注释名称保持一致；
  - JSX 内用 `{/* ... */}` 给字段/区域分组。
- 保留 `PageContainer`、`ProTable`、弹窗等关键逻辑的区块注释；禁止无意义注释与注释掉的死代码。

### 4.10 禁止项

- 禁止使用项目未安装的依赖（如 `ahooks`）。
- 禁止另写 `fetch/axios` 封装或第二套表格组件。
- 禁止 `React.FC`、`forwardRef`、`propTypes`、函数组件 `defaultProps`。
- 禁止在页面内直接操作 `res.data` 之外的原始响应；统一 `res.data?.data` / `res.data?.total`。
- 禁止用 ref 暴露 `open()` 等命令式弹窗方法；一律受控 `open`。
- 禁止硬编码中文文案；统一 `t()`。

### 4.11 新模块落地顺序

1. 建 `xxl-boot-spec/{yyyyMMdd}-{business}/plan.md`，确认字段、枚举、权限、页面形态。
2. 建表并落盘 SQL；后端按第五节生成 Entity/Mapper/Service/Controller。
3. 前端复制 `system/config` 的 `types/api/pages` + `FormModal`，替换命名、路径、字段；分页参数在 API 内转换，不再新增页面级工具栏样式。
4. 补 i18n `business.{module}.{business}` 节点（zh/en 成对）。
5. 插菜单/按钮并授权，打开页面联调。
6. 按第十一节清单逐项复核。

## 五、后端落位（React / Vue 共用）

> 后端与 Vue 模式完全一致（前端形态不影响后端契约），权威契约见 `AGENTS.md`「后端通用规范」；
> 完整骨架直接对照 `framework/.../system/Config*` 实现。本节只列 React 任务必须核对的要点。

### 5.1 文件清单

| 文件 | 位置 |
|---|---|
| `Xxx.java` | `java/.../business/{module}/{business}/model/Xxx.java` |
| `XxxDTO.java` / `XxxAdaptor.java` | 同目录 `model/dto/`、`model/adaptor/`（可选，列表展示用） |
| `XxxMapper.java` | 同目录 `mapper/XxxMapper.java` |
| `XxxMapper.xml` | `resources/mapper/business/{module}/{business}/XxxMapper.xml` |
| `XxxService.java` / `XxxServiceImpl.java` | 同目录 `service/(impl/)` |
| `XxxController.java` | 同目录 `controller/XxxController.java` |

### 5.2 接口契约

| 方法 | 通道 | 入参 | 返回 |
|---|---|---|---|
| `pageList` | GET/POST 均可 | `offset`（默认 0）、`pagesize`（默认 10）、筛选项（状态默认 `-1`） | `Response<PageModel<XxxDTO>>` |
| `load` | GET | `id` | `Response<Xxx>` |
| `insert` | JSON Body | `Xxx` | `Response<String>` |
| `delete` | JSON 裸数组 | `List<Integer> ids` | `Response<String>` |
| `update` | JSON Body | `Xxx`（含 id） | `Response<String>` |

### 5.3 核对要点

- 全部方法 `@XxlSso`；方法顺序 `pageList / load / insert / delete / update`；Controller 不写业务规则。
- Entity 字段与表一致；`Date` 加 `@JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss", timezone = "GMT+8")`。
- Mapper XML 显式 `resultMap` + `Base_Column_List`；`add_time/update_time` 用 `NOW()`；查询条件用 `<if>`。
- 校验（必填、格式、唯一性）与错误文案走 `I18nUtil`；键维护在 `xxl-boot-api/src/main/resources/i18n/message_{zh,en}.properties`。
- 更新时先按主键回查：记录不存在、必填缺失、不可变字段（如配置 Key）被修改都要拒绝。
- 列表需要格式化时间或裁剪字段时加 DTO + Adaptor（参考 `ConfigDTO` / `ConfigAdaptor`）。

后端范本：

- `xxl-boot-api/src/main/java/com/xxl/boot/api/framework/controller/system/ConfigController.java`
- `.../framework/service/impl/ConfigServiceImpl.java`
- `.../framework/mapper/system/ConfigMapper.java`
- `xxl-boot-api/src/main/resources/mapper/framework/system/ConfigMapper.xml`
- `.../framework/model/entity/Config.java`、`model/dto/ConfigDTO.java`、`model/adaptor/ConfigAdaptor.java`

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

- `loadView` 的模块 glob 为 `@/modules/**/index.tsx`，且只匹配 `{url}/index`：
  - 菜单 `url='/{module}/{business}'` → `pages/index.tsx`；
  - 子菜单 `url='/{module}/{business}/{sub}'` → `pages/{sub}/index.tsx`。
- 局部组件（如 `pages/FormModal.tsx`）不会注册为路由，只能被页面 import；按 `pages/{Sub}/index.tsx` 分组的局部组件同样不会自动成为路由。
- 页面定位只认 `modules/framework|business/**`，**无需改前端路由代码**。

原则：权限校验优先走 `hasPermi`，与资源表 `permission` 一致：
平台页用菜单级权限（`system:config`、`authz:user`、`tool:codegen`），业务页用 `{module}:{business}:add|edit|remove`；
`hasRole('admin')` 仅用于超管专属入口。新菜单必须在 `xxl_boot_role_res` 授权，否则自定义角色即使有菜单也看不到操作按钮。

## 七、枚举与字典

| 能力 | 用法 | 说明 |
|---|---|---|
| 枚举选项 | `const statusOptions = useEnumOption('XxxStatusEnum')` | 每次加载一个枚举，TanStack Query 永久缓存 |
| 表格筛选/展示 | `toValueEnum(statusOptions)` | 供 `ProColumns.valueEnum` |
| 下拉选项 | `toSelectOptions(statusOptions)` | 供 `Select` / `ProFormSelect.options` |
| 数据字典 | `dictApi.loadDictItem(type)` + `useEffect/useState` | 平台无 React 版 `useDict` |

- 后端业务枚举放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 新枚举统一命名为 `XxxStatusEnum`；平台存量 `OrgStatuEnum`、`UserStatuEnum`、`ResourceStatuEnum` 属于历史拼写，按实际类名使用。
- 状态筛选需要“全部”时，由 ProTable 的空值语义处理，不要额外造 `-1` 选项；后端用默认值 `-1` 兜底。
- 业务字段能落枚举/字典就不要硬编码数字与文案。

## 八、i18n（React）

- 文案文件：`src/i18n/locales/{zh,en}.json`；平台文案按业务域分区（`system.*`、`authz.*`、`tool.*`、`dashboard.*` 等），业务文案按 `business.{module}.{business}.*` 分区。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 由 `zh.json` 推导为 `MessageKey`，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`。
- 禁止在模块顶层（`const/let` 初始化、静态配置对象）直接调用 `t()`：React 的 `t()` 非响应式，语言切换依赖根组件 `key={language}` 重挂载，模块顶层求值不会被重新执行。应在组件渲染期或函数内求值（必要时 `useMemo`）。
- 新增业务文案 zh/en 成对提交，页面禁止硬编码中文（注释除外）。

```json
{
  "business": {
    "xxx": {
      "title": "Xxx",
      "name": "名称",
      "confirmDelete": "是否确认删除\"{0}\"？",
      "confirmBatchDelete": "是否确认删除选中的 {0} 项？"
    }
  }
}
```

通用词优先复用 `common.*`（`add/edit/delete/status/requiredMsg/titleAdd/titleEdit/paginationTotal`）与 `common.noun.*`。

## 九、代码生成器（React）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_xxx (...)", "tplWebType": "antd-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段（`queryType/htmlType/dictType/isQuery/isList/isInsert/isEdit/isRequired`）
→ `preview` 预览 / `batchGenCode?ids=...` 下载 zip。

> 代码生成器页面本身是生成器控制台，不是标准 CRUD：分页键沿用后端 `pageSize`，弹窗为创建/预览两类，属于 4.4、4.5 的显式例外，不要套用标准模板。

产物：

- 后端与 Vue 模式相同：`main/java/.../business/{module}/{business}/...` +
  `main/resources/mapper/business/{module}/{business}/...` + `{Business}-init.sql`；
- 前端：`react/business/{module}/{business}/{types,api,pages}`，页面为 `pages/index.tsx`；
- `tplCategory=tree` 时出 `index-tree.tsx`。

解压合并后必须修正（生成器只是基线）：

| 缺口 | 修正 |
|---|---|
| 查询条件 | `pageList` 只生成 `offset/pagesize`，按 `isQuery` 补 API 参数、后端 Controller/Service/Mapper |
| 弹窗形态 | 模板把 `Modal + Form` 写在 `index.tsx`；字段多或需复用时拆为 `pages/FormModal.tsx`（`ModalForm`） |
| 校验 | 只有空值判断；补必填、长度、格式、唯一性与友好提示 |
| i18n | 模板硬编码中文；迁移到 `t()` 与 `business.*` |
| 类型 | 模板只生成 `API.Xxx`；补关联实体、必要的 `API.XxxQuery` |
| 组件声明 | 确认普通函数 + 显式 props 类型（本文件内联，跨文件复用才抽 interface），不引入 `React.FC` |
| 未用导入 | 清理模板生成的冗余 `React` / 组件导入 |
| 树表 | `tplCategory=tree` 生成 `treeList`（后端按 `parent_id` 组 `children`）；确认父子字段命名与表结构一致 |

## 十、初始化与联调

- 数据库：按 `AGENTS.md`「SQL 执行规范」依次执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_react.sql`。
- 环境：Node 20+、JDK 17+、Maven 3.6+、Redis。
- 数据源：`xxl-boot-api/src/main/resources/application.properties`（默认 `127.0.0.1:3306/xxl_boot`，`root/root_pwd`）；默认账号 `admin`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-react && npm i && npm run dev`（4000）。
- 校验命令：

```bash
cd xxl-boot-api && mvn -q compile
cd xxl-boot-ui/xxl-boot-ui-react && npm run type-check && npm run build
```

## 十一、校验清单

**结构与命名**

- [ ] 已加载 `xxl-boot-react`，未混用 Vue/单体写法。
- [ ] 目录为 `business/{module}/{business}`，接口路径、菜单 url、权限标识一致。
- [ ] 主页面为 `pages/index.tsx`；子页为 `pages/{Sub}/index.tsx`；局部弹窗平铺 `pages/*.tsx`。

**前端**

- [ ] `types` 使用 `declare namespace API`（含 import 时用 `declare global`），实体字段与后端一致；查询用 `XxxQuery`，表单用 `XxxForm`。
- [ ] `api` 以 `{business}Api` 导出，返回 `request<API.Response<API.PageModel<T>>>`；`pageList` 接收 `XxxQuery` 并在内部转换为 `offset/pagesize`；平台例外已按 4.4 核对。
- [ ] 页面基于 `PageContainer + ProTable`；`request` 直接传 `params`，返回 `{ data, total, success }`，取 `res.data?.data/total`。
- [ ] 页面按「页面状态 / 数据操作 / 表格“列”定义 / 数据列表渲染」分区；未重复写工具栏 `useStyles` 或包裹 div。
- [ ] 表单用受控 `ModalForm`（`pages/FormModal.tsx`）；props 类型内联，禁止遮罩关闭（`mask: { closable: false }`），提交不回传只读字段，成功后 `reload`。
- [ ] 无 `ahooks` 等未安装依赖；无第二套请求/表格封装。
- [ ] 组件为普通函数 + 显式 props；无 `React.FC`/`forwardRef`/`propTypes`/`defaultProps`。
- [ ] `hasPermi` 与资源表 `permission` 一致（平台菜单级 / 业务按钮级）；`hasRole` 只用于超管专属入口；工具栏与行内操作都已控权。
- [ ] 文案走 `t()`，按业务域分区 zh/en 成对；无硬编码中文。
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
- [ ] 注释符合 `AGENTS.md`：文件头含 `@author`，组件/API/核心分支注释齐全，无死代码。

## 十二、参考文件

| 用途 | 路径 |
|---|---|
| 前端标准范本 | `xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/config/{types,api,pages}` |
| 表单弹窗范本 | `.../system/config/pages/FormModal.tsx` |
| 进阶形态范本 | `.../system/message/pages/{MessageDetail,ReadUsersDialog}/index.tsx` |
| Hooks | `xxl-boot-ui/xxl-boot-ui-react/src/hooks/{useEnumOption,usePermission}.ts` |
| 全局类型 | `xxl-boot-ui/xxl-boot-ui-react/src/types/index.d.ts` |
| 全局样式 | `xxl-boot-ui/xxl-boot-ui-react/src/assets/styles/global.css` |
| 路由定位 | `xxl-boot-ui/xxl-boot-ui-react/src/router/index.tsx` |
| i18n | `xxl-boot-ui/xxl-boot-ui-react/src/i18n/index.ts`、`i18n/locales/{zh,en}.json` |
| 后端范本 | `xxl-boot-api/.../framework/{controller/service/mapper/model}` 下 `Config*` |
| 后端代码生成模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl` |
| React 代码生成模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/react/*.ftl` |
| 菜单 SQL 模板 | `xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl` |
| 代码生成前端页 | `xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/tool/codegen/` |
