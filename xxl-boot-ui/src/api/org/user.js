import request from '@/utils/request'

/**
 * 名称：用户管理 API
 * 能力：提供用户列表、增删改、状态与个人中心相关接口。
 */

/**
 * 分页查询用户列表。
 * @param {Object} query 查询参数（offset/pagesize/username/status/orgIds）。
 * @returns {Promise<any>} 用户分页列表（response.data.data / response.data.total）。
 */
export function listUser(query) {
  return request({
    url: '/org/user/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 新增用户（后端以请求参数绑定实体）。
 * @param {Object} data 用户数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addUser(data) {
  return request({
    url: '/org/user/add',
    method: 'post',
    params: data
  })
}

/**
 * 修改用户（后端以请求参数绑定实体）。
 * @param {Object} data 用户数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateUser(data) {
  return request({
    url: '/org/user/update',
    method: 'post',
    params: data
  })
}

/**
 * 删除用户。
 * @param {string|number|Array} ids 用户 ID 或用户 ID 数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delUser(ids) {
  return request({
    url: '/org/user/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/**
 * 加载个人中心信息。
 * @returns {Promise<any>} 当前登录用户信息。
 */
export function getUserProfile() {
  return request({
    url: '/org/user/loadProfile',
    method: 'get'
  })
}

/**
 * 更新个人中心信息（JSON 请求体）。
 * @param {Object} data 用户资料数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateUserProfile(data) {
  return request({
    url: '/org/user/updateProfile',
    method: 'post',
    data: data
  })
}

/**
 * 修改当前登录用户密码。
 * @param {string} oldPassword 旧密码。
 * @param {string} newPassword 新密码。
 * @returns {Promise<any>} 修改结果。
 */
export function updateUserPwd(oldPassword, newPassword) {
  return request({
    url: '/org/user/updatePwd',
    method: 'post',
    params: { oldPassword, newPassword }
  })
}
