/**
 * 名称：系统设置状态Store
 * 描述：系统全局设置状态管理，包括 菜单导航、标签页、主题色 ... 等
 */
import defaultSettings from '@/settings'
import {useDark, useToggle} from '@vueuse/core'
import {handleThemeStyle} from '@/utils/theme'

// 持久化存储Key：localStorage key constant
const LAYOUT_SETTING_KEY = 'layout-setting'

// 初始化暗黑模式：跟随系统
const isDark = useDark()
// 切换暗黑模式：联动更新
const toggleDark = useToggle(isDark)

// 持久化存储数据：从 localStorage 读取已有配置（如果有）
const storageSetting = JSON.parse(localStorage.getItem(LAYOUT_SETTING_KEY)) || {}

/**
 * 系统设置状态管理 Store
 *
 * 功能说明：
 * - 管理系统的全局配置项，包括主题、布局、标签页等设置
 * - 支持从本地存储恢复用户偏好设置
 * - 提供暗黑模式切换和动态标题更新功能
 *
 *
 * Pinia 简介：提供简洁、模块化且类型友好的状态管理能力。
 *      - 单一实例‌：Store 实例在应用生命周期内只创建一次，当第一次调用 useStore() 时生成。这种单例模式确保了应用全局状态的一致性和共享性。
 *      - 注册机制：Pinia 内部维护一个 Map 结构，以 Store 的 ID‌（即 defineStore 的第一个参数）作为键，Store 实例作为值。
 *      - 生命周期：Store 生命周期与 Vue 组件生命周期一致，当Vue 组件销毁时，Store 也会自动销毁。
 *      - 跨组件同步‌：在组件 A 中修改了 Store 的状态，组件 B 中读取到的状态会立即更新，因为它们引用的是内存中的同一个对象。
 *      - 注意：虽然 Store 实例是单例且响应式的，但直接解构 State 或 Getters 会导致‌失去响应性‌（因为解构出来的是普通变量，不再是 Proxy 对象）。
 * Pinia 定义：
 * <pre>
 *      import { defineStore } from 'pinia'
 *
 *      export const useCounterStore = defineStore('counter', {
 *        // 1. 状态定义 (必须返回一个函数)
 *        state: () => ({
 *          count: 0,
 *          name: 'Pinia'
 *        }),
 *
 *        // 2. 计算属性 (Getters)
 *        getters: {
 *          // 接收 state 作为参数
 *          doubleCount: (state) => state.count * 2,
 *
 *          // 如果需要访问其他 getter，不能使用箭头函数，需使用普通函数并通过 this 访问
 *          doublePlusOne(): number {
 *            return this.doubleCount + 1
 *          }
 *        },
 *
 *        // 3. 方法 (Actions)
 *        actions: {
 *          increment() {
 *            // 直接修改 state
 *            this.count++
 *          },
 *
 *          // 支持异步操作
 *          async fetchData() {
 *            const res = await fetch('/api/data')
 *            this.name = res.data.name
 *          }
 *        }
 *      })
 * </pre>
 *
 * Pinia 使用：
 * <pre>
 *      <script setup>
 *      import { useCounterStore } from '@/stores/counter'
 *
 *      // 1. 初始化 Store
 *      const counterStore = useCounterStore()
 *
 *      // 2. 直接使用
 *      console.log(counterStore.count)
 *      counterStore.increment()
 *      </script>
 *
 *      <template>
 *        <div>
 *          <p>Count: {{ counterStore.count }}</p>
 *          <p>Double: {{ counterStore.doubleCount }}</p>
 *          <button @click="counterStore.increment">+1</button>
 *        </div>
 *      </template>
 *      </pre>
 */
