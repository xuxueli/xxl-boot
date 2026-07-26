package com.xxl.boot.admin.framework.web.xxllog;

import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.boot.admin.framework.service.LogService;
import com.xxl.tool.concurrent.MessageQueue;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;

/**
 * 日志消息队列助手，使用 MessageQueue 异步批量写入日志
 * 
 * @author xuxueli 2024-01-01
 */
@Component
public class XxlLogQueueHelper implements SmartLifecycle {
    private static final Logger logger = LoggerFactory.getLogger(XxlLogQueueHelper.class);


    // ---------------------- cycle state ----------------------

    private volatile boolean running = false;

    @Override
    public boolean isRunning() {
        return running;
    }


    // ---------------------- biz field ----------------------

    @Resource
    private LogService logService;

    /**
     * 日志消息队列
     */
    private volatile MessageQueue<Log> logMessageQueue;


    // ---------------------- start、stop ----------------------

    @Override
    public void start() {

        // 初始化消息队列，批量消费
        logMessageQueue = new MessageQueue<Log>(
                "XxlLogQueueConfig#logMessageQueue",
                messages -> {

                    // 批量写入日志
                    for (Log log : messages) {
                        logService.insert(log);
                    }

                },
                1,
                10);

        running = true;
    }

    @Override
    public void stop() {

        running = false;

        // 停止消息队列
        if (logMessageQueue != null){
            logMessageQueue.stop();
        }
    }


    // ---------------------- 操作方法 ----------------------

    /**
     * 推送日志到消息队列（异步写入）
     */
    public boolean push(Log log) {
        return logMessageQueue.produce(log);
    }

}
