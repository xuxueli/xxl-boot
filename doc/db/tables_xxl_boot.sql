#
# XXL-BOOT
# Copyright (c) 2015-present, xuxueli.

CREATE database if NOT EXISTS `xxl_boot` default character set utf8mb4 collate utf8mb4_unicode_ci;
use `xxl_boot`;

SET NAMES utf8mb4;

## —————————————————————— org：user and auth ——————————————————
CREATE TABLE `xxl_boot_org` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '组织ID',
    `parent_id` int(11) NOT NULL COMMENT '父组织ID',
    `name` varchar(50) NOT NULL COMMENT '名称',
    `order` int(11) NOT NULL COMMENT '顺序',
    `status` tinyint(4) NOT NULL COMMENT '状态：0-正常、1-禁用',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `xxl_boot_user` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` varchar(50) NOT NULL COMMENT '账号',
    `password` varchar(100) NOT NULL COMMENT '密码加密信息',
    `token` varchar(100) DEFAULT NULL COMMENT '登录token',
    `status` tinyint(4) NOT NULL COMMENT '状态：0-正常、1-禁用',
    `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_boot_role` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
    `name` varchar(50) NOT NULL,
    `order` int(11) NOT NULL COMMENT '顺序',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_boot_resource` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '资源ID',
    `parent_id` int(11) NOT NULL COMMENT '父节点ID',
    `name` varchar(50) NOT NULL COMMENT '名称',
    `type` tinyint(4) NOT NULL COMMENT '类型',
    `permission` varchar(50) DEFAULT NULL COMMENT '权限标识',
    `url` varchar(50) DEFAULT NULL COMMENT '菜单地址',
    `icon` varchar(50) DEFAULT NULL COMMENT '资源icon',
    `order` int(11) NOT NULL COMMENT '顺序',
    `status` tinyint(4) NOT NULL COMMENT '状态：0-正常、1-禁用',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `xxl_boot_user_role` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `user_id` int(11) NOT NULL,
    `role_id` int(11) NOT NULL,
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `xxl_boot_role_res` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `role_id` int(11) NOT NULL,
    `res_id` int(11) NOT NULL,
    `add_time` datetime NOT NULL COMMENT '更新时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


## —————————————————————— system：message and log ——————————————————

CREATE TABLE `xxl_boot_log` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
    `type` int(11) NOT NULL COMMENT '日志类型（如操作日志、登陆日志）',
    `module` varchar(50) NOT NULL COMMENT '日志标题（如用户管理）',
    `title` varchar(50) NOT NULL COMMENT '日志标题',
    `content` text NOT NULL COMMENT '日志内容',
    `operator` varchar(20) COMMENT '操作人',
    `ip` varchar(50) COMMENT '操作IP',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `xxl_boot_message` (
    `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '消息ID',
    `category` int(11) NOT NULL COMMENT '分类（如 通知、新闻 ）',
    `title` varchar(50) NOT NULL COMMENT '标题',
    `content` text NOT NULL COMMENT '内容',
    `sender` varchar(50) NOT NULL COMMENT '发送人',
    `status` tinyint(4) NOT NULL COMMENT '状态：0-正常、1-下线',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


## —————————————————————— for default data ——————————————————

INSERT INTO `xxl_boot_user` (`id`, `username`, `password`, `token`, `status`, `real_name`, `add_time`, `update_time`)
VALUES (1, 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 0 , '吴彦祖', now(), now()),
       (2, 'user', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 0 , '张三', now(), now());
INSERT INTO `xxl_boot_role` (`id`, `name`, `order`, `add_time`, `update_time`)
VALUES (1, '管理员', 1, now(), now()),
       ( 2, '普通用户', 2, now(), now());
INSERT INTO `xxl_boot_user_role` (`id`, `user_id`, `role_id`, `add_time`, `update_time`)
VALUES (1, 1, 1, now(), now()),
       (2, 2, 2, now(), now());
INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (1, 0,'首页', 1, 'dashboard', '/dashboard', 'fa fa-home', 100, 0, now(), now()),
        (2, 0,'组织管理', 0, 'org', '/org', 'fa-users', 900, 0, now(), now()),
        (3, 2,'用户管理', 1, 'org:user', '/org/user', "", 901, 0, now(), now()),
        (4, 2,'角色管理', 1, 'org:role', '/org/role', "", 902, 0, now(), now()),
        (5, 2, '资源管理', 1, 'org:resource', '/org/resource', "", 903, 0, now(), now()),
        (6, 2,'组织管理', 1, 'org:org', '/org/org', "", 904, 0, now(), now()),
        (7, 0,'系统管理', 0, 'system', '/system', 'fa-cogs', 910, 0, now(), now()),
        (8, 7,'通知管理', 1, 'system:message', '/system/message', 'fa-cogs', 911, 0, now(), now()),
        (9, 7,'审计日志', 1, 'system:log', '/system/log', 'fa-cogs', 912, 0, now(), now()),
        (10, 0,'系统工具', 0, 'tool', '/tool', 'fa-wrench', 920, 0, now(), now()),
        (11, 10,'代码生成', 1, 'tool:codegen', '/tool/codegen', "", 921, 0, now(), now()),
        (12, 0,'帮助中心', 1, 'help', '/help', 'fa-book', 930, 0, now(), now());
INSERT INTO `xxl_boot_role_res` (`id`, `role_id`, `res_id`, `add_time`, `update_time`)
VALUES (1, 1, 1, now(), now()),
       (2, 1, 2, now(), now()),
       (3, 1, 3, now(), now()),
       (4, 1, 4, now(), now()),
       (5, 1, 5, now(), now()),
       (6, 1, 6, now(), now()),
       (7, 1, 7, now(), now()),
       (8, 1, 8, now(), now()),
       (9, 1, 9, now(), now()),
       (10, 1, 10, now(), now()),
       (11, 1, 11, now(), now()),
       (12, 1, 12, now(), now()),
       (13, 2, 1, now(), now()),
       (14, 2, 10, now(), now()),
       (15, 2, 11, now(), now()),
       (16, 2, 12, now(), now());

INSERT INTO `xxl_boot_message` (category, title, content, sender, status, add_time, update_time)
VALUES (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT 新版发布 | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>
<p>&nbsp;</p> <p><u><strong>项目文档</strong></u>：<a href="https://www.xuxueli.com/xxl-boot/" target="_blank">https://www.xuxueli.com/xxl-boot/</a></p> <p><u><strong>GitHub地址</strong></u>：<a href="https://github.com/xuxueli/xxl-boot/" target="_blank">https://github.com/xuxueli/xxl-boot/</a></p>
', 'admin', 0, now(), now());



commit;
