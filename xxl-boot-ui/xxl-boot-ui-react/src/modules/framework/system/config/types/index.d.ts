/**
 * @fileoverview Config 类型定义
 * @description 系统配置实体、列表查询与表单类型，对应后端 Config.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 系统配置实体 */
  type Config = {
    /** 主键 */
    id?: number;
    /** 配置名称 */
    name?: string;
    /** 配置 Key，业务唯一且创建后不可修改 */
    key?: string;
    /** 配置值 */
    value?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 备注 */
    remark?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 配置列表查询条件：ProTable 分页 + 搜索栏字段 */
  type ConfigQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 配置名称，模糊匹配 */
    name?: string;
    /** 配置 Key，模糊匹配 */
    key?: string;
    /** 状态筛选：0-正常、1-停用；不传或 -1 表示全部 */
    status?: number;
  };

  /** 列表接口请求参数（offset/pagesize 形态） */
  type ConfigListQuery = ListQuery<ConfigQuery>;

  /** 配置新增/修改表单：仅保留可编辑字段，避免回传只读字段 */
  type ConfigForm = Pick<
    Config,
    'id' | 'name' | 'key' | 'value' | 'status' | 'remark'
  >;
}
