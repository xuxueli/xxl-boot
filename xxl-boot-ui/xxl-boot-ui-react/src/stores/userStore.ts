/**
 * 名称：用户会话 Store
 * 功能：管理登录态、用户资料、菜单、角色权限、退出登录
 *
 * 分支说明：
 *   state   — currentUser 用户信息、menuData 动态菜单
 *   actions — login / fetchUserInfo / fetchMenuData / logout / hasPermi / hasRole
 *
 * @author xuxueli 2026-08-15
 */
import { create } from 'zustand';
import {
  getInfo,
  getRouters,
  login as loginApi,
  logout as logoutApi,
} from '@/services/login';
import { removeToken, setTokenWithAge } from '@/utils/auth';

/**
 * 用户会话状态
 */
interface UserState {
  /** 当前登录用户信息（含角色、权限集合） */
  currentUser?: API.LoginInfo;
  /** 当前用户菜单（后端 /getRouters 返回的动态菜单树） */
  menuData: API.RouterVo[];
  /** 登录：提交账号密码与验证码，成功后保存 token（记住密码 365 天，否则 2 小时） */
  login: (params: API.LoginParams) => Promise<void>;
  /** 获取当前登录用户信息并写入状态，失败时抛出异常 */
  fetchUserInfo: () => Promise<API.LoginInfo | undefined>;
  /** 获取当前用户动态菜单并写入状态，失败时抛出异常 */
  fetchMenuData: () => Promise<API.RouterVo[]>;
  /** 退出登录：先调服务端登出（失败忽略），再清理本地 token 与会话状态 */
  logout: () => Promise<void>;
  /** 校验单个操作权限（支持超管通配符 *:*:*） */
  hasPermi: (permission: string) => boolean;
  /** 校验单个角色（admin 视为超管） */
  hasRole: (role: string) => boolean;
}
/**
 * 用户会话 Store（Zustand）
 *
 * 用法：
 *   - 渲染依赖（响应式订阅）：const currentUser = useUserStore((s) => s.currentUser)
 *   - 事件回调（零订阅）：useUserStore.getState().login(params)
 *
 * @param set 更新状态（partial 或函数）
 * @param get 读取当前最新状态
 */
export const useUserStore = create<UserState>()((set, get) => ({
  // 初始状态：未登录
  currentUser: undefined,
  menuData: [],

  /** 登录：提交凭证，保存 token（记住密码 365 天，否则 2 小时） */
  login: async (params) => {
    const res = await loginApi(params);
    const token = res.data;
    // 接口成功但未返回 token：视为登录失败，抛出错误交由调用方处理
    if (!token) {
      throw new Error('登录失败，未获取到登录凭证');
    }
    // 记住密码时 token 有效期 365 天，否则 2 小时（2/24 天）
    const age = params.rememberMe ? 365 : 2 / 24;
    setTokenWithAge(token, age);
  },

  /** 获取当前登录用户信息，失败时抛出异常（由 RequireAuth 统一处理） */
  fetchUserInfo: async () => {
    const res = await getInfo();
    // 写入当前用户信息（含角色、权限集合）
    set({ currentUser: res.data });
    return res.data;
  },

  /** 获取当前用户动态菜单，失败时抛出异常（由 RequireAuth 统一处理） */
  fetchMenuData: async () => {
    const res = await getRouters();
    // 写入动态菜单树
    set({ menuData: res.data || [] });
    return res.data || [];
  },

  /** 退出登录：服务端登出失败也继续清理本地状态 */
  logout: async () => {
    try {
      await logoutApi();
    } catch {
      // 忽略服务端登出异常，继续清理本地状态
    }
    removeToken();
    set({ currentUser: undefined, menuData: [] });
  },

  /** 校验单个操作权限：空权限直接拒绝；命中超管通配符或目标权限则通过 */
  hasPermi: (permission) => {
    const permissions = get().currentUser?.permissionList || [];
    if (!permission || permission.length === 0) return false;
    return permissions.some((v) => v === '*:*:*' || v === permission);
  },

  /** 校验单个角色：空角色直接拒绝；admin 视为超管角色 */
  hasRole: (role) => {
    const roles = get().currentUser?.roleList || [];
    if (!role || role.length === 0) return false;
    return roles.some((v) => v === 'admin' || v === role);
  },
}));
