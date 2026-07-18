<!--
  组件：SidebarLink（菜单链接适配器）
  功能：根据链接类型动态渲染 router-link 或 a 标签，外部链接新窗口打开
-->
<template>
  <!-- 动态渲染组件：根据绑定的 :is 属性值，动态地渲染不同的组件‌。 -->
  <component :is="type" v-bind="linkProps()">
    <!-- 插槽（Slot）：允许父组件向子组件的模板中插入自定义内容（HTML、其他组件或文本） -->
    <slot />
  </component>
</template>

<script setup>
import { isExternal } from '@/utils/validate'

const props = defineProps({
  /*
  * 路由路径或路由对象。
  *   - 外部链接传入字符串 URL
  *   - 内部路由传入字符串 path 或 { path, query }。
  */
  to: {
    type: [String, Object],
    required: true
  }
})

/*
* 动态标签类型：
*   - 外部链接用 a
*   - 内部路由用 router-link
*/
const type = computed(() => {
  if (isExt.value) {
    return 'a'
  }
  return 'router-link'
})

/*
* 是否为外部链接（http/https/mailto 等）
*/
const isExt = computed(() => {
  return isExternal(props.to)
})

/*
* 根据链接类型返回对应标签的绑定属性。
*   - 外部链接：href + target="_blank" + rel="noopener" 防止 tab 页劫持。
*   - 内部路由：to 对象直接传给 router-link。
*/
function linkProps() {
  if (isExt.value) {
    return {
      href: props.to,
      target: '_blank',
      rel: 'noopener'
    }
  }
  return {
    to: props.to
  }
}
</script>
