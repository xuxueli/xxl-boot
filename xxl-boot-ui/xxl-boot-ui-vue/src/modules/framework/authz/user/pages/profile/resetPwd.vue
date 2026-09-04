<!--
  页面：ResetPwd（修改密码）
  功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
-->
<template>
  <!-- 修改密码表单 -->
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item :label="t('authz.user.oldPassword')" prop="oldPassword">
      <el-input v-model="user.oldPassword" :placeholder="t('common.inputPlaceholder', [t('authz.user.oldPassword')])" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('authz.user.newPassword')" prop="newPassword">
      <el-input v-model="user.newPassword" :placeholder="t('common.inputPlaceholder', [t('authz.user.newPassword')])" type="password" show-password />
    </el-form-item>
    <el-form-item :label="t('authz.user.confirmPassword')" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" :placeholder="t('authz.user.confirmPasswordPlaceholder')" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ t('common.save') }}</el-button>
      <el-button type="danger" @click="close">{{ t('common.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
// 引入
import { t } from '@/i18n'
import { updateUserPwd } from '../../api'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { FormInstance, FormItemRule, FormRules } from 'element-plus'
import { reactive, ref } from 'vue'

/** 密码表单数据 */
interface PwdForm {
  oldPassword?: string
  newPassword?: string
  confirmPassword?: string
}

/**
 * 新密码校验规则：必填 + 长度 6-20 + 任意字符（禁止 < > " ' \ |）
 * 说明：原设计按后端 chrtype（0-4）动态切换密码策略，但全项目无任何写入方，
 *       实际恒为默认策略 0（任意字符），故直接固定为一条规则。
 */
const newPasswordRules: FormItemRule[] = [
  { required: true, message: t('common.requiredMsg', [t('authz.user.newPassword')]), trigger: 'blur' },
  { min: 6, max: 20, message: t('authz.user.newPasswordLength'), trigger: 'blur' },
  { pattern: /^[^<>"'|\\]+$/, message: t('authz.user.newPasswordForbiddenChar'), trigger: 'blur' }
]

// 表单 ref
const pwdRef = ref<FormInstance>()

// 密码表单数据
const user = reactive<PwdForm>({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

/** 校验两次密码是否一致 */
const equalToPassword: FormItemRule['validator'] = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error(t('authz.user.passwordMismatch')))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = ref<FormRules>({
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
})

/** 提交按钮 */
function submit() {
  pwdRef.value!.validate((valid) => {
    if (valid) {
      updateUserPwd(user.oldPassword as string, user.newPassword as string).then((res) => {
        modal.msgSuccess(t('common.updateSuccess'))
        user.oldPassword = undefined
        user.newPassword = undefined
        user.confirmPassword = undefined
      })
    }
  })
}

/** 关闭按钮 */
function close() {
  tab.closePage()
}
</script>
