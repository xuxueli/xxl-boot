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
import { t } from '@/i18n';
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
          {t('tool.pagegen.selectComponent')}
        </div>
      );
    }
    const type: WidgetType = activeData.type;
    return (
      <Form layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label={t('tool.pagegen.componentType')}>
          <Tag color="blue">{widgetTitles[type]}</Tag>
        </Form.Item>
        {type !== 'row' && type !== 'button' && (
          <Form.Item label={t('tool.pagegen.fieldName')}>
            <Input
              value={activeData.vModel}
              onChange={(e) => onWidgetChange({ vModel: e.target.value })}
              placeholder={t('common.inputPlaceholder', [t('tool.codegen.fieldColumn')])}
            />
          </Form.Item>
        )}
        {type !== 'row' && (
          <Form.Item label={t('tool.pagegen.label')}>
            <Input
              value={activeData.label}
              onChange={(e) => onWidgetChange({ label: e.target.value })}
              placeholder={t('common.inputPlaceholder', [t('system.message.title')])}
            />
          </Form.Item>
        )}
        {supportsPlaceholder(type) && (
          <Form.Item label={t('tool.pagegen.placeholder')}>
            <Input
              value={activeData.placeholder}
              onChange={(e) => onWidgetChange({ placeholder: e.target.value })}
              placeholder={t('common.inputPlaceholder', [t('tool.pagegen.placeholder')])}
            />
          </Form.Item>
        )}
        {isChoiceType(type) && (
          <Form.Item
            label={t('tool.pagegen.options')}
            extra={
              type === 'cascader' ? t('tool.pagegen.cascaderTip') : undefined
            }
          >
            <Select
              mode="tags"
              value={activeData.options}
              onChange={(options) => onWidgetChange({ options })}
              placeholder={
                type === 'cascader'
                  ? t('tool.pagegen.cascaderPlaceholder')
                  : t('tool.pagegen.optionsPlaceholder')
              }
            />
          </Form.Item>
        )}
        {/* 行容器专属：栅格间隔 */}
        {type === 'row' && (
          <Form.Item label={t('tool.pagegen.gutter')}>
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
          <Form.Item label={t('tool.pagegen.buttonType')}>
            <Radio.Group
              value={activeData.buttonType}
              onChange={(e) => onWidgetChange({ buttonType: e.target.value })}
              options={[
                { value: 'primary', label: t('tool.pagegen.btnPrimary') },
                { value: 'default', label: t('tool.pagegen.btnDefault') },
                { value: 'dashed', label: t('tool.pagegen.btnDashed') },
                { value: 'text', label: t('tool.pagegen.btnText') },
              ]}
            />
          </Form.Item>
        )}
        {supportsRequired(type) && (
          <Form.Item label={t('tool.pagegen.required')}>
            <Switch
              checked={activeData.required}
              onChange={(required) => onWidgetChange({ required })}
            />
          </Form.Item>
        )}
        {type === 'slider' && (
          <>
            <Form.Item label={t('tool.pagegen.min')}>
              <InputNumber
                style={{ width: '100%' }}
                value={activeData.min}
                onChange={(min) => onWidgetChange({ min: min ?? 0 })}
              />
            </Form.Item>
            <Form.Item label={t('tool.pagegen.max')}>
              <InputNumber
                style={{ width: '100%' }}
                value={activeData.max}
                onChange={(max) => onWidgetChange({ max: max ?? 100 })}
              />
            </Form.Item>
            <Form.Item label={t('tool.pagegen.step')}>
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
          <Form.Item label={t('tool.pagegen.maxRate')}>
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
          <Form.Item label={t('tool.pagegen.buttonText')}>
            <Input
              value={activeData.uploadText}
              onChange={(e) => onWidgetChange({ uploadText: e.target.value })}
              placeholder={t('common.inputPlaceholder', [t('tool.pagegen.buttonText')])}
            />
          </Form.Item>
        )}
        {type !== 'row' && (
          <Form.Item label={t('tool.pagegen.formGrid')}>
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
            <div style={{ fontWeight: 600, margin: '8px 0 4px' }}>
              {t('tool.pagegen.children')}
            </div>
            <div style={{ color: 'rgba(0,0,0,0.65)' }}>
              {t('tool.pagegen.childrenCount', [(activeData.children || []).length])}
            </div>
          </>
        )}
      </Form>
    );
  };

  const renderFormProps = () => (
    <Form layout="vertical" style={{ marginTop: 8 }}>
      <Form.Item label={t('tool.pagegen.formName')}>
        <Input
          value={formConfig.formRef}
          onChange={(e) => onFormChange({ formRef: e.target.value })}
          placeholder={t('common.inputPlaceholder', [t('tool.pagegen.formName')])}
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.formModel')}>
        <Input
          value={formConfig.formModel}
          onChange={(e) => onFormChange({ formModel: e.target.value })}
          placeholder={t('common.inputPlaceholder', [t('tool.pagegen.formModel')])}
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.formRules')}>
        <Input
          value={formConfig.formRules}
          onChange={(e) => onFormChange({ formRules: e.target.value })}
          placeholder={t('common.inputPlaceholder', [t('tool.pagegen.formRules')])}
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.formSize')}>
        <Radio.Group
          value={formConfig.size}
          onChange={(e) => onFormChange({ size: e.target.value })}
          options={[
            { value: 'small', label: t('tool.pagegen.sizeSmall') },
            { value: 'middle', label: t('tool.pagegen.sizeMiddle') },
            { value: 'large', label: t('tool.pagegen.sizeLarge') },
          ]}
          optionType="button"
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.formLayout')}>
        <Radio.Group
          value={formConfig.layout}
          onChange={(e) => onFormChange({ layout: e.target.value })}
          options={[
            { value: 'horizontal', label: t('tool.pagegen.layoutHorizontal') },
            { value: 'vertical', label: t('tool.pagegen.layoutVertical') },
            { value: 'inline', label: t('tool.pagegen.layoutInline') },
          ]}
          optionType="button"
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.labelWidth')}>
        <InputNumber
          style={{ width: '100%' }}
          value={formConfig.labelWidth}
          min={0}
          onChange={(labelWidth) =>
            onFormChange({ labelWidth: labelWidth ?? 100 })
          }
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.disableForm')}>
        <Switch
          checked={formConfig.disabled}
          onChange={(disabled) => onFormChange({ disabled })}
        />
      </Form.Item>
      <Form.Item label={t('tool.pagegen.formButtons')}>
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
        {
          key: 'field',
          label: t('tool.pagegen.componentProps'),
          children: renderComponentProps(),
        },
        {
          key: 'form',
          label: t('tool.pagegen.formProps'),
          children: renderFormProps(),
        },
      ]}
    />
  );
};

export default RightPanel;
