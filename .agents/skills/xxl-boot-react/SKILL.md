---
name: xxl-boot-react
description: 在 XXL-Boot 前后端分离的 React 模式（xxl-boot-ui-react 端口 4000，Ant Design ProTable + TypeScript）下新增或改造业务模块时加载。触发信号：修改 xxl-boot-ui-react/src/modules、编辑 .tsx 页面、使用 ProTable/usePermission/useEnumOption，或用户明确选择 React 分离模式。Vue 任务改用 xxl-boot-vue；单体任务改用 xxl-boot-monolith。
---

# XXL-Boot · React 分离模式开发 SKILL

> 适用范围：`xxl-boot-api` + `xxl-boot-ui-react` 的前后端分离业务开发。公共契约（设计原则、通用约定、需求落盘、接口通道、数据库/菜单模型、验收）见仓库根 `AGENTS.md`；本文件只维护 React 模式差异。

## 一、模式概览

| 项 | 内容 |
|---|---|
| 运行模式 | 前后端分离 · React |
| 组成 | `xxl-boot-api` + `xxl-boot-ui/xxl-boot-ui-react` |
| 端口 | api `8090`、react `4000`（Vite 代理 `/api` → 8090） |
| 技术栈 | Spring Boot + MyBatis；React 19 + Ant Design ProTable + TypeScript + Vite |
| 登录态 | XXL-SSO，登录态存 Redis（需先启动 Redis） |
| 后端落位 | Java `business/{module}/{business}`；Mapper XML `resources/mapper/business/{module}/{business}` |
| 前端落位 | `src/modules/business/{module}/{business}/{types,api,pages}` |
| 数据库脚本 | `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_react.sql` |

## 二、何时使用

- 前后端分离，前端是 React（Ant Design ProTable + TS）。
- 新增带列表页的标准 CRUD 业务模块。
- 只改后端接口、不动前端时同样适用（取「后端落位」一节）。
- 不适用：前端是 Vue 用 `xxl-boot-vue`；改 `xxl-boot-admin` 用 `xxl-boot-monolith`。

React 与 Vue 模式**共用同一个后端 `xxl-boot-api`**，后端落位完全一致。

## 三、工程结构速览

```
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…                      ← 平台内置
├── java/com/xxl/boot/api/business/{module}/{business}/    ← 新增业务（与前端双层镜像）
└── resources/mapper/framework/{module}/                   ← 平台内置 Mapper XML
└── resources/mapper/business/{module}/{business}/         ← 业务 Mapper XML

xxl-boot-ui/xxl-boot-ui-react/src
├── modules/framework/{domain}/{module}/                   ← 平台内置（pages + api + types）
├── modules/business/{module}/{business}/                  ← 业务模块（pages + api + types）
├── hooks/                                                 ← useEnumOption / usePermission
├── components/                                            ← Editor 等公共组件
└── types/index.d.ts                                       ← API.Response / API.PageModel 等全局类型
```

## 四、实现原则（React）

遵循 `AGENTS.md`「设计原则」与「通用约定」，React 侧落地：

- 优先复用 `@/hooks`、`@/components`、`@/utils/request`；同一逻辑第三次出现才新增 Hook，不提前封装。
- 列表页用 `ProTable` 直接编排；复杂表单/详情拆到 `pages/` 下独立组件，避免请求、表格、弹窗状态混在一个文件。
- 状态保持局部 `useState` + `App.useApp()`；不引入额外状态库或第二套请求封装。
- 组件声明统一为普通函数 + 显式 props 类型，不叠加 React 的包装类型、运行时校验与兼容写法：

```tsx
interface XxxProps {
  /** 主键 */
  id: number;
  /** 关闭回调 */
  onClose: () => void;
}

export default function Xxx({ id, onClose }: XxxProps) {
  return <div>{id}</div>;
}
```

  同类写法一并排除：`React.FC`/`FunctionComponent`（类型别名，表达不了泛型）、`forwardRef`（React 19 起 `ref` 可直接作为 props，已无必要）、`propTypes` 与函数组件的 `defaultProps`（React 19 已移除，改用 TS 类型与解构默认值）；类组件仅用于错误边界等无 Hook 等价物的场景。`React.ReactNode`/`ComponentType` 等命名空间类型用于 props 与类型约束属正常，`React.memo`/`lazy` 属运行时优化，不受此限。

## 五、初始化与启动

