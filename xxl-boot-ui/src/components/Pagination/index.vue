<template>
  <!--
    组件：Pagination（分页组件）
    功能：封装 el-pagination，通过 v-model 代理 page/limit，变化时派发 pagination 事件。
    用法：<Pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />

    视图层（分）：
    1）容器支持 hidden 状态控制整体显隐；
    2）内部复用 Element Plus 的 el-pagination；
    3）通过 v-model 将当前页与每页条数和外部状态双向同步；
    4）通过事件回调将用户操作统一交给脚本层处理。
  -->
  <div :class="{ 'hidden': hidden }" class="pagination-container">
    <el-pagination
      :background="background"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
/**
 * 组件名称：Pagination（分页组件）
 * 组件功能：统一封装分页交互，向上同步 page / limit，并在页码或每页条数变化时派发 pagination 事件；
 *          可选在分页切换后自动滚动到页面顶部附近，减少列表翻页后的定位成本。
 *
 * 注释结构说明（总-分）：
 * - 总：本组件负责“分页状态展示 + 分页行为上抛”；
 * - 分：包含参数定义、双向绑定代理、分页事件处理、样式显隐控制四部分。
 */
import { scrollTo } from '@/utils/scroll-to'

// defineProps 用法说明：
// 在 <script setup> 中用于声明组件入参，返回响应式 props 对象；
// 这里采用对象写法定义类型、必填项与默认值，供模板和逻辑直接读取。
// 分）参数定义：统一管理分页行为所需输入项与默认值。
const props = defineProps({
  // 总记录数（必填）：用于计算分页器页码与边界。
  total: {
    required: true,
    type: Number
  },
  // 当前页码：由父组件传入，默认第 1 页。
  page: {
    type: Number,
    default: 1
  },
  // 每页条数：由父组件传入，默认 20 条。
  limit: {
    type: Number,
    default: 20
  },
  // 可选每页条数列表：用于 sizes 下拉选项。
  pageSizes: {
    type: Array,
    default() {
      return [10, 20, 30, 50]
    }
  },
  // 页码按钮数：移动端收敛为 5，桌面端默认 7，避免过度拥挤。
  pagerCount: {
    type: Number,
    default: document.body.clientWidth < 992 ? 5 : 7
  },
  // 分页器布局：控制总数、尺寸切换、上一页/下一页、页码、跳转输入框展示顺序。
  layout: {
    type: String,
    default: 'total, sizes, prev, pager, next, jumper'
  },
  // 是否展示背景样式。
  background: {
    type: Boolean,
    default: true
  },
  // 翻页后是否自动滚动到顶部附近。
  autoScroll: {
    type: Boolean,
    default: true
  },
  // 是否隐藏整个分页组件。
  hidden: {
    type: Boolean,
    default: false
  }
})

// defineEmits 用法说明：
// 在 <script setup> 中用于声明组件可触发的事件，返回 emit 函数；
// 通过 emit('事件名', 载荷) 将状态变化通知父组件。
// 分）事件定义：向父组件派发双向绑定更新与分页行为事件。
const emit = defineEmits()

// computed 用法说明：
// 这里使用带 get/set 的 computed 创建“可写计算属性”，
// 以 currentPage / pageSize 作为 v-model 代理，实现 props 与事件更新桥接。
// 分）当前页双向代理：读取 props.page，写入时触发 update:page。
const currentPage = computed({
  get() {
    return props.page
  },
  set(val) {
    emit('update:page', val)
  }
})

// 分）每页条数双向代理：读取 props.limit，写入时触发 update:limit。
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

// 分）每页条数变化处理：
// 1）当新条数导致当前页越界时，自动重置到第一页；
// 2）向父组件派发 pagination 事件，通知重新拉取数据；
// 3）按需滚动到顶部，提升翻页后的浏览体验。
function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

// 分）页码变化处理：
// 1）派发 pagination 事件并携带最新页码与每页条数；
// 2）按需触发自动滚动，保持列表阅读连贯性。
function handleCurrentChange(val) {
  emit('pagination', { page: val, limit: pageSize.value })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}
</script>

<style scoped>
/* 分页容器基础样式：保持与页面白色内容区域风格一致。 */
.pagination-container {
  background: #fff;
}

/* 隐藏态：完全不占位显示分页区域。 */
.pagination-container.hidden {
  display: none;
}
</style>
