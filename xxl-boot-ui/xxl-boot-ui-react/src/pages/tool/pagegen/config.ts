/**
 * 表单生成器配置（pagegen/config）
 * 提供组件类型定义、左侧组件库分组、默认组件工厂与表单全局配置。
 */

/**
 * 组件类型
 * 输入型：input/textarea/password/number；选择型：select/cascader/radio/checkbox/switch/slider/time/time-range/date/date-range/rate/color/upload；布局型：row/button
 */
export type WidgetType =
  | 'input'
  | 'textarea'
  | 'password'
  | 'number'
  | 'select'
  | 'cascader'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'time'
  | 'time-range'
  | 'date'
  | 'date-range'
  | 'rate'
  | 'color'
  | 'upload'
  | 'row'
  | 'button';

/**
 * 画布表单项配置
 * 布局型 row 通过 children 承载子组件，其余组件渲染为普通表单项。
 */
export interface FormWidget {
  id: number /* 组件实例 ID */;
  type: WidgetType /* 组件类型 */;
  vModel?: string /* 字段名（v-model 绑定） */;
  label: string /* 展示标题 */;
  placeholder?: string /* 占位提示 */;
  required?: boolean /* 是否必填 */;
  options?: string[] /* 选项列表（select/cascader/radio/checkbox） */;
  span?: number /* 表单栅格跨度（1-24） */;
  min?: number /* 最小值（slider） */;
  max?: number /* 最大值（slider/rate） */;
  step?: number /* 步长（slider） */;
  maxLength?: number /* 最大长度（rate 默认 5，可配置） */;
  gutter?: number /* 行容器栅格间隔 */;
  buttonType?: 'primary' | 'default' | 'dashed' | 'text' /* 按钮类型 */;
  uploadText?: string /* 上传按钮文字 */;
  children?: FormWidget[] /* 行容器子组件列表 */;
}

/**
 * 表单全局配置
 */
export interface FormConfig {
  formRef: string /* 表单 ref 名称 */;
  formModel: string /* 数据模型名称 */;
  formRules: string /* 校验模型名称 */;
  labelWidth: number /* 标签宽度 */;
  layout: 'horizontal' | 'vertical' | 'inline' /* 表单布局 */;
  size: 'small' | 'middle' | 'large' /* 表单尺寸 */;
  gutter: number /* 栅格间隔 */;
  disabled: boolean /* 是否禁用 */;
  formBtns: boolean /* 是否显示表单按钮 */;
}

/** 组件中文标题 */
export const widgetTitles: Record<WidgetType, string> = {
  input: '单行文本',
  textarea: '多行文本',
  password: '密码输入',
  number: '数字输入',
  select: '下拉选择',
  cascader: '级联选择',
  radio: '单选框组',
  checkbox: '多选框组',
  switch: '开关',
  slider: '滑块',
  time: '时间选择',
  'time-range': '时间范围',
  date: '日期选择',
  'date-range': '日期范围',
  rate: '评分',
  color: '颜色选择',
  upload: '上传',
  row: '行容器',
  button: '按钮',
};

/** 组件库分组（选择型） */
export const selectGroups: WidgetType[] = [
  'select',
  'cascader',
  'radio',
  'checkbox',
  'switch',
  'slider',
  'time',
  'time-range',
  'date',
  'date-range',
  'rate',
  'color',
  'upload',
];

/** 组件库分组（输入型） */
export const inputGroups: WidgetType[] = [
  'input',
  'textarea',
  'password',
  'number',
];

/** 组件库分组（布局型） */
export const layoutGroups: WidgetType[] = ['row', 'button'];

/** 组件库类型列表 */
export const paletteGroups: { title: string; types: WidgetType[] }[] = [
  { title: '输入型组件', types: inputGroups },
  { title: '选择型组件', types: selectGroups },
  { title: '布局型组件', types: layoutGroups },
];

/** 表单全局配置默认值 */
export const defaultFormConfig: FormConfig = {
  formRef: 'formRef',
  formModel: 'formData',
  formRules: 'rules',
  labelWidth: 100,
  layout: 'horizontal',
  size: 'middle',
  gutter: 15,
  disabled: false,
  formBtns: true,
};

/**
 * 创建默认组件
 * @param type - 组件类型
 * @param id   - 组件实例 ID
 * @returns 默认组件配置
 */
export function createWidget(type: WidgetType, id: number): FormWidget {
  if (type === 'row') {
    return {
      id,
      type,
      label: widgetTitles.row,
      gutter: 15,
      span: 24,
      children: [],
    };
  }
  if (type === 'button') {
    return {
      id,
      type,
      label: '确定',
      buttonType: 'primary',
      span: 24,
    };
  }
  /* 带选项的组件 */
  if (['select', 'cascader', 'radio', 'checkbox'].includes(type)) {
    return {
      id,
      type,
      vModel: `field${id}`,
      label: widgetTitles[type],
      placeholder: '请选择',
      required: true,
      options: ['选项一', '选项二'],
      span: 24,
    };
  }
  /* 数值类组件（slider 单独配置 min/max/step） */
  if (type === 'slider') {
    return {
      id,
      type,
      vModel: `field${id}`,
      label: widgetTitles[type],
      required: true,
      min: 0,
      max: 100,
      step: 1,
      span: 24,
    };
  }
  if (type === 'rate') {
    return {
      id,
      type,
      vModel: `field${id}`,
      label: widgetTitles[type],
      required: true,
      maxLength: 5,
      span: 24,
    };
  }
  /* 上传组件 */
  if (type === 'upload') {
    return {
      id,
      type,
      vModel: `field${id}`,
      label: widgetTitles[type],
      required: true,
      span: 24,
      uploadText: '点击上传',
    };
  }
  return {
    id,
    type,
    vModel: `field${id}`,
    label: widgetTitles[type],
    placeholder: '请输入',
    required: false,
    span: 24,
  };
}

/** 是否选项型组件 */
export function isChoiceType(type: WidgetType): boolean {
  return ['select', 'cascader', 'radio', 'checkbox'].includes(type);
}
