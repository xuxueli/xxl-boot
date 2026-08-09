--
-- XXL-Boot React 版（xxl-boot-ui-react2）菜单图标更新SQL
-- 说明：将存量菜单数据的图标更新为 antd 图标名称（@ant-design/icons），
--       后续新增菜单在资源管理中直接选择 antd 图标即可。
-- 使用：执行本脚本后刷新登录，菜单将展示 antd 图标。

UPDATE `xxl_boot_resource`
SET `icon` = CASE `id`
                 WHEN 1 THEN 'HomeOutlined'        -- 首页
                 WHEN 2 THEN 'TeamOutlined'        -- 权限管理
                 WHEN 3 THEN 'UserOutlined'        -- 用户管理
                 WHEN 4 THEN 'SafetyOutlined'      -- 角色管理
                 WHEN 5 THEN 'MenuOutlined'        -- 资源管理
                 WHEN 6 THEN 'ApartmentOutlined'   -- 组织管理
                 WHEN 7 THEN 'SettingOutlined'     -- 系统管理
                 WHEN 8 THEN 'BookOutlined'        -- 字典管理
                 WHEN 9 THEN 'ControlOutlined'     -- 配置管理
                 WHEN 10 THEN 'MessageOutlined'    -- 站内消息
                 WHEN 11 THEN 'FileSearchOutlined' -- 审计日志
                 WHEN 12 THEN 'ToolOutlined'       -- 系统工具
                 WHEN 13 THEN 'CodeOutlined'       -- 代码生成
                 WHEN 14 THEN 'AppstoreOutlined'   -- 表单构建
                 WHEN 15 THEN 'QuestionCircleOutlined' -- 帮助中心
                 ELSE ''
    END,
    `update_time` = now()
WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
