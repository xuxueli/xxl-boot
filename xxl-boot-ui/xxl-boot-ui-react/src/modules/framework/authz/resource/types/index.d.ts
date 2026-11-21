/**
 * @fileoverview Resource 类型定义
 * @description 资源（目录/菜单/按钮）实体，对应后端 Resource.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 资源 */
  type Resource = {
    /** 主键 */
    id?: number;
    /** 父级资源主键，0 表示根节点 */
    parentId?: number;
    /** 资源名称 */
    name?: string;
    /** 类型：0-目录、1-菜单、2-按钮 */
    type?: number;
    /** 权限标识，如 system:user:add */
    permission?: string;
    /** 菜单地址（路由 path 或外链） */
    url?: string;
    /** 图标标识 */
    icon?: string;
    /** 排序值 */
    order?: number;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 显示状态：0-显示、1-隐藏 */
    visible?: number;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 子资源 */
    children?: Resource[];
  };

  /** 资源树查询条件：树形接口不分页 */
  type ResourceQuery = {
    /** 资源名称，模糊匹配 */
    name?: string;
    /** 状态筛选：不传或 -1 表示全部 */
    status?: number;
  };

  /** 资源新增/修改表单：仅保留可编辑字段 */
  type ResourceForm = Pick<
    Resource,
    | 'id'
    | 'parentId'
    | 'name'
    | 'type'
    | 'permission'
    | 'url'
    | 'icon'
    | 'order'
    | 'status'
    | 'visible'
  >;
}
