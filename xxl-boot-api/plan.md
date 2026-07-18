
1、api 重构：
    - 模块代码重构：
            - api:              done
            - assets:           done
            - directives:       done
            - router:        done：              
            - layouts:          x-01
                - Navbar
                - Sidebar
                - TagsView
            - components:       x-02
            - store:            x
                - 非必须合并；
            - utils:            x
                - 非必须合并；
            - views:            x-03
        - 登录相关：Login、用户信息管理、验证码；
        - 菜单权限：菜单查询、权限/角色列表；
        - API平移：
            - 管理端 API；
        - 升级TS；

2、API + VUE新开发：
    - 登录相关： 登录 + 验证码；
    - 个人信息管理
    - 菜单初始化：权限联动；
    - 功能兼容：
        - 组织：组织、用户、角色、菜单；
        - 通知、审计
        - 代码生成、表单构建
        - 字典管理
