--
-- 前后端分离项目初始化SQL脚本（xxl-boot-api/ui 版本）

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
                 WHEN 9 THEN 'edit'
                 WHEN 10 THEN 'message'
                 WHEN 11 THEN 'log'
                 WHEN 12 THEN 'tool'
                 WHEN 13 THEN 'build'
                 WHEN 14 THEN 'code'
                 WHEN 15 THEN 'guide'
                 ELSE ''
    END,
    `update_time` = now()
WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);

