/**
 * @fileoverview 权限校验 Hook
 * @description 基于用户会话角色/权限，提供 hasPermi / hasRole 校验
 * @author xuxueli 2026-11-21
 */
import { useUserStore } from '@/stores/userStore';

/**
 * 获取按钮级权限校验函数
 *
 * 登录后角色权限即固定，渲染期间不会变化，直接经 getState 获取稳定函数引用，无需挂载 store 订阅。
 *
 * @returns hasPermi / hasRole 校验函数
 */
export function usePermission() {
  return {
    hasPermi: useUserStore.getState().hasPermi,
    hasRole: useUserStore.getState().hasRole,
  };
}
