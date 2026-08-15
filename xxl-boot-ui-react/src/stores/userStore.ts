/**
 * userStore - 用户会话状态（Zustand，替代原 Umi model + @@initialState）
 * 功能：管理登录态、用户资料、菜单、角色权限、退出登录
 */
import { create } from 'zustand';
import {
  getInfo,
  getRouters,
  login as loginApi,
  logout as logoutApi,
} from '@/services/login';
import { removeToken, setTokenWithAge } from '@/utils/auth';

interface UserState {
  /** 当前登录用户信息 */
  currentUser?: API.LoginInfo;
  /** 当前用户菜单（后端 /getRouters） */
  menuData: API.RouterVo[];
  /** 登录：提交凭证，保存 token（记住密码 365 天，否则 2 小时） */
  login: (params: API.LoginParams) => Promise<void>;
  /** 获取当前登录用户信息 */
  fetchUserInfo: () => Promise<API.LoginInfo | undefined>;
  /** 获取当前用户菜单 */
  fetchMenuData: () => Promise<API.RouterVo[]>;
  /** 退出登录 */
  logout: () => Promise<void>;
  /** 校验单个权限 */
  hasPermi: (permission: string) => boolean;
  /** 校验单个角色 */
  hasRole: (role: string) => boolean;
}

export const useUserStore = create<UserState>()((set, get) => ({
  currentUser: undefined,
  menuData: [],

  login: async (params) => {
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
  },

  fetchUserInfo: async () => {
    try {
      const res = await getInfo();
      set({ currentUser: res.data });
      return res.data;
    } catch {
      return undefined;
    }
  },

  fetchMenuData: async () => {
    try {
      const res = await getRouters();
      set({ menuData: res.data || [] });
      return res.data || [];
    } catch {
      return [];
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // 忽略服务端登出异常，继续清理本地状态
    }
    removeToken();
    set({ currentUser: undefined, menuData: [] });
  },

  hasPermi: (permission) => {
    const permissions = get().currentUser?.permissionList || [];
    if (!permission || permission.length === 0) return false;
    return permissions.some((v) => v === '*:*:*' || v === permission);
  },

  hasRole: (role) => {
    const roles = get().currentUser?.roleList || [];
    if (!role || role.length === 0) return false;
    return roles.some((v) => v === 'admin' || v === role);
  },
}));
