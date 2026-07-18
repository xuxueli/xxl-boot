<!--
  组件：Copyright（底部版权）
  功能：系统布局底部版权信息，通过 settingsStore 控制显隐与文案
-->
<template>
  <footer v-if="visible" class="copyright">
    <span>{{ content }}</span>
  </footer>
</template>

<script setup>
import { useSettingsStore } from '@/store'

const settingsStore = useSettingsStore()
const visible = computed(() => settingsStore.footerVisible)
const content = computed(() => settingsStore.footerContent)
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  padding: 10px 20px;
  text-align: right;
  background-color: #f8f8f8;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e7e7e7;
  z-index: 999;
}
</style>
