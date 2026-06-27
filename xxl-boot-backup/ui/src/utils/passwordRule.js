/**
 * 密码强度规则工具模块（passwordRule.js）
 *
 * 职责：
 *   - 根据系统配置的密码字符类型（chrtype），动态生成一组 Element Plus
 *     表单校验规则（validator array），供各密码输入场景复用。
 *   - 密码字符类型从 sessionStorage 缓存中读取，保持与后端配置一致。
 *   - 提供四个场景的校验规则：
 *       1. pwdValidator          通用密码校验（登录、修改密码等）
 *       2. infoPwdValidator      个人中心新密码校验
 *       3. registerPwdValidator  注册页密码校验（固定使用 type 0）
 *       4. pwdPromptValidator    Prompt 弹框输入校验（函数形式）
 *
 * chrtype 说明：
 *   0 - 任意字符（默认，仅禁止 < > " ' \ |）
 *   1 - 纯数字（0-9）
 *   2 - 纯字母（a-z / A-Z）
 *   3 - 字母 + 数字（必须同时包含）
 *   4 - 字母 + 数字 + 特殊字符（必须同时包含，特殊字符：~!@#$%^&*()-=_+）
 *
 * 依赖：
 *   - @/plugins/cache   sessionStorage 封装（读取 pwrChrtype 配置项）
 *
 * 典型用法：
 *   import { usePasswordRule } from '@/utils/passwordRule'
 *   const { pwdValidator, infoPwdValidator } = usePasswordRule()
 *   // 在 el-form-item 的 :rules 中直接使用 pwdValidator
 */

import cache from '@/plugins/cache'

// 从 sessionStorage 中读取后端下发的密码字符类型配置，默认为 '0'（任意字符）
const pwdChrType = ref(cache.session.get('pwrChrtype') || '0')

/**
 * 密码校验规则配置表
 *
 * key 为 chrtype 值，value 包含：
 *   - pattern: 正则表达式，用于校验密码字符组成
 *   - message: 校验失败时的提示文案
 */
const PWD_RULES = {
  '0': { pattern: /^[^<>"'|\\]+$/, message: '密码不能包含非法字符：< > " \' \\ |' },
  '1': { pattern: /^[0-9]+$/, message: '密码只能为数字（0-9）' },
  '2': { pattern: /^[a-zA-Z]+$/, message: '密码只能为英文字母（a-z、A-Z）' },
  '3': { pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, message: '密码必须同时包含字母和数字' },
  '4': { pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()\-=_+])[A-Za-z\d~!@#$%^&*()\-=_+]+$/, message: '密码必须同时包含字母、数字和特殊字符（~!@#$%^&*()-=_+）' }
}

/**
 * 密码规则组合式 API 钩子（usePasswordRule）
 *
 * 返回各场景的响应式校验规则和验证函数。
 * pwdChrType 为响应式变量，切换密码类型配置后规则自动更新。
 *
 * @returns {{
 *   pwdChrType: Ref<string>,
 *   pwdValidator: ComputedRef<Object[]>,
 *   infoPwdValidator: ComputedRef<Object[]>,
 *   pwdPromptValidator: Function,
 *   registerPwdValidator: ComputedRef<Object[]>
 * }}
 */
export function usePasswordRule() {
  /**
   * 通用密码校验规则（computed）
   * 根据当前 pwdChrType 动态返回对应的字符规则，适用于登录后修改密码等场景。
   * 规则：必填 + 长度 6-20 + 字符格式
   */
  const pwdValidator = computed(() => {
    const rule = PWD_RULES[pwdChrType.value] || PWD_RULES['0']
    return [
      { required: true, message: '密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '密码长度必须介于 6 和 20 之间', trigger: 'blur' },
      { pattern: rule.pattern, message: rule.message, trigger: 'blur' }
    ]
  })

  /**
   * Prompt 弹框输入校验函数
   * 以函数形式返回校验结果字符串（非空=不合法），适用于 ElMessageBox.prompt 的 inputValidator。
   * 固定使用 type '0'（任意字符），不受 pwdChrType 影响。
   *
   * @param {string} value - 用户输入的密码
   * @returns {string|undefined} 校验不通过时返回错误提示字符串；通过时返回 undefined
   */
  const pwdPromptValidator = (value) => {
    const rule = PWD_RULES['0']
    if (!value || value.length < 6 || value.length > 20) {
      return '密码长度必须介于 6 和 20 之间'
    }
    if (!rule.pattern.test(value)) {
      return rule.message
    }
  }

  /**
   * 个人中心新密码校验规则（computed）
   * 与 pwdValidator 类似，但错误提示文案更明确（"新密码"）。
   * 规则：必填 + 长度 6-20 + 字符格式
   */
  const infoPwdValidator = computed(() => {
    const rule = PWD_RULES[pwdChrType.value] || PWD_RULES['0']
    return [
      { required: true, message: '新密码不能为空', trigger: 'blur' },
      { min: 6, max: 20, message: '新密码长度必须介于 6 和 20 之间', trigger: 'blur' },
      { pattern: rule.pattern, message: rule.message, trigger: 'blur' }
    ]
  })

  /**
   * 注册页面密码校验规则（computed）
   * 固定使用 type '0'（任意字符），不受后端 chrtype 配置影响，
   * 确保注册场景的密码门槛一致。
   * 规则：必填 + 长度 6-20 + type 0 字符格式
   */
  const registerPwdValidator = computed(() => {
    const rule = PWD_RULES['0']
    return [
      { required: true, message: '请输入您的密码', trigger: 'blur' },
      { min: 6, max: 20, message: '用户密码长度必须介于 6 和 20 之间', trigger: 'blur' },
      { pattern: rule.pattern, message: rule.message, trigger: 'blur' }
    ]
  })

  return {
    pwdChrType,
    pwdValidator,
    infoPwdValidator,
    pwdPromptValidator,
    registerPwdValidator
  }
}
