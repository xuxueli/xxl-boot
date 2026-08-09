/**
 * 页面：表单构建（PageGen）
 * 功能：拖拽式表单设计器，支持组件添加/排序/属性编辑/代码生成（TSX）
 */

import {
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  HolderOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  App,
  Button,
  Checkbox,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Select,
  Switch,
  Tabs,
  Tag,
} from 'antd';
import { createStyles } from 'antd-style';
import React, { useMemo, useRef, useState } from 'react';

/** 组件类型定义 */
type WidgetType =
  | 'input'
  | 'textarea'
  | 'number'
  | 'password'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'date';

interface FormWidget {
  id: number;
  type: WidgetType;
  vModel: string;
  label: string;
  placeholder?: string;
  required: boolean;
  options: string[];
}

interface FormConfig {
  labelWidth: number;
  layout: 'horizontal' | 'vertical' | 'inline';
  size: 'small' | 'middle' | 'large';
}

const widgetTitles: Record<WidgetType, string> = {
  input: '单行文本',
  textarea: '多行文本',
  number: '数字输入',
  password: '密码输入',
  select: '下拉选择',
  radio: '单选按钮',
  checkbox: '多选按钮',
  switch: '开关',
  date: '日期选择',
};

/** 组件面板配置 */
const paletteGroups: { title: string; types: WidgetType[] }[] = [
  {
    title: '输入型',
    types: ['input', 'textarea', 'number', 'password', 'date'],
  },
  { title: '选择型', types: ['select', 'radio', 'checkbox', 'switch'] },
];

const useStyles = createStyles(({ token, css }) => ({
  container: css`
    display: flex;
    gap: 12px;
    height: 100%;
  `,
  panel: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorderSecondary};
    border-radius: ${token.borderRadiusLG}px;
    padding: 12px;
  `,
  palette: css`
    width: 220px;
    flex-shrink: 0;
  `,
  paletteGroup: css`
    margin-bottom: 12px;
  `,
  paletteGroupTitle: css`
    font-size: 13px;
    font-weight: 600;
    margin-bottom: 8px;
    color: ${token.colorTextSecondary};
  `,
  paletteItem: css`
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 12px;
    margin-bottom: 6px;
    border: 1px dashed ${token.colorBorder};
    border-radius: 6px;
    cursor: pointer;
    font-size: 13px;
    transition: all 0.2s;

    &:hover {
      border-color: ${token.colorPrimary};
      color: ${token.colorPrimary};
    }
  `,
  canvas: css`
    flex: 1;
    min-width: 480px;
    display: flex;
    flex-direction: column;
  `,
  toolbar: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  `,
  canvasBody: css`
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: ${token.colorFillTertiary};
    border-radius: ${token.borderRadiusLG}px;
  `,
  widget: css`
    padding: 8px;
    border: 1px solid transparent;
    border-radius: 6px;
    position: relative;
    background: ${token.colorBgContainer};

    &:hover {
      border-color: ${token.colorPrimaryBorder};
    }
  `,
  selected: css`
    border-color: ${token.colorPrimary} !important;
  `,
  dragHandle: css`
    position: absolute;
    top: 8px;
    right: 8px;
    color: ${token.colorTextQuaternary};
    cursor: move;
    &:hover {
      color: ${token.colorPrimary};
    }
  `,
  empty: css`
    text-align: center;
    color: ${token.colorTextQuaternary};
    padding: 60px 0;
  `,
  properties: css`
    width: 280px;
    flex-shrink: 0;
  `,
}));

