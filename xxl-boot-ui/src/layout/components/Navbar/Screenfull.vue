<!--
  组件：Screenfull（全屏切换）
  功能：点击切换浏览器全屏/退出全屏模式
-->
<template>
  <div>
    <!-- isFullscreen 为 true 时显示"退出全屏"图标，否则显示"全屏"图标 -->
    <SvgIcon :icon-class="isFullscreen ? 'exit-fullscreen' : 'fullscreen'" @click="toggle" />
  </div>
</template>

<script setup>
import { useFullscreen } from '@vueuse/core'
/* 解构：isFullscreen 当前全屏状态，toggle 切换方法 */
const { isFullscreen, toggle } = useFullscreen()
</script>

<style lang='scss' scoped>
.screenfull-svg {
  display: inline-block;
  cursor: pointer;
  fill: #5a5e66;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
}
</style>
