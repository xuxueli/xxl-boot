import request from '@/utils/request'

/**
 * 名称：前端路由 API
 * 能力：获取当前用户可访问的动态路由树。
 */

/**
 * 获取当前用户路由配置。
 * @returns {Promise<any>} 路由树数据。
 */
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
