/**
 * TSX 代码生成器（pagegen/generator）
 * 根据画布组件与全局配置生成可运行的 ProForm TSX 代码（页面/弹窗两种生成类型）。
 */
import type { FormConfig, FormWidget } from './config';

/** 渲染单个表单项 TSX */
function renderField(widget: FormWidget): string {
  const rules = widget.required
    ? ` rules={[{ required: true, message: '请输入${widget.label}' }]}`
    : '';
  switch (widget.type) {
    case 'textarea':
      return `<ProFormTextArea name="${widget.vModel}" label="${widget.label}"${rules} fieldProps={{ rows: 4 }} />`;
    case 'password':
      return `<ProFormText.Password name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'number':
      return `<ProFormDigit name="${widget.vModel}" label="${widget.label}"${rules} fieldProps={{ style: { width: '50%' } }} />`;
    case 'date':
      return `<ProFormDatePicker name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'date-range':
      return `<ProFormDateRangePicker name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'time':
      return `<ProFormTimePicker name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'time-range':
      return `<ProFormTimeRangePicker name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'select':
      return `<ProFormSelect name="${widget.vModel}" label="${widget.label}"${rules} options={${JSON.stringify(
        (widget.options || []).map((o) => ({ value: o, label: o })),
      )}} />`;
    case 'cascader':
      return `<ProFormCascader name="${widget.vModel}" label="${widget.label}"${rules} options={${JSON.stringify(
        (widget.options || []).map((o) => ({ value: o, label: o })),
      )}} />`;
    case 'radio':
      return `<ProFormRadio.Group name="${widget.vModel}" label="${widget.label}"${rules} options={${JSON.stringify(
        (widget.options || []).map((o) => ({ value: o, label: o })),
      )}} />`;
    case 'checkbox':
      return `<ProFormCheckbox.Group name="${widget.vModel}" label="${widget.label}"${rules} options={${JSON.stringify(
        widget.options || [],
      )}} />`;
    case 'switch':
      return `<ProFormSwitch name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'slider':
      return `<ProFormSlider name="${widget.vModel}" label="${widget.label}"${rules} min={${widget.min ?? 0}} max={${widget.max ?? 100}} />`;
    case 'rate':
      return `<ProFormRate name="${widget.vModel}" label="${widget.label}"${rules} count={${widget.maxLength ?? 5}} />`;
    case 'color':
      return `<ProFormColorPicker name="${widget.vModel}" label="${widget.label}"${rules} />`;
    case 'upload':
      return `<ProFormUploadButton name="${widget.vModel}" label="${widget.label}"${rules} buttonText="${widget.uploadText || '点击上传'}" />`;
    case 'button':
      return `<Button type="${widget.buttonType || 'primary'}" onClick={() => console.log('${widget.label}')}>${widget.label}</Button>`;
    default:
      return `<ProFormText name="${widget.vModel}" label="${widget.label}" placeholder="${widget.placeholder || ''}"${rules} />`;
  }
}

/**
 * 渲染组件为 TSX 行（含行容器递归）
 * @param widget - 组件配置
 * @param indent - 缩进空格数
 */
function renderWidget(widget: FormWidget, indent: number): string {
  const pad = ' '.repeat(indent);
  if (widget.type === 'row') {
    const children = (widget.children || [])
      .map((child, index) => {
        const span = child.span && child.span !== 24 ? child.span : 12;
        const inner = `${' '.repeat(indent + 4)}${renderField(child)}`;
        return `${' '.repeat(indent + 2)}<Col key=${index} span="${span}">\n${inner}\n${' '.repeat(
          indent + 2,
        )}</Col>`;
      })
      .join('\n');
    return `${pad}<Row gutter="${widget.gutter || 15}">\n${children}\n${pad}</Row>`;
  }
  const field = `${pad}${renderField(widget)}`;
  if (widget.span && widget.span !== 24) {
    return `${pad}<Col span="${widget.span}">\n${field}\n${pad}</Col>`;
  }
  return field;
}

/** 组装表单内部字段 */
function buildFields(widgets: FormWidget[]): string {
  return widgets.map((w) => renderWidget(w, 4)).join('\n');
}

/**
 * 生成 TSX 代码
 * @param widgets - 画布组件列表
 * @param config  - 表单全局配置
 * @param type    - 生成类型：file 页面 / dialog 弹窗
 */
export function generateTsx(
  widgets: FormWidget[],
  config: FormConfig,
  type: 'file' | 'dialog',
): string {
  const imports = [
    "import { Button, Modal, Row, Col } from 'antd';",
    'import { ProForm, ProFormCascader, ProFormCheckbox, ProFormColorPicker, ProFormDatePicker, ' +
      'ProFormDateRangePicker, ProFormDigit, ProFormRadio, ProFormRate, ProFormSelect, ProFormSlider, ' +
      'ProFormSwitch, ProFormText, ProFormTextArea, ProFormTimePicker, ProFormTimeRangePicker, ' +
      'ProFormUploadButton } ' +
      "from '@ant-design/pro-components';",
    "import type { ProFormInstance } from '@ant-design/pro-components';",
    "import React from 'react';",
  ].join('\n');

  const fields = buildFields(widgets);

  const formBlock = `      <ProForm
        formRef={formRef}
        labelCol={{ span: ${config.labelWidth} }}
        onFinish={async (values) => {
          console.log(values);
        }}
      >
${fields}
      </ProForm>`;

  if (type === 'dialog') {
    return `${imports}

const DemoDialog = () => {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<ProFormInstance>();

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)}>
        打开弹窗
      </Button>
      <Modal
        title="弹窗表单"
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
      >
${formBlock}
      </Modal>
    </>
  );
};

export default DemoDialog;
`;
  }

  return `${imports}

const DemoForm = () => {
  const formRef = React.useRef<ProFormInstance>();

  return (
${formBlock}
  );
};

export default DemoForm;
`;
}
