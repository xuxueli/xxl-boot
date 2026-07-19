<!--
  组件：TopNav（混合模式顶部导航 - 导航模式 2）
  功能：navType=2 时在顶部渲染一级菜单，选中后左侧侧边栏联动显示对应子菜单
-->
<template>
  <el-menu
      :default-active="activeMenu"
      mode="horizontal"
      @select="handleSelect"
      :ellipsis="false"
  >
    <!-- 可见的一级菜单项：前 visibleNumber 条 -->
    <template v-for="(item, index) in topMenus">
      <el-menu-item :style="{'--theme': theme}" :index="item.path" :key="index" v-if="index < visibleNumber">
        <SvgIcon
            v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
            :icon-class="item.meta.icon"/>
        {{ item.meta.title }}
      </el-menu-item>
    </template>

    <!-- 超出的菜单：折叠到"更多菜单" -->
    <el-sub-menu :style="{'--theme': theme}" index="more" v-if="topMenus.length > visibleNumber">
      <template #title>更多菜单</template>
      <template v-for="(item, index) in topMenus">
        <el-menu-item
            :index="item.path"
            :key="index"
            v-if="index >= visibleNumber">
          <!-- icon -->
          <SvgIcon
              v-if="item.meta && item.meta.icon && item.meta.icon !== '#'"
              :icon-class="item.meta.icon"/>
          <!-- title -->
          {{ item.meta.title }}
        </el-menu-item>
      </template>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import {constantRoutes} from "@/router"
import {isHttp} from '@/utils/validate'
import {useAppStore, useRoutesStore, useSettingsStore} from '@/store'

const appStore = useAppStore()
const settingsStore = useSettingsStore()
const route = useRoute()                        /* 读取‌当前路由信息 */
const router = useRouter()                      /* 控制‌路由跳转、后退、添加路由等 */

const theme = computed(() => settingsStore.theme)
const routers = computed(() => useRoutesStore().dynamicRoutes)

const visibleNumber = ref(null)                 /* 可见菜单数量阈值，动态计算 */
const currentIndex = ref(null)                  /* 当前选中菜单索引 */
const hideList = ['/index', '/user/profile']    /* 路由列表中不显示侧边栏的路径 */

/*
* 顶部菜单列表
*   - meta=null 的 Layout 容器用子路由替代
*/
const topMenus = computed(() => {
  let topMenus = []
  routers.value.map((menu) => {
    if (menu.hidden !== true) {
      /* meta=null 的菜单是 Layout 父容器（如 isMenuFrame），直接取其第一个子路由替代父级 */
      if (!menu.meta && menu.children && menu.children.length > 0) {
        topMenus.push(menu.children[0])
      } else {
        topMenus.push(menu)
      }
    }
  })
  return topMenus
})

/*
* 所有子路由扁平列表，用于左侧侧边栏联动
*   - 将 routers 下所有 children 拍平，并补充 parentPath 指向父级路由
*/
const childrenMenus = computed(() => {
  let childrenMenus = []
  routers.value.map((router) => {
    for (let item in router.children) {
      if (router.children[item].parentPath === undefined) {
        router.children[item].parentPath = router.path
      }
      childrenMenus.push(router.children[item])
    }
  })
  return constantRoutes.concat(childrenMenus)
})

/*
* 根据当前路由自动激活对应顶级菜单，并联动侧边栏
*   - hideList 路径 → 隐藏侧边栏
*   - 非根路径 → 在顶级菜单中递归查找匹配项
*   - 根路径 → 隐藏侧边栏
*/
const activeMenu = computed(() => {
  // 顶部菜单激活
  const path = route.path
  let activePath = path

  // 联动侧边栏
  if (hideList.indexOf(path) !== -1) {
    /* hideList 中的页面强制隐藏侧边栏（首页 / 个人中心） */
    appStore.hideSideBar(true)
  } else if (path !== undefined && path.lastIndexOf("/") > 0) {
    /* 多级路径：查找匹配的顶级菜单，找到则联动显示，未找到也显示侧边栏（容错） */
    const matchedTopMenu = findActiveTopMenu(path)
    if (matchedTopMenu) {
      activePath = matchedTopMenu
      appStore.hideSideBar(false)
    } else {
      appStore.hideSideBar(false)
    }
  } else {
    /* 根路径：隐藏侧边栏 */
    appStore.hideSideBar(true)
  }

  // 侧边栏联动 scope 设置
  activeRoutes(activePath)
  return activePath
})

