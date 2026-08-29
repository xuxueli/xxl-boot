/**
 * 组件：RightPanel（右侧属性面板）
 * 功能：组件属性 / 表单属性 双 Tab，选中画布组件时联动展示并支持编辑
 */
import {
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Slider,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import React from 'react';
import type { FormConfig, FormWidget, WidgetType } from './config';
import {
  isChoiceType,
  supportsPlaceholder,
  supportsRequired,
  widgetTitles,
} from './config';

/**
 * 右侧属性面板
 * @param props.activeData   当前选中组件
 * @param props.formConfig   表单全局配置
 * @param props.onWidgetChange 组件属性变更回调
 * @param props.onFormChange   表单属性变更回调
 */
const RightPanel = ({
  activeData,
  formConfig,
  onWidgetChange,
  onFormChange,
}: {
  activeData?: FormWidget;
  formConfig: FormConfig;
  onWidgetChange: (patch: Partial<FormWidget>) => void;
  onFormChange: (patch: Partial<FormConfig>) => void;
}) => {
  const renderComponentProps = () => {
    if (!activeData) {
      return (
        <div
          style={{
            color: 'rgba(0,0,0,0.25)',
            textAlign: 'center',
            padding: '40px 0',
          }}
        >
          请选择画布中的组件
        </div>
      );
    }
    const type: WidgetType = activeData.type;
    return (
      <Form layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label="组件类型">
          <Tag color="blue">{widgetTitles[type]}</Tag>
        </Form.Item>
        {type !== 'row' && type !== 'button' && (
          <Form.Item label="字段名">
            <Input
              value={activeData.vModel}
              onChange={(e) => onWidgetChange({ vModel: e.target.value })}
              placeholder="请输入字段名"
            />
          </Form.Item>
        )}
        {type !== 'row' && (
          <Form.Item label="标题">
            <Input
              value={activeData.label}
              onChange={(e) => onWidgetChange({ label: e.target.value })}
              placeholder="请输入标题"
            />
          </Form.Item>
        )}
        {supportsPlaceholder(type) && (
          <Form.Item label="占位提示">
            <Input
              value={activeData.placeholder}
              onChange={(e) => onWidgetChange({ placeholder: e.target.value })}
              placeholder="请输入占位提示"
            />
          </Form.Item>
        )}
        {isChoiceType(type) && (
          <Form.Item label="选项">
            <Select
              mode="tags"
              value={activeData.options}
              onChange={(options) => onWidgetChange({ options })}
              placeholder="输入后回车添加选项"
            />
          </Form.Item>
        )}
        {/* 行容器专属：栅格间隔 */}
        {type === 'row' && (
          <Form.Item label="栅格间隔">
            <InputNumber
              style={{ width: '100%' }}
              value={activeData.gutter}
              min={0}
              onChange={(gutter) => onWidgetChange({ gutter: gutter ?? 0 })}
            />
          </Form.Item>
        )}
        {/* 按钮专属：按钮类型 */}
        {type === 'button' && (
          <Form.Item label="按钮类型">
            <Radio.Group
              value={activeData.buttonType}
              onChange={(e) => onWidgetChange({ buttonType: e.target.value })}
              options={[
                { value: 'primary', label: '主色' },
                { value: 'default', label: '默认' },
                { value: 'dashed', label: '虚线' },
                { value: 'text', label: '文本' },
              ]}
            />
          </Form.Item>
        )}
        {supportsRequired(type) && (
          <Form.Item label="必填">
            <Switch
              checked={activeData.required}
              onChange={(required) => onWidgetChange({ required })}
            />
          </Form.Item>
        )}
        {type === 'slider' && (
          <>
            <Form.Item label="最小值">
              <InputNumber
                style={{ width: '100%' }}
                value={activeData.min}
                onChange={(min) => onWidgetChange({ min: min ?? 0 })}
              />
            </Form.Item>
            <Form.Item label="最大值">
              <InputNumber
                style={{ width: '100%' }}
                value={activeData.max}
                onChange={(max) => onWidgetChange({ max: max ?? 100 })}
              />
            </Form.Item>
            <Form.Item label="步长">
              <InputNumber
                style={{ width: '100%' }}
                value={activeData.step}
                min={1}
                onChange={(step) => onWidgetChange({ step: step ?? 1 })}
              />
            </Form.Item>
          </>
        )}
        {type === 'rate' && (
          <Form.Item label="最大评分">
            <InputNumber
              style={{ width: '100%' }}
              value={activeData.maxLength}
              min={1}
              max={10}
              onChange={(maxLength) =>
                onWidgetChange({ maxLength: maxLength ?? 5 })
              }
            />
          </Form.Item>
        )}
        {type === 'upload' && (
          <Form.Item label="按钮文字">
            <Input
              value={activeData.uploadText}
              onChange={(e) => onWidgetChange({ uploadText: e.target.value })}
              placeholder="请输入按钮文字"
            />
          </Form.Item>
        )}
        {type !== 'row' && (
          <Form.Item label="表单栅格">
            <Slider
              value={activeData.span}
              min={1}
              max={24}
              marks={{ 12: '12' }}
              tooltip={{
                formatter: (value) => `${value} / 24`,
              }}
              onChange={(span) => onWidgetChange({ span })}
            />
          </Form.Item>
        )}
        {type === 'row' && (
          <>
            <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>子组件</div>
            <div style={{ color: 'rgba(0,0,0,0.65)' }}>
              已在画布中展示，共 {(activeData.children || []).length} 个
            </div>
          </>
        )}
      </Form>
    );
  };

  const renderFormProps = () => (
    <Form layout="vertical" style={{ marginTop: 8 }}>
      <Form.Item label="表单名">
        <Input
          value={formConfig.formRef}
          onChange={(e) => onFormChange({ formRef: e.target.value })}
          placeholder="请输入表单名（ref）"
        />
      </Form.Item>
      <Form.Item label="数据模型">
        <Input
          value={formConfig.formModel}
          onChange={(e) => onFormChange({ formModel: e.target.value })}
          placeholder="请输入数据模型"
        />
      </Form.Item>
      <Form.Item label="校验模型">
        <Input
          value={formConfig.formRules}
          onChange={(e) => onFormChange({ formRules: e.target.value })}
          placeholder="请输入校验模型"
        />
      </Form.Item>
      <Form.Item label="表单尺寸">
        <Radio.Group
          value={formConfig.size}
          onChange={(e) => onFormChange({ size: e.target.value })}
          options={[
            { value: 'small', label: '较小' },
            { value: 'middle', label: '默认' },
            { value: 'large', label: '较大' },
          ]}
          optionType="button"
        />
      </Form.Item>
      <Form.Item label="表单布局">
        <Radio.Group
          value={formConfig.layout}
          onChange={(e) => onFormChange({ layout: e.target.value })}
          options={[
            { value: 'horizontal', label: '水平' },
            { value: 'vertical', label: '垂直' },
            { value: 'inline', label: '行内' },
          ]}
          optionType="button"
        />
      </Form.Item>
      <Form.Item label="标签宽度">
        <InputNumber
          style={{ width: '100%' }}
          value={formConfig.labelWidth}
          min={0}
          onChange={(labelWidth) =>
            onFormChange({ labelWidth: labelWidth ?? 100 })
          }
        />
      </Form.Item>
      <Form.Item label="禁用表单">
        <Switch
          checked={formConfig.disabled}
          onChange={(disabled) => onFormChange({ disabled })}
        />
      </Form.Item>
      <Form.Item label="表单按钮">
        <Switch
          checked={formConfig.formBtns}
          onChange={(formBtns) => onFormChange({ formBtns })}
        />
      </Form.Item>
    </Form>
  );

  return (
    <Tabs
      items={[
        { key: 'field', label: '组件属性', children: renderComponentProps() },
        { key: 'form', label: '表单属性', children: renderFormProps() },
      ]}
    />
  );
};

export default RightPanel;
