<template>
  <!--
    组件：Pagination（分页组件）
    功能：封装 el-pagination，通过 v-model 代理 page/limit，变化时派发 pagination 事件。

    用法：<Pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
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
import { scrollTo } from '@/utils/scroll-to'

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
  // 每页条数列表（可选）：用于 sizes 下拉选项。
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
  // 分页器布局：“控制总数、每页条数切换、上一页、页码、下一页、跳转输入框”
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

const emit = defineEmits()

/**
 * currentPage 计算
 */
const currentPage = computed({
  // 当前页数
  get() {
    return props.page
  },
  /**
   * 更新页数，通过 emit 触发 'update:page' 事件
   *    - "update:" 说明是个变更事件，触发父组件 “page” 更新；
   *    - 父子组件会同时更新：通过 emit 更新父组件，父组件通过 props 同步子组件；
   *    - 不会造成循环更新：注意原则 “子组件只 emit，不直接改 props”
   */
  set(val) {
    emit('update:page', val)
  }
})

/**
 * pageSize 计算：
 *    - 每页条数双向代理：读取 props.limit，写入时触发 update:limit。
 */
const pageSize = computed({
  get() {
    return props.limit
  },
  set(val) {
    emit('update:limit', val)
  }
})

/**
 * 每页条数变化处理：
 *    - 1）当新条数导致当前页越界时，自动重置到第一页；
 *    - 2）向父组件派发 pagination 事件，通知重新拉取数据；
 *    - 3）按需滚动到顶部，提升翻页后的浏览体验。
 */
function handleSizeChange(val) {
  if (currentPage.value * val > props.total) {
    currentPage.value = 1
  }
  emit('pagination', { page: currentPage.value, limit: val })
  if (props.autoScroll) {
    scrollTo(0, 800)
  }
}

/**
 * 页码变化处理：
 *    - 1）派发 pagination 事件并携带最新页码与每页条数；
 *    - 2）按需触发自动滚动，保持列表阅读连贯性。
 */
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