const useSettingsStore = defineStore(
    /**
     * 存储名称：用于在 localStorage 中存储和检索设置数据
     */
    'settings',
    {
        /**
         * 状态定义
         *
         * 包含所有可配置的系统设置项，优先从 localStorage 读取用户自定义配置，
         * 如果不存在则使用默认配置
         */
        state: () => ({
            menuTitle: '',                  // 菜单标题
            isDark: isDark.value,           // 暗黑模式-是否
            showSettings: defaultSettings.showSettings,
            navType: storageSetting.navType === undefined ? defaultSettings.navType : storageSetting.navType,
            sideTheme: storageSetting.sideTheme || defaultSettings.sideTheme,
            theme: storageSetting.theme || defaultSettings.theme,
            tagsView: storageSetting.tagsView === undefined ? defaultSettings.tagsView : storageSetting.tagsView,
            tagsViewPersist: storageSetting.tagsViewPersist === undefined ? defaultSettings.tagsViewPersist : storageSetting.tagsViewPersist,
            tagsIcon: storageSetting.tagsIcon === undefined ? defaultSettings.tagsIcon : storageSetting.tagsIcon,
            tagsViewStyle: storageSetting.tagsViewStyle === undefined ? defaultSettings.tagsViewStyle : storageSetting.tagsViewStyle,
            fixedHeader: storageSetting.fixedHeader === undefined ? defaultSettings.fixedHeader : storageSetting.fixedHeader,
            sidebarLogo: storageSetting.sidebarLogo === undefined ? defaultSettings.sidebarLogo : storageSetting.sidebarLogo,
            dynamicTitle: storageSetting.dynamicTitle === undefined ? defaultSettings.dynamicTitle : storageSetting.dynamicTitle,
            footerVisible: storageSetting.footerVisible === undefined ? defaultSettings.footerVisible : storageSetting.footerVisible,
            footerContent: defaultSettings.footerContent
        }),
        /**
         * 动作方法定义
         *
         * 提供修改系统设置的接口，包括布局配置、标题设置和主题切换
         */
        actions: {
            /**
             * 初始化：样式全局设置
             */
            initSetting() {
                // 异步变更：等待 DOM 更新
                nextTick(() => {
                    // 主题样式设置
                    handleThemeStyle(this.theme)
                })
            },
            /**
             * 持久化：将当前设置持久化到 localStorage
             */
            saveSetting() {
                const layoutSetting = {
                    navType: this.navType,
                    sideTheme: this.sideTheme,
                    theme: this.theme,
                    tagsView: this.tagsView,
                    tagsViewPersist: this.tagsViewPersist,
                    tagsIcon: this.tagsIcon,
                    tagsViewStyle: this.tagsViewStyle,
                    fixedHeader: this.fixedHeader,
                    sidebarLogo: this.sidebarLogo,
                    dynamicTitle: this.dynamicTitle,
                    footerVisible: this.footerVisible
                }
                localStorage.setItem(LAYOUT_SETTING_KEY, JSON.stringify(layoutSetting))
            },
            /**
             * 重置：恢复默认设置，并清除 localStorage 中数据
             */
            resetSetting() {
                localStorage.removeItem(LAYOUT_SETTING_KEY)

                // 恢复到默认配置
                this.showSettingsRef = defaultSettings.showSettings
                this.navType = defaultSettings.navType
                this.sideTheme = defaultSettings.sideTheme
                this.theme = defaultSettings.theme
                this.tagsView = defaultSettings.tagsView
                this.tagsViewPersist = defaultSettings.tagsViewPersist
                this.tagsIcon = defaultSettings.tagsIcon
                this.tagsViewStyle = defaultSettings.tagsViewStyle
                this.fixedHeader = defaultSettings.fixedHeader
                this.sidebarLogo = defaultSettings.sidebarLogo
                this.dynamicTitle = defaultSettings.dynamicTitle
                this.footerVisible = defaultSettings.footerVisible
                this.footerContent = defaultSettings.footerContent
            },
            /**
             * 切换：暗黑/明亮模式，重新应用主题样式以确保视觉效果正确更新
             */
            toggleTheme() {
                // 状态切换
                this.isDark = !this.isDark
                // 执行切换动作：包含修改DOM class操作
                toggleDark()
                // 异步变更：等待 DOM 更新
                nextTick(() => {
                    // 主题样式设置
                    handleThemeStyle(this.theme)
                })
            },
            /**
             * 设置：侧边主题（例如 'theme-dark'/'theme-light'），集中处理更新逻辑
             * @param {string} val
             */
            setSideTheme(val) {
                this.sideTheme = val
            },
            /**
             * 设置：主题色
             * @param {string} themeVal
             */
            setTheme(themeVal) {
                this.theme = themeVal

                // 联动变更：立即应用主题样式
                nextTick(() => {
                    handleThemeStyle(this.theme)
                })
            },
            /**
             * 设置：标签页持久化选项，并在关闭持久化时清理标签页缓存
             * @param {boolean} val true-开启持久化，false-关闭持久化，并清理缓存
             */
            setTagsViewPersist(val) {
                this.tagsViewPersist = val
            },
            /**
             * 设置：动态标题开关
             */
            setDynamicTitle(val) {
                this.dynamicTitle = val

                // 联动变更：网页标题 刷新
                this.setMenuTitle(this.menuTitle);
            },
            /**
             * 设置：网页标题，支持动态标题
             *
             * @param {string} menuTitle - 菜单标题
             */
            setMenuTitle(menuTitle) {
                this.menuTitle = menuTitle

                // 联动变更：修改 document.title
                if (this.dynamicTitle) {
                    document.title = this.menuTitle + ' - ' + defaultSettings.title
                } else {
                    document.title = defaultSettings.title
                }
            },
            /**
             * 设置：导航栏类型
             *
             * @param {number} val - 导航栏类型
             */
            setNavType(val) {
                this.navType = val
            }
        }
    })

export default useSettingsStore
