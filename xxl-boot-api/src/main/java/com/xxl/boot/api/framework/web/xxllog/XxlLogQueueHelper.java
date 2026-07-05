package com.xxl.boot.api.framework.web.xxllog;

import com.xxl.boot.api.framework.model.entity.Log;
import com.xxl.boot.api.framework.service.LogService;
import com.xxl.tool.concurrent.MessageQueue;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.SmartLifecycle;
import org.springframework.stereotype.Component;

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
     * callback message-queue
     */
    private volatile MessageQueue<Log> logMessageQueue;


    // ---------------------- start、stop ----------------------

    @Override
    public void start() {

        // start message-queue
        logMessageQueue = new MessageQueue<Log>(
                "XxlLogQueueConfig#logMessageQueue",
                messages -> {

                    // write log
                    for (Log log : messages) {
                        logService.insert(log);
                    }

                },
                1,
                10);

        // mark running
        running = true;
    }

    @Override
    public void stop() {
        // mark stop
        running = false;

        // stop message-queue
        if (logMessageQueue != null){
            logMessageQueue.stop();
        }
    }


    // ---------------------- start、stop ----------------------

    public boolean push(Log log) {
        return logMessageQueue.produce(log);
    }

}
