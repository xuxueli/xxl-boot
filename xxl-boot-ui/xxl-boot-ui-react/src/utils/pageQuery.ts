/**
 * @fileoverview pageQuery - 列表分页参数转换
 * @description
 *  ProTable 使用 current/pageSize，后端列表接口约定 offset/pagesize；
 *  在此统一转换，对应 Vue 侧的 usePageParams，避免各页面重复编写。
 * @author xuxueli 2026-11-22
 */

/**
 * 构建列表请求参数
 *
 * @param params ProTable request 入参（current/pageSize + 搜索条件）
 * @returns 去除 current/pageSize、补充 offset/pagesize 的列表请求参数
 */
export function buildListQuery<T extends { current?: number; pageSize?: number }, >(params: T): API.ListQuery<T> {
  // 1. 解构赋值与默认值
  // - 提取 current 和 pageSize，如果未提供则分别默认为 1 和 10
  // - ...search 收集剩余的所有属性（即搜索条件、排序等其他参数）
  const { current = 1, pageSize = 10, ...search } = params;
  return {
    // 2. 计算偏移量 (Offset)：前端页码从 1 开始，后端按偏移量分页
    offset: (current - 1) * pageSize,
    // 3. 映射每页大小
    pagesize: pageSize,
    // 4. 展开其余搜索参数
    ...search,
  };
}
