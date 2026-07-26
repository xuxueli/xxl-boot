-- ${codegen.functionName} 菜单 SQL
-- Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
INSERT INTO xxl_boot_resource (parent_id, name, type, permission, url, icon, order, status, visible, add_time, update_time)
VALUES (0, '${codegen.functionName}', 1, '${codegen.moduleName}:${codegen.businessName?lower_case}', '/${codegen.moduleName}/${codegen.businessName?lower_case}', '', 999, 0, 0, now(), now());
