
// ==================== 核心依赖库 ====================
// Vue 核心
import {createApp} from 'vue'

// UI 组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import locale from 'element-plus/es/locale/lang/zh-cn'

// 工具库
import Cookies from 'js-cookie'

// ==================== 核心模块 ====================
// 根组件、路由及状态管理
import App from '@/App'
import router from '@/router'
import store from '@/store'
import '@/router/guards'                                    // 关键副作用导入/side-effect import: 全局路由权限守卫，模块加载时自动注册全局路由权限守卫，无需引入具体变量；

// 全局配置
import directive from '@/directive'                         // 自定义指令
import plugins from '@/plugins'                             // 全局插件

// ==================== 全局资源 ====================
import '@/assets/styles/index.scss'                         // 全局样式
import 'virtual:svg-icons-register'                         // 关键副作用导入/side-effect import: SVG sprite 注册
import SvgIcon from '@/components/SvgIcon'                  // 自定义图标
import elementIcons from '@/components/SvgIcon/svgicon'

// 工具函数：字典、下载、日期处理等
import {useDict} from '@/utils/dict'
import {download} from '@/utils/request'
import {getConfigKey} from '@/api/sys/config'
import {parseTime, resetForm, addDateRange, handleTree, selectDictLabel, selectDictLabels} from '@/utils/boot'

// 业务组件：分页、上传、编辑器等；
import RightToolbar from '@/components/RightToolbar'        // 工具栏组件
import Pagination from '@/components/Pagination'            // 分页组件
import DictTag from '@/components/DictTag'                  // 字典标签组件
import Editor from '@/components/Editor'                    // 富文本组件
import FileUpload from '@/components/FileUpload'            // 文件上传组件
import ImageUpload from '@/components/ImageUpload'          // 图片上传组件
import ImagePreview from '@/components/ImagePreview'        // 图片预览组件


// ==================== 创建 Vue 应用实例 ====================
const app = createApp(App)

// ==================== 安装核心插件 ====================
app.use(router)                     // 路由系统：router 安装 + 副作用导入 “路由守卫 / guards”；
app.use(store)                      // 状态管理：Pinia安装；Store实例懒加载方式生成并缓存；
app.use(plugins)                    // 全局插件：$tab/$auth/$cache/$modal/$download
app.use(elementIcons)               // Element Plus 图标组件 全量注册
app.use(ElementPlus, {      // UI组件库：element-plus，配置语言和尺寸
    locale,                                 // 语言
    size: Cookies.get('size') || 'default'  // 支持 large、default、small
})

// ==================== 挂载全局方法 ====================
// 兼容 Options API：可通过 this.xxx、proxy.xxx 调用，示例 proxy.getConfigKey('xxx')
app.config.globalProperties.useDict = useDict
app.config.globalProperties.download = download
app.config.globalProperties.getConfigKey = getConfigKey
app.config.globalProperties.parseTime = parseTime
app.config.globalProperties.resetForm = resetForm
app.config.globalProperties.addDateRange = addDateRange
app.config.globalProperties.handleTree = handleTree
app.config.globalProperties.selectDictLabel = selectDictLabel
app.config.globalProperties.selectDictLabels = selectDictLabels

// ==================== 注册自定义指令 ====================
directive(app)                      // 注册自定义指令: directive(app) → v-hasRole, v-hasPermi, v-copyText；示例 v-hasRole="['admin','editor']"

// ==================== 注册全局业务组件 ====================
// 页面业务组件：可直接使用，无需重复 import；例如 <RightToolbar />
app.component('RightToolbar', RightToolbar)
app.component('Pagination', Pagination)
app.component('DictTag', DictTag)
app.component('Editor', Editor)
app.component('FileUpload', FileUpload)
app.component('ImageUpload', ImageUpload)
app.component('ImagePreview', ImagePreview)
app.component('svg-icon', SvgIcon)

// ==================== 挂载应用到 DOM ====================
app.mount('#app')