/*
* 在顶级菜单树中递归查找包含当前路由的顶级菜单
*   - 遍历 routers，对每个菜单调用 descendantMatches 判断当前路径是否在其子孙中
*/
function findActiveTopMenu(currentPath) {
  if (!routers.value) return null
  for (const menu of routers.value) {
    if (menu.hidden) continue
    if (menu.path === '/') continue
    if (descendantMatches(menu, currentPath)) {
      return menu.path
    }
  }
  return null
}

/*
* 判断 targetPath 是否匹配 route 的子孙路由路径
*   - 递归：先查直接子路由，再查孙子路由
*   - 匹配条件：targetPath === child.path 或 targetPath 以 child.path + '/' 或 '?' 开头
*/
function descendantMatches(route, targetPath) {
  if (!route.children) return false
  for (const child of route.children) {
    if (!child.path) continue

    /* 子节点检测：精确匹配 | 子路径匹配（含 / 和 ? 两种情况） */
    if (targetPath === child.path
        || targetPath.startsWith(child.path + '/')
        || targetPath.startsWith(child.path + '?')) {
      return true
    }

    /* 孙子节点检测：递归 */
    if (child.children && descendantMatches(child, targetPath)) {
      return true
    }
  }
  return false
}

/*
* 根据容器宽度计算可显示的菜单数量
*/
function setVisibleNumber() {
  const width = document.body.getBoundingClientRect().width / 3
  visibleNumber.value = Math.max(1, parseInt(width / 85))
}

/*
* 顶部菜单选中：
*   - 外部链接新窗口
*   - 无子路由直接跳转并隐藏侧栏
*   - 有子路由联动左侧菜单
*/
function handleSelect(key, keyPath) {
  currentIndex.value = key
  const route = routers.value.find(item => item.path === key)

  if (isHttp(key)) {
    /* 外部链接分支：新窗口打开 */
    window.open(key, "_blank")
  } else if (!route || !route.children) {
    /* 无子路由分支：直接 router.push 跳转，携带 query，隐藏侧边栏 */
    const routeMenu = childrenMenus.value.find(item => item.path === key)
    if (routeMenu && routeMenu.query) {
      let query = JSON.parse(routeMenu.query)
      router.push({path: key, query: query})
    } else {
      router.push({path: key})
    }
    appStore.hideSideBar(true)
  } else {
    /* 有子路由分支：联动显示侧边栏子菜单 */
    activeRoutes(key)
    appStore.hideSideBar(false)
  }

}

/*
* 设置侧边栏联动作用域（存在子路由时 setScope，否则隐藏侧栏）
*   - key：当前选中顶级菜单 path
*   - 作用：通过 useRoutesStore().setScope 写入 _scope，Sidebar 的 sidebarRouters 据此过滤菜单
*/
function activeRoutes(key) {
  // 匹配子菜单
  let routes = []
  if (childrenMenus.value && childrenMenus.value.length > 0) {
    childrenMenus.value.map((item) => {
      /* 匹配条件：parentPath 等于 key，或首页（index）对应空 path */
      if (key === item.parentPath /*|| (key === "index" && "" === item.path)*/) {
        routes.push(item)
      }
    })
  }

  // 侧边栏联动
  if (routes.length > 0) {
    useRoutesStore().setScope(key)
  } else {
    appStore.hideSideBar(true)
  }
  return routes
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

.topmenu-container.el-menu--horizontal > .el-menu-item.is-active, .el-menu--horizontal > .el-sub-menu.is-active .el-submenu__title {
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
.topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .topmenu-container.el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .topmenu-container.el-menu--horizontal > .el-submenu .el-submenu__title:hover {
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
