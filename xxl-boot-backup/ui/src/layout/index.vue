<!--
  名称：Layout 主框架布局组件（src/layout/index.vue）
  功能项摘要：
    1. 统一后台整体骨架（侧边栏 / 顶部导航 / 标签页 / 主内容 / 设置面板）。
    2. 处理桌面端与移动端的布局切换与侧边栏收展联动。
    3. 按主题与布局状态输出动态样式类与 CSS 变量。
-->
<template>
  <!-- 布局骨架：根容器汇总布局状态类与主题变量，作为页面主承载区。 -->
  <div :class="classObj" class="app-wrapper" :style="{ '--current-color': theme, '--current-color-light': theme + '1a', '--current-color-dark-bg': theme + '33' }">
    <!-- 实现细节：移动端侧栏展开时显示遮罩，点击遮罩触发侧栏关闭。 -->
    <div v-if="device === 'mobile' && sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
    <!-- 实现细节：侧边栏按 hide 状态按需渲染，避免无效节点。 -->
    <sidebar v-if="!sidebar.hide" class="sidebar-container" />
    <!-- 主内容区：根据标签页和侧栏隐藏状态切换容器样式。 -->
    <div :class="{ hasTagsView: needTagsView, sidebarHide: sidebar.hide }" class="main-container">
      <!-- 实现细节：头部固定样式由 fixedHeader 控制。 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <!-- 实现细节：导航栏通过 setLayout 事件打开设置面板。 -->
        <navbar @setLayout="setLayout" />
        <!-- 实现细节：标签页按配置开关显示。 -->
        <tags-view v-if="needTagsView" />
      </div>
      <!-- 实现细节：路由页面主体出口。 -->
      <app-main />
      <!-- 实现细节：设置面板通过 ref 暴露打开方法。 -->
      <settings ref="settingRef" />
    </div>
  </div>
</template>

<script setup>
import { useWindowSize } from '@vueuse/core'
import Sidebar from './components/Sidebar/index.vue'
import { AppMain, Navbar, Settings, TagsView } from './components'
import useAppStore from '@/store/modules/app'
import useSettingsStore from '@/store/modules/settings'

const settingsStore = useSettingsStore()
const theme = computed(() => settingsStore.theme)
const sidebar = computed(() => useAppStore().sidebar)
const device = computed(() => useAppStore().device)
const needTagsView = computed(() => settingsStore.tagsView)
const fixedHeader = computed(() => settingsStore.fixedHeader)

// 布局状态映射：将 store 状态映射为容器 class，统一驱动页面样式。
const classObj = computed(() => ({
  hideSidebar: !sidebar.value.opened,
  openSidebar: sidebar.value.opened,
  withoutAnimation: sidebar.value.withoutAnimation,
  mobile: device.value === 'mobile'
}))

const { width, height } = useWindowSize()
const WIDTH = 992 // refer to Bootstrap's responsive design

// 设备切换处理：切换到 mobile 时，若侧栏已展开则主动收起，避免遮挡内容。
watch(() => device.value, () => {
  if (device.value === 'mobile' && sidebar.value.opened) {
    useAppStore().closeSideBar({ withoutAnimation: false })
  }
})

// 窗口响应式处理：根据宽度阈值切换设备类型，并同步侧栏状态。
watchEffect(() => {
  if (width.value - 1 < WIDTH) {
    // 实现细节：移动端采用无动画收起，减少窗口缩放时的抖动。
    useAppStore().toggleDevice('mobile')
    useAppStore().closeSideBar({ withoutAnimation: true })
  } else {
    useAppStore().toggleDevice('desktop')
  }
})

function handleClickOutside() {
  // 交互细节：遮罩点击只执行侧栏关闭，不影响其他布局状态。
  useAppStore().closeSideBar({ withoutAnimation: false })
}

const settingRef = ref(null)
// 设置面板入口：响应导航栏事件，通过组件实例方法打开设置抽屉。
function setLayout() {
  settingRef.value.openSetting()
}
</script>

<style lang="scss" scoped>
@use "@/assets/styles/variables.module.scss" as vars;

.app-wrapper {
  &:after {
    content: "";
    display: table;
    clear: both;
  }
  position: relative;
  height: 100%;
  width: 100%;

  &.mobile.openSidebar {
    position: fixed;
    top: 0;
  }
}

.main-container:has(.fixed-header) {
  height: 100vh;
  overflow: hidden;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{vars.$base-sidebar-width});
  transition: width 0.28s;
}

.hideSidebar .fixed-header {
  width: calc(100% - 54px);
}

.sidebarHide .fixed-header {
  width: 100%;
}

.mobile .fixed-header {
  width: 100%;
}
</style>
