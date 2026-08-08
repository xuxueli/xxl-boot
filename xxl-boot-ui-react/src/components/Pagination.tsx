/**
 * 组件：Pagination（分页组件）
 * 功能：封装 antd Pagination，代理 page/limit，变化时派发 pagination 事件。
 *
 * 用法：<Pagination total={total} page={queryParams.pageNum} limit={queryParams.pageSize} onPagination={getList} />
 */
import { Pagination as AntdPagination } from 'antd'
import { scrollTo } from '@/utils/scroll-to'
import './pagination.scss'

interface PaginationProps {
  /** 总记录数（必填） */
  total: number
  /** 当前页码：默认第 1 页 */
  page?: number
  /** 每页条数：默认 20 条 */
  limit?: number
  /** 每页条数列表 */
  pageSizes?: number[]
  /** 页码按钮数：移动端 5，桌面端 7 */
  pagerCount?: number
  /** 分页器布局：total, sizes, prev, pager, next, jumper */
  layout?: string
  /** 是否展示背景样式 */
  background?: boolean
  /** 翻页后是否自动滚动到顶部附近 */
  autoScroll?: boolean
  /** 是否隐藏整个分页组件 */
  hidden?: boolean
  /** 页码变化事件 */
  onPageChange?: (value: number) => void
  /** 每页条数变化事件 */
  onLimitChange?: (value: number) => void
  /** 分页事件（page + limit） */
  onPagination?: (value: { page: number; limit: number }) => void
}

/**
 * 分页组件
 */
export default function Pagination({
  total,
  page = 1,
  limit = 20,
  pageSizes = [10, 20, 50, 100],
  pagerCount = document.body.clientWidth < 992 ? 5 : 7,
  layout = 'total, sizes, prev, pager, next, jumper',
  background = true,
  autoScroll = true,
  hidden = false,
  onPageChange,
  onLimitChange,
  onPagination
}: PaginationProps) {
  /**
   * 每页条数变化处理：重置越界页码 + 派发事件 + 滚动
   */
  const handleSizeChange = (val: number) => {
    const currentPage = page * val > total ? 1 : page
    if (currentPage !== page) {
      onPageChange && onPageChange(1)
    }
    onLimitChange && onLimitChange(val)
    onPagination && onPagination({ page: currentPage, limit: val })
    if (autoScroll) {
      scrollTo(0, 800)
    }
  }

  /**
   * 页码变化处理：派发事件 + 滚动
   */
  const handleCurrentChange = (val: number) => {
    onPageChange && onPageChange(val)
    onPagination && onPagination({ page: val, limit })
    if (autoScroll) {
      scrollTo(0, 800)
    }
  }

  return (
    <div className={hidden ? 'pagination-container hidden' : 'pagination-container'}>
      <AntdPagination
        total={total}
        current={page}
        pageSize={limit}
        pageSizeOptions={pageSizes.map((size) => `${size}`)}
        showSizeChanger={layout.includes('sizes')}
        showQuickJumper={layout.includes('jumper')}
        showTotal={layout.includes('total') ? (t) => `共 ${t} 条` : undefined}
        onShowSizeChange={(_cur, size) => handleSizeChange(size)}
        onChange={(cur) => handleCurrentChange(cur)}
        className={background ? 'ant-pagination-background' : ''}
      />
    </div>
  )
}
