<!--
  组件：TopBar（顶部菜单栏 - 导航模式 3）
  功能：navType=3 时在顶部渲染一级菜单，超出数量折叠到"更多菜单"。
        点击切换左侧联动侧边栏子菜单。
-->
<template>
  <el-menu class="topbar-menu" :ellipsis="false" :default-active="activeMenu" :active-text-color="theme" mode="horizontal">
    <SidebarItem :key="route.path + index" v-for="(route, index) in topMenus" :item="route" :base-path="route.path" />

    <el-sub-menu index="more" class="el-sub-menu__hide-arrow" v-if="moreRoutes.length > 0">
      <template #title>
        <span>更多菜单</span>
      </template>
      <SidebarItem :key="route.path + index" v-for="(route, index) in moreRoutes" :item="route" :base-path="route.path" />
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import SidebarItem from '../Sidebar/SidebarItem'
import { useAppStore, useRoutesStore, useSettingsStore } from '@/store'

const route = useRoute()
const appStore = useAppStore()
const settingsStore = useSettingsStore()

const sidebarRouters = computed(() => useRoutesStore().fullRoutes)
const theme = computed(() => settingsStore.theme)
const device = computed(() => appStore.device)
/*
* 当前激活菜单：优先取 meta.activeMenu，否则取 route.path
*/
const activeMenu = computed(() => {
  const { meta, path } = route
  if (meta.activeMenu) {
    return meta.activeMenu
  }
  return path
})

const visibleNumber = ref(5)
/*
* 顶部一级菜单：取前 N 条可见路由
*/
const topMenus = computed(() => {
  return useRoutesStore().fullRoutes.filter((f) => !f.hidden).slice(0, visibleNumber.value)
})
/*
* 超出折叠的更多菜单
*/
const moreRoutes = computed(() => {
  return useRoutesStore().fullRoutes.filter((f) => !f.hidden).slice(visibleNumber.value)
})

/*
* 根据容器宽度计算可显示的菜单数量
*/
function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3
  visibleNumber.value = Math.max(1, parseInt(width / 85))
}

onMounted(() => {
  setVisibleNumber()
  window.addEventListener('resize', setVisibleNumber)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', setVisibleNumber)
})
</script>

<style lang="scss">
/* menu item */
.topbar-menu.el-menu--horizontal .el-submenu__title, .topbar-menu.el-menu--horizontal .el-menu-item {
  padding: 0 10px !important;
}

.topbar-menu.el-menu--horizontal > .el-menu-item {
  float: left;
  height: 50px !important;
  line-height: 50px !important;
  color: #303133 !important;
  padding: 0 5px !important;
  margin: 0 10px !important;
}

.el-sub-menu.is-active .svg-icon, .el-menu-item.is-active .svg-icon + span, .el-sub-menu.is-active .svg-icon + span, .el-sub-menu.is-active .el-sub-menu__title span {
  color: v-bind(theme);
}

/* sub-menu item */
.topbar-menu.el-menu--horizontal > .el-sub-menu .el-sub-menu__title {
  float: left;
  line-height: 50px !important;
  color: #303133 !important;
  margin: 0 15px -3px!important;
}

/* topbar more arrow */
.topbar-menu .el-sub-menu .el-sub-menu__icon-arrow {
  position: static;
  margin-left: 8px;
  margin-top: 0px;
  display: block !important;
}

/* menu__title el-menu-item */
.topbar-menu.el-menu--horizontal .el-sub-menu__title, .topbar-menu.el-menu--horizontal .el-menu-item {
  height: 60px;
}
</style>
