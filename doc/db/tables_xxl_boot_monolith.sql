--
-- 单体项目初始化SQL脚本（xxl-boot-admin 版本）

UPDATE `xxl_boot_resource`
SET `icon` = CASE `id`
                 WHEN 1 THEN 'fa fa-home'
                 WHEN 2 THEN 'fa-users'
                 WHEN 3 THEN ''
                 WHEN 4 THEN ''
                 WHEN 5 THEN ''
                 WHEN 6 THEN ''
                 WHEN 7 THEN 'fa-cogs'
                 WHEN 8 THEN ''
                 WHEN 9 THEN ''
                 WHEN 10 THEN ''
                 WHEN 11 THEN ''
                 WHEN 12 THEN 'fa-wrench'
                 WHEN 13 THEN ''
                 WHEN 14 THEN ''
                 WHEN 15 THEN 'fa-book'
                 ELSE ''
    END,
    `update_time` = now()
WHERE `id` IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15);
