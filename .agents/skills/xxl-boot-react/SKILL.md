---
name: xxl-boot-react
description: 在 XXL-Boot 前后端分离的 React 模式（xxl-boot-api 端口 8090 + xxl-boot-ui-react 端口 4000，Ant Design ProTable + TypeScript）下新增或改造业务模块。当任务涉及修改 xxl-boot-api/src/main/java/com/xxl/boot/api/business 或 xxl-boot-ui-react/src/modules 时加载本技能。
---

# XXL-Boot · React 分离模式开发 Skill

目标：把 `xxl-boot-api` + `xxl-boot-ui-react` 当作脚手架，规范、快速地新增/改造业务模块。本 Skill 只写 React 模式差异；跨模式共性（需求落盘、数据库、接口通道、i18n 原则、验收）见仓库根 `AGENTS.md`。

## 何时使用

- 前后端分离，前端是 React（Ant Design ProTable + TS）。
- 新增带列表页的标准 CRUD 业务模块。
- 只改后端接口、不动前端时同样适用（取「后端落位」一节）。
- 前端是 Vue 用 `xxl-boot-vue`；改 `xxl-boot-admin` 用 `xxl-boot-monolith`。

React 与 Vue 模式**共用同一个后端 `xxl-boot-api`**，后端落位完全一致。

## 前置：工程结构速览

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

## 实现原则（React）

遵循 `AGENTS.md`「设计原则」与「通用约定」，React 侧落地：
- 优先复用 `@/hooks`、`@/components`、`@/utils/request`；同一逻辑第三次出现才新增 Hook，不提前封装。
- 列表页用 `ProTable` 直接编排；复杂表单/详情拆到 `pages/` 下独立组件，避免请求、表格、弹窗状态混在一个文件。
- 状态保持局部 `useState` + `App.useApp()`；不引入额外状态库或第二套请求封装。
- 组件声明统一为普通函数 + 显式 props 类型，不叠加 React 的包装类型、运行时校验与兼容写法：

```tsx
interface DemoProps {
  id: number;          /* 主键 */
  onClose: () => void; /* 关闭回调 */
}

export default function Demo({ id, onClose }: DemoProps) {
  return <div>{id}</div>;
}
```

  同类写法一并排除：`React.FC`/`FunctionComponent`（类型别名，表达不了泛型）、`forwardRef`（React 19 起 `ref` 可直接作为 props，已无必要）、`propTypes` 与函数组件的 `defaultProps`（React 19 已移除，改用 TS 类型与解构默认值）；类组件仅用于错误边界等无 Hook 等价物的场景。`React.ReactNode`/`ComponentType` 等命名空间类型用于 props 与类型约束属正常，`React.memo`/`lazy` 属运行时优化，不受此限。

## 初始化与启动

- 数据库：按 `AGENTS.md`「SQL 执行规范」执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_modular_react.sql`。
- 后端：`cd xxl-boot-api && mvn spring-boot:run`（8090，Redis 需先启动）。
- 前端：`cd xxl-boot-ui/xxl-boot-ui-react && npm i && npm run dev`（4000，代理 `/api` → 8090）。
- 类型检查/构建：`npm run type-check` / `npm run build`。

## 执行要点

- 本模式端口：api `8090`、react `4000`。
- 后端落 `business/{module}/{business}`，Mapper XML 落 `resources/mapper/business/{module}/{business}/`，前端落 `modules/business/{module}/{business}/`。
- 页面必须是 `pages/index.tsx`（`loadView` 只识别该路径）；菜单 SQL、权限写法与 i18n 按本 Skill 后续章节执行；需求落盘与标准流程按 `AGENTS.md`。

## 后端落位（与 Vue 共用）

以业务 `Demo`、模块 `demo`、接口路径 `/demo/demo` 为例，包名 `com.xxl.boot.api.business.demo.demo`：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Demo.java` | `java/.../business/demo/demo/model/Demo.java` | 实体，字段驼峰；`Date` 字段加 `@JsonFormat(pattern="yyyy-MM-dd HH:mm:ss", timezone="GMT+8")` |
| `DemoMapper.java` | `java/.../business/demo/demo/mapper/DemoMapper.java` | `insert/delete/update/load/pageList/pageListCount` |
| `DemoMapper.xml` | `resources/mapper/business/demo/demo/DemoMapper.xml` | `resultMap` 显式映射；`add_time/update_time` 用 `NOW()`；查询用 `<if>` 动态拼条件 |
| `DemoService.java` / `DemoServiceImpl.java` | `java/.../business/demo/demo/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `DemoController.java` | `java/.../business/demo/demo/controller/DemoController.java` | `@RestController @RequestMapping("/demo/demo")`，全部方法 `@XxlSso` |

接口契约（路径、参数通道、返回结构、校验、方法顺序）按 `AGENTS.md`「后端通用规范」；本模式只需保证包路径与 Mapper XML 双层镜像。

### 代码生成器产物的 React 专属修正

- React 模板把新增/修改弹窗直接写在 `pages/index.tsx` 内的 `Modal + Form` 中；如需独立弹窗，可拆为 `pages/DemoFormModal.tsx`（推荐 `ModalForm`）。
- 其余固定缺口（查询条件、校验、i18n、树表）按 `AGENTS.md`「代码生成器」逐项补齐。

## 前端落位（3 文件 + 页内组件）

以 `/demo/demo` 为例：

| 文件 | 位置 | 说明 |
|---|---|---|
| types | `src/modules/business/demo/demo/types/index.d.ts` | `declare namespace API { type Demo = {...} }` |
| api | `src/modules/business/demo/demo/api/index.ts` | `request<API.Response<API.PageModel<T>>>`，`current/pageSize` 转 `offset/pagesize` |
| view | `src/modules/business/demo/demo/pages/index.tsx` | `PageContainer + ProTable` |
| 页内组件 | 同 `pages/` 下，如 `DemoFormModal.tsx` | 表单弹窗独立文件时使用 |

页面、接口、类型同模块聚合；**React `loadView` 只识别 `pages/index.tsx`**，即业务菜单 `url='/demo/demo'` 必须对应 `pages/index.tsx`（子页面可放 `pages/xxx/index.tsx`，菜单 `url` 写成 `/demo/demo/xxx`）。

### 1. types：`types/index.d.ts`

```ts
/**
 * 类型定义：Demo
 * 对应后端 Demo 实体。
 */
