/**
 * usePermission - 按钮级权限校验 Hook
 * 能力：基于用户会话角色/权限，提供 hasPermi / hasRole 校验。
 */
import useUser from '@/models/user';

export function usePermission() {
  const { hasPermi, hasRole, hasPermiOr, hasRoleOr } = useUser();
  return { hasPermi, hasRole, hasPermiOr, hasRoleOr };
}
