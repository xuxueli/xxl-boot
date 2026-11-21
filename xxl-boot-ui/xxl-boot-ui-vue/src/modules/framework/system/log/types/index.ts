/**
 * @fileoverview Log 类型定义
 * @description 日志实体与查询类型，对应后端 Log.java、LogDTO.java
 * @author xuxueli 2026-11-21
 */
import type { ListQuery } from '@/types'

/** 日志实体（对应后端 Log.java / LogDTO.java） */
export interface Log {
  /** 主键 */
  id?: number
  /** 日志类型：0-操作日志、1-登录日志 */
  type?: number
  /** 系统模块编码 */
  module?: number
  /** 日志标题 */
  title?: string
  /** 日志内容 */
  content?: string
  /** 操作人 */
  operator?: string
  /** 操作 IP */
  ip?: string
  /** 操作地址（IP 对应地理位置，仅列表接口返回） */
  ipAddress?: string
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 日志搜索栏查询参数（前端表单形态） */
export interface LogQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 日志类型筛选，-1 表示全部 */
  type: number
  /** 系统模块筛选，0 表示全部 */
  module: number
  /** 日志标题，模糊匹配 */
  title?: string
}

/** 日志列表接口请求参数（offset/pagesize 形态） */
export type LogListQuery = ListQuery<LogQuery>

/**
 * 日志新增/修改表单：复用实体中的可编辑字段
 *
 * 后端保留 insert/update 能力，前端日志页当前只做查询与删除，不提供编辑入口。
 */
export type LogForm = Pick<Log, 'id' | 'type' | 'module' | 'title' | 'content' | 'operator' | 'ip'>
