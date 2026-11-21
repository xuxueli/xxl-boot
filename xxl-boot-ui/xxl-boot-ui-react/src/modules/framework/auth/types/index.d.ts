/**
 * @fileoverview Auth 类型定义
 * @description 登录参数、验证码与系统基础配置，供 store 与 api 复用
 * @author xuxueli 2026-11-21
 */
import type { I18nLang } from '@/i18n';

declare global {
  namespace API {
    /** 登录参数 */
    type LoginParams = {
      /** 用户名 */
      username?: string;
      /** 密码 */
      password?: string;
      /** 验证码标识 */
      captchaUuid?: string;
      /** 验证码内容 */
      captchaResult?: string;
      /** 是否记住登录 */
      rememberMe?: boolean;
    };

    /** 验证码数据 */
    type CaptchaData = {
      /** base64 图片 */
      image: string;
      /** 验证码标识 */
      uuid: string;
    };

    /** 系统基础配置 */
    type BaseConfig = {
      /** 界面语言 */
      language: I18nLang;
      /** 是否开启登录验证码 */
      captchaEnabled: boolean;
    };
  }
}

export {};
