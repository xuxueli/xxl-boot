/**
 * 类型定义入口（types/index.d.ts）
 * 覆盖项目通用类型：后端统一返回、分页、登录认证、动态路由、枚举等。
 * 以全局命名空间 API 声明，各模块文件同名 namespace 自动合并。
 */
declare namespace API {
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

  /** 登录参数 */
  type LoginParams = {
    username?: string;
    password?: string;
    captchaUuid?: string;
    captchaResult?: string;
    rememberMe?: boolean;
  };

  /** 验证码数据 */
  type CaptchaData = {
    enable: boolean;
    image: string;
    uuid: string;
  };

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

  /** 菜单路由节点（getRouters 返回） */
  type MetaVo = {
    title?: string;
    icon?: string;
  };

  type RouterVo = {
    name?: string;
    path?: string;
    hidden?: boolean;
    component?: string;
    meta?: MetaVo;
    children?: RouterVo[];
  };

  /** 枚举项（loadEnumItem 返回） */
  type EnumItem = {
    code: number;
    title?: string;
    desc?: string;
  };
}
