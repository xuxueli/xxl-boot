<!--
  Redirect（路由重定向）
  功能：根据路由参数 path 与 query 跳转到指定页面
  @author xuxueli 2026-11-22
-->
<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute() // 读取‌当前路由信息
const router = useRouter() // 控制‌路由跳转、后退、添加路由等
const { params, query } = route
const { path } = params

// path 为动态路由段，可能为空；保留原 query 一并跳转
router.replace({ path: '/' + (path as string), query })
</script>
