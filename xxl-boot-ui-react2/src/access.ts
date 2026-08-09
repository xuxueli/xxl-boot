/**
 * @name 权限
 * @description 基于后端 loginCheck 返回的权限/角色集合，计算页面访问键。
 * @param initialState 全局初始状态（含 currentUser.permissionList / roleList）
 */
export default function access(
  initialState: { currentUser?: API.LoginInfo } | undefined,
) {
  const { currentUser } = initialState ?? {};
  const permissions = currentUser?.permissionList || [];
  const roles = currentUser?.roleList || [];

  /** 超级管理员兜底：权限标识 *:*:* 或角色 admin */
  const isSuper = () =>
    permissions.includes('*:*:*') || roles.includes('admin');

  const hasPermi = (permission: string) =>
    isSuper() || permissions.includes(permission);

  return {
    canAuthz: hasPermi('authz'),
    canAuthzUser: hasPermi('authz:user'),
    canAuthzRole: hasPermi('authz:role'),
    canAuthzResource: hasPermi('authz:resource'),
    canAuthzOrg: hasPermi('authz:org'),
    canSystem: hasPermi('system'),
    canSystemDict: hasPermi('system:dict'),
    canSystemConfig: hasPermi('system:config'),
    canSystemMessage: hasPermi('system:message'),
    canSystemLog: hasPermi('system:log'),
    canTool: hasPermi('tool'),
    canToolCodegen: hasPermi('tool:codegen'),
    canToolPagegen: hasPermi('tool:pagegen'),
  };
}
