<!--
  页面：UserInfo（基本资料编辑）
  功能：编辑用户名称、手机号、邮箱
-->
<template>
   <!-- 基本资料表单 -->
   <el-form ref="userRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="用户名称" prop="realName">
         <el-input v-model="form.realName" maxlength="30" />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
         <el-input v-model="form.phone" maxlength="20" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
         <el-input v-model="form.email" maxlength="100" />
      </el-form-item>
      <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
      </el-form-item>
   </el-form>
</template>

<script setup lang="ts">

// 引入
import { updateUserProfile } from '@/api/org/user'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { User } from '@/types/api'
import type { FormInstance, FormRules } from 'element-plus'

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

const userRef = ref<FormInstance>()   // 表单 ref
const form = ref<UserInfoForm>({})     // 表单数据
const rules = ref<FormRules>({        // 表单校验规则
  realName: [{ required: true, message: "用户名称不能为空", trigger: "blur" }],
  phone: [{ pattern: /^\d{5,20}$/, message: "手机号格式不正确", trigger: "blur" }],
  email: [{ type: 'email', message: "邮箱格式不正确", trigger: "blur" }]
})

/** 提交按钮 */
function submit() {
  userRef.value!.validate(valid => {
    if (valid) {
      updateUserProfile(form.value).then(() => {
        modal.msgSuccess("修改成功")
      })
    }
  })
}

/** 关闭按钮 */
function close() {
  tab.closePage()
}

// 回显当前登录用户信息
watch(() => props.user, user => {
  if (user) {
    form.value = { realName: user.realName, email: user.email as string, phone: user.phone as string }
  }
},{ immediate: true })

</script>
