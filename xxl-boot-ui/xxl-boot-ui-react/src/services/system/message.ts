/**
 * 名称：站内消息 API
 * 能力：提供消息分页、增删改、已读、已读用户相关接口。
 */
import { request } from '@/utils/request';

/**
 * 分页查询消息列表。
 * @param params 查询参数（current/pageSize/title/category/status）
 */
export async function listMessage(params: {
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
}

/**
 * 加载消息详情。
 * @param id 消息 ID
 */
export async function getMessage(id: number) {
  return request<API.Response<API.Message>>('/system/message/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 新增消息（JSON 请求体）。
 * @param data 消息数据
 */
export async function addMessage(data: API.Message) {
  return request<API.Response<unknown>>('/system/message/insert', {
    method: 'POST',
    data,
  });
}

/**
 * 修改消息（JSON 请求体）。
 * @param data 消息数据
 */
export async function updateMessage(data: API.Message) {
  return request<API.Response<unknown>>('/system/message/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除消息。
 * @param ids 消息 ID 数组
 */
export async function delMessage(ids: number[]) {
  return request<API.Response<unknown>>('/system/message/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 加载顶部消息列表（当前登录人，最近 N 条）。
 */
export async function listMessageTop() {
  return request<API.Response<API.Message[]>>('/system/message/listTop', {
    method: 'GET',
  });
}

/**
 * 标记单条消息已读。
 * @param messageId 消息 ID
 */
export async function markMessageRead(messageId: number) {
  return request<API.Response<unknown>>('/system/message/markRead', {
    method: 'POST',
    params: { messageId },
  });
}

/**
 * 标记全部已读。
 * @param ids 逗号分隔的消息 ID 字符串
 */
export async function markMessageReadAll(ids: string) {
  return request<API.Response<unknown>>('/system/message/markReadAll', {
    method: 'POST',
    params: { ids },
  });
}

/**
 * 分页查询消息已读用户。
 * @param params 查询参数（messageId/current/pageSize）
 */
export async function listMessageReadUsers(params: {
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
}
