<!--
  组件名称：Breadcrumb（面包屑导航）
  组件功能：基于当前路由和权限路由树生成层级导航，帮助用户识别当前位置并支持按层级回退跳转。
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
import useRoutesStore from '@/store/modules/routes'

/**
 * 结构说明（总 -> 分）：
 * 1) 数据来源：route（当前路由）+ permissionStore.defaultRoutes（权限路由树）。
 * 2) 状态承载：levelList 存储当前应展示的面包屑节点列表。
 * 3) 构建流程：getBreadcrumb -> 过滤/补首页 -> 赋值 levelList。
 * 4) 交互流程：点击节点时由 handleLink 处理 redirect/path 跳转。
 *
 * 组件对外输入/输出：
 * - props：无（完全依赖路由上下文和权限路由状态）。
 * - computed：无（使用 ref + 方法实时构建展示数据）。
 */
const route = useRoute()
const router = useRouter()
// 面包屑展示数据：每项通常包含 path、meta.title、redirect 等路由字段。
const levelList = ref([])

// 根据当前 path 生成面包屑列表，兼容普通路由与多级菜单场景。
function getBreadcrumb() {
  // only show routes with meta.title
  let matched = []
  const pathNum = findPathNum(route.path)
  // multi-level menu
  if (pathNum > 2) {
    const reg = /\/\w+/gi
    const pathList = route.path.match(reg).map((item, index) => {
      if (index !== 0) item = item.slice(1)
      return item
    })
    getMatched(pathList, useRoutesStore().fullRoutes, matched)
  } else {
    matched = route.matched.filter((item) => item.meta && item.meta.title)
  }
  // 判断是否为首页
  if (!isDashboard(matched[0])) {
    matched = [{ path: "/index", meta: { title: "首页" } }].concat(matched)
  }
  levelList.value = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
}

// 统计路径中 "/" 数量，用于识别是否进入多级菜单路径。
function findPathNum(str, char = "/") {
  let index = str.indexOf(char)
  let num = 0
  while (index !== -1) {
    num++
    index = str.indexOf(char, index + 1)
  }
  return num
}

// 在权限路由树中按 pathList 递归查找匹配链路，构建 matched 结果。
function getMatched(pathList, routeList, matched) {
  let data = routeList.find(item => item.path == pathList[0] || (item.name += '').toLowerCase() == pathList[0])
  if (data) {
    matched.push(data)
    if (data.children && pathList.length) {
      pathList.shift()
      getMatched(pathList, data.children, matched)
    }
  }
}

// 判断首节点是否为首页，用于决定是否补充“首页”面包屑入口。
function isDashboard(route) {
  const name = route && route.name
  if (!name) {
    return false
  }
  return name.trim() === 'Index'
}

function handleLink(item) {
  router.push(item.path)
}

// 【watchEffect 用法说明】
// 1) 写法：watchEffect(() => { ...使用到的响应式数据... })
// 2) 特性：回调会先立即执行一次，并在内部依赖变化时自动再次执行。
// 3) 本组件中的作用：监听 route.path 变化后重新调用 getBreadcrumb，
//    让面包屑始终与当前路由层级保持一致（含首屏首次渲染）。
watchEffect(() => {
  // 重要实现细节：redirect 中转页不更新面包屑，避免出现临时跳转路径痕迹。
  // 例如权限跳转/重定向过程中，URL 会短暂进入 /redirect/*，此时保持上一状态可避免闪烁。
  // if you go to the redirect page, do not update the breadcrumbs
  if (route.path.startsWith('/redirect/')) {
    return
  }
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
