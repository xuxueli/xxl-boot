<!--
 * @Description: 根组件
-->
<template>
  <el-config-provider :locale="elLocale">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
// 系统设置Store模块
import { computed, nextTick, onMounted } from 'vue'
import type { Language } from 'element-plus/es/locale'
import elZhCn from 'element-plus/es/locale/lang/zh-cn'
import elEn from 'element-plus/es/locale/lang/en'
import { getLang, type I18nLang } from '@/i18n'
import { useSettingsStore } from '@/store'

const settingsStore = useSettingsStore()

/** Element Plus 语言包注册表：新增语言时在此补充，Record 保证不漏配 */
const elLocales: Record<I18nLang, Language> = { zh: elZhCn, en: elEn }

/** Element Plus 语言包：随当前语言响应式切换 */
const elLocale = computed(() => elLocales[getLang()])

/**
 * 组件挂载后的生命周期钩子
 *
 * 执行流程：
 * 1. 等待 DOM 更新完成（nextTick）
 * 2. 从 settings store 中获取当前主题配置，应用主题样式到全局
 * 3. 加载系统基础配置（界面语言、验证码开关），使前端语言与后端保持一致
 */
onMounted(() => {
  nextTick(() => {
    settingsStore.initSetting()
  })
  settingsStore.loadBaseConfig()
})
</script>
