/**
 * 名称：用户会话 Model
 * 功能：管理登录态、用户资料、角色权限、退出登录
 *
 * 说明：
 *   - currentUser 存于全局 initialState（布局与权限读取）
 *   - 本模型提供 login / logout / hasPermi / hasRole 等会话动作与权限校验
 */
import { useModel } from '@umijs/max';
import {
  login as loginApi,
  logout as logoutApi,
} from '@/services/xxl-boot/login';
import { removeToken, setTokenWithAge } from '@/utils/auth';

/** 全局初始状态类型 */
interface InitialState {
  currentUser?: API.LoginInfo;
  menuData?: API.RouterVo[];
  [key: string]: unknown;
}

export interface UseUser {
  currentUser?: API.LoginInfo;
  permissions: string[];
  roles: string[];
  login: (params: API.LoginParams) => Promise<void>;
  logout: () => Promise<void>;
  hasPermi: (permission: string) => boolean;
  hasPermiOr: (permissionList: string[]) => boolean;
  hasPermiAnd: (permissionList: string[]) => boolean;
  hasRole: (role: string) => boolean;
  hasRoleOr: (roleList: string[]) => boolean;
  hasRoleAnd: (roleList: string[]) => boolean;
}

export default function useUser(): UseUser {
  const { initialState, setInitialState } = useModel('@@initialState') as {
    initialState?: InitialState;
    setInitialState: (
      updater: (s: InitialState | undefined) => InitialState | undefined,
    ) => void;
  };

  const currentUser = initialState?.currentUser;
  const permissions = currentUser?.permissionList || [];
  const roles = currentUser?.roleList || [];

  /**
   * 登录：提交凭证，保存 token（记住密码 365 天，否则 2 小时）
   */
  const login = async (params: API.LoginParams): Promise<void> => {
    const res = await loginApi(
      params.username ?? '',
      params.password ?? '',
      params.captchaUuid,
      params.captchaResult,
    );
    const token = res.data;
    if (token) {
      const age = params.rememberMe ? 365 : 2 / 24;
      setTokenWithAge(token, age);
    }
  };

  /**
   * 退出登录：服务端登出，清空本地 token 与用户状态
   */
  const logout = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch {
      // 忽略服务端登出异常，继续清理本地状态
    }
    removeToken();
    setInitialState((s) => ({
      ...s,
      currentUser: undefined,
      menuData: undefined,
    }));
  };

  /**
   * 校验单个权限
   */
  const hasPermi = (permission: string): boolean => {
    const all_permission = '*:*:*';
    if (permission && permission.length > 0) {
      return permissions.some((v) => all_permission === v || v === permission);
    }
    return false;
  };

  /**
   * 校验多个权限（或逻辑）
   */
  const hasPermiOr = (permissionList: string[]): boolean =>
    permissionList.some((item) => hasPermi(item));

  /**
   * 校验多个权限（与逻辑）
   */
  const hasPermiAnd = (permissionList: string[]): boolean =>
    permissionList.every((item) => hasPermi(item));

  /**
   * 校验角色
   */
  const hasRole = (role: string): boolean => {
    const super_admin = 'admin';
    if (role && role.length > 0) {
      return roles.some((v) => super_admin === v || v === role);
    }
    return false;
  };

  /**
   * 校验多个角色（或逻辑）
   */
  const hasRoleOr = (roleList: string[]): boolean =>
    roleList.some((item) => hasRole(item));

  /**
   * 校验多个角色（与逻辑）
   */
  const hasRoleAnd = (roleList: string[]): boolean =>
    roleList.every((item) => hasRole(item));

  return {
    currentUser,
    permissions,
    roles,
    login,
    logout,
    hasPermi,
    hasPermiOr,
    hasPermiAnd,
    hasRole,
    hasRoleOr,
    hasRoleAnd,
  };
}
