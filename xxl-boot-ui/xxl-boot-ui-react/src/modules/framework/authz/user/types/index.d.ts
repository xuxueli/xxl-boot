/**
 * @fileoverview User 类型定义
 * @description 用户实体，对应后端 User.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 用户 */
  type User = {
    /** 主键 */
    id?: number;
    /** 归属组织主键 */
    orgId?: number;
    /** 归属组织名称（列表回显） */
    orgName?: string;
    /** 登录账号 */
    username?: string;
    /** 登录密码（仅新增/改密时提交） */
    password?: string;
    /** 真实姓名 */
    realName?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 邮箱 */
    email?: string;
    /** 手机号 */
    phone?: string;
    /** 角色主键集合 */
    roleIds?: number[];
    /** 角色名称集合（列表回显） */
    roleNames?: string[];
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 用户列表查询条件：ProTable 分页 + 搜索栏字段 */
  type UserQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 账号，模糊匹配 */
    username?: string;
    /** 状态筛选：不传或 -1 表示全部 */
    status?: number;
    /** 选中组织及其全部子组织的 ID 集合 */
    orgIds?: number[];
  };

  /** 用户新增/修改表单：仅保留可编辑字段，排除时间与联查回显字段 */
  type UserForm = Pick<
    User,
    | 'id'
    | 'orgId'
    | 'username'
    | 'password'
    | 'realName'
    | 'status'
    | 'phone'
    | 'email'
  > & {
    /** 角色 ID 集合 */
    roleIds?: number[];
  };
}
