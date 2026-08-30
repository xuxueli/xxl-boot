---
name: xxl-boot-react
description: 在 XXL-Boot 前后端分离的 React 模式（xxl-boot-api 端口 8090 + xxl-boot-ui-react 端口 4000，Ant Design ProTable + TypeScript）下新增或改造业务模块。当任务涉及修改 xxl-boot-api/src/main/java/com/xxl/boot/api/business 或 xxl-boot-ui-react/src/pages|services|types 时加载本技能。
---

# XXL-Boot · React 分离模式开发 Skill

目标：把 XXL-Boot 的 `xxl-boot-api` + `xxl-boot-ui-react` 当作脚手架，规范、快速地新增/改造一个业务模块。本 Skill 覆盖「建表 → 后端 → 前端 → 菜单/权限 → 验证」全流程，含落位清单、代码骨架与校验清单。

## 何时使用

- 前后端分离，前端是 React（Ant Design ProTable + TS）。
- 需要新增一个带列表页的业务模块（标准 CRUD）。
- 只需要动后端接口而不动前端时，同样适用（取「后端落位」一节）。

如前端是 Vue3，用 `xxl-boot-vue`；如运行对象是 `xxl-boot-admin`，用 `xxl-boot-monolith`。React 与 Vue 模式**共用同一个后端 `xxl-boot-api`**，后端落位完全一致。

## 前置：工程结构速览

```
xxl-boot-api/src/main
├── java/com/xxl/boot/api/framework/…        ← 平台内置
├── java/com/xxl/boot/api/business/{module}  ← 后端新增业务落此（可经后台代码生成器产出或按模板直生）
└── resources/mapper/{module}/               ← 业务 Mapper XML
xxl-boot-ui-react/src
├── pages/{module}/{page}/index.tsx          ← 页面（DB 菜单 url 驱动，零路由改动）+ XxxFormModal.tsx
├── services/{module}/{page}.ts              ← 接口封装
└── types/{module}/{page}.d.ts               ← declare namespace API {}
```

通用规范（返回结构、注释、命名、DB）见仓库根 `AGENTS.md` 第六节。

## 标准流程

0. **需求落盘（先建立）**：先按「需求落盘（xxl-boot-spec）」一节在项目根 `xxl-boot-spec/{yyyyMMdd}-{business}/` 创建需求子目录，随后确认的需求结论、方案、SQL 全部落入该目录（见下文专属章节）。
1. **需求确认（第一步，必须）**：接到任务先不写代码，主动向用户确认需求细节，用户确认后再执行。至少确认：模块与业务命名（`{module}/{business}`）及目录归属；核心字段、状态/枚举下拉、是否需文件上传/富文本等特殊组件；页面形态（标准 CRUD / 详情页 / 多页签，仅动后端时则不动前端）；菜单+按钮+角色授权是否一并处理；出码方式（AI 按模板直生 or 后台「代码生成」）；验证范围与启动端口（api 8090 / react 4000）。确认结果即时回填到子目录 `方案.md`。
2. **建表**：`xxl_boot_*` SQL，公共字段 `id/add_time/update_time`，TINYINT 状态，`COMMENT` 注释；SQL 脚本写入该需求子目录（如 `{business}-table.sql`、`{business}-init.sql`）。
3. **生成或手写代码**：本 Skill 缺省策略为 AI 直接按内置模板（`xxl-boot-api/src/main/resources/templates/tool/codegen/{java,react}/*.ftl`）渲染等价代码落位；同时提示用户可后台「工具-代码生成」走内置生成器（见第六节）。
4. **落位**：后端 Java 落 `business/{module}`，Mapper XML 落 `resources/mapper/{module}/`；前端三个文件落 `pages|services|types/{module}/{page}`。
5. **菜单/权限**：插 `xxl_boot_resource` 菜单(type=1)+按钮(type=2)+`xxl_boot_role_res` 授权；按钮用 `hasPermi('{module}:{business}:add')`。
6. **验证**：起 `xxl-boot-api`(8090) + `xxl-boot-ui-react`(4000，代理 /api→8090)，菜单可见、CRUD 可用、权限生效；验证结果回填 `方案.md`。

## 需求落盘（xxl-boot-spec）

每个需求在项目根目录 `xxl-boot-spec/` 下生成一个需求子目录，把执行中产出的「方案 + SQL」沉淀其中，便于追溯与复用：

1. **目录命名**：`xxl-boot-spec/{yyyyMMdd}-{business}/`（同日多个需求用业务名区分，如 `20260830-product`）。
2. **方案**：`方案.md`，记录需求确认结论（`{module}/{business}` 命名、核心字段、状态/枚举下拉、页面形态、菜单/权限、出码方式、验证范围）、落位清单（后端 7 件套 + 前端三文件）与验证结果/变更记录。
3. **SQL**：建表 SQL 与菜单/权限 SQL 一并落盘（如 `{business}-table.sql`、`{business}-init.sql`），作为本需求专属脚本；如需进总库初始化，再同步一份到 `doc/db/`。

