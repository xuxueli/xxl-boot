--
-- 前后端分离项目初始化SQL脚本（react 版本）

USE `xxl_boot`;
SET NAMES utf8mb4;

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
                 WHEN 9 THEN 'BookOutlined'        -- 字典项管理
                 WHEN 10 THEN 'ControlOutlined'     -- 配置管理
                 WHEN 11 THEN 'MessageOutlined'    -- 站内消息
                 WHEN 12 THEN 'FileSearchOutlined' -- 审计日志
                 WHEN 13 THEN 'ToolOutlined'       -- 系统工具
                 WHEN 14 THEN 'CodeOutlined'       -- 代码生成
                 WHEN 15 THEN 'AppstoreOutlined'   -- 表单构建
                 WHEN 16 THEN 'QuestionCircleOutlined' -- 帮助中心
                 ELSE ''
    END,
    `update_time` = now()
WHERE `id` BETWEEN 1 AND 16;
