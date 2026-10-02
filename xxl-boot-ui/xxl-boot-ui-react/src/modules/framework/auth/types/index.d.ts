/**
 * 类型定义：登录认证 & 路由（auth 模块）
 * 覆盖登录参数、验证码数据结构；用 declare global 合并到全局 API 命名空间
 * 供 store/user 与 api/index.ts 复用。
 */
import type { I18nLang } from '@/i18n';

declare global {
  namespace API {
    /** 登录参数 */
    type LoginParams = {
      username?: string;
      password?: string;
      captchaUuid?: string;
      captchaResult?: string;
      rememberMe?: boolean;
    };

    /** 验证码数据 */
    type CaptchaData = {
      image: string;
      uuid: string;
    };

    /** 系统基础配置 */
    type BaseConfig = {
      language: I18nLang;
      captchaEnabled: boolean;
    };
  }
}

export {};