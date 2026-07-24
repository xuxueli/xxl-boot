<!--
  页面：Redirect（路由重定向）
  功能：根据路由参数 path 和 query 跳转到指定页面
-->
<template>
  <div></div>
</template>

<script setup>

// 引入
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()        // 读取‌当前路由信息
const router = useRouter()      // 控制‌路由跳转、后退、添加路由等
const { params, query } = route
const { path } = params

// 重定向到目标路径（保留 query 参数）
router.replace({ path: '/' + path, query })

</script>