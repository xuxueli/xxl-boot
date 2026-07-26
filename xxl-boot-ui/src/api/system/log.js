import request from '@/utils/request'

/**
 * 名称：日志 API
 * 功能：提供日志查询、删除、枚举查询接口
 */

/** 分页查询日志列表 */
export function pageList(query) {
  return request({
    url: '/system/log/pageList',
    method: 'get',
    params: query
  })
}

/** 删除日志 */
export function delOperlog(ids) {
  return request({
    url: '/system/log/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/** 查询枚举列表 */
export function loadEnumItem(enumName) {
  return request({
    url: '/system/dict/loadEnumItem',
    method: 'get',
    params: { enumName }
  })
}
