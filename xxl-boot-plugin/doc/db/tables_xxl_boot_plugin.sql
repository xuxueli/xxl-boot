#
# XXL-BOOT
# Copyright (c) 2025-present, xuxueli.

## —————————————————————— for ai start ——————————————————

## ----------- model、chat、message -----------
CREATE TABLE `xxl_boot_ai_model`(
    `id`                    int(11)         NOT NULL AUTO_INCREMENT COMMENT 'Model ID',
    `name`                  varchar(100)    NOT NULL COMMENT 'Model名称',
    `model_type`            tinyint(4)      NOT NULL COMMENT 'Model类型：1-基础模型，1-文本模型，2-视觉模型',
    `supplier_type`         tinyint(4)      NOT NULL COMMENT '供应商类型：1-Ollama',
    `model`                 varchar(255)    NOT NULL COMMENT 'model，如 qwen3:0.6b',
    `base_url`              varchar(500)    NOT NULL COMMENT 'base url',
    `api_key`               varchar(500)    DEFAULT NULL COMMENT 'api key',
    `add_time`              datetime        NOT NULL COMMENT '新增时间',
    `update_time`           datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_name` (`name`)
) ENGINE = InnoDB  DEFAULT CHARSET = utf8mb4 COMMENT ='Model 配置';

CREATE TABLE `xxl_boot_ai_chat` (
    `id`                    int(11)         NOT NULL AUTO_INCREMENT COMMENT ' Chat ID',
    `model_id`              int(11)         NOT NULL COMMENT 'Model ID',
    `title`                 varchar(100)    NOT NULL COMMENT 'Chat 标题',
    `prompt`                TEXT            DEFAULT NULL COMMENT '提示词',
    `add_time`              datetime        NOT NULL COMMENT '新增时间',
    `update_time`           datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_model` (`model_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='Chat 对话表';

CREATE TABLE `xxl_boot_ai_chat_message`(
    `id`                bigint(20)      NOT NULL AUTO_INCREMENT COMMENT ' Message ID',
    `chat_id`           int(11)         NOT NULL COMMENT 'Chat ID',
    `sender_type`       tinyint(4)      NOT NULL COMMENT '发送者类型：1-Model、2-用户',
    `sender_username`   varchar(100)    NOT NULL COMMENT '发送者，用户名',
    `content`           TEXT            NOT NULL COMMENT '消息内容',
    `add_time`          datetime        NOT NULL COMMENT '新增时间',
    `update_time`       datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_chat_id` (`chat_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='Chat Message 对话消息明细表';

## ----------- knowledge base -----------

CREATE TABLE `xxl_boot_ai_kb_info`
(
    `id`              bigint       NOT NULL AUTO_INCREMENT COMMENT '知识库ID',
    `kb_name`         varchar(100) NOT NULL COMMENT '知识库名称',
    `kb_desc`         varchar(500) DEFAULT NULL COMMENT '描述',
    `embedding_model` varchar(100) NOT NULL COMMENT '嵌入模型，如qwen3-embedding:0.6b',
    `vector_db_type`  varchar(50)  NOT NULL COMMENT '向量库类型，默认milvus',
    `collection_name` varchar(100) DEFAULT NULL COMMENT 'milvus集合名，默认xxl_ai数据库下新建：kb_{主键id}',
    `add_time`        datetime     NOT NULL COMMENT '新增时间',
    `update_time`     datetime     NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='知识库主表';

CREATE TABLE `xxl_boot_ai_kb_document`
(
    `id`          bigint                NOT NULL AUTO_INCREMENT COMMENT '文档ID',
    `kb_id`       bigint                NOT NULL COMMENT '所属知识库',
    `doc_name`    varchar(200)          NOT NULL COMMENT '文档名称',
    `doc_type`    varchar(20)           NOT NULL COMMENT 'txt/pdf/word/md',
    `content`     longtext              NOT NULL COMMENT '原文内容',
    `file_url`    varchar(500)          DEFAULT NULL COMMENT '文件存储地址',
    `status`      tinyint               NOT NULL DEFAULT '0' COMMENT '状态',
    `add_time`    datetime              NOT NULL COMMENT '新增时间',
    `update_time` datetime              NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_kb_id` (`kb_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='文档表';

CREATE TABLE `xxl_boot_ai_kb_chunk`
(
    `id`          bigint            NOT NULL AUTO_INCREMENT COMMENT '分片ID',
    `kb_id`       bigint            NOT NULL,
    `doc_id`      bigint            NOT NULL,
    `chunk_index` int               NOT NULL COMMENT '分片序号',
    `content`     text              NOT NULL COMMENT '分片文本',
    `status`      tinyint           NOT NULL DEFAULT '0' COMMENT '0未向量化 1已向量化',
    `add_time`    datetime          NOT NULL COMMENT '新增时间',
    `update_time` datetime          NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `idx_kb_doc` (`kb_id`, `doc_id`)
) ENGINE = InnoDB
  DEFAULT CHARSET = utf8mb4 COMMENT ='文档分片表';

## ----------- init data  -----------

INSERT INTO xxl_boot_ai_model (id, name, model_type, supplier_type, model, base_url, api_key, add_time, update_time)
VALUES (1, 'Ollama模型（qwen）', 1, 1, 'qwen3.5:2b', 'http://127.0.0.1:11434', '',NOW(), NOW()),
       (2, 'Ollama模型（qwen3-embedding）', 1, 1, 'qwen3-embedding:0.6b', 'http://127.0.0.1:11434', '',NOW(), NOW());

INSERT INTO xxl_boot_ai_chat (id, model_id, title, prompt, add_time, update_time)
VALUES (1, 1, '默认对话', '你是一个资深研发工程师，严谨、专业；',  NOW(), NOW());

INSERT INTO xxl_boot_ai_chat_message (id, chat_id, sender_type, sender_username, content, add_time, update_time)
VALUES (1, 1, 1,  '用户', '你好！', NOW(), NOW());


INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (200, 0,'AI应用', 0, 'ai', '/ai', 'fa-fire', 200, 0, now(), now()),
       (201, 200,'对话管理', 1, 'ai:chat', '/ai/chat', "", 201, 0, now(), now()),
       (202, 200,'知识库管理', 1, 'ai:kb', '/ai/kb', "", 202, 0, now(), now()),
       (203, 200,'模型配置', 1, 'ai:model', '/ai/model', "", 203, 0, now(), now());

INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES ( 1, 200, now(), now()),
       (1, 201, now(), now()),
       (1, 202, now(), now()),
       (1, 203, now(), now());
## ----------- chat bot end -----------

## —————————————————————— for ai stop ——————————————————
