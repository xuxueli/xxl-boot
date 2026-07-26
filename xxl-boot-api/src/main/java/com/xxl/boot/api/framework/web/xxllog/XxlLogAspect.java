package com.xxl.boot.api.framework.web.xxllog;

import com.xxl.boot.api.framework.annotation.XxlLog;
import com.xxl.boot.api.framework.util.Ip2regionUtil;
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
 * aspect/aop
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
    @Pointcut("@annotation(com.xxl.boot.api.framework.annotation.XxlLog)")
    public void logPointcut() {}

    /**
     * 在方法调用前记录请求信息
     *
     * @param joinPoint joinPoint
     */
    //@Around("@annotation(com.xxl.boot.api.framework.annotation.Log)")
    @Around("logPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {

        // parse request/response
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        HttpServletRequest request = attributes.getRequest();
        /*HttpServletResponse response = attributes.getResponse();*/

        // parse annotation
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();

        /*logger.info("Request URL: {}", request.getRequestURL());
        logger.info("HTTP Method: {}", request.getMethod());
        logger.info("IP: {}", request.getRemoteAddr());
        logger.info("Class Method: {}.{}", joinPoint.getSignature().getDeclaringTypeName(), joinPoint.getSignature().getName());
        logger.info("Arguments: {}", joinPoint.getArgs());*/

        // 1、annotation not exits
        XxlLog log = AnnotationUtils.findAnnotation(method, XxlLog.class);
        if (log == null) {
            return joinPoint.proceed();
        }

        // 2、process log logic
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
            // push log message-queue
            try {
                doLog(log, request, joinPoint.getArgs(), result, startTime, endTime);
            } catch (Throwable e) {
                // ignore
                logger.error(e.getMessage(), e);
            }
        }
        return result;
    }

    /**
     * do log
     */
    private void doLog(XxlLog log,
                       HttpServletRequest request,
                       Object[] args,
                       Object result,
                       long startTime,
                       long endTime) {

        // xxl-sso, logincheck
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

        String operator = loginInfoResponse.isSuccess()?loginInfoResponse.getData().getUserName():"";
        String ip = Ip2regionUtil.getIp(request);
        ip = ip!=null?ip:"";

        // content
        String content = log.content();
        if (StringTool.isBlank(content)) {
            content += "【Request】:\n" + getRequestData(request, args);
            content += "\n\n【Response】:\n" + GsonTool.toJson(result);
            content += "\n\n【CostTime】:\n" + (endTime - startTime) + "ms";
        }

        // generate
        com.xxl.boot.api.framework.model.entity.Log xxlBootLog = new com.xxl.boot.api.framework.model.entity.Log();
        xxlBootLog.setType(log.type().getCode());
        xxlBootLog.setModule(log.module().getCode());
        xxlBootLog.setTitle(log.title());
        xxlBootLog.setContent(content);
        xxlBootLog.setOperator(operator);
        xxlBootLog.setIp(ip);

        xxlLogQueueHelper.push(xxlBootLog);
    }

    /**
     * 获取请求数据
     */
    private String getRequestData(HttpServletRequest request, Object[] args) {
        // 1. GET 请求：直接记录参数 Map
        if ("GET".equalsIgnoreCase(request.getMethod())) {
            return GsonTool.toJson(request.getParameterMap());
        }

        // 2. POST/PUT 等请求：遍历方法参数，找到第一个有效的业务对象
        if (args != null) {
            for (Object arg : args) {
                // 跳过 null 和 Web 原生对象
                if (arg == null
                        || arg instanceof HttpServletRequest
                        || arg instanceof HttpServletResponse
                        || arg instanceof org.springframework.validation.BindingResult
                        || arg instanceof org.springframework.web.multipart.MultipartFile) {
                    continue;
                }

                // 找到第一个非 Web 对象，视为主要请求参数并返回
                return GsonTool.toJson(arg);
            }
        }

        // 3. Fallback：ParameterMap
        return GsonTool.toJson(request.getParameterMap());
    }

}