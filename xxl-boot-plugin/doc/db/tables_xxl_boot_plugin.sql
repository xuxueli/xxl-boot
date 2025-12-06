
## —————————————————————— for ai ——————————————————

## ----------- chat bot start -----------
CREATE TABLE `xxl_boot_ai_chat_bot`(
    `id`                    int(11)         NOT NULL AUTO_INCREMENT,
    `name`                  varchar(100)    NOT NULL COMMENT 'ChatBot 名称',
    `cue_word`              TEXT            DEFAULT NULL COMMENT '提示词',
    `model`                 VARCHAR(255)    NOT NULL COMMENT '模型，如 qwen3:0.6b',
    `ollama_url`            VARCHAR(500)    NOT NULL COMMENT 'ollama url',
    `add_time`              datetime        NOT NULL COMMENT '新增时间',
    `update_time`           datetime        NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    KEY `i_name` (`name`)
) ENGINE = InnoDB  DEFAULT CHARSET = utf8mb4 COMMENT ='ChatBot';

INSERT INTO xxl_boot_ai_chat_bot (id, name, cue_word, model, ollama_url, add_time, update_time)
VALUES (1, '助手小X', '你是一个资深研发工程师，严谨、专业；', 'qwen3:0.6b', 'http://127.0.0.1:11434', NOW(), NOW());

INSERT INTO `xxl_boot_resource` (`id`, `parent_id`, `name`, `type`, `permission`, `url`, `icon`, `order`, `status`, `add_time`, `update_time`)
VALUES (200, 0,'大模型应用', 0, 'ai', '/ai', 'fa-fire', 200, 0, now(), now()),
       (201, 200,'AI助手', 1, 'ai:chatbot', '/ai/chatbot', "", 201, 0, now(), now());

INSERT INTO `xxl_boot_role_res` (`role_id`, `res_id`, `add_time`, `update_time`)
VALUES ( 1, 200, now(), now()),
       (1, 201, now(), now());
## ----------- chat bot end -----------

