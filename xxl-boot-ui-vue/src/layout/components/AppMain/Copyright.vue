<!--
  组件：Copyright（底部版权）
  功能：系统布局底部版权信息，显隐通过 settingsStore 控制，文案取 default-settings 静态常量
-->
<template>
  <footer v-if="visible" class="copyright">
    <!-- Powered by <b>XXL-BOOT</b> v{{version}}
    ｜-->
    <span>{{ footerContent }}</span>
    <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" style="margin-left: 5px; text-decoration: underline">xuxueli</a>
    <a href="https://github.com/xuxueli/xxl-boot" target="_blank" style="margin-left: 5px; text-decoration: underline">github</a>
  </footer>
</template>

<script setup lang="ts">
import { useSettingsStore } from '@/store'
import defaultSettings from '@/default-settings'

const settingsStore = useSettingsStore()
const visible = computed(() => settingsStore.footerVisible)
const footerContent = computed(() => defaultSettings.footerContent)
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  padding: 6px 20px;
  text-align: right;
  background-color: #f8f8f8;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e7e7e7;
  z-index: 999;
}
</style>
