<!--
  ResetPwd（修改密码）
  功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
  @author xuxueli 2026-11-22
-->
<template>
  <!-- 修改密码表单 -->
  <el-form ref="pwdRef" :model="pwdForm" :rules="rules" label-width="80px">
    <el-form-item :label="t('authz.user.oldPassword')" prop="oldPassword">
      <el-input v-model="pwdForm.oldPassword" :placeholder="t('common.inputPlaceholder', [t('authz.user.oldPassword')])" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('authz.user.newPassword')" prop="newPassword">
      <el-input v-model="pwdForm.newPassword" :placeholder="t('common.inputPlaceholder', [t('authz.user.newPassword')])" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('authz.user.confirmPassword')" prop="confirmPassword">
      <el-input v-model="pwdForm.confirmPassword" :placeholder="t('authz.user.confirmPasswordPlaceholder')" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ t('common.save') }}</el-button>
      <el-button type="danger" @click="close">{{ t('common.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'ResetPwd' })
import { ref } from 'vue'
import { t } from '@/i18n'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import { userApi } from '../../api'
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'

/** 密码表单数据 */
interface PwdForm {
  /** 旧密码 */
  oldPassword?: string
  /** 新密码 */
  newPassword?: string
  /** 确认密码 */
  confirmPassword?: string
}

/**
 * 新密码校验规则：必填 + 长度 6-20 + 任意字符（禁止 < > " ' \ |）
 *
 * 与后端 UserServiceImpl 的密码策略保持一致（6-20 位）。
 */
const newPasswordRules: FormItemRule[] = [
  { required: true, message: t('common.requiredMsg', [t('authz.user.newPassword')]), trigger: 'blur' },
  { min: 6, max: 20, message: t('authz.user.newPasswordLength'), trigger: 'blur' },
  { pattern: /^[^<>"'|\\]+$/, message: t('authz.user.newPasswordForbiddenChar'), trigger: 'blur' }
]

const pwdRef = ref<FormInstance>() /* 表单实例 */
const pwdForm = ref<PwdForm>({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
}) /* 密码表单数据 */

/** 校验两次输入的密码是否一致 */
const equalToPassword: FormItemRule['validator'] = (rule, value, callback) => {
  // 确认密码与新密码不一致时中断校验并提示
  if (pwdForm.value.newPassword !== value) {
    callback(new Error(t('authz.user.passwordMismatch')))
  } else {
    callback()
  }
}

// 表单校验规则
const rules: FormRules = {
  oldPassword: [{ required: true, message: t('common.requiredMsg', [t('authz.user.oldPassword')]), trigger: 'blur' }],
  newPassword: newPasswordRules,
  confirmPassword: [
    { required: true, message: t('common.requiredMsg', [t('authz.user.confirmPassword')]), trigger: 'blur' },
    {
      required: true,
      validator: equalToPassword,
      trigger: 'blur'
    }
  ]
}

/** 校验通过后提交密码修改，成功后清空表单 */
function submit() {
  pwdRef.value?.validate((valid) => {
    // 校验失败时保持表单，等待用户修正
    if (!valid) return
    const { oldPassword, newPassword } = pwdForm.value
    // 校验已保证两个字段非空
    if (!oldPassword || !newPassword) return
    userApi
      .updatePwd(oldPassword, newPassword)
      .then(() => {
        modal.msgSuccess(t('common.updateSuccess'))
        pwdForm.value = { oldPassword: undefined, newPassword: undefined, confirmPassword: undefined }
      })
      .catch(() => {})
  })
}

/** 关闭当前页签 */
function close() {
  tab.closePage()
}
</script>
