<!--
  组件：SidebarItem（递归菜单项）
  功能：递归渲染侧边栏菜单树，目录统一渲染为 el-sub-menu；根级菜单包装节点提升其唯一子路由。
-->
<template>
  <div v-if="!item.hidden">
    <!--
      叶子节点：根级菜单包装节点提升其唯一子路由；无可见子节点的节点自身作为叶子展示。
    -->
    <template v-if="singleLeafChild">
      <!-- 目录节点（无可见子菜单）：禁用交互，仅展示标题与图标，避免选中态变化与无效跳转 -->
      <el-menu-item
        v-if="leafIsCatalog"
        :index="catalogIndex"
        class="catalog-menu-item"
        disabled
        :class="{ 'submenu-title-noDropdown': !isNest }"
      >
        <SvgIcon :icon-class="singleLeafChild.meta?.icon || (item.meta && item.meta.icon)" />
        <template #title
          ><span class="menu-title" :title="hasTitle(singleLeafChild.meta?.title)">{{ singleLeafChild.meta?.title }}</span></template
        >
      </el-menu-item>

      <!-- 菜单链接：内部路由渲染 router-link，外部链接渲染 a（新窗口打开） -->
      <component v-else-if="singleLeafChild.meta" :is="linkType" v-bind="linkAttrs">
        <el-menu-item :index="resolvePath(singleLeafChild.path)" :class="{ 'submenu-title-noDropdown': !isNest }">
          <!-- 图标：优先取子菜单自身的 icon，没有则继承父级 -->
          <SvgIcon :icon-class="singleLeafChild.meta.icon || (item.meta && item.meta.icon)" />
          <template #title
            ><span class="menu-title" :title="hasTitle(singleLeafChild.meta.title)">{{ singleLeafChild.meta.title }}</span></template
          >
        </el-menu-item>
      </component>
    </template>

    <!--
      目录节点（含 1 个或多个子菜单）：渲染为 el-sub-menu 下拉菜单，递归用 SidebarItem 渲染每一级子菜单。
    -->
    <el-sub-menu v-else ref="subMenu" :index="resolvePath(item.path)" teleported>
      <!-- 父菜单 -->
      <template v-if="item.meta" #title>
        <SvgIcon :icon-class="item.meta && item.meta.icon" />
        <span class="menu-title" :title="hasTitle(item.meta.title)">{{ item.meta.title }}</span>
      </template>
      <!-- 子菜单列表 -->
      <SidebarItem
        v-for="(child, index) in item.children"
        :key="(child.path || '') + index"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-sub-menu>
  </div>
</template>

<script setup lang="ts">
import { isExternal } from '@/utils/validate'
import { resolveMenuPath } from '@/utils/menu'
import type { RouteData } from '@/store/modules/routes'
import { computed } from 'vue'
import { SvgIcon } from '@/components'

/*
 * 组件属性
 */
interface MenuItemProps {
  /*
   * 父路由对象：包含 path / meta / children / hidden 等属性
   */
  item: RouteData
  /*
   * 是否嵌套子菜单：true 表示当前已在 el-sub-menu 内，叶子结点无需再缩进
   */
  isNest?: boolean
  /*
   * 父路由path：子路由若为相对路径，据此拼接为绝对路径
   */
  basePath?: string
}

const props = withDefaults(defineProps<MenuItemProps>(), {
  isNest: false,
  basePath: ''
})

/*
 * 可见子菜单列表（过滤 hidden 标记的隐藏路由）
 */
const visibleChildren = computed<RouteData[]>(() => {
  return (props.item.children || []).filter((item) => !item.hidden)
})

/*
 * 渲染为叶子菜单的节点（满足时用 el-menu-item 展示，否则走 el-sub-menu）：
 *   1）根级菜单包装节点（meta 为空）仅含 1 个模拟子路由 → 提升该子路由为叶子菜单，避免多一层无效层级；
 *   2）0 个可见子菜单 → 父级自身作为叶子节点展示（目录仅展示不可跳转，菜单按 basePath 跳转）；
 *   3）目录含子菜单（1 个或多个）→ 返回 null，保留目录层级渲染 el-sub-menu，与 React 端保持一致。
 */
