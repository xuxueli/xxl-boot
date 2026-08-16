<!--
  组件：SidebarItem（递归菜单项）
  功能：递归渲染侧边栏菜单树，单子路由时自动展开，多子路由时显示为 el-sub-menu
-->
<template>
  <div v-if="!item.hidden">
    <!--
      只有一个可见子路由：直接展开为 el-menu-item（不包裹 el-sub-menu），减少一级菜单深度。无子路由时用父级自身的 title/icon 作为叶子结点。
    -->
    <template v-if="singleLeafChild">
      <!-- 菜单链接：内部路由渲染 router-link，外部链接渲染 a（新窗口打开） -->
      <component v-if="singleLeafChild.meta" :is="linkType" v-bind="linkAttrs">
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
      多个可见子路由：渲染为 el-sub-menu 下拉菜单，递归用 SidebarItem 渲染每一级子菜单。
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
 *   1）恰好 1 个可见子菜单且其本身无下级 → 直接展开为该子菜单（不包 el-sub-menu），减少菜单层级；
 *   2）0 个可见子菜单 → 父级自身作为叶子菜单展示（用父级的 title/icon 填充，path='' 避免跳转无效路由）；
 *   3）其余情况（≥2 个子菜单，或唯一子菜单仍有下级）→ 返回 null，需渲染 el-sub-menu。
 */
const singleLeafChild = computed<RouteData | null>(() => {
  if (visibleChildren.value.length === 1 && !visibleChildren.value[0].children) {
    return visibleChildren.value[0]
  }
  if (visibleChildren.value.length === 0) {
    return { ...props.item, path: '' }
  }
  return null
})

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
