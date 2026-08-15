/**
 * 类型定义：角色管理
 * 对应后端角色实体（Role）。
 */
declare namespace API {
  /** 角色 */
  type Role = {
    id?: number;
    name?: string;
    code?: string;
    status?: number;
    order?: number;
    addTime?: string;
    updateTime?: string;
  };
}