const singleLeafChild = computed<RouteData | null>(() => {
  if (!props.item.meta && visibleChildren.value.length === 1) {
    return visibleChildren.value[0]
  }
  if (visibleChildren.value.length === 0) {
    return { ...props.item, path: '' }
  }
  return null
})

/*
 * 叶子节点是否为目录：目录只做分组展示，点击不跳转；菜单才渲染路由链接。
 */
const leafIsCatalog = computed(() => singleLeafChild.value?.meta?.menuType === 0)

/*
 * 目录叶子节点的菜单 index：以路由名加前缀保证唯一，同时避免与真实路由路径同名而产生错误高亮。
 */
const catalogIndex = computed(() => `catalog:${props.item.name || singleLeafChild.value?.path || ''}`)

/*
 * 解析路由路径，返回值类型可能是 string 或 { path, query }。
 *   - 外部链接 → 原样返回；
 *   - 绝对路径（以 / 开头）→ 直接使用；
 *   - 相对路径 → 拼接 basePath 前缀。
 *   - routeQuery 存在时一并返回，用于携带路由参数。
 */
function resolvePath(routePath?: string): string
function resolvePath(routePath: string | undefined, routeQuery?: unknown): string | { path: string; query: Record<string, unknown> }
function resolvePath(routePath: string | undefined, routeQuery?: unknown): string | { path: string; query: Record<string, unknown> } {
  return resolveMenuPath(routePath, props.basePath, routeQuery as string | undefined)
}

/*
 * 叶子菜单链接目标：解析后的路径，或 { path, query } 对象
 */
const linkTo = computed<string | { path: string; query: Record<string, unknown> }>(() => {
  const leaf = singleLeafChild.value
  if (!leaf) return ''
  return resolvePath(leaf.path, leaf.query)
})

/*
 * 是否为外部链接：命中时渲染 a 标签新窗口打开，否则渲染 router-link 内部跳转
 */
const isExternalLink = computed(() => {
  return typeof linkTo.value === 'string' && isExternal(linkTo.value)
})

/*
 * 动态链接标签类型：'a'（外部链接）或 'router-link'（内部路由）
 */
const linkType = computed(() => (isExternalLink.value ? 'a' : 'router-link'))

/*
 * 链接标签绑定属性：外部链接走 href/target/rel，内部路由走 to
 */
const linkAttrs = computed<Record<string, unknown>>(() => {
  if (isExternalLink.value) {
    return { href: linkTo.value, target: '_blank', rel: 'noopener' }
  }
  return { to: linkTo.value }
})

/*
 * 标题超长时显示 tooltip
 */
function hasTitle(title: string | undefined) {
  if (title && title.length > 5) {
    return title
  } else {
    return ''
  }
}
</script>

<style scoped>
/* 空目录叶子节点：禁用后保持正常展示样式，仅去掉禁用透明度与 pointer 光标 */
.catalog-menu-item.is-disabled {
  opacity: 1;
  cursor: default;
}

/* 顶栏（top 模式）等无 .theme-light 作用域场景：沿用 Element Plus 默认 hover 背景 */
.catalog-menu-item.is-disabled:hover {
  background-color: var(--el-menu-hover-bg-color, rgba(0, 0, 0, 0.06)) !important;
}

/* 亮色侧边栏：hover 背景与正常菜单项完全一致（一级 #f5f7fa、子级 #f0f5ff，见 layout/index.vue） */
html:not(.dark) .theme-light .catalog-menu-item.is-disabled:hover {
  background-color: #f5f7fa !important;
}

html:not(.dark) .theme-light .el-sub-menu .catalog-menu-item.is-disabled:hover {
  background-color: #f0f5ff !important;
}

/* 暗色顶栏：与顶部菜单 hover 背景一致 */
html.dark .topbar-menu .catalog-menu-item.is-disabled:hover {
  background-color: var(--navbar-hover, #141414) !important;
}
</style>
