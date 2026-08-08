/**
 * usePageParams - 前端分页参数 → 后端请求参数
 *
 * 列表页搜索栏使用 pageNum/pageSize 分页，后端约定 offset/pagesize。
 * 本工具封装统一的转换逻辑，避免各页面重复编写。
 *
 * 用法（纯逻辑，无副作用，可直接在方法内调用）：
 *   const params = usePageParams(queryParams)()   // { ...筛选字段, offset, pagesize }
 */
/** 分页表单查询参数：必须含前端分页字段 pageNum/pageSize */
type PageFormQuery = {
  pageNum: number
  pageSize: number
  [key: string]: unknown
}

/**
 * 生成「后端列表请求参数」构建函数
 * @param queryParams 搜索栏查询参数（含 pageNum/pageSize）
 * @returns 调用后返回去除 pageNum/pageSize、补充 offset/pagesize 的请求参数，类型与 ListQuery 兼容
 */
export function buildPageParams<T extends PageFormQuery>(queryParams: T) {
  return function buildListParams(): Omit<T, 'pageNum' | 'pageSize'> & { offset: number; pagesize: number } {
    const { pageNum, pageSize, ...rest } = queryParams
    return {
      ...rest,
      offset: (pageNum - 1) * pageSize,
      pagesize: pageSize
    }
  }
}