执行全程保持该目录与实现同步：先建目录落方案骨架 → 建表写 SQL → 落位实现 → 验证后回填结论。

## 后端落位清单（7 件套）

与 `xxl-boot-vue` 完全一致：

| 文件 | 位置 | 说明 |
|---|---|---|
| `Demo.java` | `java/.../business/demo/model/Demo.java` | 实体，字段驼峰 |
| `DemoMapper.java` | `java/.../business/demo/mapper/DemoMapper.java` | insert/delete/update/load/pageList/pageListCount |
| `DemoMapper.xml` | `resources/mapper/demo/DemoMapper.xml` | resultMap 显式映射；`add_time/update_time` 用 `NOW()` |
| `DemoService.java` / `DemoServiceImpl.java` | `java/.../business/demo/service/(impl/)` | 方法顺序 `pageList/load/insert/delete/update` |
| `DemoController.java` | `java/.../business/demo/controller/DemoController.java` | `@RestController @RequestMapping("/demo/demo")`，全 `@XxlSso` |

**直生入口**：读模板 `templates/tool/codegen/java/*.ftl` 得准确骨架与落位路径。要点：分页 `offset/pagesize`（默认 0/10）、校验 `StringTool/RegexTool` 返回 `Response.ofFail`、删除 `@RequestParam("ids[]") List<Integer>`、接口路径全小写 `/{module}/{business}/pageList|load|insert|delete|update`。

## 前端落位清单（3 文件）

以业务 `Demo` 为例，后端路径 `/demo/demo`：

### 1. types：`src/types/demo/demo.d.ts`

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
    status?: number;
    addTime?: string;
    updateTime?: string;
  };
}
```

### 2. services：`src/services/demo/demo.ts`

```ts
/**
 * 名称：Demo API
 * 能力：提供 Demo 分页、增删改接口。
 */
import { request } from '@/utils/request';

