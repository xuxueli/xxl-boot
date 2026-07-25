import request from '@/utils/request'
import { parseStrEmpty } from "@/utils/common";

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
    url: '/org/user/pageList',
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
    url: '/org/user/load',
    method: 'get',
    params: { id: userId }
  })
}

/**
 * 新增用户。
 * @param {Object} data 用户数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addUser(data) {
  return request({
    url: '/org/user/add',
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
    url: '/org/user/update',
    method: 'post',
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
    url: '/org/user/delete',
    method: 'post',
    params: { 'ids[]': [userId] }
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
    url: '/org/user/update',
    method: 'post',
    data: data
  })
}

export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/org/user/update',
    method: 'post',
    data: data
  })
}

export function getUserProfile() {
  return request({
    url: '/org/user/loadProfile',
    method: 'get'
  })
}

export function updateUserProfile(data) {
  return request({
    url: '/org/user/updateProfile',
    method: 'post',
    data: data
  })
}

export function updateUserPwd(oldPassword, newPassword) {
  return request({
    url: '/org/user/updatePwd',
    method: 'post',
    params: { oldPassword, newPassword }
  })
}

export function getAuthRole(userId) {
  return request({
    url: '/org/user/load',
    method: 'get',
    params: { id: userId }
  })
}

export function updateAuthRole(data) {
  return request({
    url: '/org/user/update',
    method: 'post',
    data: data
  })
}

export function deptTreeSelect() {
  return request({
    url: '/org/org/treeList',
    method: 'get'
  })
}
