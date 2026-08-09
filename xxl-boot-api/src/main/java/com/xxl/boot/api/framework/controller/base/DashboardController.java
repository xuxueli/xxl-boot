package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.mapper.system.LogMapper;
import com.xxl.boot.api.framework.mapper.system.MessageMapper;
import com.xxl.boot.api.framework.mapper.authz.RoleMapper;
import com.xxl.boot.api.framework.mapper.authz.UserMapper;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 首页仪表盘
 *
 * @author xuxueli 2026-07-25
 */
@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Resource
    private UserMapper userMapper;
    @Resource
    private RoleMapper roleMapper;
    @Resource
    private LogMapper logMapper;
    @Resource
    private MessageMapper messageMapper;

    /**
     * 首页统计数据
     */
    @RequestMapping("/stats")
    @XxlSso
    public Response<Map<String, Object>> stats() {

        int userCount = userMapper.pageListCount(0, 10, null, -1, null);
        int roleCount = roleMapper.pageListCount(0, 999, null, -1);
        int logCount = logMapper.pageListCount(-1, 0, null, 0, 10);
        int messageCount = messageMapper.pageListCount(-1, -1, null, 0, 10);

        Map<String, Object> data = new HashMap<>();
        data.put("userCount", userCount);
        data.put("roleCount", roleCount);
        data.put("logCount", logCount);
        data.put("messageCount", messageCount);

        return Response.ofSuccess(data);
    }

    /**
     * 日志趋势
     */
    @RequestMapping("/logTrend")
    @XxlSso
    public Response<List<Map<String, Object>>> logTrend(@RequestParam(required = false, defaultValue = "30") int days) {
        if (days <= 0 || days > 30) {
            days = 30;
        }
        List<Map<String, Object>> list = logMapper.trendList(days);
        return Response.ofSuccess(list);
    }

}
