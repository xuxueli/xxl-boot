<!--
  组件：InnerLink（内嵌 iframe 页面）
  功能：在系统内部以 iframe 方式加载外部页面，加载期间显示 loading
-->
<template>
  <div :style="'height:' + height" v-loading="loading" element-loading-text="正在加载页面，请稍候！">
    <iframe
      :id="iframeId"
      style="width: 100%; height: 100%"
      :src="src"
      ref="iframeRef"
      frameborder="no"
    ></iframe>
  </div>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
    default: "/"
  },
  iframeId: {
    type: String
  }
})

const loading = ref(true)
const height = ref(document.documentElement.clientHeight - 94.5 + 'px')
const iframeRef = ref(null)

/*
* iframe 加载完成后隐藏 loading
*/
onMounted(() => {
  if (iframeRef.value) {
    iframeRef.value.onload = () => {
      loading.value = false
    }
  }
})
</script>
