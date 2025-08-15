package com.xxl.boot.admin.model.entity;

import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.dto.XxlBootRoleDTO;

import java.util.List;

/**
 * @author xuxueli 2019-05-04 16:43:12
 */
public class XxlBootUserDTO {

	private int id;
	private String username;		// 账号
	private String password;		// 密码
	private String token;		// 登录token
	private int status;				// 状态：0-正常、1-停用
	private String realName;		// 真实姓名

	// permission
	private List<XxlBootRoleDTO> roleList;
	private List<XxlBootResourceDTO> resourceList;


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public List<XxlBootRoleDTO> getRoleList() {
		return roleList;
	}

	public void setRoleList(List<XxlBootRoleDTO> roleList) {
		this.roleList = roleList;
	}

	public List<XxlBootResourceDTO> getResourceList() {
		return resourceList;
	}

	public void setResourceList(List<XxlBootResourceDTO> resourceList) {
		this.resourceList = resourceList;
	}

}
