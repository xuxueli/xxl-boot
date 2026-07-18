import { createPinia } from 'pinia'

const store = createPinia()

export default store

export { default as useUserStore } from './modules/user'
export { default as useRoutesStore } from './modules/routes'
export { default as useAppStore } from './modules/app'
export { default as useSettingsStore } from './modules/settings'
export { default as useTagsViewStore } from './modules/tagsView'
export { default as useDictStore } from './modules/dict'
