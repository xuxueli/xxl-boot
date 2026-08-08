/**
 * JSX 模板代码生成（generator/html）
 * 根据表单配置生成 React + antd 的 JSX 模板字符串。
 */
import { trigger } from './config'
import type { FormConf, FormItemConf } from './config'

let confGlobal: (FormConf & { fields: FormItemConf[] }) | null = null

export function dialogWrapper(str: string): string {
  return `      <Modal open={dialogVisible} title="Dialog Title" onCancel={close} onOk={handelConfirm} destroyOnClose>
        ${str}
      </Modal>`
}

export function vueTemplate(str: string): string {
  return `  return (
    <div className="app-container">
      ${str}
    </div>
  )
}`
}

export function vueScript(str: string): string {
  return `export default function FormPage() {
  const [form] = Form.useForm()
  const [dialogVisible, setDialogVisible] = useState(false)
  const onOpen = () => {}
  const onClose = () => setDialogVisible(false)
  const close = () => setDialogVisible(false)
  const handelConfirm = () => {}
  const submitForm = () => { form.validateFields().then((values) => { console.log(values) }) }
  const resetForm = () => { form.resetFields() }
  ${str}`
}

export function cssStyle(cssStr: string): string {
  return `const styles = \`${cssStr}\``
}

function buildFormTemplate(conf: FormConf, child: string, type: string): string {
  let str = `      <Form form={form} name="${conf.formRef}" labelCol={{ style: { width: ${conf.labelWidth} } }}>
        ${child}
        ${buildFromBtns(conf, type)}
      </Form>`
  if (someSpanIsNot24) {
    str = `      <Row gutter={${conf.gutter}}>
        ${str}
      </Row>`
  }
  return str
}

let someSpanIsNot24 = false

function buildFromBtns(conf: FormConf, type: string): string {
  let str = ''
  if (conf.formBtns && type === 'file') {
    str = `        <Form.Item>
          <Button type="primary" onClick={submitForm}>提交</Button>
          <Button style={{ marginLeft: 8 }} onClick={resetForm}>重置</Button>
        </Form.Item>`
    if (someSpanIsNot24) {
      str = `        <Col span={24}>
          ${str}
        </Col>`
    }
  }
  return str
}

function colWrapper(element: FormItemConf, str: string): string {
  if (someSpanIsNot24 || element.span !== 24) {
    return `      <Col span={${element.span}}>
        ${str}
      </Col>`
  }
  return str
}

const layouts: Record<string, (element: FormItemConf) => string> = {
  colFormItem(element: FormItemConf): string {
    const required = !trigger[element.tag!] && element.required ? 'required' : ''
    const tagFn = element.tag ? tags[element.tag] : undefined
    const tagDom = tagFn ? tagFn(element) : null
    let str = `        <Form.Item label="${element.label}" name="${element.vModel}" ${required}>
          ${tagDom}
        </Form.Item>`
    str = colWrapper(element, str)
    return str
  },
  rowFormItem(element: FormItemConf): string {
    const gutter = element.gutter ? `gutter={${element.gutter}}` : ''
    const children = element.children!.map((el) => layouts[el.layout!](el))
    let str = `      <Row ${gutter}>
        ${children.join('\n')}
      </Row>`
    str = colWrapper(element, str)
    return str
  }
}

const tags: Record<string, (el: FormItemConf) => string> = {
  'el-button': (el) => {
    const type = el.type ? `type="${el.type}"` : ''
    const disabled = el.disabled ? ' disabled' : ''
    return `<Button ${type}${disabled}>${el.default || '主要按钮'}</Button>`
  },
  'el-input': (el) => {
    const type = el.type && el.type !== 'text' ? ` type={${JSON.stringify(el.type)}}` : ''
    const showCount = el['show-word-limit'] ? ' showCount' : ''
    const maxLength = el.maxlength ? ` maxLength={${el.maxlength}}` : ''
    const disabled = el.disabled ? ' disabled' : ''
    const placeholder = el.placeholder ? ` placeholder="${el.placeholder}"` : ''
    return `<Input${type}${placeholder}${maxLength}${showCount}${disabled} />`
  },
  'el-input-number': (el) => {
    const min = el.min !== undefined ? ` min={${el.min}}` : ''
    const max = el.max !== undefined ? ` max={${el.max}}` : ''
    const step = el.step ? ` step={${el.step}}` : ''
    const disabled = el.disabled ? ' disabled' : ''
    return `<InputNumber style={{ width: '100%' }}${min}${max}${step}${disabled} />`
  },
  'el-select': (el) => {
    const mode = el.multiple ? ` mode="multiple"` : ''
    const filterable = el.filterable ? ' showSearch' : ''
    const allowClear = el.clearable ? ' allowClear' : ''
    const disabled = el.disabled ? ' disabled' : ''
    const placeholder = el.placeholder ? ` placeholder="${el.placeholder}"` : ''
    const options = el.options && el.options.length
      ? el.options.map((o: any) => `<Select.Option key="${o.value}" value={${JSON.stringify(o.value)}}>${o.label}</Select.Option>`).join('\n')
      : ''
    return `<Select style={{ width: '100%' }}${mode}${filterable}${allowClear}${disabled}${placeholder}>
        ${options}
      </Select>`
  },
  'el-radio-group': (el) => {
    const options = el.options && el.options.length
      ? el.options.map((o: any) => `<Radio value={${JSON.stringify(o.value)}}>${o.label}</Radio>`).join('\n')
      : ''
    return `<Radio.Group>
        ${options}
      </Radio.Group>`
  },
  'el-checkbox-group': (el) => {
    const options = el.options && el.options.length
      ? el.options.map((o: any) => `<Checkbox value={${JSON.stringify(o.value)}}>${o.label}</Checkbox>`).join('\n')
      : ''
    return `<Checkbox.Group>
        ${options}
      </Checkbox.Group>`
  },
  'el-switch': (el) => {
    const disabled = el.disabled ? ' disabled' : ''
    return `<Switch${disabled} />`
  },
  'el-slider': (el) => {
    return `<Slider />`
  },
  'el-time-picker': (el) => {
    const placeholder = el.placeholder ? ` placeholder="${el.placeholder}"` : ''
    return `<TimePicker${placeholder} />`
  },
  'el-date-picker': (el) => {
    const placeholder = el.placeholder ? ` placeholder="${el.placeholder}"` : ''
    return `<DatePicker${placeholder} />`
  },
  'el-rate': (el) => `<Rate />`,
  'el-color-picker': (el) => `<ColorPicker />`,
  'el-cascader': (el) => `<Cascader options={[]} />`,
  'el-upload': (el) => `<Button>${el.buttonText || '点击上传'}</Button>`
}

export function makeUpHtml(conf: FormConf & { fields: FormItemConf[] }, type: string): string {
  const htmlList: string[] = []
  confGlobal = conf
  someSpanIsNot24 = conf.fields.some((item) => item.span !== 24)
  conf.fields.forEach((el) => {
    htmlList.push(layouts[el.layout!](el))
  })
  const htmlStr = htmlList.join('\n')
  let temp = buildFormTemplate(conf, htmlStr, type)
  if (type === 'dialog') {
    temp = dialogWrapper(temp)
  }
  confGlobal = null
  return temp
}
