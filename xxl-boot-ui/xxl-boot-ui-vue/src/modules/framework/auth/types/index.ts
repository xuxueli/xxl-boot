/**
 * @fileoverview Auth 类型定义
 * @description 登录入参、验证码与系统基础配置类型，对应后端登录与基础配置接口
 * @author xuxueli 2026-11-21
 */
import type { I18nLang } from '@/i18n'

/** 登录入参（对应 /auth/login 登录接口请求体） */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 验证码标识 */
  captchaUuid?: string
  /** 用户输入的验证码 */
  captchaResult?: string
  /** 是否记住密码 */
  rememberMe?: boolean
}

/** 验证码数据（对应 /auth/captcha 返回结构） */
export interface CaptchaData {
  /** 验证码图片 Base64 */
  image: string
  /** 验证码标识 */
  uuid: string
}

/** 系统基础配置（对应 /loadBaseConfig 返回结构） */
export interface BaseConfig {
  /** 界面语言：zh/en */
  language: I18nLang
  /** 登录验证码开关 */
  captchaEnabled: boolean
}
