<!--
  组件：Doc（文档入口）
  功能：顶部导航栏文档图标按钮，点击跳转项目文档地址
-->
<template>
  <div>
    <SvgIcon icon-class="question" @click="goto" />
  </div>
</template>

<script setup>
/* 项目文档 URL */
const url = ref('https://www.xuxueli.com/xxl-boot/')

/*
* 新窗口打开项目文档
*/
function goto() {
  window.open(url.value)
}
</script>
