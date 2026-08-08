/**
 * 表单渲染组件（render.tsx）
 * 功能：根据表单配置（conf/draw/rules）渲染 antd 表单预览，供页面表单设计器画布使用
 */
import {
  Button,
  Cascader,
  Checkbox,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Select,
  Slider,
  Switch,
  TimePicker,
  Row,
  Col
} from 'antd'
import type { ReactNode } from 'react'
import type { FormConf, FormItemConf } from './config'

export interface RenderProps {
  /** 表单全局配置 */
  conf: FormConf
  /** 校验规则 */
  rules?: Record<string, unknown[]>
  /** 画布组件列表 */
  draw?: FormItemConf[]
  /** 值变化回调（受控模式） */
  value?: Record<string, unknown>
  /** 值变化回调 */
  onChange?: (values: Record<string, unknown>) => void
  /** 组件点击选中回调 */
  onSelect?: (item: FormItemConf) => void
  /** 当前选中组件 id */
  activeId?: number | string
}

/**
 * 渲染单个表单项
 */
export function renderFormItem(el: FormItemConf, props: RenderProps): ReactNode {
  const { value = {}, onChange, onSelect, activeId } = props
  const active = activeId !== undefined && el.formId === activeId
  const style = {
    width: '100%',
    ...(el.style || {}),
    ...(active ? { border: '1px solid #409eff', boxShadow: '0 0 0 2px rgba(64,158,255,0.2)' } : {})
  }
  const fieldValue = el.vModel ? value[el.vModel] : undefined

  const clickWrap = (node: ReactNode) => (
    <div onClick={(e) => { e.stopPropagation(); onSelect && onSelect(el) }} style={{ cursor: 'pointer', width: '100%' }}>
      {node}
    </div>
  )

  const options = Array.isArray(el.options) ? el.options : []

  switch (el.tag) {
    case 'el-input':
      return clickWrap(
        <Input
          style={style}
          placeholder={el.placeholder}
          disabled={el.disabled}
          maxLength={el.maxlength}
          showCount={el['show-word-limit']}
          type={el.type}
          value={fieldValue as string}
          onChange={(e) => onChange && onChange({ ...value, [el.vModel as string]: e.target.value })}
        />
      )
    case 'el-input-number':
      return clickWrap(
        <InputNumber
          style={style}
          placeholder={el.placeholder}
          disabled={el.disabled}
          min={el.min}
          max={el.max}
          step={el.step}
          value={fieldValue as number}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-select':
      return clickWrap(
        <Select
          style={style}
          placeholder={el.placeholder}
          disabled={el.disabled}
          mode={el.multiple ? 'multiple' : undefined}
          allowClear={el.clearable}
          value={fieldValue}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        >
          {options.map((opt: any, i: number) => (
            <Select.Option key={i} value={opt.value}>
              {opt.label}
            </Select.Option>
          ))}
        </Select>
      )
    case 'el-radio-group':
      return clickWrap(
        <Radio.Group value={fieldValue} onChange={(e) => onChange && onChange({ ...value, [el.vModel as string]: e.target.value })}>
          {options.map((opt: any, i: number) => (
            <Radio key={i} value={opt.value}>
              {opt.label}
            </Radio>
          ))}
        </Radio.Group>
      )
    case 'el-checkbox-group':
      return clickWrap(
        <Checkbox.Group
          value={fieldValue as any[]}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        >
          {options.map((opt: any, i: number) => (
            <Checkbox key={i} value={opt.value}>
              {opt.label}
            </Checkbox>
          ))}
        </Checkbox.Group>
      )
    case 'el-switch':
      return clickWrap(
        <Switch
          checked={Boolean(fieldValue)}
          disabled={el.disabled}
          checkedChildren={el['active-text']}
          unCheckedChildren={el['inactive-text']}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-slider':
      return clickWrap(
        <Slider
          min={el.min}
          max={el.max}
          step={el.step}
          range={el.range}
          value={fieldValue as number}
          onChange={(v: number | [number, number]) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-time-picker':
      return clickWrap(
        <TimePicker
          style={style}
          format={el.format}
          placeholder={el.placeholder}
          value={fieldValue as any}
          onChange={(v: any) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-date-picker':
      return clickWrap(
        <DatePicker
          style={style}
          format={el.format}
          placeholder={el.placeholder}
          picker={el.type === 'daterange' ? undefined : 'date'}
          value={fieldValue as any}
          onChange={(v: any) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-rate':
      return clickWrap(
        <Rate
          allowHalf={el['allow-half']}
          value={fieldValue as number}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-color-picker':
      return clickWrap(
        <ColorPicker value={fieldValue as any} onChange={(v: any) => onChange && onChange({ ...value, [el.vModel as string]: v.toHexString() })} />
      )
    case 'el-cascader':
      return clickWrap(
        <Cascader
          style={style}
          options={options}
          placeholder={el.placeholder}
          value={fieldValue as any[]}
          onChange={(v) => onChange && onChange({ ...value, [el.vModel as string]: v })}
        />
      )
    case 'el-button':
      return clickWrap(
        <Button type={el.type} disabled={el.disabled}>
          {el.default || '主要按钮'}
        </Button>
      )
    case 'el-upload':
      return clickWrap(
        <Button disabled={el.disabled}>{el.buttonText || '点击上传'}</Button>
      )
    default:
      return clickWrap(<div>未知组件：{el.tag}</div>)
  }
}

/**
 * 表单预览渲染组件
 */
export default function RenderForm(props: RenderProps) {
  const { conf, draw = [], value = {}, onChange, onSelect, activeId } = props

  const renderChildren = (list: FormItemConf[]): ReactNode => {
    return list.map((el) => {
      if (el.layout === 'rowFormItem') {
        const gutter = el.gutter || conf.gutter || 15
        const children = el.children || []
        return (
          <Row gutter={gutter} key={el.formId}>
            {children.map((child) => (
              <Col span={child.span || 24} key={child.formId}>
                {child.layout === 'colFormItem' ? (
                  <Form.Item
                    key={child.formId}
                    label={child.label}
                    required={child.required}
                    style={{ cursor: 'pointer' }}
                  >
                    {renderFormItem(child, props)}
                  </Form.Item>
                ) : (
                  renderChildren([child])
                )}
              </Col>
            ))}
          </Row>
        )
      }
      // colFormItem
      return (
        <Col span={el.span || 24} key={el.formId}>
          <Form.Item label={el.label} required={el.required} style={{ marginBottom: 8 }}>
            {renderFormItem(el, props)}
          </Form.Item>
        </Col>
      )
    })
  }

  return (
    <Form layout="horizontal" labelCol={{ style: { width: conf.labelWidth || 100 } }} style={{ padding: 10 }}>
      <Row gutter={conf.gutter || 15}>{renderChildren(draw)}</Row>
      {conf.formBtns && (
        <Form.Item>
          <Button type="primary" style={{ marginRight: 8 }}>
            提交
          </Button>
          <Button>重置</Button>
        </Form.Item>
      )}
    </Form>
  )
}
