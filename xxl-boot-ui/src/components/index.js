/**
 * 名称：全局组件注册入口
 * 功能：集中注册项目中常用的全局组件，避免在每个页面重复 import
 *
 * 注册列表：
 *   svg-icon       — SVG 图标组件
 *   RightToolbar   — 表格操作工具栏（搜索/重置/列显隐等）
 *   Pagination     — 分页组件（与后端分页参数联动）
 *   DictTag        — 数据字典标签（字典编码 → 标签渲染）
 */
import SvgIcon from '@/components/SvgIcon'
import RightToolbar from '@/components/RightToolbar'
import Pagination from '@/components/Pagination'
import DictTag from '@/components/DictTag'

export default function registerComponents(app) {
  app.component('svg-icon', SvgIcon)
  app.component('RightToolbar', RightToolbar)
  app.component('Pagination', Pagination)
  app.component('DictTag', DictTag)
}
