/**
 * 类型定义：资源管理
 * 对应后端资源实体（Resource）。
 */
declare namespace API {
  /** 资源 */
  type Resource = {
    id?: number;
    parentId?: number;
    name?: string;
    type?: number;
    permission?: string;
    url?: string;
    icon?: string;
    order?: number;
    status?: number;
    visible?: number;
    addTime?: string;
    updateTime?: string;
    children?: Resource[];
  };
}
