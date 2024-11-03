package com.xxl.boot.admin.model.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * @author xuxueli 2019-05-04 16:43:12
 */
public class LoginUserDTO {

	private int id;
	private String username;		// 账号
	private String password;		// 密码
	private String userToken;		// 登录token
	private String realName;		// 真实姓名

	// other
	private List<String> permissionList;	// resource permission list


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

	public String getUserToken() {
		return userToken;
	}

	public void setUserToken(String userToken) {
		this.userToken = userToken;
	}

	public String getRealName() {
		return realName;
	}

	public void setRealName(String realName) {
		this.realName = realName;
	}

	public List<String> getPermissionList() {
		return permissionList;
	}

	public void setPermissionList(List<String> permissionList) {
		this.permissionList = permissionList;
	}

}