<!--
  组件：IFrame（iframe 内嵌页面容器）
  功能：在系统页面内嵌加载外部 url，显示 loading 直至页面加载完成。
  用法：<IFrame src="https://example.com" />
-->
<template>
  <div v-loading="loading" :style="'height:' + height">
    <iframe 
      :src="url" 
      frameborder="no" 
      style="width: 100%; height: 100%" 
      scrolling="auto" />
  </div>
</template>

<script setup>
const props = defineProps({
  // 要嵌入的页面 URL（必传）
  src: {
    type: String,
    required: true
  }
})

// 动态高度：视口高度减去导航栏/标签栏占位
const height = ref(document.documentElement.clientHeight - 94.5 + "px;")
// 加载状态：初始 true，300ms 后自动关闭（给 iframe 加载缓冲时间）
const loading = ref(true)
const url = computed(() => props.src)

onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 300)
  // 窗口大小变化时重新计算 iframe 高度
  window.onresize = function temp() {
    height.value = document.documentElement.clientHeight - 94.5 + "px;"
  }
})
</script>
