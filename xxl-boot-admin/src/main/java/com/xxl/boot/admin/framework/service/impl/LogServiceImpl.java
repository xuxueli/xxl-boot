package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.LogMapper;
import com.xxl.boot.admin.framework.model.adaptor.LogAdaptor;
import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.boot.admin.framework.service.LogService;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * 日志 Service 实现，提供日志的增删改查业务逻辑
 *
 * @author xuxueli 2024-10-27
 */
@Service
public class LogServiceImpl implements LogService {

	@Resource
	private LogMapper logMapper;

    /**
     * 新增日志
     */
    @Override
    public Response<String> insert(Log xxlBootLog) {

        // 参数校验
        if (xxlBootLog == null) {
            return Response.ofFail("必要参数缺失");
        }
        logMapper.insert(xxlBootLog);
        return Response.ofSuccess();
    }

    /**
     * 批量删除日志
     */
    @Override
    public Response<String> delete(List<Integer> ids) {
        int ret = logMapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * 更新日志
     */
    @Override
    public Response<String> update(Log xxlBootLog) {
        int ret = logMapper.update(xxlBootLog);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * 根据 ID 查询日志
     */
    @Override
    public Response<Log> load(int id) {
        Log record = logMapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
     * 分页查询日志列表
     */
    @Override
    public PageModel<LogDTO> pageList(int type, int module, String title, int offset, int pagesize) {

        // 分页查询数据库
        List<Log> pageList = logMapper.pageList(type, module, title, offset, pagesize);
        int totalCount = logMapper.pageListCount(type, module, title, offset, pagesize);

        // 实体转 DTO，补充 IP 地理位置
        List<LogDTO> pageListDTO = LogAdaptor.adaptor(pageList);

        // 封装分页结果
        PageModel<LogDTO> pageModel = new PageModel<>();
        pageModel.setData(pageListDTO);
        pageModel.setTotal(totalCount);
        return pageModel;
    }

    /**
     * 按日期统计日志趋势
     */
    @Override
    public List<Map<String, Object>> trendList(int days) {
        return logMapper.trendList(days);
    }
}
