/**
 * 类型定义：配置管理
 * 对应后端配置实体（Config）。
 */
declare namespace API {
  /** 配置 */
  type Config = {
    id?: number;
    name?: string;
    key?: string;
    value?: string;
    status?: number;
    remark?: string;
    addTime?: string;
    updateTime?: string;
  };
}