declare namespace API {
  /** Demo 实体 */
  type Demo = {
    id?: number;
    name?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    addTime?: string;
    updateTime?: string;
  };
}
```

### 2. api：`api/index.ts`

```ts
import { request } from '@/utils/request';

/**
 * 分页查询 Demo。
 * @param params ProTable 查询参数（current/pageSize + 查询字段）
 */
export async function listDemo(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  status?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Demo>>>('/demo/demo/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
    },
  });
}

/** 查询 Demo 详情 */
export async function getDemo(id: number) {
  return request<API.Response<API.Demo>>('/demo/demo/load', {
    method: 'GET',
    params: { id },
  });
}

/** 新增 Demo */
export async function addDemo(data: API.Demo) {
  return request<API.Response<unknown>>('/demo/demo/insert', {
    method: 'POST',
    data,
  });
}

/** 修改 Demo */
export async function updateDemo(data: API.Demo) {
  return request<API.Response<unknown>>('/demo/demo/update', {
    method: 'POST',
    data,
  });
}

/** 删除 Demo（后端接收裸数组） */
export async function delDemo(ids: number[]) {
  return request<API.Response<unknown>>('/demo/demo/delete', {
    method: 'POST',
    data: ids,
  });
}
```

### 3. 页面：`pages/index.tsx`

```tsx
/**
 * 页面：Demo 管理
 * 功能：分页表格 + 新增/修改 + 删除
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Space, Tag } from 'antd';
import React, { useRef, useState } from 'react';
import { t } from '@/i18n';
import { usePermission } from '@/hooks/usePermission';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { delDemo, listDemo } from '../api';
import DemoFormModal from './DemoFormModal';

const DemoList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();

  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.Demo | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const statusOptions = useEnumOption('DemoStatusEnum');
  const statusValueEnum = toValueEnum(statusOptions);

  /** 删除 Demo（单条或批量） */
  const handleDelete = (row?: API.Demo) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('business.demo.confirmDelete', [ids.join(',')]),
      onOk: async () => {
        await delDemo(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.Demo>[] = [
    { title: t('common.serialNo'), dataIndex: 'id', search: false, width: 80 },
    { title: t('business.demo.name'), dataIndex: 'name', ellipsis: true },
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
    { title: t('business.demo.updateTime'), dataIndex: 'updateTime', search: false, width: 180 },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 160,
      render: (_, record) => (
        <Space size="middle">
          {hasPermi('demo:demo:edit') && (
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
          {hasPermi('demo:demo:remove') && (
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
      <ProTable<API.Demo>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{ labelWidth: 80, optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()] }}
        request={async (params) => {
          const res = await listDemo(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasPermi('demo:demo:add') && (
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
          hasPermi('demo:demo:remove') && (
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
      <DemoFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default DemoList;
```

### 4. 表单弹窗：`pages/DemoFormModal.tsx`（推荐）

```tsx
/**
 * 组件：DemoFormModal（Demo 新增/编辑弹窗）
 */
import { ModalForm, ProFormRadio, ProFormText } from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import { addDemo, updateDemo } from '../api';

const DemoFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Demo | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.Demo) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateDemo({ ...data, id: current.id });
    } else {
      await addDemo(data);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Demo>
      title={
        current?.id
          ? t('common.titleEdit', [t('business.demo.title')])
          : t('common.titleAdd', [t('business.demo.title')])
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
        label={t('business.demo.name')}
        placeholder={t('common.inputPlaceholder', [t('business.demo.name')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('business.demo.name')]) }]}
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

export default DemoFormModal;
```

### React 页面约定

- 列表页基于 `ProTable + PageContainer`；`request` 直接调用 API 并返回 `{ data, total, success }`，**不要引入 `ahooks/useRequest`**（项目未安装该依赖）。
- 类型统一 `declare namespace API { type Xxx = {...} }`；全局类型 `API.Response/API.PageModel` 已由 `types/index.d.ts` 合并。
- API 入参用 `current/pageSize`，函数内转 `offset/pagesize`；其余接口通道遵循 `AGENTS.md`「前端通用规范」。
- 权限用 `usePermission().hasPermi('{module}:{business}:add')`；角色控制用 `hasRole('admin')`（平台 message 示例即用角色控制）。
- 枚举：`useEnumOption('XxxEnum')` 返回 `EnumOption[]`（不是按枚举名分组），配合 `toValueEnum`（表格列）/`toSelectOptions`（Select/ProFormSelect）。
- 字典：平台没有 React 版 `useDict` hook；使用 `loadDictItem`（`@/modules/framework/system/dict/api`）配合 `useEffect/useState` 或 ProForm 的 `request` 加载 options。
- 删除确认用 `App.useApp().modal.confirm`（`onOk` 内发请求），提示用 `App.useApp().message`；成功后 `actionRef.current?.reload()`。

### i18n（React）

- 文案文件：`src/i18n/locales/{zh,en}.json`（单一文件，按域名节点分区，`business.*` 放最后）。
- 页面统一 `import { t } from '@/i18n'`；`t()` 的 key 受 `MessageKey` 类型约束，先补文案再引用。
- 语言由后端 `system.i18n.language` 决定；前端启动经 `/loadBaseConfig` 调 `setLang` 同步，默认 `zh`，antd 语言随当前语言切换。

## 菜单 / 权限注册 SQL

与 Vue 模式一致（前端菜单同样由 `xxl_boot_resource` 的 `url` 驱动，React `loadView` 映射到 `pages/{url}/index.tsx`）：

```sql
SET NAMES utf8mb4;

INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, 'Demo管理', 1, 'demo:demo', '/demo/demo', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();

INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, 'Demo新增', 2, 'demo:demo:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, 'Demo修改', 2, 'demo:demo:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, 'Demo删除', 2, 'demo:demo:remove', '', '', 3, 0, 0, now(), now());

SELECT @btnAddId := LAST_INSERT_ID();
SET @btnEditId = @btnAddId + 1, @btnDelId = @btnAddId + 2;

INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()),
       (1, @btnAddId, now(), now()),
       (1, @btnEditId, now(), now()),
       (1, @btnDelId, now(), now());
```

## 内置代码生成器（React）

后台「工具-代码生成」或接口：

```json
POST /tool/codegen/createTable
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "tplWebType": "antd-typescript" }
```

流程：`createTable` 建记录 → `update` 编辑字段 → `preview` 预览 / `batchGenCode?ids=...` 下载 zip。

产物：

- 后端与 Vue 模式相同：`main/java/.../business/{module}/{business}/...` + `main/resources/mapper/business/{module}/{business}/...` + `{Business}-init.sql`；
- 前端：`react/business/{module}/{business}/{types,api,pages}`，页面为 `pages/index.tsx`；
- `tplCategory=tree` 时前端出 `index-tree.tsx`。

> 生成代码默认硬编码中文、内联 `Modal + Form`，且没有 `FormModal` 拆分；解压后必须做 i18n 迁移、查询条件补齐与组件复核。

## 校验清单

- [ ] `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md` 六大块与 SQL 已落盘并同步（模板见 `AGENTS.md`「需求落盘」）。
- [ ] 后端 `mvn -q compile` 通过；接口契约与代码生成补齐项符合 `AGENTS.md`「后端通用规范」「代码生成器」。
- [ ] 前端 types 用 `declare namespace API`；api 返回 `request<API.Response<API.PageModel<T>>>`，`current/pageSize` 已转 `offset/pagesize`。
- [ ] 页面为 `pages/index.tsx`，`ProTable.request` 取 `res.data?.data/total`；未引入项目不存在的依赖（如 `ahooks`）。
- [ ] 按钮 `hasPermi`；资源表菜单+按钮已插且已授权；菜单可见、页面能打开。
- [ ] i18n：页面无硬编码中文（注释除外），语言由后端 `system.i18n.language` 控制，前端已由 `/loadBaseConfig` 同步。
- [ ] SQL 按 `AGENTS.md`「SQL 执行规范」执行，中文无乱码。
- [ ] 联调：列表/新增/修改/删除/搜索可用，无权限按钮隐藏，空参数后端友好提示。

## 参考文件

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- React 直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/react/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/pages/index.tsx`
- 表单弹窗样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/pages/MessageFormModal.tsx`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-react/src/modules/framework/system/message/{api,types}/index.{ts,d.ts}`
- Hooks：`xxl-boot-ui/xxl-boot-ui-react/src/hooks/{useEnumOption,usePermission}.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`
