/**
 * 类型定义：字典管理
 * 对应后端字典类型（Dict）与字典项（DictItem）。
 */
declare namespace API {
  /** 字典类型 */
  type Dict = {
    id?: number;
    name?: string;
    type?: string;
    status?: number;
    remark?: string;
    addTime?: string;
    updateTime?: string;
  };

  /** 字典项 */
  type DictItem = {
    id?: number;
    dictId?: number;
    name?: string;
    code?: number;
    status?: number;
    order?: number;
    remark?: string;
    addTime?: string;
    updateTime?: string;
  };

  /** 字典项（loadDictItem 返回） */
  type DictItemOption = {
    id?: number;
    dictId?: number;
    name?: string;
    code?: number;
    status?: number;
  };
}
