--
-- XXL-BOOT
-- Copyright (c) 2015-present, xuxueli.

CREATE DATABASE IF NOT EXISTS `xxl_boot` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `xxl_boot`;

-- ================== org：user and auth ==================

CREATE TABLE `xxl_boot_org`
(
    `id`            INT             NOT NULL AUTO_INCREMENT      COMMENT '组织ID',
    `parent_id`     INT             NOT NULL                     COMMENT '父组织ID',
    `name`          VARCHAR(50)     NOT NULL                     COMMENT '名称',
    `order`         INT             NOT NULL                     COMMENT '顺序',
    `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-禁用',
    `manager`       VARCHAR(50)     DEFAULT NULL                 COMMENT '负责人',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_user`
(
    `id`            INT             NOT NULL AUTO_INCREMENT      COMMENT '用户ID',
    `org_id`        INT             DEFAULT 0                    COMMENT '组织ID',
    `username`      VARCHAR(50)     NOT NULL                     COMMENT '账号',
    `password`      VARCHAR(100)    NOT NULL                     COMMENT '密码加密信息',
    `token`         VARCHAR(100)    DEFAULT NULL                 COMMENT '登录token',
    `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-禁用',
    `real_name`     VARCHAR(50)     DEFAULT NULL                 COMMENT '真实姓名',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_username` (`username`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_role`
(
    `id`            INT             NOT NULL AUTO_INCREMENT      COMMENT '角色ID',
    `name`          VARCHAR(50)     NOT NULL                     COMMENT '角色名称',
    `code`          VARCHAR(50)     NOT NULL                     COMMENT '角色标识',
    `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-禁用',
    `order`         INT             NOT NULL                     COMMENT '顺序',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_resource`
(
    `id`            INT             NOT NULL AUTO_INCREMENT      COMMENT '资源ID',
    `parent_id`     INT             NOT NULL                     COMMENT '父节点ID',
    `name`          VARCHAR(50)     NOT NULL                     COMMENT '名称',
    `type`          TINYINT         NOT NULL                     COMMENT '类型',
    `permission`    VARCHAR(50)     DEFAULT NULL                 COMMENT '权限标识',
    `url`           VARCHAR(50)     DEFAULT NULL                 COMMENT '菜单地址',
    `icon`          VARCHAR(50)     DEFAULT NULL                 COMMENT '资源icon',
    `order`         INT             NOT NULL                     COMMENT '顺序',
    `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-禁用',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_user_role`
(
    `id`            INT             NOT NULL AUTO_INCREMENT,
    `user_id`       INT             NOT NULL,
    `role_id`       INT             NOT NULL,
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_role_res`
(
    `id`            INT             NOT NULL AUTO_INCREMENT,
    `role_id`       INT             NOT NULL,
    `res_id`        INT             NOT NULL,
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


-- ================== system：message and log ==================

CREATE TABLE `xxl_boot_log`
(
    `id`            BIGINT          NOT NULL AUTO_INCREMENT      COMMENT '日志ID',
    `type`          INT             NOT NULL                     COMMENT '日志类型（如操作日志、登陆日志）',
    `module`        VARCHAR(50)     NOT NULL                     COMMENT '日志标题（如用户管理）',
    `title`         VARCHAR(50)     NOT NULL                     COMMENT '日志标题',
    `content`       TEXT            NOT NULL                     COMMENT '日志内容',
    `operator`      VARCHAR(20)     DEFAULT NULL                 COMMENT '操作人',
    `ip`            VARCHAR(50)     DEFAULT NULL                 COMMENT '操作IP',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_message`
(
    `id`            BIGINT          NOT NULL AUTO_INCREMENT      COMMENT '消息ID',
    `category`      INT             NOT NULL                     COMMENT '分类（如 通知、新闻 ）',
    `title`         VARCHAR(50)     NOT NULL                     COMMENT '标题',
    `content`       TEXT            NOT NULL                     COMMENT '内容',
    `sender`        VARCHAR(50)     NOT NULL                     COMMENT '发送人',
    `status`        TINYINT         NOT NULL                     COMMENT '状态：0-正常、1-下线',
    `add_time`      DATETIME        NOT NULL                     COMMENT '新增时间',
    `update_time`   DATETIME        NOT NULL                     COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_dict`
(
    `id`                BIGINT          NOT NULL AUTO_INCREMENT     COMMENT '字典ID',
    `name`              VARCHAR(100)    NOT NULL                    COMMENT '字典名称',
    `code`              VARCHAR(100)    NOT NULL                    COMMENT '字典标识',
    `status`            TINYINT         NOT NULL                    COMMENT '状态：0-正常、1-停用',
    `add_time`          DATETIME        NOT NULL                    COMMENT '新增时间',
    `update_time`       DATETIME        NOT NULL                    COMMENT '更新时间',
    `remark`            VARCHAR(500)    DEFAULT NULL                COMMENT '备注',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_type` (`code`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_dict_item`
(
    `id`                BIGINT          NOT NULL AUTO_INCREMENT     COMMENT '字典子项ID',
    `dict_id`           BIGINT          NOT NULL                    COMMENT '字典ID',
    `item_name`         VARCHAR(100)    NOT NULL                    COMMENT '字典子项名称',
    `item_code`         VARCHAR(100)    NOT NULL                    COMMENT '字典子项标识',
    `status`            TINYINT         NOT NULL                    COMMENT '状态：0-正常、1-停用',
    `order`             INT             NOT NULL                    COMMENT '顺序',
    `add_time`          DATETIME        NOT NULL                    COMMENT '新增时间',
    `update_time`       DATETIME        NOT NULL                    COMMENT '更新时间',
    `remark`            VARCHAR(500)    DEFAULT NULL                COMMENT '备注',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

-- ================== for default data ==================

START TRANSACTION;

INSERT INTO `xxl_boot_user` (`id`, `org_id`, `username`, `password`, `token`, `status`, `real_name`, `add_time`, `update_time`)
VALUES (1, 0, 'admin', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 0, '吴彦祖', now(), now()),
       (2, 0, 'user', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', '', 0, '张三', now(), now());

INSERT INTO `xxl_boot_role` (`id`, `name`, `code`, `status`, `order`, `add_time`, `update_time`)
VALUES (1, '管理员', 'admin', 0, 1, now(), now()),
       (2, '普通用户', 'user', 0, 2, now(), now());

INSERT INTO `xxl_boot_user_role` (`id`, `user_id`, `role_id`, `add_time`, `update_time`)
VALUES (1, 1, 1, now(), now()),
       (2, 2, 2, now(), now());

INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (1, 0, '首页', 1, 'dashboard', '/dashboard', 'fa fa-home', 100, 0, now(), now()),
       (2, 0, '组织管理', 0, 'org', '/org', 'fa-users', 900, 0, now(), now()),
       (3, 2, '用户管理', 1, 'org:user', '/org/user', '', 901, 0, now(), now()),
       (4, 2, '角色管理', 1, 'org:role', '/org/role', '', 902, 0, now(), now()),
       (5, 2, '资源管理', 1, 'org:resource', '/org/resource', '', 903, 0, now(), now()),
       (6, 2, '组织管理', 1, 'org:org', '/org/org', '', 904, 0, now(), now()),
       (7, 0, '系统管理', 0, 'system', '/system', 'fa-cogs', 910, 0, now(), now()),
       (8, 7, '站内消息', 1, 'system:message', '/system/message', '', 911, 0, now(), now()),
       (9, 7, '字典管理', 1, 'system:dict', '/system/dict', '', 912, 0, now(), now()),
       (10, 7, '参数管理', 1, 'system:config', '/system/config', '', 913, 0, now(), now()),
       (11, 7, '审计日志', 1, 'system:log', '/system/log', '', 914, 0, now(), now()),
       (12, 0, '系统工具', 0, 'tool', '/tool', 'fa-wrench', 920, 0, now(), now()),
       (13, 12, '代码生成', 1, 'tool:codegen', '/tool/codegen', '', 921, 0, now(), now()),
       (14, 12, '表单构建', 1, 'tool:pagegen', '/tool/pagegen', '', 922, 0, now(), now()),
       (15, 0, '帮助中心', 1, 'help', '/help', 'fa-book', 930, 0, now(), now());

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
       (13, 1, 13, now(), now()),
       (14, 1, 14, now(), now()),
       (15, 1, 15, now(), now()),
       (16, 2, 1, now(), now()),
       (17, 2, 12, now(), now()),
       (18, 2, 13, now(), now()),
       (19, 2, 14, now(), now()),
       (20, 2, 15, now(), now());

INSERT INTO `xxl_boot_message` (`category`, `title`, `content`, `sender`, `status`, `add_time`, `update_time`)
VALUES (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>', 'admin', 0, now(), now()),
       (0, 'XXL-BOOT 新版发布 | 快速开发平台', '<p><strong>XXL-BOOT </strong>是一个快速开发平台，易学易用、灵活扩展、开箱即用。内置安全登录、权限管控、端到端代码生成、响应式布局、多语言、通告触达&hellip;&hellip;等能力。整合前后端流行技术，致力为 中小企业、个人开发者 打造开箱即用的中后台解决方案。</p>
<p>&nbsp;</p> <p><u><strong>项目文档</strong></u>：<a href="https://www.xuxueli.com/xxl-boot/" target="_blank">https://www.xuxueli.com/xxl-boot/</a></p> <p><u><strong>GitHub地址</strong></u>：<a href="https://github.com/xuxueli/xxl-boot/" target="_blank">https://github.com/xuxueli/xxl-boot/</a></p>
', 'admin', 0, now(), now());

COMMIT;
