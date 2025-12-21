#
# XXL-BOOT
# Copyright (c) 2025-present, xuxueli.

## —————————————————————— for ai start ——————————————————

## ----------- agent、conversation、message -----------
CREATE TABLE `xxl_boot_ai_agent`(
    `id`                    int(11)         NOT NULL AUTO_INCREMENT COMMENT 'Agent ID',
    `name`                  varchar(100)    NOT NULL COMMENT 'Agent名称',
    `agent_type`            tinyint(4)      NOT NULL COMMENT 'Agent类型：1-ChatAgent',
    `supplier_type`         tinyint(4)      NOT NULL COMMENT '供应商类型：1-Ollama',
    `prompt`                TEXT            DEFAULT NULL COMMENT '提示词',
    `model`                 varchar(255)    NOT NULL COMMENT '模型，如 qwen3:0.6b',
    `ollama_url`            varchar(500)    NOT NULL COMMENT 'ollama url',
    `add_time`              datetime        NOT NULL COMMENT '新增时间',
    `update_time`           datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_name` (`name`)
) ENGINE = InnoDB  DEFAULT CHARSET = utf8mb4 COMMENT ='Agent 配置';

CREATE TABLE `xxl_boot_ai_chat` (
    `id`                    int(11)         NOT NULL AUTO_INCREMENT COMMENT ' Chat ID',
    `agent_id`              int(11)         NOT NULL COMMENT 'Agent ID',
    `title`                 varchar(100)    NOT NULL COMMENT 'Chat 标题',
    `add_time`              datetime        NOT NULL COMMENT '新增时间',
    `update_time`           datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_agent_id` (`agent_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='Agent Chat 对话表';

CREATE TABLE `xxl_boot_ai_chat_message`(
    `id`                bigint(20)      NOT NULL AUTO_INCREMENT COMMENT ' Message ID',
    `chat_id`           int(11)         NOT NULL COMMENT 'Chat ID',
    `sender_type`       tinyint(4)      NOT NULL COMMENT '发送者类型：1-Agent、2-用户',
    `sender_username`   varchar(100)    NOT NULL COMMENT '发送者，用户名',
    `content`           TEXT            NOT NULL COMMENT '消息内容',
    `add_time`          datetime        NOT NULL COMMENT '新增时间',
    `update_time`       datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_chat_id` (`chat_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT ='Agent Chat Message 对话消息明细表';

## ----------- init data  -----------

INSERT INTO xxl_boot_ai_agent (id, name, agent_type, supplier_type, prompt, model, ollama_url, add_time, update_time)
VALUES (1, '助手小X', 1, 1, '你是一个资深研发工程师，严谨、专业；', 'qwen3:0.6b', 'http://127.0.0.1:11434', NOW(), NOW());

INSERT INTO xxl_boot_ai_chat (id, agent_id, title, add_time, update_time)
VALUES (1, 1, '默认对话',  NOW(), NOW());

INSERT INTO xxl_boot_ai_chat_message (id, chat_id, sender_type, sender_username, content, add_time, update_time)
VALUES (1, 1, 1,  '用户', '你好！', NOW(), NOW());


INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (200, 0,'Agent应用', 0, 'ai', '/ai', 'fa-fire', 200, 0, now(), now()),
       (201, 200,'Agent配置', 1, 'ai:agent', '/ai/agent', "", 201, 0, now(), now()),
       (202, 200,'对话管理', 1, 'ai:chat', '/ai/chat', "", 201, 0, now(), now());

INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES ( 1, 200, now(), now()),
       (1, 201, now(), now()),
       (1, 202, now(), now());
## ----------- chat bot end -----------

## —————————————————————— for ai stop ——————————————————