/**
 * @fileoverview 全局类型定义
 * @description 后端统一返回、分页、登录用户、菜单与枚举等公共类型，以全局命名空间 API 声明
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  // --------------------------------- 公共数据结构 ----------------------

  /** 后端统一返回结构 */
  type Response<T = unknown> = {
    /** 业务码，200 成功 */
    code: number;
    /** 提示信息 */
    msg?: string;
    /** 业务数据 */
    data?: T;
  };

  /** 后端分页返回结构 */
  type PageModel<T = unknown> = {
    /** 当前页数据 */
    data: T[];
    /** 总条数 */
    total: number;
  };

  // --------------------------------- 登录用户信息 ----------------------

  /** 登录用户信息（loginCheck 返回） */
  type LoginInfo = {
    /** 用户主键 */
    userId?: string;
    /** 登录账号 */
    userName?: string;
    /** 真实姓名 */
    realName?: string;
    /** 角色编码集合 */
    roleList?: string[];
    /** 权限标识集合 */
    permissionList?: string[];
    /** 扩展信息 */
    extraInfo?: Record<string, string>;
    /** 过期时间 */
    expireTime?: number;
  };

  // --------------------------------- 菜单节点 ----------------------

  /** 菜单节点（/getMenus 返回，纯业务字段） */
  type MenuNode = {
    /** 主键 */
    id: number;
    /** 父级主键 */
    parentId: number;
    /** 菜单名称 */
    name: string;
    /** 类型：0-目录、1-菜单 */
    type: number;
    /** 菜单地址：内部路径或 http(s) 外链 */
    url?: string;
    /** 图标标识（由 UI 图标库解析） */
    icon?: string;
    /** 排序值 */
    order?: number;
    /** 显示状态：0-显示、1-隐藏 */
    visible: number;
    /** 子菜单 */
    children?: MenuNode[];
  };

  // --------------------------------- 枚举项 ----------------------

  /** 枚举项（loadEnumItem 返回） */
  type EnumItem = {
    /** 枚举值 */
    code: number;
    /** 枚举标题 */
    title?: string;
    /** 枚举描述 */
    desc?: string;
  };
}
