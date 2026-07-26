-- ${codegen.functionName} 菜单初始化 SQL
-- Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.

-- 菜单SQL
INSERT INTO `xxl_boot_resource` (`parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `visible`, `add_time`, `update_time`)
VALUES (0, '${codegen.functionName}', 1, '${codegen.moduleName}:${codegen.businessName?lower_case}', '/${codegen.moduleName}/${codegen.businessName?lower_case}', '', 999, 0, 0, now(), now());

-- 菜单ID
SELECT @parentId := LAST_INSERT_ID();

-- 角色菜单关系（默认管理员角色 role_id = 1）
INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES (1, @parentId, now(), now());