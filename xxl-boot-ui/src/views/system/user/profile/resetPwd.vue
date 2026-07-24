<!--
  页面：ResetPwd（修改密码）
  功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
-->
<template>
  <!-- 修改密码表单 -->
  <el-form ref="pwdRef" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword" :rules="infoPwdValidator">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">保存</el-button>
      <el-button type="danger" @click="close">关闭</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>

// 引入
import {usePasswordRule} from "@/composables/usePasswordRule"
import {updateUserPwd} from "@/api/system/user"
import modal from '@/utils/modal'
import tab from '@/utils/tab'

// 表单 ref
const pwdRef = ref(null)
const {infoPwdValidator} = usePasswordRule()

// 密码表单数据
const user = reactive({
  oldPassword: undefined,
  newPassword: undefined,
  confirmPassword: undefined
})

/** 校验两次密码是否一致 */
const equalToPassword = (rule, value, callback) => {
  if (user.newPassword !== value) {
    callback(new Error("两次输入的密码不一致"))
  } else {
    callback()
  }
}

// 表单校验规则
const rules = ref({
  oldPassword: [{required: true, message: "旧密码不能为空", trigger: "blur"}],
  confirmPassword: [{required: true, message: "确认密码不能为空", trigger: "blur"}, {
    required: true,
    validator: equalToPassword,
    trigger: "blur"
  }]
})

/** 提交按钮 */
function submit() {
  pwdRef.value.validate(valid => {
    if (valid) {
      updateUserPwd(user.oldPassword, user.newPassword).then(() => {
        modal.msgSuccess("修改成功")
      })
    }
  })
}

/** 关闭按钮 */
function close() {
  tab.closePage()
}
</script>
