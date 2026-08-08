/**
 * usePasswordRule - 密码强度校验规则
 *
 * 根据后端配置的 chrtype 动态生成 antd 表单校验规则。
 * chrtype 从 sessionStorage 读取，支持 0-4 五种密码策略。
 *
 * 用法：
 *   const { pwdValidator, infoPwdValidator } = usePasswordRule()
 *   // rules={pwdValidator} 绑定到 Form.Item
 *
 * chrtype:
 *   0 - 任意字符（默认，仅禁止 < > " ' \ |）
 *   1 - 纯数字（0-9）
 *   2 - 纯字母（a-z / A-Z）
 *   3 - 字母 + 数字（必须同时包含）
 *   4 - 字母 + 数字 + 特殊字符（必须同时包含，特殊字符：~!@#$%^&*()-=_+）
 */
import { useMemo, useState } from 'react'
import type { Rule } from 'antd/es/form'
import cache from '@/utils/cache'

/** 密码校验规则项 */
interface PwdRule {
  pattern: RegExp
  message: string
}

/**
 * 密码校验规则配置表
 */
const PWD_RULES: Record<string, PwdRule> = {
  '0': { pattern: /^[^<>"'|\\]+$/, message: '密码不能包含非法字符：< > " \' \\ |' },
  '1': { pattern: /^[0-9]+$/, message: '密码只能为数字（0-9）' },
  '2': { pattern: /^[a-zA-Z]+$/, message: '密码只能为英文字母（a-z、A-Z）' },
  '3': { pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, message: '密码必须同时包含字母和数字' },
  '4': {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()\-=_+])[A-Za-z\d~!@#$%^&*()\-=_+]+$/,
    message: '密码必须同时包含字母、数字和特殊字符（~!@#$%^&*()-=_+）'
  }
}

/**
 * 密码规则 Hook（usePasswordRule）
 *
 * 返回各场景的校验规则和验证函数。
 * pwdChrType 为状态，切换密码类型配置后规则自动更新。
 */
export function usePasswordRule(): {
  pwdChrType: string
  setPwdChrType: (value: string) => void
  pwdValidator: Rule[]
  infoPwdValidator: Rule[]
  pwdPromptValidator: (value: string) => string | undefined
  registerPwdValidator: Rule[]
} {
  // 从 sessionStorage 读取密码字符类型配置
  const [pwdChrType, setPwdChrType] = useState<string>(cache.session.get('pwrChrtype') || '0')

  /**
   * 通用密码校验规则
   * 根据当前 pwdChrType 动态返回对应的字符规则，适用于登录后修改密码等场景。
   */
  const pwdValidator = useMemo<Rule[]>(() => {
    const rule = PWD_RULES[pwdChrType] || PWD_RULES['0']
    return [
      { required: true, message: '密码不能为空' },
      { min: 6, max: 20, message: '密码长度必须介于 6 和 20 之间' },
      { pattern: rule.pattern, message: rule.message }
    ]
  }, [pwdChrType])

  /**
   * Prompt 弹框输入校验函数
   * 以函数形式返回校验结果字符串（非空=不合法），适用于 Modal.prompt 的输入校验。
   * 固定使用 type '0'（任意字符），不受 pwdChrType 影响。
   */
  const pwdPromptValidator = (value: string): string | undefined => {
    const rule = PWD_RULES['0']
    if (!value || value.length < 6 || value.length > 20) {
      return '密码长度必须介于 6 和 20 之间'
    }
    if (!rule.pattern.test(value)) {
      return rule.message
    }
  }

  /**
   * 个人中心新密码校验规则
   * 与 pwdValidator 类似，但错误提示文案更明确（"新密码"）。
   */
  const infoPwdValidator = useMemo<Rule[]>(() => {
    const rule = PWD_RULES[pwdChrType] || PWD_RULES['0']
    return [
      { required: true, message: '新密码不能为空' },
      { min: 6, max: 20, message: '新密码长度必须介于 6 和 20 之间' },
      { pattern: rule.pattern, message: rule.message }
    ]
  }, [pwdChrType])

  /**
   * 注册页面密码校验规则
   * 固定使用 type '0'（任意字符），不受后端 chrtype 配置影响。
   */
  const registerPwdValidator = useMemo<Rule[]>(() => {
    const rule = PWD_RULES['0']
    return [
      { required: true, message: '请输入您的密码' },
      { min: 6, max: 20, message: '用户密码长度必须介于 6 和 20 之间' },
      { pattern: rule.pattern, message: rule.message }
    ]
  }, [])

  return {
    pwdChrType,
    setPwdChrType,
    pwdValidator,
    infoPwdValidator,
    pwdPromptValidator,
    registerPwdValidator
  }
}
