/**
 * @fileoverview Auth API
 * @description 登录认证与基础配置接口，方法名与后端 LoginController、IndexController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 登录认证 API，调用方式：authApi.login(...) */
export const authApi = {
  /**
   * 用户登录
   *
   * @param params 登录参数（用户名、密码、验证码标识、验证码）
   * @returns 登录成功返回 token
   */
  login(params: API.LoginParams) {
    return request<API.Response<string>>('/auth/login', {
      headers: { isToken: false, repeatSubmit: false },
      method: 'POST',
      data: {
        username: params.username ?? '',
        password: params.password ?? '',
        captchaUuid: params.captchaUuid,
        captchaResult: params.captchaResult,
      },
    });
  },

  /**
   * 获取当前登录用户信息
   *
   * @returns 用户详情（含角色、权限集合）
   */
  loginCheck() {
    return request<API.Response<API.LoginInfo>>('/auth/loginCheck', {
      method: 'GET',
      headers: { skipErrorHandler: true },
    });
  },

  /**
   * 用户退出登录
   *
   * @returns 退出结果
   */
  logout() {
    return request<API.Response<unknown>>('/auth/logout', {
      method: 'POST',
    });
  },

  /**
   * 获取登录验证码
   *
   * @returns 验证码图片与标识
   */
  captcha() {
    return request<API.Response<API.CaptchaData>>('/auth/captcha', {
      headers: { isToken: false },
      method: 'GET',
      timeout: 20000,
    });
  },

  /**
   * 获取当前用户菜单树
   *
   * @returns 纯业务菜单数据
   */
  getMenus() {
    return request<API.Response<API.MenuNode[]>>('/getMenus', {
      method: 'GET',
    });
  },

  /**
   * 加载系统基础配置（界面语言、登录验证码开关）
   *
   * @returns 基础配置数据
   */
  loadBaseConfig() {
    return request<API.Response<API.BaseConfig>>('/loadBaseConfig', {
      headers: { isToken: false },
      method: 'GET',
    });
  },
};
