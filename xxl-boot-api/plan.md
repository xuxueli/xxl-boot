
1、api 重构：
    - 模块代码重构：
        - api:              x-03  
        - assets:           done
        - components:       x-02   
        - directives:       done      
        - layouts:          x-01
        - router:           ing：
            - route逻辑待整理重构：菜单 path、componet 统一；左侧+顶部+搜索，逻辑统一；
                - store/modules/tagsView.js
                - layout/components/Sidebar/SidebarItem.vue
                - layout/components/Sidebar/index.vue
                - layout/components/IframeToggle
                - layout/components/TopNav/index.vue
                - layout/components/TagsView
                - components/Breadcrumb/index.vue
                - components/HeaderSearch/index.vue
        - store:            x
        - utils:            x
        - views:            x-03
    - 登录相关：Login、用户信息管理、验证码；
    - 菜单权限：菜单查询、权限/角色列表；
    - API平移：
        - 管理端 API；

2、API + VUE新开发：
    - 登录相关： 登录 + 验证码；
    - 个人信息管理
    - 菜单初始化：权限联动；
    - 功能兼容：
        - 组织：组织、用户、角色、菜单；
        - 通知、审计
        - 代码生成、表单构建
        - 字典管理