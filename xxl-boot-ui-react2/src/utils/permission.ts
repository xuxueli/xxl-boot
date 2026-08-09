/**
 * usePermission - 按钮级权限校验 Hook
 * 能力：基于用户会话角色/权限，提供 hasPermi / hasRole 校验。
 */
import { useUserStore } from '@/stores/userStore';

export function usePermission() {
  const hasPermi = useUserStore((s) => s.hasPermi);
  const hasRole = useUserStore((s) => s.hasRole);
  return { hasPermi, hasRole };
}
