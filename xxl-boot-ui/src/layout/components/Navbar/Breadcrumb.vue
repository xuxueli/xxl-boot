<!--
  组件：Breadcrumb（面包屑导航）
  功能：基于当前路由和权限路由树生成层级导航，支持按层级回退跳转
-->
<template>
  <!-- 一级结构：外层面包屑容器，统一分隔符为 "/" -->
  <el-breadcrumb class="app-breadcrumb" separator="/">
    <!-- 二级结构：过渡组用于路由切换时的面包屑动画 -->
    <transition-group name="breadcrumb">
      <!-- 三级结构：按 levelList 渲染每一个导航节点 -->
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <!-- 当前页或显式 noRedirect 节点仅展示文本，不可点击 -->
        <span v-if="(item.children && item.children.length > 0) || index == levelList.length - 1" class="no-redirect">{{ item.meta.title }}</span>
        <!-- 其他节点提供跳转能力，点击后交给 handleLink 统一处理 -->
        <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script setup>
import { useRoutesStore } from '@/store'

const route = useRoute()
const router = useRouter()
const levelList = ref([])

/*
* 生成面包屑列表：路径层级 > 2 时在路由树中递归匹配，否则取 route.matched
*/
function getBreadcrumb() {
  let matched = []
  const pathNum = findPathNum(route.path)
  if (pathNum > 2) {
    /* 多级菜单：按 path 分段在路由树中递归查找链路 */
    const reg = /\/\w+/gi
    const pathList = route.path.match(reg).map((item, index) => {
      if (index !== 0) item = item.slice(1)
      return item
    })
    getMatched(pathList, useRoutesStore().fullRoutes, matched)
  } else {
    /* 一级菜单：直接从 route.matched 取 */
    matched = route.matched.filter((item) => item.meta && item.meta.title)
  }
  /* 首节点不是"首页"时自动补 */
  if (!isDashboard(matched[0])) {
    matched = [{ path: "/index", meta: { title: "首页" } }].concat(matched)
  }
  /* 过滤掉标记 breadcrumb: false 的项 */
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

/*
* 统计路径中 "/" 数量，判断是否多级菜单
*/
function findPathNum(str, char = "/") {
  let index = str.indexOf(char)
  let num = 0
  while (index !== -1) { num++; index = str.indexOf(char, index + 1) }
  return num
}

/*
* 在路由树中按 pathList 递归查找匹配链路
*/
function getMatched(pathList, routeList, matched) {
  let data = routeList.find(item => item.path == pathList[0] || (item.name += '').toLowerCase() == pathList[0])
  if (data) {
    matched.push(data)
    /* 有子路由且还有剩余 path 时继续递归 */
    if (data.children && pathList.length) {
      pathList.shift()
      getMatched(pathList, data.children, matched)
    }
  }
}

/*
* 判断首节点是否为首页（name === 'Index'）
*/
function isDashboard(route) {
  const name = route && route.name
  return name ? name.trim() === 'Index' : false
}

/*
* 点击面包屑节点跳转
*/
function handleLink(item) {
  router.push(item.path)
}

/*
* 监听路由变化更新面包屑，redirect 路径不更新避免闪烁
*
*
* 【watchEffect 用法说明】
*   1）写法：watchEffect(() => { ...使用到的响应式数据... })
*   2) 特性：回调会先立即执行一次，并在内部依赖变化时自动再次执行。
*   3) 本组件中的作用：监听 route.path 变化后重新调用 getBreadcrumb，
*   让面包屑始终与当前路由层级保持一致（含首屏首次渲染）。
*/
watchEffect(() => {
  if (route.path.startsWith('/redirect/')) return
  getBreadcrumb()
})
// 显式初始化一次，确保在某些依赖尚未稳定时也能尽早渲染基础面包屑。
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
