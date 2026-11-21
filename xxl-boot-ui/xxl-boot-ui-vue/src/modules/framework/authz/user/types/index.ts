/**
 * @fileoverview User 类型定义
 * @description 实体、查询与表单类型，对应后端 UserDTO.java
 * @author xuxueli 2026-11-22
 */

/** 用户实体（对应后端 UserDTO.java） */
export interface User {
  /** 主键 */
  id?: number
  /** 组织 ID */
  orgId?: number
  /** 组织名称（列表联查字段，非数据库字段） */
  orgName?: string
  /** 账号 */
  username?: string
  /** 密码（仅新增时提交） */
  password?: string
  /** 用户名称 */
  realName?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 手机号 */
  phone?: string
  /** 邮箱 */
  email?: string
  /** 角色 ID 集合（非数据库字段） */
  roleIds?: number[]
  /** 角色名称集合（非数据库字段） */
  roleNames?: string[]
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索栏查询参数（含分页，前端表单形态） */
export interface UserQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 账号，模糊匹配 */
  username?: string
  /** 状态筛选，-1 表示全部 */
  status: number
  /** 选中组织及其全部子组织的 ID 集合 */
  orgIds: number[]
}

/** 新增/修改表单：复用实体中的可编辑字段，排除后端维护的时间与联查字段 */
export type UserForm = Pick<User, 'id' | 'orgId' | 'username' | 'password' | 'realName' | 'status' | 'phone' | 'email'> & {
  /** 角色 ID 集合 */
  roleIds?: number[]
}