- 数据库：按 `AGENTS.md`「SQL 执行规范」依次执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_react.sql`。
- 环境：Node 20+。
- 数据源：`xxl-boot-api/src/main/resources/application.properties`（默认 `127.0.0.1:3306/xxl_boot`，`root/root_pwd`）；默认账号 `admin`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090，Redis 需先启动）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-react && npm i && npm run dev`（4000）。
- 编译/类型检查/构建：`mvn -q compile`（`xxl-boot-api` 下）/ `npm run type-check` / `npm run build`（前端目录下）。

## 六、后端落位（与 Vue 共用）

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
| types | `src/modules/business/{module}/{business}/types/index.d.ts` | `declare namespace API { type Xxx = {...} }` |
| api | `src/modules/business/{module}/{business}/api/index.ts` | `request<API.Response<API.PageModel<T>>>`，`current/pageSize` 转 `offset/pagesize` |
| view | `src/modules/business/{module}/{business}/pages/index.tsx` | `PageContainer + ProTable` |
| 页内组件 | 同 `pages/` 下，如 `XxxFormModal.tsx` | 表单弹窗独立文件时使用 |

页面、接口、类型同模块聚合；**React `loadView` 只识别 `pages/index.tsx`**，即业务菜单 `url='/{module}/{business}'` 必须对应 `pages/index.tsx`（子页面可放 `pages/xxx/index.tsx`，菜单 `url` 写成 `/{module}/{business}/xxx`）。

### 7.1 types：`types/index.d.ts`

```ts
/**
 * @file Xxx 类型定义
 * @description 对应后端 Xxx 实体
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** Xxx 实体 */
  type Xxx = {
    id?: number;
    name?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    addTime?: string;
    updateTime?: string;
  };
}
```

### 7.2 api：`api/index.ts`

```ts
/**
 * @file Xxx API
 * @description 接口封装
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/**
 * 分页查询 Xxx。
 * @param params ProTable 查询参数（current/pageSize + 查询字段）
 */
export async function listXxx(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  status?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Xxx>>>('/{module}/{business}/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
    },
  });
}

/** 查询 Xxx 详情 */
export async function getXxx(id: number) {
  return request<API.Response<API.Xxx>>('/{module}/{business}/load', {
    method: 'GET',
    params: { id },
  });
}

/** 新增 Xxx */
export async function addXxx(data: API.Xxx) {
  return request<API.Response<unknown>>('/{module}/{business}/insert', {
    method: 'POST',
    data,
  });
}

/** 修改 Xxx */
export async function updateXxx(data: API.Xxx) {
  return request<API.Response<unknown>>('/{module}/{business}/update', {
    method: 'POST',
    data,
  });
}

/** 删除 Xxx（后端接收裸数组） */
export async function delXxx(ids: number[]) {
  return request<API.Response<unknown>>('/{module}/{business}/delete', {
    method: 'POST',
    data: ids,
  });
}
```

### 7.3 页面：`pages/index.tsx`

```tsx
/**
 * @file Xxx 管理
 * @description 分页表格 + 新增/修改 + 删除
 * @author xuxueli 2026-11-21
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { t } from '@/i18n';
import { usePermission } from '@/hooks/usePermission';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delXxx, listXxx } from '../api';
import XxxFormModal from './XxxFormModal';

const XxxList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Xxx | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const statusOptions = useEnumOption('XxxStatusEnum');
  const statusValueEnum = toValueEnum(statusOptions);

  /** 删除 Xxx（单条或批量） */
  const handleDelete = (row?: API.Xxx) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('business.xxx.confirmDelete', [ids.join(',')]),
      onOk: async () => {
        await delXxx(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Xxx>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 80 },
    { title: t('business.xxx.name'), dataIndex: 'name', ellipsis: true },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 120,
      valueType: 'select',
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    { title: t('business.xxx.updateTime'), dataIndex: 'updateTime', search: false, width: 180 },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          {hasPermi('{module}:{business}:edit') && (
            <a
              key="edit"
              onClick={() => {
                setFormCurrent(record);
                setFormOpen(true);
              }}
            >
              <EditOutlined /> {t('common.modify')}
            </a>
          )}
          {hasPermi('{module}:{business}:remove') && (
            <a key="delete" onClick={() => handleDelete(record)}>
              <DeleteOutlined /> {t('common.delete')}
            </a>
          )}
        </Space>
      ),
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Xxx>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{ labelWidth: 80, optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()] }}
        request={async (params) => {
          const res = await listXxx(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
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
        rowSelection={{
          onChange: (_keys, rows) => setSelectedIds(rows.map((r) => r.id as number)),
        }}
        pagination={{ defaultPageSize: 10, pageSizeOptions: [10, 20, 50, 100], showSizeChanger: true }}
        tableAlertRender={false}
      />
      <XxxFormModal
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

### 7.4 表单弹窗：`pages/XxxFormModal.tsx`（推荐）

```tsx
/**
 * @file XxxFormModal（Xxx 新增/编辑弹窗）
 * @description 新增/编辑表单
 * @author xuxueli 2026-11-21
 */
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import { addXxx, updateXxx } from '../api';

const XxxFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Xxx | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.Xxx) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateXxx({ ...data, id: current.id });
    } else {
      await addXxx(data);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Xxx>
      title={
        current?.id
          ? t('common.titleEdit', [t('business.xxx.title')])
          : t('common.titleAdd', [t('business.xxx.title')])
      }
      width={640}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      <ProFormText
        name="name"
        label={t('business.xxx.name')}
        placeholder={t('common.inputPlaceholder', [t('business.xxx.name')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('business.xxx.name')]) }]}
      />
      <ProFormRadio.Group
        name="status"
        label={t('common.status')}
        options={[
          { value: 0, label: t('common.normal') },
          { value: 1, label: t('common.disabled') },
        ]}
      />
    </ModalForm>
  );
};

export default XxxFormModal;
```

### 7.5 React 页面约定

- 列表页基于 `ProTable + PageContainer`；`request` 直接调用 API 并返回 `{ data, total, success }`，**不要引入 `ahooks/useRequest`**（项目未安装该依赖）。
- 类型统一 `declare namespace API { type Xxx = {...} }`；全局类型 `API.Response/API.PageModel` 已由 `types/index.d.ts` 合并。
- API 入参用 `current/pageSize`，函数内转 `offset/pagesize`；其余接口通道遵循 `AGENTS.md`「前端通用规范」。
- 权限用 `usePermission().hasPermi('{module}:{business}:add')`；角色控制用 `hasRole('admin')`（平台 message 示例即用角色控制）。
- 枚举：`useEnumOption('XxxEnum')` 返回 `EnumOption[]`（不是按枚举名分组），配合 `toValueEnum`（表格列）/`toSelectOptions`（Select/ProFormSelect）。
- 字典：平台没有 React 版 `useDict` hook；使用 `loadDictItem`（`@/modules/framework/system/dict/api`）配合 `useEffect/useState` 或 ProForm 的 `request` 加载 options。
- 删除确认用 `App.useApp().modal.confirm`（`onOk` 内发请求），提示用 `App.useApp().message`；成功后 `actionRef.current?.reload()`。
- 弹窗/抽屉用受控 `open` + `onClose`，展示数据通过 props 传入；不用 ref 暴露 `open()` 等命令式方法。

### 7.6 注释与 JSDoc

遵循 `AGENTS.md`「注释规范」。React 侧落地：

- `.tsx` 文件头使用 JSDoc，必须包含 `@file`、功能描述和 `@author`：

```tsx
/**
 * @file 站内消息页面
 * @description 分页表格 + 新增/修改 + 删除
 * @author xuxueli 2026-11-21
 */
```

- 组件、Props、API 函数、Hook 使用 JSDoc；复杂函数补 `@param` / `@returns`。
- 简单内联回调不强制 JSDoc；核心分支用 `//` 说明原因。
- 保留现有 `PageContainer`、`ProTable` 等关键逻辑的区块注释。

## 八、菜单 / 权限

与 Vue 模式一致（前端菜单同样由 `xxl_boot_resource` 的 `url` 驱动，React `loadView` 映射到 `pages/index.tsx`）：

```sql
SET NAMES utf8mb4;

INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, '{businessName}管理', 1, '{module}:{business}', '/{module}/{business}', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, '{businessName}新增', 2, '{module}:{business}:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, '{businessName}修改', 2, '{module}:{business}:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, '{businessName}删除', 2, '{module}:{business}:remove', '', '', 3, 0, 0, now(), now());

SELECT @btnAddId := LAST_INSERT_ID();
SET @btnEditId = @btnAddId + 1, @btnDelId = @btnAddId + 2;

INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()),
       (1, @btnAddId, now(), now()),
       (1, @btnEditId, now(), now()),
       (1, @btnDelId, now(), now());
```

