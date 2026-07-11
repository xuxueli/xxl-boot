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
