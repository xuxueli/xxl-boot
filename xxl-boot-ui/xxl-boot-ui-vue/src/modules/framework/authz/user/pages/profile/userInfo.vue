<!--
  页面：UserInfo（基本资料编辑）
  功能：编辑用户名称、手机号、邮箱
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
// 引入
import { t } from '@/i18n'
import { updateUserProfile } from '../../api'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { User } from '../../types'
import type { FormInstance, FormRules } from 'element-plus'
import { ref, watch } from 'vue'

/** 基本资料表单数据 */
interface UserInfoForm {
  realName?: string
  phone?: string
  email?: string
}

// 父组件传入的用户数据
const props = defineProps<{
  user?: User
}>()

const userRef = ref<FormInstance>() // 表单 ref
const form = ref<UserInfoForm>({}) // 表单数据
const rules = ref<FormRules>({
  // 表单校验规则
  realName: [{ required: true, message: t('common.requiredMsg', [t('common.realName')]), trigger: 'blur' }],
  phone: [{ pattern: /^\d{5,11}$/, message: t('authz.user.mobileInvalid'), trigger: 'blur' }],
  email: [{ type: 'email', message: t('authz.user.emailInvalid'), trigger: 'blur' }]
})

/** 提交按钮 */
function submit() {
  userRef.value!.validate((valid) => {
    if (valid) {
      updateUserProfile(form.value).then(() => {
        modal.msgSuccess(t('common.updateSuccess'))
      })
    }
  })
}

/** 关闭按钮 */
function close() {
  tab.closePage()
}

// 回显当前登录用户信息
watch(
  () => props.user,
  (user) => {
    if (user) {
      form.value = { realName: user.realName, email: user.email as string, phone: user.phone as string }
    }
  },
  { immediate: true }
)
</script>
