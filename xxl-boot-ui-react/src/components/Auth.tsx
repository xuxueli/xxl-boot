/**
 * Auth - 权限/角色校验组件
 *
 * 等价 v-hasPermi / v-hasRole 指令（React 无指令机制，用组件替代）。
 * 无权限时不渲染 children（等价 Vue 中移除 DOM 元素）。
 *
 * 用法：
 *   <Auth perms={['authz:user']}>
 *     <Button>新增</Button>
 *   </Auth>
 *   <Auth roles={['admin']}>
 *     <Button>删除</Button>
 *   </Auth>
 */
import type { ReactNode } from 'react'
import { useUserStore } from '@/stores'

interface AuthProps {
  /** 权限标识数组（或逻辑） */
  perms?: string[]
  /** 角色标识数组（或逻辑） */
  roles?: string[]
  /** 内容 */
  children: ReactNode
}

/**
 * 权限/角色校验组件：无权限时不渲染 children
 */
export default function Auth({ perms, roles, children }: AuthProps) {
  const checkPermi = useUserStore((state) => state.checkPermi)
  const checkRole = useUserStore((state) => state.checkRole)

  // 校验：优先权限，其次角色；均未配置则视为放行
  const visible = perms ? checkPermi(perms) : roles ? checkRole(roles) : true

  if (!visible) {
    return null
  }
  return <>{children}</>
}
