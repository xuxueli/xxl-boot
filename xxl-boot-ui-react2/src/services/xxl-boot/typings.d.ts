// @ts-ignore
/* eslint-disable */

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

  /** 角色 */
  type Role = {
    id?: number;
    name?: string;
    code?: string;
    status?: number;
    order?: number;
    addTime?: string;
    updateTime?: string;
  };

  /** 资源 */
  type Resource = {
    id?: number;
    parentId?: number;
    name?: string;
    type?: number;
    permission?: string;
    url?: string;
    icon?: string;
    order?: number;
    status?: number;
    visible?: number;
    addTime?: string;
    updateTime?: string;
    children?: Resource[];
  };

  /** 用户 */
  type User = {
    id?: number;
    orgId?: number;
    orgName?: string;
    username?: string;
    password?: string;
    realName?: string;
    status?: number;
    email?: string;
    phone?: string;
    roleIds?: number[];
    roleNames?: string[];
    addTime?: string;
    updateTime?: string;
  };

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

  /** 枚举项（loadEnumItem 返回） */
  type EnumItem = {
    code: number;
    title?: string;
    desc?: string;
  };

  /** 日志 */
  type Log = {
    id?: number;
    type?: number;
    module?: number;
    title?: string;
    content?: string;
    operator?: string;
    ip?: string;
    ipAddress?: string;
    addTime?: string;
    updateTime?: string;
  };

  /** 消息 */
  type Message = {
    id?: number;
    category?: number;
    title?: string;
    content?: string;
    sender?: string;
    status?: number;
    isRead?: boolean;
    addTime?: string;
    updateTime?: string;
  };

  /** 消息已读用户 */
  type MessageRead = {
    id?: number;
    messageId?: number;
    userId?: number;
    userName?: string;
    realName?: string;
    addTime?: string;
  };

  /** 代码生成表 */
  type Codegen = {
    id?: number;
    tableName?: string;
    tableComment?: string;
    remark?: string;
    packageName?: string;
    moduleName?: string;
    businessName?: string;
    functionName?: string;
    functionAuthor?: string;
    formColNum?: number;
    tplCategory?: string;
    tplWebType?: string;
    addTime?: string;
    updateTime?: string;
    fieldList?: CodegenField[];
  };

  /** 代码生成字段 */
  type CodegenField = {
    id?: number;
    codegenId?: number;
    columnName?: string;
    columnComment?: string;
    javaType?: string;
    javaField?: string;
    isInsert?: string;
    isEdit?: string;
    isList?: string;
    isQuery?: string;
    isRequired?: string;
    queryType?: string;
    htmlType?: string;
    dictType?: string;
    sort?: number;
    addTime?: string;
    updateTime?: string;
  };

  /** 首页统计 */
  type DashboardStats = {
    userCount?: number;
    roleCount?: number;
    logCount?: number;
    messageCount?: number;
  };

  /** 日志趋势单日数据 */
  type LogTrendItem = {
    date?: string;
    count?: number;
  };
}
