/**
 * usePasswordRule - 密码强度校验规则
 *
 * 根据后端配置的 chrtype 动态生成 antd 表单校验规则。
 * chrtype 从 sessionStorage 读取，支持 0-4 五种密码策略。
 *
 * 用法：
 *   const { pwdValidator, infoPwdValidator, registerPwdValidator } = usePasswordRule()
 *   // rules={pwdValidator} 绑定到 ProFormText.Password
 *
 * chrtype:
 *   0 - 任意字符（默认，仅禁止 < > " ' \ |）
 *   1 - 纯数字（0-9）
 *   2 - 纯字母（a-z / A-Z）
 *   3 - 字母 + 数字（必须同时包含）
 *   4 - 字母 + 数字 + 特殊字符（必须同时包含，特殊字符：~!@#$%^&*()-=_+）
 */
import type { Rule } from 'antd/es/form';

/** 从 sessionStorage 读取密码字符类型配置 */
const getPwdChrType = (): string => sessionStorage.getItem('pwrChrtype') || '0';

/** 密码校验规则项 */
interface PwdRule {
  pattern: RegExp;
  message: string;
}

/**
 * 密码校验规则配置表
 *
 * key 为 chrtype 值，value 包含：
 *   - pattern: 正则表达式，用于校验密码字符组成
 *   - message: 校验失败时的提示文案
 */
const PWD_RULES: Record<string, PwdRule> = {
  '0': { pattern: /^[^<>"'|\\]+$/, message: '密码不能包含非法字符：< > " \' \\ |' },
  '1': { pattern: /^[0-9]+$/, message: '密码只能为数字（0-9）' },
  '2': { pattern: /^[a-zA-Z]+$/, message: '密码只能为英文字母（a-z、A-Z）' },
  '3': { pattern: /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]+$/, message: '密码必须同时包含字母和数字' },
  '4': {
    pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[~!@#$%^&*()\-=_+])[A-Za-z\d~!@#$%^&*()\-=_+]+$/,
    message: '密码必须同时包含字母、数字和特殊字符（~!@#$%^&*()-=_+）',
  },
};

/**
 * 密码校验 Hook（usePasswordRule）
 *
 * 返回各场景的校验规则数组，供 antd FormItem rules 直接使用。
 *
 * @returns {
 *   pwdValidator:           通用密码校验规则（必填 + 长度 6-20 + 当前 chrtype 字符格式），适用于修改密码
 *   infoPwdValidator:       个人中心新密码校验规则，提示文案使用「新密码」
 *   pwdPromptValidator:     弹框输入校验函数（固定 type '0'），返回错误提示字符串或 undefined
 *   registerPwdValidator:   注册页密码校验规则（固定 type '0'），密码门槛一致
 * }
 */
export function usePasswordRule() {
  const chrType = getPwdChrType();

  /**
   * 通用密码校验规则
   * 根据当前 chrtype 动态返回对应的字符规则，适用于登录后修改密码等场景。
   * 规则：必填 + 长度 6-20 + 字符格式
   */
  const buildValidator = (requiredMsg: string): Rule[] => {
    const rule = PWD_RULES[chrType] || PWD_RULES['0'];
    return [
      { required: true, message: requiredMsg },
      { min: 6, max: 20, message: '密码长度必须介于 6 和 20 之间' },
      { pattern: rule.pattern, message: rule.message },
    ];
  };

  /** 通用密码校验规则（提示文案为「密码」） */
  const pwdValidator = buildValidator('密码不能为空');

  /** 个人中心新密码校验规则（提示文案为「新密码」） */
  const infoPwdValidator = buildValidator('新密码不能为空');

  /** 注册页密码校验规则（固定 type '0'，不受后端 chrtype 配置影响） */
  const registerPwdValidator = buildValidator('请输入您的密码');

  /**
   * 弹框输入校验函数
   * 以函数形式返回校验结果字符串（非空=不合法），适用于 Modal.prompt 等 inputValidator。
   * 固定使用 type '0'（任意字符），不受 chrtype 影响。
   *
   * @param value 用户输入的密码
   * @returns 校验不通过时返回错误提示字符串；通过时返回 undefined
   */
  const pwdPromptValidator = (value: string): string | undefined => {
    const rule = PWD_RULES['0'];
    if (!value || value.length < 6 || value.length > 20) {
      return '密码长度必须介于 6 和 20 之间';
    }
    if (!rule.pattern.test(value)) {
      return rule.message;
    }
    return undefined;
  };

  return {
    pwdValidator,
    infoPwdValidator,
    registerPwdValidator,
    pwdPromptValidator,
  };
}
