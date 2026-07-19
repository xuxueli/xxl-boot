<!--
  组件：Breadcrumb（面包屑导航）
  功能：基于当前路由和权限路由树生成层级导航，支持按层级回退跳转
-->
<template>
  <!-- 外层面包屑容器：统一分隔符为 "/" -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 过渡组：用于路由切换时的面包屑动画 -->
    <transition-group name="breadcrumb">
      <!-- 导航节点：按 levelList 渲染每一个导航节点 -->
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 纯文本节点：当前页或显式 noRedirect 节点仅展示文本，不可点击 -->
        <span v-if="(item.children && item.children.length > 0) || index === levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 可点击节点：点击后交给 handleLink 统一处理 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>


<script setup>
import settings from '@/settings'

const route = useRoute()
const router = useRouter()
/* 面包屑层级列表 */
const levelList = ref([])

/*
* 生成面包屑列表：从 route.matched 取 Vue Router 已解析的完整匹配链路
*/
function getBreadcrumb() {
  /* 取 Vue Router 已解析的完整匹配链路，过滤无 title 的容器节点 */
  let matched = route.matched.filter((item) => item.meta && item.meta.title)

  /* 首节点不是"首页"时自动补 home 项 */
  /*if (!isDashboard(matched[0])) {
    matched = [{ path: settings.homePath, meta: { title: "首页" } }].concat(matched)
  }*/

  levelList.value = matched
}

/*
* 点击面包屑节点跳转
*/
function handleLink(item) {
  router.push(item.path)
}

/*
* 监听路由变化更新面包屑，redirect 路径不更新避免闪烁
*/
watchEffect(() => {
  if (route.path.startsWith('/redirect/')) return
  getBreadcrumb()
})
/* 首次渲染时立即生成一次，确保首屏面包屑正确 */
getBreadcrumb()
</script>


<style lang='scss' scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
