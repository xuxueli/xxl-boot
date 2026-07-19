<!--
  组件：SvgIcon（SVG 图标）
  功能：通过 <use> 引用 sprite 图标，支持自定义 class 和填充色。

  用法：<SvgIcon icon-class="user" class-name="icon" />
-->
<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="iconName" :fill="color" />
  </svg>
</template>

<script>
/*
* defineComponent：标准组件导出
*   - props：定义组件接收的外部参数
*   - setup：入口函数
*     - 它接收 props 作为第一个参数。
*     - 此函数中定义的返回值（暴露给模板的数据和方法），可以在 <template> 中直接使用。
*/
export default defineComponent({
  props: {
    // 图标名称：对应 svg-sprite 的 id，会拼为 #icon-xxx
    iconClass: {
      type: String,
      required: true
    },
    // 附加 CSS 类名
    className: {
      type: String,
      default: ''
    },
    // 填充色
    color: {
      type: String,
      default: ''
    },
  },
  setup(props) {
    return {
      // <use xlink:href="#icon-图标名" />
      iconName: computed(() => `#icon-${props.iconClass}`),
      // 基础样式 svg-icon + 自定义 class
      svgClass: computed(() => {
        if (props.className) {
          return `svg-icon ${props.className}`
        }
        return 'svg-icon'
      })
    }
  }
})
</script>

<style scope lang="scss">
.sub-el-icon,
.nav-icon {
  display: inline-block;
  font-size: 15px;
  margin-right: 12px;
  position: relative;
}

.svg-icon {
  width: 1em;
  height: 1em;
  position: relative;
  fill: currentColor;
  vertical-align: -2px;
}
</style>
