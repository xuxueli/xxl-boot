package com.xxl.boot.admin.framework.web.xxllog;

import com.xxl.boot.admin.framework.annotation.XxlLog;
import com.xxl.boot.admin.framework.util.Ip2regionUtil;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.json.GsonTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;

/**
 * 日志切面，通过 AOP 拦截 @XxlLog 注解自动记录操作日志
 * 
 * @author xuxueli 2016-1-6 19:22:18
 */
@Aspect
@Component
public class XxlLogAspect {
    private static final Logger logger = LoggerFactory.getLogger(XxlLogAspect.class);

    @Resource
    private XxlLogQueueHelper xxlLogQueueHelper;

    /**
     * 定义切点，匹配所有标记了 @XxlLog 注解的方法
     */
    @Pointcut("@annotation(com.xxl.boot.admin.framework.annotation.XxlLog)")
    public void logPointcut() {}

    /**
     * 环绕通知，记录请求和响应
     */
    @Around("logPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {

        // 获取当前请求
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();

        // 获取方法上的 @XxlLog 注解
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        // 未找到注解则直接执行
        XxlLog log = AnnotationUtils.findAnnotation(method, XxlLog.class);
        if (log == null) {
            return joinPoint.proceed();
        }

        // 执行方法并记录耗时
        long startTime = 0;
        Object result = null;
        long endTime = 0;
        try {
            startTime = System.currentTimeMillis();
            result = joinPoint.proceed();
            endTime = System.currentTimeMillis();
        } catch (Throwable e) {
            throw e;
        } finally {
            // 推送日志到消息队列
            try {
                doLog(log, request, joinPoint.getArgs(), result, startTime, endTime);
            } catch (Throwable e) {
                logger.error(e.getMessage(), e);
            }
        }
        return result;
    }

    /**
     * 构建日志并推送消息队列
     */
    private void doLog(XxlLog log,
                       HttpServletRequest request,
                       Object[] args,
                       Object result,
                       long startTime,
                       long endTime) {

        // 获取当前登录用户
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
        String operator = loginInfoResponse.isSuccess() ? loginInfoResponse.getData().getUserName() : "";

        // 获取客户端 IP
        String ip = Ip2regionUtil.getIp(request);
        ip = ip != null ? ip : "";

        // 若注解未指定 content，自动拼接请求/响应/耗时信息
        String content = log.content();
        if (StringTool.isBlank(content)) {
            content += "【Request】:\n" + getRequestData(request, args);
            content += "\n\n【Response】:\n" + GsonTool.toJson(result);
            content += "\n\n【CostTime】:\n" + (endTime - startTime) + "ms";
        }

        // 构建日志实体
        com.xxl.boot.admin.framework.model.entity.Log xxlBootLog = new com.xxl.boot.admin.framework.model.entity.Log();
        xxlBootLog.setType(log.type().getCode());
        xxlBootLog.setModule(log.module().getCode());
        xxlBootLog.setTitle(log.title());
        xxlBootLog.setContent(content);
        xxlBootLog.setOperator(operator);
        xxlBootLog.setIp(ip);

        // 推入消息队列异步写入
        xxlLogQueueHelper.push(xxlBootLog);
    }

    /**
     * 获取请求数据，用于记录日志内容
     */
    private String getRequestData(HttpServletRequest request, Object[] args) {

        // GET 请求直接记录参数 Map
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            return GsonTool.toJson(request.getParameterMap());
        }

        // POST/PUT 等从方法参数中取首个有效业务对象
        if (args != null) {
            for (Object arg : args) {
                // 跳过框架内部对象
                if (arg == null
                        || arg instanceof HttpServletRequest
                        || arg instanceof HttpServletResponse
                        || arg instanceof org.springframework.validation.BindingResult
                        || arg instanceof org.springframework.web.multipart.MultipartFile) {
                    continue;
                }
                return GsonTool.toJson(arg);
            }
        }

        // 最终兜底：使用 ParameterMap
        return GsonTool.toJson(request.getParameterMap());
    }

}
