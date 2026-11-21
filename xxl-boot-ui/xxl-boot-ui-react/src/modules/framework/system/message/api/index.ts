/**
 * @fileoverview Message API
 * @description 站内消息接口，方法名与后端 MessageController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 消息 API，调用方式：messageApi.pageList(...) */
export const messageApi = {
  /**
   * 分页查询消息
   *
   * @param params 分页与查询条件（current/pageSize/title/category/status）
   * @returns 消息分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
    title?: string;
    category?: number;
    status?: number;
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.Message>>>(
      '/system/message/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...rest,
        },
      },
    );
  },

  /**
   * 查询消息详情
   *
   * @param id 消息主键
   * @returns 消息详情
   */
  load(id: number) {
    return request<API.Response<API.Message>>('/system/message/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 新增消息
   *
   * @param data 消息数据
   * @returns 保存结果
   */
  insert(data: API.Message) {
    return request<API.Response<unknown>>('/system/message/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除消息（支持单条/批量）
   *
   * @param ids 消息主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/system/message/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新消息
   *
   * @param data 消息数据（含主键）
   * @returns 保存结果
   */
  update(data: API.Message) {
    return request<API.Response<unknown>>('/system/message/update', {
      method: 'POST',
      data,
    });
  },

  /**
   * 查询首页顶部消息（当前登录人最近 N 条）
   *
   * @returns 顶部消息列表
   */
  listTop() {
    return request<API.Response<API.Message[]>>('/system/message/listTop', {
      method: 'GET',
    });
  },

  /**
   * 标记单条消息已读
   *
   * @param messageId 消息主键
   * @returns 标记结果
   */
  markRead(messageId: number) {
    return request<API.Response<unknown>>('/system/message/markRead', {
      method: 'POST',
      params: { messageId },
    });
  },

  /**
   * 批量标记消息已读
   *
   * @param ids 消息主键，逗号分隔字符串
   * @returns 标记结果
   */
  markReadAll(ids: string) {
    return request<API.Response<unknown>>('/system/message/markReadAll', {
      method: 'POST',
      params: { ids },
    });
  },

  /**
   * 分页查询消息的已读用户
   *
   * @param params 查询条件（messageId/current/pageSize）
   * @returns 已读用户分页结果
   */
  readUsers(params: {
    messageId: number;
    current?: number;
    pageSize?: number;
  }) {
    const { current = 1, pageSize = 10, messageId } = params || {};
    return request<API.Response<API.PageModel<API.MessageRead>>>(
      '/system/message/readUsers',
      {
        method: 'GET',
        params: {
          messageId,
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
        },
      },
    );
  },
};
