<!--
  组件：SidebarItem（递归菜单项）
  功能：递归渲染侧边栏菜单树，单子路由时自动展开，多子路由时显示为 el-sub-menu
-->
<template>
  <div v-if="!item.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children || onlyOneChild.noShowingChildren)">
      <AppLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"/>
          <template #title><span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span></template>
        </el-menu-item>
      </AppLink>
    </template>

    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <template v-if="item.meta" #title>
        <svg-icon :icon-class="item.meta && item.meta.icon" />
        <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
      </template>

      <SidebarItem
        v-for="(child, index) in item.children"
        :key="child.path + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup>
import { isExternal } from '@/utils/validate'
import AppLink from './Link.vue'
import { getNormalPath } from '@/utils/common'

const props = defineProps({
  // route object
  item: {
    type: Object,
    required: true
  },
  isNest: {
    type: Boolean,
    default: false
  },
  basePath: {
    type: String,
    default: ''
  }
})

const onlyOneChild = ref({})

/*
* 判断是否只有一个可见子菜单：单子菜单直接展开，无子菜单则展示父级自身
*/
function hasOneShowingChild(children = [], parent) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter(item => {
    /* 隐藏菜单不参与计数 */
    if (item.hidden) {
      return false
    }
    onlyOneChild.value = item
    return true
  })
  /* 刚好一个子菜单 -> 直接展开（不显示父级 el-sub-menu） */
  if (showingChildren.length === 1) {
    return true
  }
  /* 无可见子菜单 -> 把父级当叶子结点展示 */
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '', noShowingChildren: true }
    return true
  }
  return false
}

/*
* 解析路由路径：外部链接 -> 原样返回；绝对路径 -> 直接使用；相对路径 -> 拼接 basePath
*/
function resolvePath(routePath, routeQuery) {

  if (isExternal(routePath)) {
    return routePath
  }
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  /* 绝对路径：有 query 时拼接 query 参数返回 */
  if (routePath && routePath.startsWith('/')) {
    if (routeQuery) {
      let query = JSON.parse(routeQuery)
      return { path: getNormalPath(routePath), query: query }
    }
    return getNormalPath(routePath)
  }
  /* 相对路径：拼接 basePath，有 query 时一并返回 */
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)
}

/*
* 标题超长时显示 tooltip
*/
function hasTitle(title) {
  if (title.length > 5) {
    return title
  } else {
    return ""
  }
}
</script>
