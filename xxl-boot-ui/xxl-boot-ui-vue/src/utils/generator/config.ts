/**
 * 组件元数据与常量中心（generator/config）
 * 提供表单全局配置、可拖拽组件注册表、校验触发方式映射与 js-beautify 格式化配置。
 */
import { readonly } from 'vue'
import { t } from '@/i18n'
/**
 * 正则校验项
 */
export interface RegItemConf {
  /** 正则表达式 */
  pattern?: string
  /** 错误提示 */
  message?: string
}

/**
 * 表单组件配置（单个表单项 / 布局项）
 * 键名采用 kebab-case（如 prefix-icon），通过索引签名任意取值（any 兜底）
 */
export interface FormItemConf {
  /** 展示标题 */
  label?: string
  /** 组件标签名，如 el-input */
  tag?: string
  /** 布局类型：colFormItem / rowFormItem */
  layout?: string
  /** 字段名（v-model 绑定） */
  vModel?: string
  /** 组件实例 ID */
  formId?: number | string
  /** 渲染 key（强制刷新） */
  renderKey?: number | string
  /** 组件名（行容器） */
  componentName?: string
  /** 子组件列表（行容器） */
  children?: FormItemConf[]
  /** 默认值 */
  defaultValue?: any
  /** 正则校验列表 */
  regList?: any
  /** 其他属性（含 tagIcon、kebab-case 键等） */
  [key: string]: any
}

/**
 * 表单全局配置
 */
export interface FormConf {
  /** 表单 ref 名称 */
  formRef: string
  /** 数据模型名称 */
  formModel: string
  /** 表单尺寸 */
  size: any
  /** 标签对齐方式 */
  labelPosition: any
  /** 标签宽度 */
  labelWidth: any
  /** 校验模型名称 */
  formRules: string
  /** 栅格间隔 */
  gutter: any
  /** 是否禁用 */
  disabled: any
  /** 栅格跨度 */
  span: any
  /** 是否显示表单按钮 */
  formBtns: any
  /** 是否显示未选中组件边框 */
  unFocusedComponentBorder?: any
  /** 字段列表（画布中的组件） */
  fields?: FormItemConf[]
  /** 其他属性 */
  [key: string]: any
}

export const formConf: FormConf = {
  formRef: 'formRef',
  formModel: 'formData',
  size: 'default',
  labelPosition: 'right',
  labelWidth: 100,
  formRules: 'rules',
  gutter: 15,
  disabled: false,
  span: 24,
  formBtns: true
}

export const inputComponents: FormItemConf[] = [
  {
    label: t('tool.pagegen.cmpInput'),
    tag: 'el-input',
    tagIcon: 'input',
    type: 'text',
    placeholder: t('tool.pagegen.enterPlaceholder'),
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/input'
  },
  {
    label: t('tool.pagegen.cmpTextarea'),
    tag: 'el-input',
    tagIcon: 'textarea',
    type: 'textarea',
    placeholder: t('tool.pagegen.enterPlaceholder'),
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    autosize: {
      minRows: 4,
      maxRows: 4
    },
    style: { width: '100%' },
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/input'
  },
  {
    label: t('tool.pagegen.cmpPassword'),
    tag: 'el-input',
    tagIcon: 'password',
    type: 'password',
    placeholder: t('tool.pagegen.enterPlaceholder'),
    defaultValue: undefined,
    span: 24,
    'show-password': true,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    prepend: '',
    append: '',
    'prefix-icon': '',
    'suffix-icon': '',
    maxlength: null,
    'show-word-limit': false,
    readonly: false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/input'
  },
  {
    label: t('tool.pagegen.cmpNumber'),
    tag: 'el-input-number',
    tagIcon: 'number',
    placeholder: '',
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    min: undefined,
    max: undefined,
    step: undefined,
    'step-strictly': false,
    precision: undefined,
    'controls-position': '',
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/input-number'
  }
]

