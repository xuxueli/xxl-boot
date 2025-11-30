
## —————————————————————— for ai ——————————————————

INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (200, 0,'大模型应用', 0, 'ai', '/ai', 'fa-fire', 200, 0, now(), now()),
       (201, 200,'Agent管理', 1, 'ai:agent', '/ai/agent', "", 201, 0, now(), now());

INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES ( 1, 200, now(), now()),
       (1, 201, now(), now());