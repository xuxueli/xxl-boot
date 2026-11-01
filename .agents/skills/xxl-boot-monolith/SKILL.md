---
name: xxl-boot-monolith
description: 在 XXL-Boot 单体模式（xxl-boot-admin，Spring Boot + FreeMarker + AdminLTE，端口 8080）下新增或改造业务模块。当任务涉及修改 xxl-boot-admin/src/main/java/com/xxl/boot/admin/business 或 templates/*.ftl 页面、使用 $.adminTable 写 FreeMarker 列表页时加载本技能。
---

# XXL-Boot 单体模式开发 Skill

目标：把 `xxl-boot-admin` 当作脚手架，规范、快速地新增/改造业务模块。本 Skill 只写单体模式差异；跨模式共性（需求落盘、数据库、接口通道、i18n 原则、验收）见仓库根 `AGENTS.md`。

## 何时使用

- 运行/改动对象是 `xxl-boot-admin`（端口 8080，FreeMarker 服务端渲染）。
- 新增一个既有后端接口又有 FreeMarker 页面的业务模块。
- 补一个标准 CRUD 页面（完整范例对照 `templates/framework/system/config.ftl`）。
- 如任务涉及独立 Vue/React 前端，改用 `xxl-boot-vue` / `xxl-boot-react`。

## 前置：单体工程结构速览

```
xxl-boot-admin/src
├── main/java/com/xxl/boot/admin
│   ├── framework/{controller/service/service.impl/mapper/model(constant,enums,consts)/web/util}
│   └── business/{module}/                     ← 新增业务落此（controller/service/mapper/model/enums）
└── main/resources
    ├── templates/framework/…                  ← 平台内置 FTL 页面
    ├── templates/business/{module}/…          ← 业务 FTL 页面
    ├── static/framework/admin.table.js        ← 列表/增删改通用封装
    ├── i18n/message_{zh_CN,en}.properties     ← 单体文案
    └── mapper/{framework|business/{module}}   ← Mapper XML
```

## 实现原则（单体）

遵循 `AGENTS.md`「设计原则」与「通用约定」，单体侧落地：
- 优先复用 `admin.table.js`、`common.macro.ftl`、已有 Controller/Service；不引入新的前端框架或第二套表格封装。
- 页面、弹窗、JS 初始化保持边界清晰；复杂页面拆 FTL 片段或独立 JS，避免模板里堆业务逻辑。
- Controller 只做视图/接口编排，业务规则放 Service；不为转发单独加一层。

## 初始化与启动

- 数据库：按 `AGENTS.md`「SQL 执行规范」执行 `doc/db/tables_xxl_boot.sql` + `doc/db/tables_xxl_boot_monolith.sql`。
- 启动：`cd xxl-boot-admin && mvn spring-boot:run`（8080）。
- 编译：`cd xxl-boot-admin && mvn -q compile`。

## 执行要点

- 本模式端口：`8080`；页面、接口、菜单在同一 `xxl-boot-admin` 内完成。
- Java 落 `business/{module}`，FTL 落 `templates/business/{module}/`，Mapper XML 落 `resources/mapper/business/{module}/`。
- 菜单 SQL、页面定位、FTL 骨架与 i18n 按本 Skill 后续章节执行；需求落盘与标准流程按 `AGENTS.md`。

## 后端落位（单体）

以模块/业务 `Demo`、接口路径 `/demo/demo` 为例，包前缀 `com.xxl.boot.admin.business.demo`：

| 文件 | 位置 |
|---|---|
| `Demo.java` | `business/demo/model/Demo.java` |
| `DemoDTO.java` | `business/demo/model/dto/DemoDTO.java`（可选，列表展示用） |
| `DemoAdaptor.java` | `business/demo/model/adaptor/DemoAdaptor.java`（可选） |
| `DemoMapper.java` | `business/demo/mapper/DemoMapper.java` |
| `DemoMapper.xml` | `resources/mapper/business/demo/DemoMapper.xml` |
| `DemoService.java` | `business/demo/service/DemoService.java` |
| `DemoServiceImpl.java` | `business/demo/service/impl/DemoServiceImpl.java` |
| `DemoController.java` | `business/demo/controller/DemoController.java` |
| `demo.ftl` | `templates/business/demo/demo.ftl` |

### Controller 骨架（视图 + 数据接口共存）

- 页面入口：`@RequestMapping` + `@XxlSso`，向 `Model` 注入页面所需枚举，返回视图名 `/business/demo/demo`。
- 数据接口：`pageList/load/insert/delete/update` 加 `@ResponseBody`、`@XxlSso`，返回 `Response` / `Response<PageModel<DemoDTO>>`；参数通道与返回结构遵循 `AGENTS.md`「后端通用规范」。
- 参考实现：`framework/controller/system/ConfigController.java`。

```java
@Controller
@RequestMapping("/demo/demo")
public class DemoController {

    @Resource
    private DemoService demoService;

    @RequestMapping
    @XxlSso
    public String index(Model model) {
        model.addAttribute("DemoStatusEnum", DemoStatusEnum.values());
        return "/business/demo/demo";
    }

    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<DemoDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                 @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                 int status,
                                                 String name) {
        return Response.ofSuccess(demoService.pageList(status, name, offset, pagesize));
    }

    @RequestMapping("/load") @ResponseBody @XxlSso
    public Response<Demo> load(int id) { return demoService.load(id); }

    @RequestMapping("/insert") @ResponseBody @XxlSso
    public Response<String> insert(@RequestBody Demo demo) { return demoService.insert(demo); }

    @RequestMapping("/delete") @ResponseBody @XxlSso
    public Response<String> delete(@RequestBody List<Integer> ids) { return demoService.delete(ids); }

    @RequestMapping("/update") @ResponseBody @XxlSso
    public Response<String> update(@RequestBody Demo demo) { return demoService.update(demo); }
}
```

### Service / Mapper

- Service 接口 + `impl`（`@Service`）；`pageList` 返回 `PageModel`，entity 列表经 Adaptor 转 DTO。
- 校验失败提示走 `I18nUtil.getString("xxx")`，键维护在 `resources/i18n/message_zh_CN.properties` / `message_en.properties`。
- Mapper 接口与 XML 按 `AGENTS.md`「后端通用规范」；分页参数为 `offset/pagesize`。

### 页面与视图路径

- FTL 文件放 `templates/business/{module}/{business}.ftl`；`DemoController.index()` 返回 `/business/demo/demo`。
- 菜单 `url` 写 `/demo/demo`，`framework/base/index.ftl` 会自动拼上 `${request.contextPath}`，不要手写上下文路径。

## FreeMarker 页面骨架

先通读 `templates/framework/system/config.ftl`，再按 5 块组织：

1. 头：`<#import "/framework/common/common.macro.ftl" as netCommon>` + `<@netCommon.commonStyle />`（按需加 bootstrap-table / iCheck css）。
2. 查询区 `#data_filter`：`.searchBtn` / `.resetBtn` + 输入控件；select 用 `<#list DemoStatusEnum as item>` 渲染。
3. 按钮区 `#data_operation`：`.add`、`.update`（`selectOnlyOne` 单选）、`.delete`（`selectAny` 多选）。
   - ⚠️ 单体页面按钮**不按权限显隐**（平台暂未做按钮级权限），不要照搬 Vue/React 的 `v-hasPermi` / `hasPermi`。
4. 表格 `#data_list`（`table table-bordered table-striped`，thead 留空） + `#addModal` / `#updateModal` 两个 Bootstrap modal；更新 modal 末尾放 `<input type="hidden" name="id">`。
5. 底部：`<@netCommon.commonScript />` + `bootstrap-table.min.js` + `admin.table.js` + `$(function(){...})`。

```ftl
<#-- 查询区示例：状态枚举由 Controller.index() 注入 -->
<select class="form-control status">
    <option value="-1">${I18n.system_all}</option>
    <#list DemoStatusEnum as item>
        <option value="${item.code}">${item.title}</option>
    </#list>
</select>
```

```js
// 列表：分页/查询按表单参数提交（Controller 用 @RequestParam）
$.adminTable.initTable({
    table: '#data_list',
    url: base_url + '/demo/demo/pageList',
    queryParams: function (params) {
        return {
            status: $('#data_filter .status').val(),
            name: $('#data_filter .name').val(),
            offset: params.offset,      // bootstrap-table 分页 → offset/pagesize
            pagesize: params.limit
        };
    },
    columns: [
        { checkbox: true, field: 'state', width: '5', widthUnit: '%' },
        { title: I18n.demo_name, field: 'name' },
        { title: I18n.system_status, field: 'status', formatter: function (value) { return value === 0 ? I18n.demo_status_normal : I18n.demo_status_disabled; } }
    ]
});

// 删除：JSON 裸数组提交（@RequestBody List<Integer>）
$.adminTable.initDelete({ url: base_url + '/demo/demo/delete' });

// 新增：JSON 提交（@RequestBody Demo）
$.adminTable.initAdd({
    url: base_url + '/demo/demo/insert',
    rules: { name: { required: true, rangelength: [2, 50] } },
    messages: { name: { required: I18n.system_please_input + I18n.demo_name } },
    readFormData: function () {
        return {
            name: $("#addModal .form input[name=name]").val(),
            status: $("#addModal .form input[name='status']:checked").val()
        };
    }
});

// 修改：JSON 提交（@RequestBody Demo）
$.adminTable.initUpdate({
    url: base_url + '/demo/demo/update',
    writeFormData: function (row) {
        $("#updateModal .form input[name='id']").val(row.id);
        $("#updateModal .form input[name='name']").val(row.name);
        $("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
    },
    readFormData: function () {
        return {
            id: $("#updateModal .form input[name=id]").val(),
            name: $("#updateModal .form input[name=name]").val(),
            status: $("#updateModal .form input[name='status']:checked").val()
        };
    }
});
```

- `admin.table.js` 的列表请求默认 `POST` + `application/x-www-form-urlencoded`，与 Controller `@RequestParam` 匹配；新增/更新/删除是 `POST` + JSON。
- 示例中的 `I18n.demo_name` / `I18n.demo_status_*` 需在 `message_zh_CN.properties`、`message_en.properties` 成对补齐。
- 页面内自定义 `$.ajax` 时按同样规则选择表单或 JSON，禁止把复杂参数拼到 URL。

## 文案（单体 i18n）

- 文案维护在 `xxl-boot-admin/src/main/resources/i18n/message_zh_CN.properties` 与 `message_en.properties`。
- 语言由 `application.properties` 的 `xxl.boot.i18n` 决定（如 `zh_CN` / `en`）。
- FTL 用 `${I18n.system_opt_add}` 等（`common.macro.ftl` 已通过 `<#global I18n = I18nUtil.getMultString()?eval />` 注入）；Java 用 `I18nUtil.getString("key")`。
- 新页面优先复用已有 `system_*` 键；新增业务键按模块前缀命名并 zh/en 成对补齐。

## 枚举落位

- 业务枚举统一放 `business/{module}/enums`，实现 `EnumTool.IEnum`；`framework/constant/enums` 只放平台内置枚举。
- 页面下拉在 `Controller.index()` 用 `model.addAttribute("DemoStatusEnum", DemoStatusEnum.values())` 注入，FTL 用 `<#list DemoStatusEnum as item>` 渲染。
- 前端若需经 `loadEnumItem` 拉取：`DictController.loadEnum` 已支持动态扫描 `com.xxl.boot` 下实现 `IEnum` 的枚举包。

## 菜单注册 SQL

```sql
SET NAMES utf8mb4;

-- 目录（需要时）：type=0
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, '业务中心', 0, '', '', 'fa-cubes', 10, 0, 0, now(), now());
SELECT @catId := LAST_INSERT_ID();

-- 菜单：type=1，url 为上下文路径下的相对地址
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@catId, 'Demo管理', 1, 'demo:demo', '/demo/demo', 'fa-table', 1, 0, 0, now(), now());
SELECT @menuId := LAST_INSERT_ID();

-- 授权（默认管理员 role_id=1）
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @catId, now(), now()),
       (1, @menuId, now(), now());
```

> 不要写成 `(1, LAST_INSERT_ID(), ...)`：插入 `xxl_boot_role_res` 后 `LAST_INSERT_ID()` 已变成角色资源关系表的自增 ID，不是菜单 ID。先把菜单 ID 存到 `@menuId`。

菜单由 `templates/framework/base/index.ftl` 遍历 `resourceList`（`IndexController` 注入）渲染，无需改路由代码。

## 内置代码生成器（单体）

后台「代码生成」页面或接口：

```json
POST /tool/codegen/genCode
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "author": "you",
  "packagePath": "com.xxl.boot.admin.business.demo", "businessName": "Demo" }
```

返回 7 段代码：`controller_code` / `service_code` / `service_impl_code` / `mapper_code` / `mapper_xml_code` / `entity_code` / `page_code`。模板在 `templates/framework/tool/codegen-module/*.ftl`。

> 生成结果的单体专属修正：
> - Controller 的 `@RequestMapping("/${classNameLower}")`、`return "${classNameLower}"` 是占位形态，应改成 `/{module}/{business}` 与 `/business/{module}/{business}`；
> - 页面查询参数 `param` 是占位，字段控件是通用 `input`，需按实际查询字段与业务改为对应控件；
> - 生成代码没有 DTO/Adaptor，需按列表展示需要补充；
> - 其余固定缺口（查询条件、校验、i18n、树表）按 `AGENTS.md`「代码生成器」逐项补齐。

## 校验清单

- [ ] `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`plan.md` 六大块与 SQL 已落盘并同步（模板见 `AGENTS.md`「需求落盘」）。
- [ ] 后端 `mvn -q compile` 通过（在 `xxl-boot-admin` 下）；接口契约与代码生成补齐项符合 `AGENTS.md`「后端通用规范」「代码生成器」。
- [ ] 视图名 `/business/{module}/{business}` 与 FTL 文件位置一致；菜单 `url` 与 `@RequestMapping` 一致。
- [ ] FTL：`commonStyle/commonScript`、`admin.table.js` 引入完整；`#data_filter/#data_operation/#data_list/#addModal/#updateModal` id 规范。
- [ ] 菜单已插资源表并授权；启动后侧边栏可见、点击可打开页面、CRUD/搜索可用。
- [ ] SQL 按 `AGENTS.md`「SQL 执行规范」执行，中文无乱码。

## 参考文件

- 标准 CRUD 页面：`xxl-boot-admin/src/main/resources/templates/framework/system/config.ftl`
- 前端表格封装：`xxl-boot-admin/src/main/resources/static/framework/admin.table.js`
- Controller 范例：`xxl-boot-admin/src/main/java/com/xxl/boot/admin/framework/controller/system/ConfigController.java`
- 菜单渲染：`xxl-boot-admin/src/main/resources/templates/framework/base/index.ftl`
- i18n 宏与 `base_url`：`xxl-boot-admin/src/main/resources/templates/framework/common/common.macro.ftl`
- 代码生成模板：`xxl-boot-admin/src/main/resources/templates/framework/tool/codegen-module/*.ftl`
- 代码生成接口：`xxl-boot-admin/src/main/java/com/xxl/boot/admin/framework/controller/tool/CodeGenController.java`
