/**
 * 名称：Store 入口
 * 功能：创建 Pinia 实例并集中导出所有 store 模块
 *
 * 用法：
 *   import store from '@/store'
 *   app.use(store)
 *
 *   import { useUserStore, useRoutesStore } from '@/store'
 *   const userStore = useUserStore()
 */
import { createPinia } from 'pinia'

const store = createPinia()

export default store

export { default as useUserStore } from './modules/user'
export { default as useRoutesStore } from './modules/routes'
export { default as useAppStore } from './modules/app'
export { default as useSettingsStore } from './modules/settings'
export { default as useTagsViewStore } from './modules/tagsView'
export { default as useDictStore } from './modules/dict'