export const selectComponents: FormItemConf[] = [
  {
    label: t('tool.pagegen.cmpSelect'),
    tag: 'el-select',
    tagIcon: 'select',
    placeholder: t('common.selectPlaceholder'),
    defaultValue: undefined,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    clearable: true,
    disabled: false,
    required: true,
    filterable: false,
    multiple: false,
    options: [
      {
        label: t('tool.pagegen.optionFirst'),
        value: 1
      },
      {
        label: t('tool.pagegen.optionSecond'),
        value: 2
      }
    ],
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/select'
  },
  {
    label: t('tool.pagegen.cmpCascader'),
    tag: 'el-cascader',
    tagIcon: 'cascader',
    placeholder: t('common.selectPlaceholder'),
    defaultValue: [],
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    props: {
      props: {
        multiple: false
      }
    },
    'show-all-levels': true,
    disabled: false,
    clearable: true,
    filterable: false,
    required: true,
    options: [
      {
        id: 1,
        value: 1,
        label: t('tool.pagegen.optionOne'),
        children: [
          {
            id: 2,
            value: 2,
            label: t('tool.pagegen.optionOneSub')
          }
        ]
      }
    ],
    dataType: 'dynamic',
    labelKey: 'label',
    valueKey: 'value',
    childrenKey: 'children',
    separator: '/',
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/cascader'
  },
  {
    label: t('tool.pagegen.cmpRadioGroup'),
    tag: 'el-radio-group',
    tagIcon: 'radio',
    defaultValue: 0,
    span: 24,
    labelWidth: null,
    style: {},
    optionType: 'default',
    border: false,
    size: 'default',
    disabled: false,
    required: true,
    options: [
      {
        label: t('tool.pagegen.optionFirst'),
        value: 1
      },
      {
        label: t('tool.pagegen.optionSecond'),
        value: 2
      }
    ],
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/radio'
  },
  {
    label: t('tool.pagegen.cmpCheckboxGroup'),
    tag: 'el-checkbox-group',
    tagIcon: 'checkbox',
    defaultValue: [],
    span: 24,
    labelWidth: null,
    style: {},
    optionType: 'default',
    border: false,
    size: 'default',
    disabled: false,
    required: true,
    options: [
      {
        label: t('tool.pagegen.optionFirst'),
        value: 1
      },
      {
        label: t('tool.pagegen.optionSecond'),
        value: 2
      }
    ],
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/checkbox'
  },
  {
    label: t('tool.pagegen.cmpSwitch'),
    tag: 'el-switch',
    tagIcon: 'switch',
    defaultValue: false,
    span: 24,
    labelWidth: null,
    style: {},
    disabled: false,
    required: true,
    'active-text': '',
    'inactive-text': '',
    'active-color': null,
    'inactive-color': null,
    'active-value': true,
    'inactive-value': false,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/switch'
  },
  {
    label: t('tool.pagegen.cmpSlider'),
    tag: 'el-slider',
    tagIcon: 'slider',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    disabled: false,
    required: true,
    min: 0,
    max: 100,
    step: 1,
    'show-stops': false,
    range: false,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/slider'
  },
  {
    label: t('tool.pagegen.cmpTimePicker'),
    tag: 'el-time-picker',
    tagIcon: 'time',
    placeholder: t('common.selectPlaceholder'),
    defaultValue: '',
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/time-picker'
  },
  {
    label: t('tool.pagegen.cmpTimeRange'),
    tag: 'el-time-picker',
    tagIcon: 'time-range',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    'is-range': true,
    'range-separator': t('tool.pagegen.rangeSeparator'),
    'start-placeholder': t('tool.pagegen.startTime'),
    'end-placeholder': t('tool.pagegen.endTime'),
    format: 'HH:mm:ss',
    'value-format': 'HH:mm:ss',
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/time-picker'
  },
  {
    label: t('tool.pagegen.cmpDatePicker'),
    tag: 'el-date-picker',
    tagIcon: 'date',
    placeholder: t('common.selectPlaceholder'),
    defaultValue: null,
    type: 'date',
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    disabled: false,
    clearable: true,
    required: true,
    format: 'YYYY-MM-DD',
    'value-format': 'YYYY-MM-DD',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/date-picker'
  },
  {
    label: t('tool.pagegen.cmpDateRange'),
    tag: 'el-date-picker',
    tagIcon: 'date-range',
    defaultValue: null,
    span: 24,
    labelWidth: null,
    style: { width: '100%' },
    type: 'daterange',
    'range-separator': t('tool.pagegen.rangeSeparator'),
    'start-placeholder': t('tool.pagegen.startDate'),
    'end-placeholder': t('tool.pagegen.endDate'),
    disabled: false,
    clearable: true,
    required: true,
    format: 'YYYY-MM-DD',
    'value-format': 'YYYY-MM-DD',
    readonly: false,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/date-picker'
  },
  {
    label: t('tool.pagegen.cmpRate'),
    tag: 'el-rate',
    tagIcon: 'rate',
    defaultValue: 0,
    span: 24,
    labelWidth: null,
    style: {},
    max: 5,
    'allow-half': false,
    'show-text': false,
    'show-score': false,
    disabled: false,
    required: true,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/rate'
  },
  {
    label: t('tool.pagegen.cmpColorPicker'),
    tag: 'el-color-picker',
    tagIcon: 'color',
    defaultValue: null,
    labelWidth: null,
    'show-alpha': false,
    'color-format': '',
    disabled: false,
    required: true,
    size: 'default',
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/color-picker'
  },
  {
    label: t('tool.pagegen.cmpUpload'),
    tag: 'el-upload',
    tagIcon: 'upload',
    action: 'https://jsonplaceholder.typicode.com/posts/',
    defaultValue: null,
    labelWidth: null,
    disabled: false,
    required: true,
    accept: '',
    name: 'file',
    'auto-upload': true,
    showTip: false,
    buttonText: t('tool.pagegen.uploadButton'),
    fileSize: 2,
    sizeUnit: 'MB',
    'list-type': 'text',
    multiple: false,
    regList: [],
    changeTag: true,
    document: 'https://element-plus.org/zh-CN/component/upload',
    tip: t('tool.pagegen.uploadTip'),
    style: { width: '100%' }
  }
]

