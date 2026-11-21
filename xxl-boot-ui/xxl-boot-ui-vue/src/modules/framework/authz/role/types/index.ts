/**
 * @fileoverview Role 类型定义
 * @description 实体、查询、表单与列表查询类型，对应后端 Role.java
 * @author xuxueli 2026-11-22
 */
import type { ListQuery } from '@/types'

/** 角色实体（对应后端 Role.java） */
export interface Role {
  /** 主键 */
  id?: number
  /** 角色名称 */
  name?: string
  /** 角色标识（权限字符） */
  code?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 显示顺序 */
  order?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索栏查询参数（前端表单形态） */
export interface RoleQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 角色名称，模糊匹配 */
  name?: string
  /** 状态筛选，-1 表示全部 */
  status: number
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type RoleListQuery = ListQuery<RoleQuery>

/** 新增/修改表单：复用实体中的可编辑字段，排除后端维护的时间字段 */
export type RoleForm = Pick<Role, 'id' | 'name' | 'code' | 'status' | 'order'>
