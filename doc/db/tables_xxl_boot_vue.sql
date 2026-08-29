--
-- 前后端分离项目初始化SQL脚本（xxl-boot-ui 版本）

UPDATE `xxl_boot_resource`
SET `icon` = CASE `id`
                 WHEN 1 THEN 'dashboard'
                 WHEN 2 THEN 'monitor'
                 WHEN 3 THEN 'user'
                 WHEN 4 THEN 'peoples'
                 WHEN 5 THEN 'tree-table'
                 WHEN 6 THEN 'tree'
                 WHEN 7 THEN 'system'
                 WHEN 8 THEN 'dict'
                 WHEN 9 THEN 'dict'
                 WHEN 10 THEN 'edit'
                 WHEN 11 THEN 'message'
                 WHEN 12 THEN 'log'
                 WHEN 13 THEN 'tool'
                 WHEN 14 THEN 'build'
                 WHEN 15 THEN 'code'
                 WHEN 16 THEN 'guide'
                 ELSE ''
    END,
    `update_time` = now()
WHERE `id` BETWEEN 1 AND 16;

