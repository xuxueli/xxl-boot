
-- ================== Vue 版本菜单 icon 等属性存在差异；执行如下SQL重置 xxl_boot_resource 表数据  ====================

delete from xxl_boot_resource;
INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `visible`, `add_time`, `update_time`)
VALUES (1, 0, '首页', 1, 'dashboard', '/dashboard', 'dashboard', 100, 0, 0, now(), now()),
       (2, 0, '组织管理', 0, 'org', '/org', 'monitor', 900, 0, 0, now(), now()),
       (3, 2, '用户管理', 1, 'org:user', '/org/user', 'user', 901, 0, 0, now(), now()),
       (4, 2, '角色管理', 1, 'org:role', '/org/role', 'peoples', 902, 0, 0, now(), now()),
       (5, 2, '资源管理', 1, 'org:resource', '/org/resource', 'tree-table', 903, 0, 0, now(), now()),
       (6, 2, '组织管理', 1, 'org:org', '/org/org', 'tree', 904, 0, 0, now(), now()),
       (7, 0, '系统管理', 0, 'system', '/system', 'system', 910, 0, 0, now(), now()),
       (8, 7, '字典管理', 1, 'system:dict', '/system/dict', 'dict', 911, 0, 0, now(), now()),
       (9, 7, '参数管理', 1, 'system:config', '/system/config', 'edit', 912, 0, 0, now(), now()),
       (10, 7, '站内消息', 1, 'system:message', '/system/message', 'message', 913, 0, 0, now(), now()),
       (11, 7, '审计日志', 1, 'system:log', '/system/log', 'log', 914, 0, 0, now(), now()),
       (12, 0, '系统工具', 0, 'tool', '/tool', 'tool', 920, 0, 0, now(), now()),
       (13, 12, '代码生成', 1, 'tool:codegen', '/tool/codegen', 'build', 921, 0, 0, now(), now()),
       (14, 12, '表单构建', 1, 'tool:pagegen', '/tool/pagegen', 'code', 922, 0, 0, now(), now()),
       (15, 0, '帮助中心', 1, 'help', '/help', 'guide', 930, 0, 0, now(), now());
