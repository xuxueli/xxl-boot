
1、UI 重构：
    - 模块代码重构：
            - api:              done
            - assets:           done
            - directives:       done
            - router:           done：              
            - layouts:          done
            - store:            done
            - components:       done
            - composables       done       
            - utils:            done
            - views:            x-02
                - 框架：
                  - 个人管理：profile 查询、 profile修改、updatePwd修改；
                - 功能：
                    - 组织管理：用户
                - 目录调整：
                    - index：首页：
                    - org：组织管理； /user、role、resource、org
                    - system：系统管理；/message、dict、config、log
                    - tool：系统工具；/codegen、pagegen
                    - help：帮助中心

2、UI 集成 API 服务；
    - Copy：代码copy 孵化项；不可逆修改；
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