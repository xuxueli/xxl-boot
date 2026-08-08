/**
 * JS 逻辑代码生成（generator/js）
 * 根据表单配置生成 React 组件的数据/校验逻辑代码字符串。
 */
import { titleCase } from '@/utils/common'
import { trigger } from './config'
import type { FormConf, FormItemConf } from './config'

/**
 * 生成 React 组件的数据/逻辑代码
 * @param conf 表单配置（含 fields）
 * @param type 生成类型（file/dialog 等）
 * @returns 代码字符串
 */
export function makeUpJs(conf: FormConf & { fields: FormItemConf[] }, type: string): string {
  const dataList: string[] = []
  const ruleList: string[] = []
  const optionsList: string[] = []

  conf.fields.forEach((el) => {
    buildData(el, dataList)
    buildOptions(el, optionsList)
    buildRules(el, ruleList)
    if (el.children && el.children.length) {
      el.children.forEach((el2) => {
        buildData(el2, dataList)
        buildOptions(el2, optionsList)
        buildRules(el2, ruleList)
      })
    }
  })

  const formModel = conf.formModel
  const formDataStr = dataList.length ? dataList.join('\n') : ''
  const rulesStr = ruleList.length ? `const ${conf.formRules} = {\n${ruleList.join('\n')}\n}` : ''
  const optionsStr = optionsList.length ? optionsList.join('\n') : ''

  return `  // 表单数据
  const [${formModel}, setFormData] = useState({
${formDataStr}
  })
${rulesStr}
${optionsStr}`
}

/**
 * 生成字段初始值数据
 */
function buildData(conf: FormItemConf, dataList: string[]) {
  let defaultValue: any = conf.defaultValue
  if (defaultValue === undefined) {
    defaultValue = null
  }
  dataList.push(`    ${conf.vModel}: ${JSON.stringify(defaultValue)},`)
}

/**
 * 生成校验规则
 */
function buildRules(conf: FormItemConf, ruleList: string[]) {
  const rules: string[] = []
  if (conf.required) {
    const type = trigger[conf.tag!] ? `, type: '${trigger[conf.tag!]}'` : ''
    rules.push(`{ required: true, message: '${conf.label}不能为空'${type} }`)
  }
  if (conf.regList && conf.regList.length) {
    conf.regList.forEach((item: any) => {
      const pattern = item.pattern && item.pattern.startsWith('/')
        ? item.pattern
        : `new RegExp(${JSON.stringify(item.pattern)})`
      rules.push(`{ pattern: ${pattern}, message: '${item.message}' }`)
    })
  }
  if (rules.length) {
    ruleList.push(`    ${conf.vModel}: [\n      ${rules.join(',\n      ')}\n    ],`)
  }
}

/**
 * 生成动态选项（级联等）
 */
function buildOptions(conf: FormItemConf, optionsList: string[]) {
  if (conf.dataType === 'dynamic' && conf.options && conf.options.length) {
    optionsList.push(`  const ${conf.vModel}Options = ${JSON.stringify(conf.options)}`)
  }
}
