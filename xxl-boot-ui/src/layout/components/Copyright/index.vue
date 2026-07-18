<!--
  组件：Copyright（底部版权）
  功能：系统布局底部版权信息，通过 settingsStore 控制显隐与文案
-->

<!--
  【通用说明】新组件如何开发与引入（与本组件业务无关）：
  1）开发规范
     - 优先单一职责：一个组件只解决一个明确问题，避免同时承担数据获取与复杂业务编排。
     - 先定义输入/输出：输入包括 props、store、slots；输出包括 emits、暴露方法、渲染结构。
     - 响应式优先：展示层尽量用 computed/props 驱动，避免冗余本地状态造成同步问题。
     - 样式隔离：默认使用 scoped；若必须全局样式，需明确命名空间，避免污染其它页面。
     - 可维护注释：文件顶部写“组件用途 + 开发/接入方式”，正文对关键逻辑写注释，不写无意义注释。
  2）目录与命名建议
     - 组件目录建议按功能域划分，例如 layout/components、business/components。
     - 文件名使用 index.vue 或明确语义名（如 UserCard.vue），保持团队统一。
     - 对外导出名、组件显示名、目录名尽量一致，降低检索与排障成本。
  3）引入与注册方式
     - script setup 场景：在父组件 import 后可直接在 template 中使用（按构建工具规则自动识别）。
     - 非 script setup 场景：需在 components 选项中注册后再使用。
     - 全局通用组件：可在应用入口统一注册，避免在每个页面重复 import。
  4）在页面中使用
     - 基础使用：`<YourComponent />`
     - 传参使用：`<YourComponent :data="data" :visible="visible" @change="onChange" />`
     - 插槽使用：根据组件文档传入默认插槽/具名插槽，保证内容与结构解耦。
  5）联调与验收
     - 本地先做最小可运行验证（页面渲染、交互事件、边界空态）。
     - 合入前执行项目既有构建/测试命令，确认无回归后再提交。
  6）代码示例（定义 + 使用）
     - 定义示例（MyBadge.vue）：
       `defineProps({ text: { type: String, default: '' } })`
     - 使用示例（父组件）：
       `<MyBadge text="新组件" />`
-->

<template>
  <!--
    页脚容器：
    1）通过 visible 控制是否渲染整个 footer（v-if 为 false 时不创建 DOM）。
    2）content 为页脚展示文案，来自系统设置（如版权信息、公司信息等）。
  -->
  <footer v-if="visible" class="copyright">
    <!-- 页脚文本内容：由配置中心（settingsStore.footerContent）统一提供 -->
    <span>{{ content }}</span>
  </footer>
</template>

<script setup>
import { useSettingsStore } from '@/store'

const settingsStore = useSettingsStore()
const visible = computed(() => settingsStore.footerVisible)
const content = computed(() => settingsStore.footerContent)
</script>

<style scoped>
.copyright {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 36px;
  padding: 10px 20px;
  text-align: right;
  background-color: #f8f8f8;
  color: #666;
  font-size: 14px;
  border-top: 1px solid #e7e7e7;
  z-index: 999;
}
</style>
