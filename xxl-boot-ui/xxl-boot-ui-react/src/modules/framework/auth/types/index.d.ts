/**
 * 类型定义：登录认证 & 路由（auth 模块）
 * 覆盖登录参数、验证码数据结构；用 declare global 合并到全局 API 命名空间
 * 供 store/user 与 api/index.ts 复用。
 */
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
      enable: boolean;
      image: string;
      uuid: string;
    };
  }
}

export {};