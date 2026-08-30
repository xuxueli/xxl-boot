/**
 * usePermission - 按钮级权限校验 Hook
 * 能力：基于用户会话角色/权限，提供 hasPermi / hasRole 校验。
 *
 * 说明：登录后角色权限即固定，渲染期间不会变化，
 *      直接经 getState 获取稳定函数引用，无需挂载 store 订阅。
 */
import { useUserStore } from '@/stores/userStore';

export function usePermission() {
  return {
    hasPermi: useUserStore.getState().hasPermi,
    hasRole: useUserStore.getState().hasRole,
  };
}
