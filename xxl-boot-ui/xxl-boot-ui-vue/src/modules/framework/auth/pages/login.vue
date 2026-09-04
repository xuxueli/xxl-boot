<!--
  页面：Login（登录页面）
  功能：账号密码登录、验证码获取与展示、记住密码（Cookie 回填）
-->
<template>
  <div class="login">
    <h2 class="login-title">{{ brandName }}</h2>
    <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">{{ title }}</h3>

      <!-- 用户名 -->
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" size="large" auto-complete="off" placeholder="账号">
          <template #prefix><SvgIcon icon-class="user" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>

      <!-- 密码 -->
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          type="password"
          size="large"
          auto-complete="off"
          placeholder="密码"
          @keyup.enter="handleLogin"
        >
          <template #prefix><SvgIcon icon-class="password" class="el-input__icon input-icon" /></template>
        </el-input>
      </el-form-item>

      <!-- 验证码 -->
      <el-form-item prop="captchaResult" v-if="captchaEnabled">
        <el-input
          v-model="loginForm.captchaResult"
          size="large"
          auto-complete="off"
          placeholder="验证码"
          style="width: 63%"
          @keyup.enter="handleLogin"
        >
          <template #prefix><SvgIcon icon-class="validCode" class="el-input__icon input-icon" /></template>
        </el-input>
        <div class="login-code">
          <img :src="codeUrl" @click="getCode" class="login-code-img" />
        </div>
      </el-form-item>

      <!-- 记住密码 -->
      <el-checkbox prop="rememberMe" v-model="loginForm.rememberMe" style="margin: 0px 0px 8px 0px">记住密码</el-checkbox>

      <!-- login btn -->
      <el-form-item style="width: 100%">
        <el-button :loading="loading" size="large" type="primary" style="width: 100%" @click.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
      </el-form-item>
    </el-form>
    <!--  底部版权  -->
    <div class="el-login-footer">
      {{ footerContent }}
      <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" style="margin-left: 5px; text-decoration: underline">xuxueli</a>
      <a href="https://github.com/xuxueli/xxl-boot" target="_blank" style="margin-left: 5px; text-decoration: underline">github</a>
    </div>
  </div>
</template>

<script setup lang="ts">
// 导入依赖
import { getCodeImg } from '../api'
import { useUserStore } from '@/store'
import defaultSettings from '@/default-settings'
import type { LoginParams } from '@/types'
import type { FormInstance, FormRules } from 'element-plus'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { SvgIcon } from '@/components'

const title = defaultSettings.title // 系统标题
const brandName = defaultSettings.brandName // 品牌名称
const footerContent = defaultSettings.footerContent // 页脚版权信息
const userStore = useUserStore()
const route = useRoute() // 路由
const router = useRouter() // 路由
const loginRef = ref<FormInstance>() // 登录表单 ref

// 登录表单数据
const loginForm = ref<LoginParams>({
  username: '',
  password: '',
  rememberMe: false,
  captchaResult: '',
  captchaUuid: ''
})

// 表单校验规则
const loginRules: FormRules = {
  username: [{ required: true, trigger: 'blur', message: '请输入您的账号' }],
  password: [{ required: true, trigger: 'blur', message: '请输入您的密码' }],
  captchaResult: [{ required: true, trigger: 'change', message: '请输入验证码' }]
}

const codeUrl = ref('') // 验证码图片 base64
const loading = ref(false) // 登录按钮 loading
const captchaEnabled = ref(true) // 验证码开关（默认开启，实际由后端 /auth/captcha 返回的 enable 决定）
const redirect = ref<string>() // 登录后重定向地址

// 监听路由参数，获取重定向地址
watch(
  route,
  (newRoute) => {
    redirect.value = (newRoute.query && newRoute.query.redirect) as string | undefined
  },
  { immediate: true }
)

/**
 * 处理登录：
 *    - 表单校验
 *    - →调用登录接口
 *    - →路由跳转
 */
function handleLogin() {
  loginRef.value!.validate((valid) => {
    if (valid) {
      loading.value = true
      // 执行登录
      userStore
        .login(loginForm.value)
        .then(() => {
          const query = route.query
          const otherQueryParams = Object.keys(query).reduce((acc: Record<string, any>, cur) => {
            if (cur !== 'redirect') {
              acc[cur] = query[cur]
            }
            return acc
          }, {})
          router.push({ path: redirect.value || '/', query: otherQueryParams })
        })
        .catch(() => {
          loading.value = false
          // 重新获取验证码
          if (captchaEnabled.value) {
            getCode()
          }
        })
    }
  })
}

/** 获取验证码图片，根据开关控制显示 */
function getCode() {
  getCodeImg().then((res) => {
    captchaEnabled.value = res.data.enable
    codeUrl.value = res.data.image
    loginForm.value.captchaUuid = res.data.uuid
  })
}

/** 初始化：获取验证码 */
getCode()
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  height: 100%;
  padding-bottom: 120px;
  background-color: #d2d6de;
  background-size: cover;
}
.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #444;
}
.login-title {
  margin: 0;
  font-size: 32px;
  text-align: center;
  color: #444;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px 25px 5px 25px;
  margin-bottom: 25px;
  z-index: 1;
  .el-input {
    height: 40px;
    input {
      height: 40px;
    }
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 40px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.login-code-img {
  height: 40px;
  padding-left: 12px;
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #666;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

/* 暗黑模式 */
html.dark .login {
  background-color: #d2d6de;
  .login-form {
    background: var(--el-bg-color-overlay) !important;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
  }
}
html.dark .title,
html.dark .login-title {
  color: #c5c5c5;
}
</style>
