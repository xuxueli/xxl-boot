

1、admin 重构：
    - 系统工具：
        - Model：Entity、DTO、Adaptor 下的类，移除 XxlBoot 前缀          
        - 代码生成：
            - 属性：
                - Package路径：【com.xxl.boot.admin.business】controller/service/mapper/model; // AbcController
                - 业务标识：【abc】// 默认表名
                - author：
        - 表单构建（ui-build）：纯前端
2、api 重构：
    - 登录相关：Login、用户信息管理、验证码；
    - 菜单权限：菜单查询、权限/角色列表；
    - API平移：
        - 管理端 API；

3、API + VUE新开发：
    - 登录相关： 登录 + 验证码；
    - 个人信息管理
    - 菜单初始化：权限联动；
    - 功能兼容：
        - 组织：组织、用户、角色、菜单；
        - 通知、审计
        - 代码生成、表单构建
        - 字典管理