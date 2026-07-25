

## 1、目标：

现状：当前存在前后端分离项目，前端项目为 xxl-boot-ui，后端项目为 xxl-boot-backup/api，低层数据库为 xxl-boot-backup/api/doc/tables-init.sql。
目标：
- 后端项目替换为 xxl-boot-api，新后端项目底层数据库为 doc/db/tables_xxl_boot.sql。
- 前端项目交互层保持不变，低层API服务更换为对接 xxl-boot-api。
- 后端项目 API 接口目录为  xxl-boot-api/src/main/java/com/xxl/boot/api/framework/controller。如果 后端对应 Controller 没有匹配的接口，新建新接口或修改旧接口支持。
- 注意，新后端项目的 token 鉴权逻辑和旧项目不同，新后端项目通过 XxlSsoNativeInterceptor 处理鉴权。

## 2、改造范围

- 框架层：
    - 验证码：captchaImage                  【done】
    - 登录：login                           【done】
    - 个人信息（权限、角色列表）：getInfo       【done】
    - 菜单路由：getRouters                   【done】
    - 公告：listTop                         【done】
    - 注销：logout                          【done】
    - 个人管理：
      - profile查询
      - profile修改
      - updatePwd修改；
- 业务层：
    - 首页：                      
    - 组织管理：用户、角色、菜单、部门
    - 系统管理：字典、参数、通知公告、审计日志
    - 系统工具：表单、代码生成
    - 帮助中心：                             【done】

## 3、其他
略/TS。