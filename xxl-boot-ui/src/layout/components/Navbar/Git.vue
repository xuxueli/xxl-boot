<!--
  组件：Git（源码入口）
  功能：顶部导航栏 GitHub 图标按钮，点击跳转源码仓库
-->
<template>
  <div>
    <svg-icon icon-class="github" @click="goto" />
  </div>
</template>

<script setup>
/* 源码仓库 URL */
const url = ref('https://gitee.com/xxx/x')

/*
* 新窗口打开源码仓库
*/
function goto() {
  window.open(url.value)
}
</script>
