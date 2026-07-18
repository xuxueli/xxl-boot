<!--
  组件：Navbar（顶部导航栏）
  功能：根据 navType 切换不同导航模式（左侧菜单/混合菜单/顶部菜单），
        右侧渲染搜索、全屏、主题切换、布局尺寸、通知、用户菜单等操作项
-->
<template>
  <div class="navbar" :class="'nav' + settingsStore.navType">

    <!-- 侧边栏折叠按钮 -->
    <Hamburger id="hamburger-container" :is-active="appStore.sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- 面包屑导航：导航模式：
        1=左侧菜单（显示面包屑）
        2=混合模式（显示 TopNav）
        3=顶部菜单模式（显示 SidebarLogo + TopBar）
    -->

    <!-- 面包屑导航（左侧菜单模式-1） -->
    <Breadcrumb v-if="settingsStore.navType === 1" id="breadcrumb-container" class="breadcrumb-container" />

    <!-- 顶部导航（混合模式-2） -->
    <TopNav v-if="settingsStore.navType === 2" id="topmenu-container" class="topmenu-container" />

    <!-- 顶部导航+Logo（顶部菜单模式-3） -->
    <template v-if="settingsStore.navType === 3">
      <!-- 侧边栏 Logo -->
      <SidebarLogo v-show="settingsStore.sidebarLogo" :collapse="false"></SidebarLogo>
      <!-- 顶部菜单栏（顶部菜单模式-3） -->
      <TopBar id="topbar-container" class="topbar-container" />
    </template>

    <!-- 右侧操作区 -->
    <div class="right-menu">
      <template v-if="appStore.device !== 'mobile'">
        <!-- 搜索 -->
        <HeaderSearch id="header-search" class="right-menu-item" />
        <!-- 源码 -->
        <el-tooltip content="源码地址" effect="dark" placement="bottom">
          <Git id="boot-git" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 文档 -->
        <el-tooltip content="文档地址" effect="dark" placement="bottom">
          <Doc id="boot-doc" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 全屏 -->
        <Screenfull id="screenfull" class="right-menu-item hover-effect" />
        <!-- 主题 -->
        <el-tooltip content="主题模式" effect="dark" placement="bottom">
          <div class="right-menu-item hover-effect theme-switch-wrapper" @click="toggleTheme">
            <svg-icon v-if="settingsStore.isDark" icon-class="sunny" />
            <svg-icon v-if="!settingsStore.isDark" icon-class="moon" />
          </div>
        </el-tooltip>
        <!-- 布局尺寸 -->
        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <SizeSelect id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
        <!-- 通知 -->
        <el-tooltip content="消息通知" effect="dark" placement="bottom">
          <HeaderNotice id="header-notice" class="right-menu-item hover-effect" />
        </el-tooltip>
      </template>

      <!-- 用户头像与下拉菜单 -->
      <el-dropdown @command="handleCommand" class="avatar-container right-menu-item hover-effect" trigger="hover">
        <!-- 用户信息  -->
        <div class="avatar-wrapper">
          <img :src="userStore.avatar" class="user-avatar" />
          <span class="user-nickname"> {{ userStore.nickName }} </span>
        </div>
        <!-- 下拉框  -->
        <template #dropdown>
          <el-dropdown-menu>
            <!-- 个人中心  -->
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <!-- 布局设置  -->
            <el-dropdown-item command="setLayout" v-if="settingsStore.showSettings">
                <span>布局设置</span>
            </el-dropdown-item>
            <!-- 退出登录  -->
            <el-dropdown-item divided command="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from 'element-plus'
import Breadcrumb from './Breadcrumb.vue'
import TopNav from './TopNav.vue'
import TopBar from './TopBar.vue'
import SidebarLogo from '../Sidebar/SidebarLogo.vue'
import Hamburger from './Hamburger.vue'
import Screenfull from './Screenfull.vue'
import SizeSelect from './SizeSelect.vue'
import HeaderSearch from './HeaderSearch.vue'
import HeaderNotice from './HeaderNotice.vue'
import Git from './Git.vue'
import Doc from './Doc.vue'
import { useAppStore, useUserStore, useSettingsStore } from '@/store'

const appStore = useAppStore()
const userStore = useUserStore()
const settingsStore = useSettingsStore()

/*
* 切换侧边栏展开/收起
*/
function toggleSideBar() {
  appStore.toggleSideBar()
}

/*
* 用户下拉菜单命令处理
*/
function handleCommand(command) {
  switch (command) {
    case "setLayout": setLayout(); break
    case "logout":    logout(); break
  }
}

/*
* 退出登录：二次确认后清除登录态并跳转首页
*/
function logout() {
  ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userStore.logout().then(() => { location.href = '/index' })
  }).catch(() => {})
}

/*
* 触发布局设置面板打开
* emit: setLayout（由 layout/index.vue 父组件监听，控制右侧设置面板显隐）
*/
const emits = defineEmits(['setLayout'])
function setLayout() {
  emits('setLayout')
}

/*
* 主题切换：浅色、暗色
*   - 支持 View Transition API 实现圆形扩散动画
*   - fallback 分支（无 API / 减少动效模式）：直接切换
*   - animation 分支：startViewTransition + clipPath 圆形过渡
*/
async function toggleTheme(event) {
  const x = event?.clientX || window.innerWidth / 2
  const y = event?.clientY || window.innerHeight / 2
  const wasDark = settingsStore.isDark

  const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  const isSupported = document.startViewTransition && !isReducedMotion

  /* fallback：降级到直接切换 */
  if (!isSupported) {
    settingsStore.toggleTheme()
    return
  }

  /* animation：圆形扩散过渡动画 */
  try {
    const transition = document.startViewTransition(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10))
      settingsStore.toggleTheme()
      await nextTick()
    })
    await transition.ready

    /* 从点击位置向外扩散的 clipPath 动画 */
    const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    document.documentElement.animate(
      {
        clipPath: !wasDark ? [...clipPath].reverse() : clipPath
      }, {
        duration: 650,
        easing: "cubic-bezier(0.4, 0, 0.2, 1)",
        fill: "forwards",
        pseudoElement: !wasDark ? "::view-transition-old(root)" : "::view-transition-new(root)"
      }
    )
    await transition.finished
  } catch (error) {
    console.warn("View transition failed, falling back to immediate toggle:", error)
    settingsStore.toggleTheme()
  }
}
</script>

<style lang='scss' scoped>
.navbar.nav3 {
  .hamburger-container {
    display: none !important;
  }
}

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: var(--navbar-bg);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  // padding: 0 8px;
  box-sizing: border-box;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;
    display: flex;
    align-items: center;
    flex-shrink: 0;
    margin-right: 8px;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    flex-shrink: 0;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .topbar-container {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    margin-left: 8px;
  }

  .right-menu {
    height: 100%;
    line-height: 50px;
    display: flex;
    align-items: center;
    margin-left: auto;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }

      &.theme-switch-wrapper {
        display: flex;
        align-items: center;

        svg {
          transition: transform 0.3s;
          
          &:hover {
            transform: scale(1.15);
          }
        }
      }
    }

    .avatar-container {
      margin-right: 0px;
      padding-right: 0px;

      .avatar-wrapper {
        margin-top: 10px;
        right: 8px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          margin-right: 8px;
          border-radius: 50%;
        }

        .user-nickname{
          position: relative;
          left: 0px;
          bottom: 10px;
          font-size: 14px;
          font-weight: bold;
        }

        i {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
