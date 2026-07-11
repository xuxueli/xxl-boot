import SvgIcon from '@/components/SvgIcon'
import RightToolbar from '@/components/RightToolbar'
import Pagination from '@/components/Pagination'
import DictTag from '@/components/DictTag'
import Editor from '@/components/Editor'
import FileUpload from '@/components/FileUpload'
import ImageUpload from '@/components/ImageUpload'
import ImagePreview from '@/components/ImagePreview'

export default function registerComponents(app) {
  app.component('svg-icon', SvgIcon)
  app.component('RightToolbar', RightToolbar)
  app.component('Pagination', Pagination)
  app.component('DictTag', DictTag)
  app.component('Editor', Editor)
  app.component('FileUpload', FileUpload)
  app.component('ImageUpload', ImageUpload)
  app.component('ImagePreview', ImagePreview)
}
