/**
 * 类型定义：用户管理
 * 对应后端用户实体（User）。
 */
declare namespace API {
  /** 用户 */
  type User = {
    id?: number;
    orgId?: number;
    orgName?: string;
    username?: string;
    password?: string;
    realName?: string;
    status?: number;
    email?: string;
    phone?: string;
    roleIds?: number[];
    roleNames?: string[];
    addTime?: string;
    updateTime?: string;
  };
}
