
1、UI 重构：
    - 模块代码重构：
            - api:              done
            - assets:           done
            - directives:       done
            - router:           done：              
            - layouts:          done
            - store:            done
            - components:       x-02
                - ExcelImportDialog 
                - FileUpload
                - ImageUpload
            - composables
                - useFormReset
                - userPasswordRule
            - utils:            x
                - 非必须合并；
            - views:            x-03
                - 框架：
                  - 验证码：captchaImage
                  - 登录：login
                  - 个人信息（权限、角色列表）：getInfo
                  - 菜单路由：getRouters
                  - 公告：listTop
                  - 注销：logout
                  - 个人管理：profile查询、 profile修改、updatePwd修改；
                - 功能：
                    - 组织管理：用户

2、UI 集成 API 服务；
    - 框架：
        - 验证码：captchaImage
        - 登录：login
        - 个人信息（权限、角色列表）：getInfo
        - 菜单路由：getRouters
        - 公告：listTop
        - 注销：logout
        - 个人管理：profile查询、 profile修改、updatePwd修改；
    - 功能：
        - 首页： 
        - 组织管理：用户、角色、菜单、部门
        - 系统管理：字典、参数、通知公告、审计日志
        - 系统工具：表单、代码生成
        - 帮助中心：

3、升级TS；