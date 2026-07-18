<!--
  组件：BootDoc（文档入口）
  功能：顶部导航栏文档图标按钮，点击跳转项目文档地址
-->
<template>
  <div>
    <svg-icon icon-class="question" @click="goto" />
  </div>
</template>

<script setup>
const url = ref('http://xxx.xxx/xxx')

/*
* 新窗口打开项目文档
*/
function goto() {
  window.open(url.value)
}
</script>