export const layoutComponents: FormItemConf[] = [
  {
    layout: 'rowFormItem',
    tagIcon: 'row',
    type: 'default',
    justify: 'start',
    align: 'top',
    label: t('tool.pagegen.cmpRow'),
    layoutTree: true,
    children: [],
    document: 'https://element-plus.org/zh-CN/component/layout'
  },
  {
    layout: 'colFormItem',
    label: t('tool.pagegen.cmpButton'),
    changeTag: true,
    labelWidth: null,
    tag: 'el-button',
    tagIcon: 'button',
    span: 24,
    default: t('tool.pagegen.primaryButton'),
    type: 'primary',
    icon: 'Search',
    size: 'default',
    disabled: false,
    document: 'https://element-plus.org/zh-CN/component/button'
  }
]

// 组件rule的触发方式，无触发方式的组件不生成rule
export const trigger: Record<string, string> = {
  'el-input': 'blur',
  'el-input-number': 'blur',
  'el-select': 'change',
  'el-radio-group': 'change',
  'el-checkbox-group': 'change',
  'el-cascader': 'change',
  'el-time-picker': 'change',
  'el-date-picker': 'change',
  'el-rate': 'change'
}

/**
 * 构建字符串集合的快速查找函数（O(1)）
 *
 * @param {string}  str              - 逗号分隔的字符串
 * @param {boolean} [expectsLowerCase] - true 时查找时转小写
 * @returns {Function} val => boolean
 *
 * 示例：
 *   const isColor = makeMap('red,green,blue')
 *   isColor('red')   // true
 */
export function makeMap(str: string, expectsLowerCase?: boolean): (val: string) => boolean {
  const map: Record<string, boolean> = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase ? (val: string) => map[val.toLowerCase()] : (val: string) => map[val]
}

/**
 * 代码生成器：js-beautify 格式化配置
 *
 * HTML / JS 两套选项，缩进 2 空格，行宽 110。
 */
export const beautifierConf: {
  html: Record<string, any>
  js: Record<string, any>
} = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}
