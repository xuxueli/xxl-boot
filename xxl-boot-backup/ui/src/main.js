
// ==================== 依赖引入 ====================
// 核心依赖库
import {createApp} from 'vue'

// UI 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

// 工具库
import Cookies from 'js-cookie'

// 核心模块
import App from '@/App'
import router from '@/router'
import store from '@/store'
import directive from '@/directive'

// 全局资源
import '@/assets/styles/index.scss'
import 'virtual:svg-icons-register'
import registerComponents from '@/components'

// ==================== 创建 Vue 应用实例 ====================
const app = createApp(App)

// 安装核心插件
app.use(router)
app.use(store)
app.use(ElementPlus, { locale, size: Cookies.get('size') || 'default' })

// 全局注册自定义指令
directive(app)

// 注册全局组件
registerComponents(app)

// 挂载应用到 DOM
app.mount('#app')
