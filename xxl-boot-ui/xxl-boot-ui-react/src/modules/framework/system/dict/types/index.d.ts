/**
 * @fileoverview Dict 类型定义
 * @description 字典类型、字典项与字典项选项，对应后端 Dict.java、DictItem.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 字典类型 */
  type Dict = {
    /** 主键 */
    id?: number;
    /** 字典名称 */
    name?: string;
    /** 字典标识，业务唯一 */
    type?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 备注 */
    remark?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 字典项 */
  type DictItem = {
    /** 主键 */
    id?: number;
    /** 所属字典类型主键 */
    dictId?: number;
    /** 字典项名称 */
    name?: string;
    /** 字典项编码 */
    code?: number;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 排序值 */
    order?: number;
    /** 备注 */
    remark?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 字典项选项（loadDictItem 返回） */
  type DictItemOption = {
    /** 主键 */
    id?: number;
    /** 所属字典类型主键 */
    dictId?: number;
    /** 字典项名称 */
    name?: string;
    /** 字典项编码 */
    code?: number;
    /** 状态：0-正常、1-停用 */
    status?: number;
  };

  /** 字典类型列表查询条件：ProTable 分页 + 搜索栏字段 */
  type DictQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 字典名称，模糊匹配 */
    name?: string;
    /** 字典标识，模糊匹配 */
    type?: string;
    /** 状态筛选：不传或 -1 表示全部 */
    status?: number;
  };

  /** 字典类型新增/修改表单 */
  type DictForm = Pick<Dict, 'id' | 'name' | 'type' | 'status' | 'remark'>;

  /** 字典项列表查询条件：ProTable 分页 + 后端支持的筛选项 */
  type DictItemQuery = {
    /** 当前页码，默认 1 */
    current?: number;
    /** 每页条数，默认 10 */
    pageSize?: number;
    /** 所属字典主键 */
    dictId?: number;
  };

  /** 字典项新增/修改表单 */
  type DictItemForm = Pick<
    DictItem,
    'id' | 'dictId' | 'name' | 'code' | 'status' | 'order' | 'remark'
  >;
}
