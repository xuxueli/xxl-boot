/**
 * 类型定义：登录认证 & 路由（auth 模块）
 * 覆盖登录入参、验证码数据结构。
 */

/**
 * 登录入参
 * 对应 /auth/login 登录接口请求体
 */
export interface LoginParams {
  username: string
  password: string
  captchaUuid?: string
  captchaResult?: string
  rememberMe?: boolean
}

/**
 * 验证码结构。
 */
export interface CaptchaData {
  /** 是否启用验证码 */
  enable: boolean
  /** 验证码图片 Base64 */
  image: string
  /** 验证码标识 */
  uuid: string
}