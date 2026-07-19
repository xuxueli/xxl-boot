
1、UI 重构：
    - 模块代码重构：
            - api:              done
            - assets:           done
            - directives:       done
            - router:           done：              
            - layouts:          done
            - components:       x-02
                - DictTag
                - Editor
                - ExcelImportDialog
                - IconSelect
                - Pagination
                - RightToolbar
                - SvgIcon
                - TreePanel
                - index // 
                - iFrame   【未使用】
                - FileUpload
                - ImagePreview
                - ImageUpload
            - store:            x
                - 非必须合并；
            - utils:            x
                - 非必须合并；
            - views:            x-03
                - 登录、注销
                - 权限、角色列表
                - 菜单：
                - 个人信息：
                - 用户管理：

2、UI 集成 API 服务；
    - 登录 + 验证码 + 注销
    - 权限、角色列表
    - 菜单
    - 个人信息
    - 用户管理
    - 功能兼容：
        - 组织：组织、用户、角色、菜单；
        - 通知、审计
        - 代码生成、表单构建
        - 字典管理

3、升级TS；