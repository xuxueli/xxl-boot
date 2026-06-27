<!--
 * @Description: 根组件
-->
<template>
  <router-view/>
</template>

<script setup>
// 系统设置Store模块
import useSettingsStore from '@/store/modules/settings'

/**
 * 组件挂载后的生命周期钩子
 *
 * 执行流程：
 * 1. 等待 DOM 更新完成（nextTick）
 * 2. 从 settings store 中获取当前主题配置，应用主题样式到全局
 */
onMounted(() => {
  nextTick(() => {
    useSettingsStore().initSetting()
  })
})
</script>
