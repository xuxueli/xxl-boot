---
name: xxl-boot-monolith
description: 在 XXL-Boot 单体模式（xxl-boot-admin，Spring Boot + FreeMarker + AdminLTE，端口 8080）下新增或改造业务模块。当任务涉及修改 xxl-boot-admin/src/main/java/com/xxl/boot/admin/business 或 templates/*.ftl 页面、使用 $.adminTable 写 FreeMarker 列表页时加载本技能。
---

# XXL-Boot 单体模式开发 Skill

目标：把 XXL-Boot 的 `xxl-boot-admin`（单体）当作脚手架，规范、快速地新增/改造一个业务模块。本 Skill 覆盖「建表 → 后端 → FreeMarker 页面 → 菜单注册 → 验证」全流程，含落位清单、代码骨架与校验清单。

## 何时使用

- 运行/改动对象是 `xxl-boot-admin`（端口 8080，FreeMarker 服务端渲染）。
- 需要新增一个既有后端接口又有页面的业务模块（对照 `business/ai`）。
- 需要在单体平台补一个简单的 CRUD 页面（对照 `framework/system/config.ftl`）。

如任务同时涉及后端接口与独立前端项目（Vue/React），请改用 `xxl-boot-vue` / `xxl-boot-react`。

## 前置：单体工程结构速览

```
xxl-boot-admin/src
├── main/java/com/xxl/boot/admin
│   ├── framework/{controller/service/service.impl/mapper/model(entity,dto,adaptor)/constant(enums,consts)/web/util}
│   └── business/{module}                     ← 新增业务一律落此处（参照 ai）
└── main/resources
    ├── templates/framework/…                 ← 平台内置 FTL 页面
    ├── templates/business/{module}/…         ← 业务 FTL 页面
    ├── static/framework/*                    ← admin.table.js 等通用前端
    └── mapper/{framework|business/{module}}  ← Mapper XML
```

通用规范（返回结构、注释、命名、DB 约定）见仓库根 `AGENTS.md` 第六节。

## 标准流程

0. **需求落盘（先建立）**：先按「需求落盘（xxl-boot-spec）」一节在项目根 `xxl-boot-spec/{yyyyMMdd}-{business}/` 创建需求子目录，随后确认的需求结论、方案、SQL 全部落入该目录（见下文专属章节）。
1. **需求确认（第一步，必须）**：接到任务先不写代码，主动向用户确认需求细节，用户确认后再执行。至少确认：模块与业务命名（`{module}/{business}`）及目录归属；核心字段、状态/枚举下拉、是否需文件上传/富文本等特殊组件；页面形态（标准 CRUD / 详情页 / 多页签）；菜单+角色授权是否一并处理；出码方式（AI 按模板直生 or 后台「代码生成」）；验证范围与启动端口。确认结果即时回填到子目录 `方案.md`。
2. **建表**：`xxl_boot_*` 建表 SQL，遵守公共字段 `id(add_time/update_time)`、TINYINT 状态、`COMMENT` 注释、唯一索引 `i_` 前缀；SQL 脚本写入该需求子目录（如 `{business}-table.sql`、`{business}-init.sql`）。
3. **生成或手写后端代码**：
   - 可直接按本 Skill「后端骨架」直生等价代码；
   - 也可用内置「代码生成」页面：`POST /tool/codegen/genCode`，入参 `tableSql/author/packagePath/businessName`，返回 `controller/service/service_impl/mapper/mapper_xml/entity/page` 7 段代码（模板在 `templates/framework/tool/codegen-module/*.ftl`）。
4. **落位文件**：后端 Java 落 `business/{module}`；FTL 页面落 `templates/business/{module}/`；Mapper XML 落 `resources/mapper/business/{module}/`。
5. **注册菜单**：`xxl_boot_resource` 插菜单（type=1）或目录（type=0）+ `xxl_boot_role_res` 授权（role_id=1）。
6. **验证**：启动 `xxl-boot-admin`（8080），登录后菜单可见、CRUD 可用；接口自测；验证结果回填 `方案.md`。

## 需求落盘（xxl-boot-spec）

每个需求在项目根目录 `xxl-boot-spec/` 下生成一个需求子目录，把执行中产出的「方案 + SQL」沉淀其中，便于追溯与复用：

1. **目录命名**：`xxl-boot-spec/{yyyyMMdd}-{business}/`（同日多个需求用业务名区分，如 `20260830-product`）。
2. **方案**：`方案.md`，记录需求确认结论（`{module}/{business}` 命名、核心字段、状态/枚举下拉、页面形态、菜单/权限、出码方式、验证范围）、落位清单（后端 6 件套 + FTL 页面）与验证结果/变更记录。
3. **SQL**：建表 SQL 与菜单/权限 SQL 一并落盘（如 `{business}-table.sql`、`{business}-init.sql`），作为本需求专属脚本；如需进总库初始化，再同步一份到 `doc/db/`。

执行全程保持该目录与实现同步：先建目录落方案骨架 → 建表写 SQL → 落位实现 → 验证后回填结论。

## 后端落位清单（6 件套）

以业务 `Demo`、模块 `demo` 为例，包前缀 `com.xxl.boot.admin.business.demo`：

| 文件 | 包 / 位置 |
|---|---|
| `Demo.java` | `business/demo/model/Demo.java` |
| `DemoDTO.java` | `business/demo/model/dto/DemoDTO.java`（可选，列表展示用） |
| `DemoAdaptor.java` | `business/demo/model/adaptor/DemoAdaptor.java`（可选） |
| `DemoMapper.java` | `business/demo/mapper/DemoMapper.java` |
| `DemoMapper.xml` | `resources/mapper/business/demo/DemoMapper.xml` |
| `DemoService.java` | `business/demo/service/DemoService.java` |
| `DemoServiceImpl.java` | `business/demo/service/impl/DemoServiceImpl.java` |
| `DemoController.java` | `business/demo/controller/DemoController.java` |

### Controller 骨架（单体差异：视图 + 数据接口共存）

- 页面入口：`@RequestMapping("/demo/demo")` + `@XxlSso`，返回 view 名 `/business/demo/demo`，并把页面需要的枚举 `model.addAttribute("DemoStatusEnum", ...)`。
- 数据接口：`pageList/load/insert/delete/update`，加 `@ResponseBody`，返回 `Response` / `Response<PageModel<DemoDTO>>`，入参分页统一 `offset/pagesize`，删除用 `@RequestParam("ids[]") List<Integer> ids`。
- 全部加 `@XxlSso`。参考 `framework/controller/system/ConfigController.java`。

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
                                                 int status, String name) {
        return Response.ofSuccess(demoService.pageList(status, name, offset, pagesize));
    }

    @RequestMapping("/load") @ResponseBody @XxlSso
    public Response<Demo> load(int id) { return demoService.load(id); }

    @RequestMapping("/insert") @ResponseBody @XxlSso
    public Response<String> insert(Demo demo) { return demoService.insert(demo); }

    @RequestMapping("/delete") @ResponseBody @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) { return demoService.delete(ids); }

    @RequestMapping("/update") @ResponseBody @XxlSso
    public Response<String> update(Demo demo) { return demoService.update(demo); }
}
```

### Service / Mapper

- Service 接口 + `impl`（`@Service`），方法顺序固定 `pageList/load/insert/delete/update`；参数校验用 `StringTool/RegexTool`，失败返回 `Response.ofFail("提示")`。
- pageList 返回 `PageModel`：查询列表 + `pageListCount`，entity 列表经 Adaptor 转 DTO。
- Mapper 接口声明 `insert/delete/update/load/pageList/pageListCount`；XML 显式 `resultMap` 字段映射，insert/update 的 `add_time`/`update_time` 用 `NOW()`。

## FreeMarker 页面骨架

业务页面放 `templates/business/{module}/demo.ftl`，**强烈建议先通读 `templates/framework/system/config.ftl` 作为完整范例再动手**。标准 CRUD 页 = 5 块：

1. 头：`<#import "/framework/common/common.macro.ftl" as netCommon>` + `<@netCommon.commonStyle />`（+ 需要的 bootstrap-table/iCheck css）。
2. 查询区 `#data_filter`：`.searchBtn` / `.resetBtn` 按钮 + 输入控件（select 用 `<#list XxxStatusEnum as item>` 渲染）。
3. 按钮区 `#data_operation`：`.add`（新增）、`.update`（`selectOnlyOne` 单选）、`.delete`（`selectAny` 多选）。⚠️ 单体页面按钮不按权限显隐（写死），按钮级权限后续再扩展。
4. 表格 `#data_list`（`table table-bordered table-striped`，thead 留空）+ `#addModal` / `#updateModal` 两个 Bootstrap modal（`form-horizontal form`，末尾更新 modal 需 `<input type="hidden" name="id">`）。
5. 底部：`<@netCommon.commonScript />` + `bootstrap-table.min.js` + `admin.table.js` + 页面 `$(function(){...})`。

页脚 JS 直接调用 `$.adminTable`（封装见 `static/framework/admin.table.js`）：

```js
$.adminTable.initTable({
    table: '#data_list',
    url: base_url + "/demo/demo/pageList",
    queryParams: function (params) {
        var obj = {};
        obj.status = $('#data_filter .status').val();
        obj.name = $('#data_filter .name').val();
        obj.offset = params.offset;      // bootstrap-table 分页 → offset/pagesize
        obj.pagesize = params.limit;
        return obj;
    },
    columns: [
        { checkbox: true, field: 'state', width: '5', widthUnit: '%' },
        { title: '名称', field: 'name' },
        { title: '状态', field: 'status', formatter: function (value) { return value === 0 ? '正常' : '停用'; } }
    ]
});
$.adminTable.initDelete({ url: base_url + "/demo/demo/delete" });
$.adminTable.initAdd({
    url: base_url + "/demo/demo/insert",
    rules: { name: { required: true, rangelength: [2, 50] } },   // jquery.validate
    messages: { name: { required: "请输入名称" } },
    readFormData: function () {
        return {
            "name": $("#addModal .form input[name=name]").val(),
            "status": $("#addModal .form input[name='status']:checked").val()
        };
    }
});
$.adminTable.initUpdate({
    url: base_url + "/demo/demo/update",
    writeFormData: function (row) {
        $("#updateModal .form input[name='id']").val(row.id);
        $("#updateModal .form input[name='name']").val(row.name);
        $("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
    },
    readFormData: function () {
        return {
            "id": $("#updateModal .form input[name=id]").val(),
            "name": $("#updateModal .form input[name=name]").val(),
            "status": $("#updateModal .form input[name='status']:checked").val()
        };
    }
});
```

> 复杂业务（多页签、详情页、关联下拉）参考 `templates/business/ai/*.ftl` 与对应 Controller。

## 菜单注册 SQL

```sql
-- 目录（需要时）：type=0
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (0, '业务中心', 0, '', '', 'fa-cubes', 10, 0, 0, now(), now());
SELECT @catId := LAST_INSERT_ID();

-- 菜单：type=1，url 为上下文路径下的相对地址
INSERT INTO `xxl_boot_resource` (`parent_id`,`name`,`type`,`permission`,`url`,`icon`,`order`,`status`,`visible`,`add_time`,`update_time`)
VALUES (@catId, 'Demo管理', 1, 'demo:demo', '/demo/demo', 'fa-table', 1, 0, 0, now(), now());

-- 授权（默认管理员 role_id=1）
INSERT INTO `xxl_boot_role_res` (`role_id`,`res_id`,`add_time`,`update_time`)
VALUES (1, @catId, now(), now()), (1, LAST_INSERT_ID(), now(), now());
```

菜单由 `index.ftl` 遍历 `resourceList`（`XxlSsoWebController` 注入，platform 框架逻辑）渲染，无需改路由代码。

## 内置代码生成器（快速出码）

后台「代码生成」页面或在接口工具调用 `POST /tool/codegen/genCode`：

```json
{ "tableSql": "CREATE TABLE xxl_boot_demo (...)", "author": "you",
  "packagePath": "com.xxl.boot.admin.business.demo", "businessName": "Demo" }
```

返回 7 段代码：`controller` / `service` / `service_impl` / `mapper` / `mapper_xml` / `entity` / `page`（FreeMarker 页面）。落位同上方「6 件套」，页面落 `templates/business/demo/demo.ftl`。Skill 缺省策略：AI 直接按 `templates/framework/tool/codegen-module/*.ftl` 渲染等价代码落位，并提示用户在后台也可用生成器。

## 校验清单

- [ ] 需求子目录 `xxl-boot-spec/{yyyyMMdd}-{business}/` 已创建，`方案.md` + SQL 已落盘并同步。
- [ ] 后端 `mvn -q compile` 通过（在 `xxl-boot-admin` 下）。
- [ ] Controller 视图 + `@ResponseBody` 数据接口齐全，全部 `@XxlSso`；数据接口方法顺序 `pageList/load/insert/delete/update`。
- [ ] Mapper XML 显式 resultMap；`add_time/update_time` `NOW()`；分页 `offset/pagesize`。
- [ ] 参数校验返回 `Response.ofFail`；实体/DTO/Adaptor 文案、注释符合 AGENTS.md 6.1。
- [ ] FTL：`commonStyle/commonScript`、`admin.table.js` 引入完整；`#data_filter/#data_operation/#data_list/#addModal/#updateModal` id 规范。
- [ ] 菜单已插资源表并授权；启动后侧边栏可见、点击可打开页面、CRUD 可用。

## 参考文件（绝对路径）

- 标准 CRUD 页面：`xxl-boot-admin/src/main/resources/templates/framework/system/config.ftl`
- 前端表格封装：`xxl-boot-admin/src/main/resources/static/framework/admin.table.js`
- 后端 Controller 范例：`xxl-boot-admin/src/main/java/com/xxl/boot/admin/framework/controller/system/ConfigController.java`
- 复杂业务模块：`xxl-boot-admin/src/main/java/com/xxl/boot/admin/business/ai/**` + `templates/business/ai/*.ftl`
- 代码生成模板：`xxl-boot-admin/src/main/resources/templates/framework/tool/codegen-module/*.ftl`