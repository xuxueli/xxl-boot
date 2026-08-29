/**
 * 类型定义：组织管理
 * 对应后端组织实体（Org）。
 *
 *
 *  Typescript 类型定义：
 *    - 命名空间（declare namespace API）: 将类型定义包裹在 “API 命名空间” 中，避免全局污染。
 *    - 类型定义（type XX）: 定义一个类型 XX，用于描述指定 业务实体 的数据结构。
 *
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
