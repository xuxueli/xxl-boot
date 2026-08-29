// ==================== 组件引入 ====================
// 核心依赖库
import { createApp } from 'vue'

// UI 组件库
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

// 核心模块
import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import directive from '@/directive'

// 全局资源
import '@/assets/styles/index.scss'
import 'virtual:svg-icons-register'

// 持久化存储Key：localStorage key constant（字体大小）
const FONTSIZE_KEY = 'boot-fontsize'

// Element Plus 全局尺寸：'default' | 'small' | 'large'
type AppSize = 'default' | 'small' | 'large'

// ==================== 创建 Vue 应用 ====================
const app = createApp(App)

// 安装核心插件
app.use(router)
app.use(store)
app.use(ElementPlus, {
  locale,
  size: (localStorage.getItem(FONTSIZE_KEY) || 'default') as AppSize
})

// 全局注册：自定义指令
directive(app)

// 全局注册：Element Plus 图标（业务组件按需/Barrel引入）
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 挂载应用到 DOM
app.mount('#app')
