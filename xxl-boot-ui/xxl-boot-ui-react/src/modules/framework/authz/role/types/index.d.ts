/**
 * @fileoverview Role 类型定义
 * @description 角色实体，对应后端 Role.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 角色 */
  type Role = {
    /** 主键 */
    id?: number;
    /** 角色名称 */
    name?: string;
    /** 角色编码 */
    code?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 排序值 */
    order?: number;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 角色列表查询条件：ProTable 分页 + 搜索栏字段 */
  type RoleQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 角色名称，模糊匹配 */
    name?: string;
    /** 状态筛选：不传或 -1 表示全部 */
    status?: number;
  };

  /** 角色新增/修改表单：仅保留可编辑字段 */
  type RoleForm = Pick<Role, 'id' | 'name' | 'code' | 'status' | 'order'>;
}
