/**
 * 全局注册自定义指令
  */
import hasRole from './hasRole'
import hasPermi from './hasPermi'
import copyText from './copyText'

export default function directive(app){
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}