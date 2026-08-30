/**
 * 类型定义：组织管理
 * 对应后端组织实体（Org）。
 *
 *
 *  Typescript 类型定义：
 *    - 命名空间（declare namespace API）: 将类型定义包裹在 “API 命名空间” 中，避免全局污染。
 *    - 类型定义（type XX）: 定义一个类型 XX，用于描述指定 业务实体 的数据结构。
 *    - 说明：
 *      - 全局脚本文件：.d.ts 天然是声明文件，declare namespace API 默认就是全局；
 *      - 模块文件：.ts 有顶层 import/export 是模块。
 *        - declare namespace API 只会挂在模块内部，外部访问不到。
 *        - 必须用 declare global { namespace API {} } 才能把它「提升」到全局作用域。
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
