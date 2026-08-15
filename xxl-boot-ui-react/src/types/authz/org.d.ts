/**
 * 类型定义：组织管理
 * 对应后端组织实体（Org）。
 */
declare namespace API {
  /** 组织 */
  type Org = {
    id?: number;
    parentId?: number;
    name?: string;
    order?: number;
    status?: number;
    manager?: string;
    addTime?: string;
    updateTime?: string;
    children?: Org[];
  };
}
