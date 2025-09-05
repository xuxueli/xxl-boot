package com.xxl.boot.admin.service;

import com.xxl.boot.admin.model.dto.XxlBootUserDTO;
import com.xxl.boot.admin.model.entity.XxlBootUser;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * user service
 *
 * @author xuxueli
 */
public interface UserService {

    /**
     * 新增
     */
    public Response<String> insert(XxlBootUserDTO xxlJobUser);

    /**
     * 删除
     */
    public Response<String> delete(int id);

    /**
     * 删除
     */
    Response<String> deleteByIds(List<Integer> userIds, int loginUserId);

    /**
     * 更新
     */
    public Response<String> update(XxlBootUserDTO xxlJobUser, String loginUserName);

    /**
     * 修改密码
     */
    public Response<String> updatePwd(String loginUserName, String oldPassword, String password);

    /**
     * Load查询
     */
    public Response<XxlBootUser> loadByUserName(String username);

    /**
     * Load查询
     */
    public Response<XxlBootUser> loadByUserId(int id);

    /**
     * 分页查询
     */
    public PageModel<XxlBootUserDTO> pageList(int offset, int pagesize, String username, int status);

    /**
     * 更新登录token
     */
    Response<String> updateToken(Integer id, String token);

}
