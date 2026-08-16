<!--
  组件：TopBarMix.vue（混合模式顶部导航 - 导航模式 mix）
  功能：navType='mix' 时在顶部渲染一级菜单，选中后左侧侧边栏联动显示对应子菜单
-->
<template>
  <el-menu :default-active="activeMenu" mode="horizontal" @select="handleSelect" :ellipsis="false">
    <!-- 可见的一级菜单项：前 visibleNumber 条 -->
    <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{ '--theme': theme }" :index="item.path || ''" :key="index" v-if="index < visibleNumber">
        <SvgIcon v-if="item.meta && item.meta.icon && item.meta.icon !== '#'" :icon-class="item.meta.icon" />
        {{ item.meta?.title }}
      </el-menu-item>
    </template>

    <!-- 超出的菜单：折叠到"更多" -->
    <el-sub-menu :style="{ '--theme': theme }" index="more" v-if="topMenus.length > visibleNumber">
      <template #title>更多</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item :index="item.path || ''" :key="index" v-if="index >= visibleNumber">
          <!-- icon -->
          <SvgIcon v-if="item.meta && item.meta.icon && item.meta.icon !== '#'" :icon-class="item.meta.icon" />
          <!-- title -->
          {{ item.meta?.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup lang="ts">
import { isHttp } from '@/utils/validate'
import { useAppStore, useRoutesStore, useSettingsStore } from '@/store'
import { filterMenuRoutes, promoteSingleChildRoutes, findMenuByPath, findActiveTopMenu, useVisibleMenuCount } from '@/utils/menu'
import defaultSettings from '@/default-settings'
import type { RouteData } from '@/store/modules/routes'
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const routesStore = useRoutesStore()
const route = useRoute() /* 读取当前路由信息 */
const router = useRouter() /* 控制路由跳转、后退、添加路由等 */

const theme = computed(() => settingsStore.theme)
const routers = computed(() => routesStore.dynamicRoutes)
const hideList = [defaultSettings.homePath] /* 路由列表中不显示侧边栏的路径 */
const { visibleNumber } = useVisibleMenuCount(0)

/*
 * 顶部菜单列表
 *   - 过滤隐藏菜单；meta=null 的 Layout 包装容器用其首个子路由替代
 */
const topMenus = computed<RouteData[]>(() => {
  return promoteSingleChildRoutes(filterMenuRoutes(routers.value))
})

/*
 * 当前激活菜单（纯计算，无副作用）
 *   - 命中顶级菜单时取其 path 高亮，否则用当前路由 path
 */
const activeMenu = computed(() => {
  const path = route.path
  const matchedTopMenu = findActiveTopMenu(routers.value, path)
  if (matchedTopMenu) {
    return matchedTopMenu.path ?? path
  }
  return path
})

/*
 * 路由变化联动侧边栏（副作用统一收敛到 app store）
 *   - syncMixSidebar：根据当前路径决定侧边栏显隐（菜单折叠/目录展开）
 *   - setMixScopeForChildren：写入 mix 作用域，供侧边栏过滤展示子菜单
 */
watch(
  () => route.path,
  (path) => {
    const matchedTopMenu = findActiveTopMenu(routers.value, path)
    const activePath = matchedTopMenu ? (matchedTopMenu.path ?? path) : path
    appStore.syncMixSidebar(routers.value, path, hideList)
    appStore.setMixScopeForChildren(routers.value, activePath)
  },
  { immediate: true }
)

/*
 * 顶部菜单选中：
 *   - 外部链接新窗口
 *   - 顶级菜单自身即菜单（无下级菜单）：直接跳转并折叠左侧下级菜单
 *   - 顶级菜单为目录：展开左侧菜单，供点击具体下级菜单
 */
function handleSelect(key: string) {
  const topMenu = topMenus.value.find((item) => item.path === key)

  if (isHttp(key)) {
    /* 外部链接分支：新窗口打开 */
    window.open(key, '_blank')
  } else if (!topMenu || !topMenu.children) {
    /* 菜单分支：直接 router.push 跳转，携带 query，并折叠左侧下级菜单 */
    const routeMenu = findMenuByPath(routesStore.fullRoutes, key)
    if (routeMenu && routeMenu.query) {
      router.push({ path: key, query: JSON.parse(routeMenu.query as string) })
    } else {
      router.push({ path: key })
    }
    appStore.hideSideBar(true)
  } else {
    /* 目录分支：展开左侧菜单展示下级子菜单 */
    appStore.setMixScopeForChildren(routers.value, key)
    appStore.hideSideBar(false)
  }
}
</script>

<style lang="scss">
.topmenu-container.el-menu--horizontal {
  height: 50px !important;
  border-bottom: none;
}

.topmenu-container.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #303133 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active,
.el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
  border-bottom: 2px solid #{'var(--theme)'} !important;
  color: #303133;
}

/* sub-menu item */
.topmenu-container.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #303133 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

/* 背景色隐藏 */
.topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus,
.topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover,
.topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: #ffffff;
}

/* 图标右间距 */
.topmenu-container .svg-icon {
  margin-right: 4px;
}

/* topmenu more arrow */
.topmenu-container .el-sub-menu .el-sub-menu__icon-arrow {
  position: static;
  vertical-align: middle;
  margin-left: 8px;
  margin-top: 0px;
}
</style>
