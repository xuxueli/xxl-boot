/**
 * @fileoverview Codegen API
 * @description 代码生成接口，方法名与后端 CodeGenController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { CodegenTable } from '../types'
import type { PageModel, Response } from '@/types'

/** 代码生成 API，调用方式：codegenApi.pageList(...) */
export const codegenApi = {
  /**
   * 分页查询生成表
   *
   * @param query 分页与查询条件（pageNum/pageSize/tableName/tableComment）
   * @returns 生成表分页结果
   */
  pageList(query: {
    pageNum?: number
    pageSize?: number
    tableName?: string
    tableComment?: string
  }): Promise<Response<PageModel<CodegenTable>>> {
    return request({
      url: '/tool/codegen/pageList',
      method: 'get',
      params: {
        offset: ((query.pageNum || 1) - 1) * (query.pageSize || 10),
        pageSize: query.pageSize || 10,
        tableName: query.tableName,
        tableComment: query.tableComment
      }
    })
  },

  /**
   * 查询生成表详情
   *
   * @param id 生成表主键
   * @returns 生成表详情
   */
  detail(id: number): Promise<Response<CodegenTable>> {
    return request({
      url: '/tool/codegen/detail',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 更新代码生成配置
   *
   * @param data 生成配置数据
   * @returns 保存结果
   */
  update(data: CodegenTable): Promise<Response<unknown>> {
    return request({
      url: '/tool/codegen/update',
      method: 'post',
      data
    })
  },

  /**
   * 删除生成表数据（支持单条/批量）
   *
   * @param ids 生成表主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/tool/codegen/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 在数据库中创建表
   *
   * @param data 建表参数
   * @returns 创建结果
   */
  createTable(data: object): Promise<Response<unknown>> {
    return request({
      url: '/tool/codegen/createTable',
      method: 'post',
      data
    })
  },

  /**
   * 预览生成代码
   *
   * @param id 生成表主键
   * @returns 文件名与代码内容的映射
   */
  preview(id: number): Promise<Response<Record<string, string>>> {
    return request({
      url: '/tool/codegen/preview',
      method: 'get',
      params: { id }
    })
  }
}
