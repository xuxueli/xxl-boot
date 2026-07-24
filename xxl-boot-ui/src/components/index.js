/**
 * 全局注册组件
 */
import SvgIcon from '@/components/SvgIcon'
import RightToolbar from '@/components/RightToolbar'
import Pagination from '@/components/Pagination'
import DictTag from '@/components/DictTag'
import IconSelect from '@/components/IconSelect'
import TreePanel from '@/components/TreePanel'
import Editor from '@/components/Editor'
import ExcelImportDialog from '@/components/ExcelImportDialog'
import FileUpload from '@/components/FileUpload'
import ImagePreview from '@/components/ImagePreview'
import ImageUpload from '@/components/ImageUpload'
import IFrame from '@/components/iFrame'

// Element Plus 图标（全局注册）
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

export default function registerComponents(app) {

  // 全局注册：Element Plus 图标
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  // 全局注册：自定义业务组件
  app.component('SvgIcon', SvgIcon)                         // SVG 图标
  app.component('RightToolbar', RightToolbar)               // 表格工具栏（搜索/刷新/列显隐）
  app.component('Pagination', Pagination)                   // 分页
  app.component('DictTag', DictTag)                         // 字典标签：字典值 → el-tag 渲染
  app.component('IconSelect', IconSelect)                   // SVG 图标选择器
  app.component('TreePanel', TreePanel)                     // 树形侧栏面板
  app.component('Editor', Editor)                           // 富文本编辑器（Quill）
  app.component('ExcelImportDialog', ExcelImportDialog)     // Excel 导入弹窗
  app.component('FileUpload', FileUpload)                   // 文件上传
  app.component('ImagePreview', ImagePreview)               // 图片预览
  app.component('ImageUpload', ImageUpload)                 // 图片上传
  app.component('IFrame', IFrame)                           // iframe 内嵌页面容器
}
