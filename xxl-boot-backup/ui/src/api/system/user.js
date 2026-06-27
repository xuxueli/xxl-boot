import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/boot";

/**
 * 名称：用户管理 API
 * 能力：提供用户列表、详情、增删改、状态与授权管理等接口。
 */

/**
 * 查询用户列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 用户分页列表。
 */
export function listUser(query) {
  return request({
    url: '/system/user/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询用户详情。
 * @param {string|number} userId 用户 ID。
 * @returns {Promise<any>} 用户详细信息。
 */
export function getUser(userId) {
  return request({
    url: '/system/user/' + parseStrEmpty(userId),
    method: 'get'
  })
}

/**
 * 新增用户。
 * @param {Object} data 用户数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addUser(data) {
  return request({
    url: '/system/user',
    method: 'post',
    data: data
  })
}

/**
 * 修改用户。
 * @param {Object} data 用户数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateUser(data) {
  return request({
    url: '/system/user',
    method: 'put',
    data: data
  })
}

/**
 * 删除用户。
 * @param {string|number} userId 用户 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delUser(userId) {
  return request({
    url: '/system/user/' + userId,
    method: 'delete'
  })
}

/**
 * 重置用户密码。
 * @param {string|number} userId 用户 ID。
 * @param {string} password 新密码。
 * @returns {Promise<any>} 重置结果。
 */
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/system/user/resetPwd',
    method: 'put',
    data: data
  })
}

/**
 * 修改用户状态。
 * @param {string|number} userId 用户 ID。
 * @param {string} status 状态值。
 * @returns {Promise<any>} 修改结果。
 */
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/system/user/changeStatus',
    method: 'put',
    data: data
  })
}

/**
 * 查询当前用户个人信息。
 * @returns {Promise<any>} 个人资料。
 */
export function getUserProfile() {
  return request({
    url: '/system/user/profile',
    method: 'get'
  })
}

/**
 * 修改当前用户个人信息。
 * @param {Object} data 个人资料数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateUserProfile(data) {
  return request({
    url: '/system/user/profile',
    method: 'put',
    data: data
  })
}

/**
 * 修改当前用户密码。
 * @param {string} oldPassword 原密码。
 * @param {string} newPassword 新密码。
 * @returns {Promise<any>} 修改结果。
 */
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/system/user/profile/updatePwd',
    method: 'put',
    data: data
  })
}

/**
 * 上传当前用户头像。
 * @param {string|Object} data 头像表单数据。
 * @returns {Promise<any>} 上传结果。
 */
export function uploadAvatar(data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    data: data
  })
}

/**
 * 查询用户授权角色。
 * @param {string|number} userId 用户 ID。
 * @returns {Promise<any>} 角色授权信息。
 */
export function getAuthRole(userId) {
  return request({
    url: '/system/user/authRole/' + userId,
    method: 'get'
  })
}

/**
 * 保存用户授权角色。
 * @param {Object} data 角色授权数据。
 * @returns {Promise<any>} 保存结果。
 */
export function updateAuthRole(data) {
  return request({
    url: '/system/user/authRole',
    method: 'put',
    params: data
  })
}

/**
 * 查询部门下拉树。
 * @returns {Promise<any>} 部门树结构。
 */
export function deptTreeSelect() {
  return request({
    url: '/system/user/deptTree',
    method: 'get'
  })
}