- 权限标识统一 `{module}:{business}:add|edit|remove`，与 `hasPermi` 保持一致；新菜单必须在 `xxl_boot_role_res` 授权。
- 页面必须是 `pages/index.tsx`（`loadView` 只识别该路径）；子页面放 `pages/xxx/index.tsx`，菜单 `url` 写 `/{module}/{business}/xxx`。**无需改路由代码。**

## 九、枚举 / 字典

- 业务枚举放 `business/{module}/{business}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 枚举下拉：`useEnumOption('XxxEnum')` 返回 `EnumOption[]`，配合 `toValueEnum`（表格列）/`toSelectOptions`（Select/ProFormSelect）。
- 数据字典：平台无 React 版 `useDict`，用 `loadDictItem` + `useEffect/useState` 或 ProForm 的 `request` 加载 options。

## 十、i18n（React）

- 文案文件：`src/i18n/locales/{zh,en}.json`（单一文件，按域名节点分区，`business.*` 放最后）。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 受 `MessageKey` 类型约束，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`，antd 语言随当前语言切换。
- 新增业务文案 zh/en 成对提交，页面禁止硬编码中文（注释除外）。

## 十一、代码生成器（React）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_xxx (...)", "tplWebType": "antd-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段 → `preview` 预览 / `batchGenCode?ids=...` 下载 zip。

产物：

- 后端与 Vue 模式相同：`main/java/.../business/{module}/{business}/...` + `main/resources/mapper/business/{module}/{business}/...` + `{Business}-init.sql`；
- 前端：`react/business/{module}/{business}/{types,api,pages}`，页面为 `pages/index.tsx`；
- `tplCategory=tree` 时前端出 `index-tree.tsx`。

> 解压后按项目目录合并，并做 React 专属修正：
> - 模板把新增/修改弹窗直接写在 `pages/index.tsx` 内的 `Modal + Form`；如需独立弹窗，拆为 `pages/XxxFormModal.tsx`（推荐 `ModalForm`）；
> - 生成代码默认硬编码中文，需迁移到 i18n；查询条件与组件写法按本 SKILL 复核；
> - 其余固定缺口（查询条件、校验、树表）按 `AGENTS.md`「代码生成器」逐项补齐。

## 十二、校验清单

- [ ] 已加载 `xxl-boot-react`，且未混用 Vue/单体写法。
- [ ] 注释符合规范：TSX 文件头含 `@author`，组件/API/核心分支注释齐全，无无意义注释和注释掉的死代码。
- [ ] `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md` 六大块与 SQL 已落盘并同步（模板见 `AGENTS.md`「需求落盘」）。
- [ ] 后端 `mvn -q compile` 通过；接口契约与代码生成补齐项符合 `AGENTS.md`「后端通用规范」「代码生成器」。
- [ ] 前端 types 用 `declare namespace API`；api 返回 `request<API.Response<API.PageModel<T>>>`，`current/pageSize` 已转 `offset/pagesize`。
- [ ] 页面为 `pages/index.tsx`，`ProTable.request` 取 `res.data?.data/total`；未引入项目不存在的依赖（如 `ahooks`）。
- [ ] 组件声明符合规范：普通函数 + 显式 props，无 `React.FC`/`forwardRef`/`propTypes`/函数组件 `defaultProps`；弹窗用受控 `open`。
- [ ] 按钮 `hasPermi`；资源表菜单+按钮已插且已授权；菜单可见、页面能打开。
- [ ] i18n：后端错误文案走 `I18nUtil`，前端页面无硬编码中文（注释除外），语言由后端 `system.i18n.language` 控制，前端已由 `/loadBaseConfig` 同步。
- [ ] SQL 按 `AGENTS.md`「SQL 执行规范」执行，中文无乱码。
- [ ] 联调：列表/新增/修改/删除/搜索可用，无权限按钮隐藏，空参数后端友好提示。

## 十三、参考文件

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- React 直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/react/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/pages/index.tsx`
- 表单弹窗样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/pages/MessageFormModal.tsx`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/{api,types}/index.{ts,d.ts}`
- Hooks：`xxl-boot-ui/xxl-boot-ui-react/src/hooks/{useEnumOption,usePermission}.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
