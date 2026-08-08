-- ${codegen.functionName} 菜单初始化 SQL
-- Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.

-- 菜单SQL
INSERT INTO `xxl_boot_resource` (`parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `visible`, `add_time`, `update_time`)
VALUES (0, '${codegen.functionName}', 1, '${codegen.moduleName}:${codegen.businessName?lower_case}', '/${codegen.moduleName}/${codegen.businessName?lower_case}', '', 999, 0, 0, now(), now());

-- 菜单ID
SELECT @parentId := LAST_INSERT_ID();

-- 按钮权限SQL（新增/修改/删除，type=2 按钮，合并为一条多值插入）
INSERT INTO `xxl_boot_resource` (`parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `visible`, `add_time`, `update_time`)
VALUES (@parentId, '${codegen.functionName}新增', 2, '${codegen.moduleName}:${codegen.businessName?lower_case}:add', '', '', 1, 0, 0, now(), now()),
       (@parentId, '${codegen.functionName}修改', 2, '${codegen.moduleName}:${codegen.businessName?lower_case}:edit', '', '', 2, 0, 0, now(), now()),
       (@parentId, '${codegen.functionName}删除', 2, '${codegen.moduleName}:${codegen.businessName?lower_case}:remove', '', '', 3, 0, 0, now(), now());

-- 按钮ID（多值插入 LAST_INSERT_ID 返回首行，三行自增连续，按序 +1/+2）
SELECT @btnAddId := LAST_INSERT_ID(),
       @btnEditId := LAST_INSERT_ID() + 1,
       @btnDelId := LAST_INSERT_ID() + 2;

-- 角色菜单关系（默认管理员角色 role_id = 1）
INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES (1, @parentId, now(), now()),
       (1, @btnAddId, now(), now()),
       (1, @btnEditId, now(), now()),
       (1, @btnDelId, now(), now());
