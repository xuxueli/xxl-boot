<!--
  UserInfo（基本资料编辑）
  功能：编辑当前登录用户的用户名称、手机号、邮箱
  @author xuxueli 2026-11-22
-->
<template>
  <!-- 基本资料表单 -->
  <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
    <el-form-item :label="t('common.realName')" prop="realName">
      <el-input v-model="form.realName" maxlength="30" />
    </el-form-item>
    <el-form-item :label="t('authz.user.phoneNumber')" prop="phone">
      <el-input v-model="form.phone" maxlength="11" @input="(value: string) => (form.phone = value.slice(0, 11))" />
    </el-form-item>
    <el-form-item :label="t('authz.user.email')" prop="email">
      <el-input v-model="form.email" maxlength="100" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">{{ t('common.save') }}</el-button>
      <el-button type="danger" @click="close">{{ t('common.close') }}</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
defineOptions({ name: 'UserInfo' })
import { ref, watch } from 'vue'
import { t } from '@/i18n'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import { userApi } from '../../api'
import type { User } from '../../types'
import type { FormInstance, FormRules } from 'element-plus'

/** 基本资料表单数据：复用用户实体中的可编辑字段 */
type UserInfoForm = Pick<User, 'realName' | 'phone' | 'email'>

// 父组件传入的用户数据
const props = defineProps<{
  user?: User
}>()

const userRef = ref<FormInstance>() /* 表单实例 */
const form = ref<UserInfoForm>({}) /* 表单数据 */
const rules: FormRules = {
  // 表单校验规则
  realName: [{ required: true, message: t('common.requiredMsg', [t('common.realName')]), trigger: 'blur' }],
  phone: [{ pattern: /^\d{5,11}$/, message: t('authz.user.mobileInvalid'), trigger: 'blur' }],
  email: [{ type: 'email', message: t('authz.user.emailInvalid'), trigger: 'blur' }]
}

/** 校验通过后提交基本资料 */
function submit() {
  userRef.value?.validate((valid) => {
    // 校验失败时保持表单，等待用户修正
    if (!valid) return
    userApi
      .updateProfile(form.value)
      .then(() => {
        modal.msgSuccess(t('common.updateSuccess'))
      })
      .catch(() => {})
  })
}

/** 关闭当前页签 */
function close() {
  tab.closePage()
}

// 回显当前登录用户信息
watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = { realName: user.realName, email: user.email, phone: user.phone }
    }
  },
  { immediate: true }
)
</script>