/** 分页查询列表（current/pageSize 在函数内转 offset/pagesize） */
export async function listDemo(params: { current?: number; pageSize?: number; status?: number; name?: string }) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Demo>>>('/demo/demo/pageList', {
    method: 'GET',
    params: { offset: (current - 1) * pageSize, pagesize: pageSize, ...rest },
  });
}
export async function getDemo(id: number) {
  return request<API.Response<API.Demo>>('/demo/demo/load', { method: 'GET', params: { id } });
}
export async function addDemo(data: API.Demo) {
  return request<API.Response<unknown>>('/demo/demo/insert', { method: 'POST', data });
}
export async function updateDemo(data: API.Demo) {
  return request<API.Response<unknown>>('/demo/demo/update', { method: 'POST', data });
}
export async function delDemo(ids: number[]) {
  return request<API.Response<unknown>>('/demo/demo/delete', { method: 'POST', params: { ids } });
}
```

### 3. 页面：`src/pages/demo/demo/index.tsx`（ProTable）

```tsx
import { useRequest } from 'ahooks';
import { PageContainer, ProTable, type ActionType } from '@ant-design/pro-components';
import { App, Button, Space } from 'antd';
import { useRef, useState } from 'react';
import DemoFormModal from './DemoFormModal';
import { listDemo, delDemo } from '@/services/demo/demo';
import { useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';

export default function Demo() {
  const actionRef = useRef<ActionType>(null);
  const { DemoStatusEnum } = useEnumOption('DemoStatusEnum');
  const { hasPermi } = usePermission();
  const { message, modal } = App.useApp();
  const [open, setOpen] = useState(false);
  const [formState, setFormState] = useState<API.Demo>({});

  const { run: fetchList } = useRequest((params) =>
    listDemo(params).then((res) => ({
      data: res.data?.data ?? [],      // 列表
      total: res.data?.total ?? 0,     // 总数
      success: true,
    })),
  );

  return (
    <PageContainer>
      <ProTable<API.Demo>
        headerTitle="Demo"
        rowKey="id"
        actionRef={actionRef}
        request={async (params) => fetchList(params)}
        columns={[
          { title: '序号', dataIndex: 'id', width: 100 },
          { title: '名称', dataIndex: 'name' },
          { title: '状态', dataIndex: 'status', valueType: 'select', valueEnum: DemoStatusEnum, width: 120 },
          { title: '更新时间', dataIndex: 'addTime', width: 180 },
          {
            title: '操作', valueType: 'option', width: 160,
            render: (_, row) => (
              <Space>
                {hasPermi('demo:demo:edit') && <a onClick={() => { setFormState(row); setOpen(true); }}>修改</a>}
                {hasPermi('demo:demo:remove') && <a onClick={() => modal.confirm({ title: '删除确认', content: '确认删除该数据项？', onOk: () => delDemo([row.id!]).then(() => { message.success('删除成功'); actionRef.current?.reload(); }) })}>删除</a>}
              </Space>
            ),
          },
        ]}
        toolBarRender={() => [
          hasPermi('demo:demo:add') && (<Button type="primary" key="add" onClick={() => { setFormState({}); setOpen(true); }}>新增</Button>),
        ]}
      />
      {open && <DemoFormModal open={open} initialValues={formState} onCancel={() => setOpen(false)} onOk={() => { setOpen(false); actionRef.current?.reload(); }} />}
    </PageContainer>
  );
}
```

- 表单弹窗独立文件 `DemoFormModal.tsx`（antd Modal + Form Form.Item，新增/编辑复用），参考 `pages/system/message/MessageFormModal.tsx`。
- 权限统一用 `usePermission().hasPermi('{module}:{business}:add|edit|remove')`。
- 下拉两种来源：业务枚举 `useEnumOption('XxxEnum')` + `toValueEnum/toSelectOptions`（`hooks/useEnumOption.ts`）；数据字典 `useDict` 等价物 → antd Select 手写 options。
- 删除确认用 `App.useApp().modal.confirm`（`onOk` 内发请求），提示用 `App.useApp().message`。

## 菜单 / 权限注册 SQL

与 Vue 模式完全一致（前端菜单同样由 `xxl_boot_resource` url 驱动，React `loadView` 映射 `pages/{module}/{page}/index.tsx`）：

```sql
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, 'Demo管理', 1, 'demo:demo', '/demo/demo', '', 999, 0, 0, now(), now());
SELECT @parentId := LAST_INSERT_ID();
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@parentId, 'Demo新增', 2, 'demo:demo:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, 'Demo修改', 2, 'demo:demo:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, 'Demo删除', 2, 'demo:demo:remove', '', '', 3, 0, 0, now(), now());
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @parentId, now(), now()), (1, @parentId+1, now(), now()), (1, @parentId+2, now(), now()), (1, @parentId+3, now(), now());
```

## 枚举下拉（可选）

需要下拉的业务枚举统一放 `com.xxl.boot.api.framework.constant.enums`（实现 `EnumTool.IEnum`，前端经 `loadEnumItem` 拉取），前端 `useEnumOption('XxxEnum')` 配合 `toValueEnum`（列 valueEnum）/`toSelectOptions`（Select options）。不需要下拉的枚举可放 `business/{module}/enums`。

## 内置代码生成器（快速出码）

后台「工具-代码生成」或接口 `POST /tool/codegen/createTable`，**React 固定传 `tplWebType` 为 `"antd-typescript"`**：

```json
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "tplWebType": "antd-typescript" }
```

→ `update` 编辑字段 → `preview` / `batchGenCode` 下载 zip（后端 6 件套 + react 三文件 + `-init.sql`）。落位见上文清单。

## 校验清单

- [ ] 需求子目录 `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`方案.md` + SQL 已落盘并同步。
- [ ] `xxl-boot-api` 下 `mvn -q compile` 通过；`xxl-boot-ui-react` 下 `npm run build`（或 eslint）通过。
- [ ] 后端：Controller 全 `@XxlSso`，方法顺序 `pageList/load/insert/delete/update`，分页 `offset/pagesize`，XML resultMap + `NOW()`，校验 `Response.ofFail`。
- [ ] 前端：types 用 `declare namespace API`；services 返回 `request<API.Response<API.PageModel<T>>>`，`current/pageSize` 已转 `offset/pagesize`；页面 ProTable `request` 取 `res.data?.data/total`。
- [ ] 权限：按钮 `hasPermi`，资源表菜单+按钮已插且已授权。注释符合 AGENTS.md 6.1。
- [ ] 联调：菜单可见、列表/新增/修改/删除/搜索可用、权限失效项按钮隐藏、空参数后端友好提示。

## 参考文件（绝对路径）

- 后端直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/java/*.ftl`
- React 直生模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/react/*.ftl`
- 列表页规范样例：`xxl-boot-ui/xxl-boot-ui-react/src/pages/system/message/index.tsx`、`MessageFormModal.tsx`
- API / 类型样例：`xxl-boot-ui/xxl-boot-ui-react/src/services/system/message.ts`、`src/types/system/message.d.ts`
- hooks：`xxl-boot-ui/xxl-boot-ui-react/src/hooks/{useEnumOption,usePermission}.ts`
- 菜单 SQL 模板：`xxl-boot-api/src/main/resources/templates/tool/codegen/sql/sql.ftl`