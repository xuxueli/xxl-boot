/**
 * 名称：Store 入口
 * 功能：集中导出所有 store 模块
 *
 * 用法：
 *   import { useUserStore, useRoutesStore } from '@/stores'
 *   const userStore = useUserStore()
 */
export { useUserStore } from './user'
export { useRoutesStore } from './routes'
export { useAppStore } from './app'
export { useSettingsStore } from './settings'
export { useTagsViewStore } from './tagsView'
export { useDictStore } from './dict'
