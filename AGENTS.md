# XXL-Boot 开发规范

## 一、通用约定

- 使用中文与我沟通。

## 二、代码规范

### 2.1 命名规范

- 类名使用大驼峰命名，首字母大写；变量、方法使用小驼峰命名，首字母小写。
- 命名应表达真实语义、具备可读性，避免无意义单字母（循环变量等通用惯例除外），避免使用拼音。
- 常量使用全大写 + 下划线分隔，如 `REPEAT_SUBMIT_STORAGE_KEY`。
- 布尔属性不使用 `isXxx` 前缀命名，避免与 getter 生成冲突。

### 2.2 代码实现

- 避免过度设计，注重复用、易理解、易维护。
- 同一类场景保持同一套实现方案，不混用多种写法（如各模块 Controller 的 pageList/load/insert/delete/update 结构保持一致）。
- 分层职责清晰：Controller 负责参数接收与校验、Service 负责业务逻辑、Mapper 负责数据访问，不跨层越权。
- Java 的 set/get 方法不折叠成一行，使用正常方法体书写。

### 2.3 接口规范

- 接口路径采用「模块前缀 + 动词式后缀」，如 `/system/message/pageList`、`/load`、`/insert`、`/delete`。
- 统一返回 `Response(code、msg、data)`，分页返回 `Response<PageModel>`；分页入参统一为 `offset`、`pagesize`，由前端传入。
- 数据库字段采用下划线命名，Java 实体采用对应驼峰命名，并在 mapper XML 中显式配置字段映射。

### 2.4 前端规范

- 组件 import 名称与模板使用标签保持一致（统一 PascalCase，如 `import NoticeDetailView` 对应 `<NoticeDetailView>`）
- **响应式数据说明**
  - 针对 响应式数据，非必须的情况下 一律使用 `ref`，避免使用 `reactive`，并通过 `toRefs(data)` 方式解构响应式数据。
  - 针对逻辑相关的一组ref，比如 `list、total、loading、showSearch、ids、multiple` 统一放在一个 table 对象中，避免散落在各处。如 `views/system/log/index.vue` 中代码。
- **避免啰嗦写法**：
  - 不要用 `defineProps` 声明 visible + `defineEmits(['update:visible'])` + computed get/set 桥接来实现 v-model 双向绑定，直接 `defineModel('visible')` + 模板 `v-model="visible"` 即可。
  - 模板中直接使用 props（`row.xxx`），不要额外定义冗余的 computed 别名（如 `const form = computed(() => props.row)`）。

## 三、注释规范

- 注释覆盖范围：Java、前端文件。
- 文件注释：文件顶部注释，遵循业界标准注释方式。一行写文件功能，间隔一行，再写一行 `@author xuxueli yyyy-mm-dd`。
- 方法注释：遵循业界标准注释方式。除方法注释外，方法内部的分支逻辑也需添加注释。
- 属性注释：在属性右侧通过 `/* xxx */` 方式添加，注意注释垂直对齐。
- Vue 代码：每个模块组件均需添加注释。
- 所有注释使用中文，要求直接、准确、不啰嗦。
- 已有注释需检查是否与上述要求一致，不一致需调整。

## 四、数据结构规范

### 4.1 统一返回结构

- 后端统一返回结构体 `Response(code、msg、data)`。
- 前端处理时从 `response.data` 中获取数据，不要直接拿返回值操作。
- `response.code` 为 200 表示成功，其他表示失败。

### 4.2 分页返回结构

- 后端分页返回结构体 `Response<PageModel>`。
- `PageModel`（data、total）存放于 `response.data` 属性中。
- 前端处理时：
  - 从 `response.data.data` 获取数据列表；
  - 从 `response.data.total` 获取总条数。
- 注意取数据层级。
