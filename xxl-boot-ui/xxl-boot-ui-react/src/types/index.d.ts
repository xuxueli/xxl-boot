/**
 * 类型定义入口（types/index.d.ts）
 * 覆盖项目通用类型：后端统一返回、分页、登录认证、动态路由、枚举等。
 * 以全局命名空间 API 声明，各模块文件同名 namespace 自动合并。
 */
declare namespace API {
  // --------------------------------- 公共数据结构 ----------------------

  /** 后端统一返回结构 */
  type Response<T = unknown> = {
    code: number;
    msg?: string;
    data?: T;
  };

  /** 后端分页返回结构 */
  type PageModel<T = unknown> = {
    data: T[];
    total: number;
    offset?: number;
    pagesize?: number;
  };

  // --------------------------------- 登录用户信息 ----------------------
  /** 登录用户信息（loginCheck 返回） */
  type LoginInfo = {
    userId?: string;
    userName?: string;
    realName?: string;
    roleList?: string[];
    permissionList?: string[];
    extraInfo?: Record<string, string>;
    expireTime?: number;
  };

  // --------------------------------- 菜单节点 ----------------------
  /** 菜单节点（/getMenus 返回，纯业务字段） */
  type MenuNode = {
    id: number;
    parentId: number;
    name: string;
    /** 类型：0-目录、1-菜单 */
    type: number;
    /** 菜单地址：内部路径或 http(s) 外链 */
    url?: string;
    /** 图标标识（由 UI 图标库解析） */
    icon?: string;
    /** 排序 */
    order?: number;
    /** 显示状态：0-显示、1-隐藏 */
    visible: number;
    /** 子菜单 */
    children?: MenuNode[];
  };

  // --------------------------------- 枚举项 ----------------------
  /** 枚举项（loadEnumItem 返回） */
  type EnumItem = {
    code: number;
    title?: string;
    desc?: string;
  };
}
