package com.xxl.boot.admin.model.entity;

import java.util.Date;

/**
 * @author xuxueli 2019-05-04 16:43:12
 */
public class XxlBootUser {

	private int id;
	private String username;		// 账号
	private String password;		// 密码
	private String token;			// 登录token
	private int status;				// 状态：0-正常、1-停用
	private String realName;		// 真实姓名
	private Date addTime;
	private Date updateTime;


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

	public Date getAddTime() {
		return addTime;
	}

	public void setAddTime(Date addTime) {
		this.addTime = addTime;
	}

	public Date getUpdateTime() {
		return updateTime;
	}

	public void setUpdateTime(Date updateTime) {
		this.updateTime = updateTime;
	}

}
