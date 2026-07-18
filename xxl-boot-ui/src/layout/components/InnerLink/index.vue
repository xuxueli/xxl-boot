<!--
  组件：InnerLink（内嵌 iframe 页面）
  功能：在系统内部以 iframe 方式加载外部页面，加载期间显示 loading

  Props：父组件向子组件传递数据的核心机制。
    - 组件间的‌单向数据流‌：数据由父组件流向子组件，子组件只能读取，严禁直接修改（Mutate）。
    - 若需修改，应通过 $emit 触发事件通知父组件。
    - 使用示例：<InnerLink src="https://xxx.com" iframeId="111" />

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
