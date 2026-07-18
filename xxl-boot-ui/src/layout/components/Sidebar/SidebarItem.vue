<!--
  组件：SidebarItem（递归菜单项）
  功能：递归渲染侧边栏菜单树，单子路由时自动展开，多子路由时显示为 el-sub-menu
-->
<template>
  <div v-if="!item.hidden">
    <!--
      只有一个可见子路由：直接展开为 el-menu-item（不包裹 el-sub-menu），减少一级菜单深度。无子路由时用父级自身的 title/icon 作为叶子结点。
    -->
    <template v-if="hasOneShowingChild(item.children, item) && !onlyOneChild.children">
      <!-- 菜单链接组件 -->
      <SidebarLink v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path, onlyOneChild.query)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <!-- 图标：优先取子菜单自身的 icon，没有则继承父级 -->
          <svg-icon :icon-class="onlyOneChild.meta.icon || (item.meta && item.meta.icon)"/>
          <template #title><span class="menu-title" :title="hasTitle(onlyOneChild.meta.title)">{{ onlyOneChild.meta.title }}</span></template>
        </el-menu-item>
      </SidebarLink>
    </template>

    <!--
      多个可见子路由：渲染为 el-sub-menu 下拉菜单，递归用 SidebarItem 渲染每一级子菜单。
    -->
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <!-- 父菜单 -->
      <template v-if="item.meta" #title>
        <svg-icon :icon-class="item.meta && item.meta.icon" />
        <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
      </template>
      <!-- 子菜单列表 -->
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
import SidebarLink from './SidebarLink.vue'
import { getNormalPath } from '@/utils/common'

const props = defineProps({
  /*
  * 当前路由对象，包含 path / meta / children / hidden 等属性
  */
  item: {
    type: Object,
    required: true
  },
  /*
  * 是否嵌套子菜单：true 表示当前已在 el-sub-menu 内，叶子结点无需再缩进
  */
  isNest: {
    type: Boolean,
    default: false
  },
  /*
  * 父级路由路径基准，子路由的相对路径据此拼接为绝对路径
  */
  /*basePath: {
    type: String,
    default: ''
  }*/
})

/*
* hasOneShowingChild 的判断结果暂存区。
* 满足"只有一个可见子路由"时存储该子路由对象，模板据此决定渲染 el-menu-item 还是 el-sub-menu。
*/
const onlyOneChild = ref({})

/*
* 判断当前菜单是否只有一个可见子菜单：
*   1）1 个可见子路由 → 直接展开为该子路由（不包 el-sub-menu），减少菜单层级。
*   2）0 个可见子路由 → 父级自身作为叶子菜单展示（用父级的 title/icon 填充）。
*   3）≥ 2 个可见子路由 → 渲染 el-sub-menu，继续递归。
* 每次调用会将筛选结果写入 onlyOneChild，供模板访问。
*/
function hasOneShowingChild(children = [], parent) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter(item => {
    /* hidden 标记为 true 的路由不展示，不计入可见子菜单 */
    if (item.hidden) {
      return false
    }
    /* 记录最后一个可见子路由，后续判断长度用 */
    onlyOneChild.value = item
    return true
  })
  /* 刚好一个可见子菜单：跳过父级 el-sub-menu，直接渲染叶子 el-menu-item */
  if (showingChildren.length === 1) {
    return true
  }
  /*
  * 无可见子菜单：把父级自身当叶子结点展示。
  * 设 path='' 避免跳转到无效路由
  *
  *
  * 对象展开运算符（Spread Operator）‌：
  *   - 作用：创建一个新对象，该对象包含了 oldObject 对象的所有可枚举属性，并将 filed01 属性设置为新值；
  *   - 格式：{ ...oldObject, filed01: '' }
  */
  if (showingChildren.length === 0) {
    onlyOneChild.value = { ...parent, path: '' }
    return true
  }
  /* 多个可见子菜单：需要 el-sub-menu 包裹展开 */
  return false
}

/*
* 解析路由路径，返回值类型可能是 string 或 { path, query }。
*   - 外部链接：原样返回；
*   - 非外部链接：默认仅支持 绝对地址
*   - // 简化废弃：绝对路径（以 / 开头）→ 直接使用；相对路径 → 拼接 basePath 前缀。
*   - routeQuery 存在时一并返回，用于携带路由参数。
*/
function resolvePath(routePath, routeQuery) {
  /* 子路由本身是外部链接 → 直接返回，不走内部路由拼接 */
  if (isExternal(routePath)) {
    return routePath
  }

  /* routeQuery 是 JSON 字符串，解析为对象后和 path 一起返回 */
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(routePath), query: query }
  }
  return getNormalPath(routePath)

  /*
  /!* 父级基准路径是外部链接 → 子路由也无法拼接，直接返回父级路径 *!/
  if (isExternal(props.basePath)) {
    return props.basePath
  }

  /!* 以 / 开头的是绝对路径，无需拼接 basePath *!/
  if (routePath && routePath.startsWith('/')) {
    /!* routeQuery 是 JSON 字符串，解析为对象后和 path 一起返回 *!/
    if (routeQuery) {
      let query = JSON.parse(routeQuery)
      return { path: getNormalPath(routePath), query: query }
    }
    return getNormalPath(routePath)
  }
  /!* 相对路径：拼接 basePath/routePath，有 query 时一并携带 *!/
  if (routeQuery) {
    let query = JSON.parse(routeQuery)
    return { path: getNormalPath(props.basePath + '/' + routePath), query: query }
  }
  return getNormalPath(props.basePath + '/' + routePath)*/
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