/** 可排序画布条目 */
const SortableWidget: React.FC<{
  widget: FormWidget;
  selected: boolean;
  onClick: () => void;
  onDelete: () => void;
}> = ({ widget, selected, onClick, onDelete }) => {
  const { styles } = useStyles();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 999, opacity: 0.8 } : {}),
  };

  const renderWidget = (w: FormWidget) => {
    const common = {
      placeholder: w.placeholder,
      style: { width: '100%' as const },
    };
    switch (w.type) {
      case 'textarea':
        return <Input.TextArea {...common} />;
      case 'number':
        return <InputNumber {...common} />;
      case 'password':
        return <Input.Password {...common} />;
      case 'date':
        return <DatePicker {...common} />;
      case 'select':
        return (
          <Select
            {...common}
            placeholder={w.placeholder || '请选择'}
            options={w.options.map((o) => ({ value: o, label: o }))}
          />
        );
      case 'radio':
        return (
          <Radio.Group
            options={w.options.map((o) => ({ value: o, label: o }))}
          />
        );
      case 'checkbox':
        return (
          <Checkbox.Group
            options={w.options.map((o) => ({ value: o, label: o }))}
          />
        );
      case 'switch':
        return <Switch />;
      default:
        return <Input {...common} />;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={
        selected ? `${styles.widget} ${styles.selected}` : styles.widget
      }
      onClick={onClick}
    >
      <span {...attributes} {...listeners} className={styles.dragHandle}>
        <HolderOutlined />
      </span>
      <Form.Item
        label={widget.label}
        required={widget.required}
        style={{ marginBottom: 0 }}
      >
        {renderWidget(widget)}
      </Form.Item>
      <DeleteOutlined
        style={{
          position: 'absolute',
          bottom: 8,
          right: 8,
          color: '#ff4d4f',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      />
    </div>
  );
};

/** 生成 TSX 代码 */
const generateTsx = (widgets: FormWidget[], _config: FormConfig): string => {
  const imports = [
    "import { Button, DatePicker, Form, Input, InputNumber, Radio, Checkbox, Select, Switch } from 'antd';",
    "import React from 'react';",
    "import type { ProFormInstance } from '@ant-design/pro-components';",
    "import { ProForm } from '@ant-design/pro-components';",
  ].join('\n');

  const fields = widgets
    .map((w) => {
      const rules = w.required
        ? `rules={[{ required: true, message: '请输入${w.label}' }]}`
        : '';
      switch (w.type) {
        case 'textarea':
          return `  <ProForm.TextArea name="${w.vModel}" label="${w.label}" ${rules} />`;
        case 'number':
          return `  <ProFormDigit name="${w.vModel}" label="${w.label}" ${rules} />`;
        case 'password':
          return `  <ProFormText.Password name="${w.vModel}" label="${w.label}" ${rules} />`;
        case 'date':
          return `  <ProFormDatePicker name="${w.vModel}" label="${w.label}" ${rules} />`;
        case 'select':
          return `  <ProFormSelect name="${w.vModel}" label="${w.label}" ${rules} options={${JSON.stringify(w.options.map((o) => ({ value: o, label: o })))}} />`;
        case 'radio':
          return `  <ProFormRadio.Group name="${w.vModel}" label="${w.label}" ${rules} options={${JSON.stringify(w.options.map((o) => ({ value: o, label: o })))}} />`;
        case 'checkbox':
          return `  <ProFormCheckbox.Group name="${w.vModel}" label="${w.label}" ${rules} options={${JSON.stringify(w.options)}} />`;
        case 'switch':
          return `  <ProFormSwitch name="${w.vModel}" label="${w.label}" ${rules} />`;
        default:
          return `  <ProFormText name="${w.vModel}" label="${w.label}" placeholder="${w.placeholder || ''}" ${rules} />`;
      }
    })
    .join('\n');

  return `${imports}

const DemoForm: React.FC = () => {
  const formRef = React.useRef<ProFormInstance>();

  return (
    <ProForm
      formRef={formRef}
      labelCol={{ span: 4 }}
      onFinish={async (values) => {
        console.log(values);
      }}
    >
${fields}
    </ProForm>
  );
};

export default DemoForm;
`;
};

const PageGen: React.FC = () => {
  const { styles } = useStyles();
  const { message } = App.useApp();
  const idRef = useRef(100);

  const [widgets, setWidgets] = useState<FormWidget[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [config, setConfig] = useState<FormConfig>({
    labelWidth: 120,
    layout: 'horizontal',
    size: 'middle',
  });

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const selectedWidget = useMemo(
    () => widgets.find((w) => w.id === selectedId),
    [widgets, selectedId],
  );

  /** 从面板添加组件 */
  const addWidget = (type: WidgetType) => {
    const id = ++idRef.current;
    const widget: FormWidget = {
      id,
      type,
      vModel: `field${id}`,
      label: widgetTitles[type],
      required: false,
      options: ['选项一', '选项二'],
      placeholder: type === 'select' ? '请选择' : '请输入',
    };
    setWidgets((prev) => [...prev, widget]);
    setSelectedId(id);
  };

  /** 画布排序 */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setWidgets((prev) => {
        const oldIndex = prev.findIndex((w) => w.id === active.id);
        const newIndex = prev.findIndex((w) => w.id === over?.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  /** 更新选中组件 */
  const updateWidget = (patch: Partial<FormWidget>) => {
    if (selectedId == null) return;
    setWidgets((prev) =>
      prev.map((w) => (w.id === selectedId ? { ...w, ...patch } : w)),
    );
  };

  /** 复制代码 */
  const handleCopy = async () => {
    const code = generateTsx(widgets, config);
    try {
      await navigator.clipboard.writeText(code);
      message.success('代码已复制');
    } catch {
      message.error('复制失败');
    }
  };

  /** 导出 TSX 文件 */
  const handleExport = () => {
    const code = generateTsx(widgets, config);
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'demoForm.tsx';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className={styles.container}>
      {/* 左：组件面板 */}
      <div className={`${styles.panel} ${styles.palette}`}>
        {paletteGroups.map((group) => (
          <div key={group.title} className={styles.paletteGroup}>
            <div className={styles.paletteGroupTitle}>{group.title}</div>
            {group.types.map((type) => (
              <div
                key={type}
                className={styles.paletteItem}
                onClick={() => addWidget(type)}
              >
                <PlusOutlined />
                {widgetTitles[type]}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 中：画布 */}
      <div className={`${styles.panel} ${styles.canvas}`}>
        <div className={styles.toolbar}>
          <span style={{ fontWeight: 600 }}>表单设计</span>
          <div>
            <Button
              icon={<CopyOutlined />}
              size="small"
              style={{ marginRight: 8 }}
              onClick={handleCopy}
            >
              复制代码
            </Button>
            <Button
              icon={<DownloadOutlined />}
              size="small"
              style={{ marginRight: 8 }}
              onClick={handleExport}
            >
              导出
            </Button>
            <Button
              danger
              size="small"
              onClick={() => {
                setWidgets([]);
                setSelectedId(undefined);
              }}
            >
              清空
            </Button>
          </div>
        </div>
        <div className={styles.canvasBody}>
          {widgets.length === 0 ? (
            <div className={styles.empty}>点击左侧组件添加，或拖拽排序</div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={widgets.map((w) => w.id)}
                strategy={verticalListSortingStrategy}
              >
                <Form
                  layout={config.layout}
                  labelCol={
                    config.layout === 'horizontal' ? { span: 6 } : undefined
                  }
                >
                  {widgets.map((w) => (
                    <SortableWidget
                      key={w.id}
                      widget={w}
                      selected={w.id === selectedId}
                      onClick={() => setSelectedId(w.id)}
                      onDelete={() => {
                        setWidgets((prev) => prev.filter((i) => i.id !== w.id));
                        if (selectedId === w.id) setSelectedId(undefined);
                      }}
                    />
                  ))}
                </Form>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* 右：属性面板 */}
      <div className={`${styles.panel} ${styles.properties}`}>
        <Tabs
          items={[
            {
              key: 'widget',
              label: '组件属性',
              children: selectedWidget ? (
                <div>
                  <Form layout="vertical" style={{ marginTop: 8 }}>
                    <Form.Item label="组件类型">
                      <Tag color="blue">
                        {widgetTitles[selectedWidget.type]}
                      </Tag>
                    </Form.Item>
                    <Form.Item label="字段名">
                      <Input
                        value={selectedWidget.vModel}
                        onChange={(e) =>
                          updateWidget({ vModel: e.target.value })
                        }
                      />
                    </Form.Item>
                    <Form.Item label="标签">
                      <Input
                        value={selectedWidget.label}
                        onChange={(e) =>
                          updateWidget({ label: e.target.value })
                        }
                      />
                    </Form.Item>
                    <Form.Item label="占位提示">
                      <Input
                        value={selectedWidget.placeholder}
                        onChange={(e) =>
                          updateWidget({ placeholder: e.target.value })
                        }
                      />
                    </Form.Item>
                    <Form.Item label="必填">
                      <Switch
                        checked={selectedWidget.required}
                        onChange={(checked) =>
                          updateWidget({ required: checked })
                        }
                      />
                    </Form.Item>
                    {['select', 'radio', 'checkbox'].includes(
                      selectedWidget.type,
                    ) && (
                      <Form.Item label="选项">
                        <Select
                          mode="tags"
                          value={selectedWidget.options}
                          onChange={(options) => updateWidget({ options })}
                          placeholder="输入后回车添加选项"
                        />
                      </Form.Item>
                    )}
                  </Form>
                </div>
              ) : (
                <div className={styles.empty}>请选择画布中的组件</div>
              ),
            },
            {
              key: 'form',
              label: '表单属性',
              children: (
                <Form layout="vertical" style={{ marginTop: 8 }}>
                  <Form.Item label="标签宽度">
                    <InputNumber
                      style={{ width: '100%' }}
                      value={config.labelWidth}
                      min={0}
                      onChange={(v) =>
                        setConfig((prev) => ({ ...prev, labelWidth: v ?? 120 }))
                      }
                    />
                  </Form.Item>
                  <Form.Item label="布局">
                    <Radio.Group
                      value={config.layout}
                      onChange={(e) =>
                        setConfig((prev) => ({
                          ...prev,
                          layout: e.target.value,
                        }))
                      }
                      options={[
                        { value: 'horizontal', label: '水平' },
                        { value: 'vertical', label: '垂直' },
                        { value: 'inline', label: '行内' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item label="尺寸">
                    <Radio.Group
                      value={config.size}
                      onChange={(e) =>
                        setConfig((prev) => ({ ...prev, size: e.target.value }))
                      }
                      options={[
                        { value: 'small', label: '小' },
                        { value: 'middle', label: '中' },
                        { value: 'large', label: '大' },
                      ]}
                    />
                  </Form.Item>
                </Form>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default PageGen;
