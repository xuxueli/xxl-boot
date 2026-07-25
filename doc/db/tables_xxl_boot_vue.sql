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
    `email`         VARCHAR(100)    DEFAULT NULL                 COMMENT '邮箱',
    `phone`         VARCHAR(20)     DEFAULT NULL                 COMMENT '手机号码',
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
    `visible`       TINYINT         NOT NULL                     COMMENT '显示状态：0-显示、1-隐藏',
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


-- ================== system：message、log、dict、config ==================

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

CREATE TABLE `xxl_boot_message_read` (
    `id`            BIGINT          NOT NULL AUTO_INCREMENT     COMMENT 'ID',
    `message_id`    BIGINT          NOT NULL                    COMMENT '消息ID',
    `user_id`       INT             NOT NULL                    COMMENT '用户ID',
    `add_time`      DATETIME        NOT NULL                    COMMENT '阅读时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_message_user` (`message_id`, `user_id`) USING BTREE
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

CREATE TABLE `xxl_boot_config`
(
    `id`                BIGINT          NOT NULL AUTO_INCREMENT     COMMENT '配置ID',
    `name`              VARCHAR(100)    NOT NULL                    COMMENT '配置名称',
    `key`               VARCHAR(100)    NOT NULL                    COMMENT '配置Key',
    `value`             VARCHAR(500)    NOT NULL                    COMMENT '配置Value',
    `status`            TINYINT         NOT NULL                    COMMENT '状态：0-正常、1-停用',
    `add_time`          DATETIME        NOT NULL                    COMMENT '新增时间',
    `update_time`       DATETIME        NOT NULL                    COMMENT '更新时间',
    `remark`            VARCHAR(500)    DEFAULT NULL                COMMENT '备注',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_type` (`key`) USING BTREE
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;


-- ================== tool：codegen ==================

CREATE TABLE `xxl_boot_codegen`
(
    `id`               BIGINT          NOT NULL AUTO_INCREMENT      COMMENT '编号',
    `table_name`       VARCHAR(200)    DEFAULT ''                   COMMENT '表名称',
    `table_comment`    VARCHAR(500)    DEFAULT ''                   COMMENT '表描述',
    `sub_table_name`   VARCHAR(64)     DEFAULT NULL                 COMMENT '关联子表的表名',
    `sub_table_fk_name` VARCHAR(64)    DEFAULT NULL                 COMMENT '子表关联的外键名',
    `class_name`       VARCHAR(100)    DEFAULT ''                   COMMENT '实体类名称',
    `tpl_category`     VARCHAR(200)    DEFAULT 'crud'               COMMENT '使用的模板（crud单表操作 tree树表操作）',
    `tpl_web_type`     VARCHAR(30)     DEFAULT ''                   COMMENT '前端模板类型（element-ui element-plus）',
    `package_name`     VARCHAR(100)    DEFAULT NULL                 COMMENT '生成包路径',
    `module_name`      VARCHAR(30)     DEFAULT NULL                 COMMENT '生成模块名',
    `business_name`    VARCHAR(30)     DEFAULT NULL                 COMMENT '生成业务名',
    `function_name`    VARCHAR(50)     DEFAULT NULL                 COMMENT '生成功能名',
    `function_author`  VARCHAR(50)     DEFAULT NULL                 COMMENT '生成功能作者',
    `form_col_num`     INT             DEFAULT 1                    COMMENT '表单布局（1单列 2双列 3三列）',
    `gen_type`         CHAR(1)         DEFAULT '0'                  COMMENT '生成代码方式（0zip压缩包 1自定义路径）',
    `gen_path`         VARCHAR(200)    DEFAULT '/'                  COMMENT '生成路径（不填默认项目路径）',
    `options`          VARCHAR(1000)   DEFAULT NULL                 COMMENT '其它生成选项',
    `add_time`         DATETIME        NOT NULL                     COMMENT '创建时间',
    `update_time`      DATETIME        NOT NULL                     COMMENT '更新时间',
    `remark`           VARCHAR(500)    DEFAULT NULL                 COMMENT '备注',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4;

CREATE TABLE `xxl_boot_codegen_field`
(
    `id`              BIGINT          NOT NULL AUTO_INCREMENT      COMMENT '编号',
    `codegen_id`      BIGINT          NOT NULL                     COMMENT '归属表编号',
    `column_name`     VARCHAR(200)    DEFAULT NULL                 COMMENT '列名称',
    `column_comment`  VARCHAR(500)    DEFAULT NULL                 COMMENT '列描述',
    `column_type`     VARCHAR(100)    DEFAULT NULL                 COMMENT '列类型',
    `java_type`       VARCHAR(500)    DEFAULT NULL                 COMMENT 'JAVA类型',
    `java_field`      VARCHAR(200)    DEFAULT NULL                 COMMENT 'JAVA字段名',
    `is_pk`           CHAR(1)         DEFAULT NULL                 COMMENT '是否主键（1是）',
    `is_increment`    CHAR(1)         DEFAULT NULL                 COMMENT '是否自增（1是）',
    `is_required`     CHAR(1)         DEFAULT NULL                 COMMENT '是否必填（1是）',
    `is_insert`       CHAR(1)         DEFAULT NULL                 COMMENT '是否为插入字段（1是）',
    `is_edit`         CHAR(1)         DEFAULT NULL                 COMMENT '是否编辑字段（1是）',
    `is_list`         CHAR(1)         DEFAULT NULL                 COMMENT '是否列表字段（1是）',
    `is_query`        CHAR(1)         DEFAULT NULL                 COMMENT '是否查询字段（1是）',
    `query_type`      VARCHAR(200)    DEFAULT 'EQ'                 COMMENT '查询方式（等于、不等于、大于、小于、范围）',
    `html_type`       VARCHAR(200)    DEFAULT NULL                 COMMENT '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）',
    `dict_type`       VARCHAR(200)    DEFAULT ''                   COMMENT '字典类型',
    `sort`            INT             DEFAULT NULL                 COMMENT '排序',
    `add_time`        DATETIME        NOT NULL                     COMMENT '创建时间',
    `update_time`     DATETIME        NOT NULL                     COMMENT '更新时间',
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
