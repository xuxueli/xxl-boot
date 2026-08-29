/**
 * 页面：表单设计器（PageGen）
 * 功能：拖拽式表单设计，左侧三组组件库（输入/选择/布局），画布拖拽排序，
 * 右侧组件属性/表单属性联动配置，代码生成（页面/弹窗，导出文件/复制代码）
 */
import {
  AlignLeftOutlined,
  ApartmentOutlined,
  BgColorsOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  CheckSquareOutlined,
  CopyOutlined,
  DeleteOutlined,
  DownloadOutlined,
  DownOutlined,
  FieldTimeOutlined,
  FontSizeOutlined,
  HolderOutlined,
  LockOutlined,
  NumberOutlined,
  StarOutlined,
  SwapOutlined,
  TableOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  defaultDropAnimation,
  PointerSensor,
  useDraggable,
  useDroppable,
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
  Cascader,
  Checkbox,
  Col,
  ColorPicker,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Radio,
  Rate,
  Row,
  Select,
  Slider,
  Switch,
  TimePicker,
  Upload,
} from 'antd';
import { createStyles } from 'antd-style';
import React, { useMemo, useRef, useState } from 'react';
import CodeTypeDialog from './CodeTypeDialog';
import type { FormConfig, FormWidget, WidgetType } from './config';
import {
  createWidget,
  defaultFormConfig,
  paletteGroups,
  toCascaderOptions,
  widgetTitles,
} from './config';
import { generateTsx } from './generator';
import RightPanel from './RightPanel';

/** 组件图标映射 */
const widgetIcons: Record<WidgetType, React.ReactNode> = {
  input: <FontSizeOutlined />,
  textarea: <AlignLeftOutlined />,
  password: <LockOutlined />,
  number: <NumberOutlined />,
  select: <DownOutlined />,
  cascader: <ApartmentOutlined />,
  radio: <CheckCircleOutlined />,
  checkbox: <CheckSquareOutlined />,
  switch: <SwapOutlined />,
  slider: <SwapOutlined />,
  time: <FieldTimeOutlined />,
  'time-range': <FieldTimeOutlined />,
  date: <CalendarOutlined />,
  'date-range': <CalendarOutlined />,
  rate: <StarOutlined />,
  color: <BgColorsOutlined />,
  upload: <UploadOutlined />,
  row: <TableOutlined />,
  button: <CopyOutlined />,
};

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
    overflow-y: auto;
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
    display: inline-flex;
    align-items: center;
    gap: 6px;
    width: 48%;
    margin: 1%;
    padding: 8px 10px;
    box-sizing: border-box;
    border: 1px dashed ${token.colorBorder};
    border-radius: 6px;
    cursor: move;
    font-size: 13px;
    transition: all 0.2s;
    user-select: none;

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
  rowWidget: css`
    border: 1px dashed ${token.colorBorder};
    border-radius: 6px;
    padding: 12px;
    background: ${token.colorBgLayout};
  `,
  rowSelected: css`
    border-color: ${token.colorPrimary} !important;
  `,
  rowTitle: css`
    position: relative;
    font-size: 13px;
    font-weight: 600;
    color: ${token.colorTextSecondary};
    margin-bottom: 8px;
  `,
  rowBody: css`
    min-height: 48px;
    border: 1px dashed ${token.colorBorderSecondary};
    background: ${token.colorBgContainer};
    border-radius: 6px;
    padding: 8px;
  `,
  rowEmpty: css`
    text-align: center;
    color: ${token.colorTextQuaternary};
    padding: 12px 0;
  `,
  empty: css`
    text-align: center;
    color: ${token.colorTextQuaternary};
    padding: 60px 0;
  `,
  properties: css`
    width: 300px;
    flex-shrink: 0;
    overflow-y: auto;
  `,
  overlay: css`
    min-width: 320px;
    padding: 8px;
    background: ${token.colorBgContainer};
    border: 1px dashed ${token.colorPrimary};
    border-radius: 6px;
    box-shadow: ${token.boxShadow};
  `,
}));

/** 递归查找组件所在列表 */
const findWidgetList = (
  list: FormWidget[],
  id: number,
): { list: FormWidget[]; index: number } | null => {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      return { list, index: i };
    }
    const children = list[i].children;
    if (children) {
      const found = findWidgetList(children, id);
      if (found) return found;
    }
  }
  return null;
};

/** 递归查找组件节点 */
const findWidgetById = (list: FormWidget[], id: number): FormWidget | null => {
  for (const w of list) {
    if (w.id === id) return w;
    if (w.children) {
      const found = findWidgetById(w.children, id);
      if (found) return found;
    }
  }
  return null;
};

/** 递归更新组件属性 */
const patchWidget = (
  list: FormWidget[],
  id: number,
  patch: Partial<FormWidget>,
): FormWidget[] =>
  list.map((w) => {
    if (w.id === id) return { ...w, ...patch };
    if (w.children)
      return { ...w, children: patchWidget(w.children, id, patch) };
    return w;
  });

/** 递归删除组件 */
const removeWidget = (list: FormWidget[], id: number): FormWidget[] => {
  const result: FormWidget[] = [];
  for (const w of list) {
    if (w.id === id) continue;
    if (w.children) {
      result.push({ ...w, children: removeWidget(w.children, id) });
    } else {
      result.push(w);
    }
  }
  return result;
};

/** 画布表单项实时渲染 */
const renderPreview = (widget: FormWidget) => {
  const common = {
    placeholder: widget.placeholder,
    style: { width: '100%' as const },
  };
  switch (widget.type) {
    case 'textarea':
      return <Input.TextArea {...common} rows={4} />;
    case 'password':
      return <Input.Password {...common} />;
    case 'number':
      return <InputNumber {...common} style={{ width: '50%' }} />;
    case 'date':
      return <DatePicker {...common} />;
    case 'date-range':
      return (
        <DatePicker.RangePicker
          placeholder={[
            widget.placeholder || '开始日期',
            widget.placeholder || '结束日期',
          ]}
          style={{ width: '100%' }}
        />
      );
    case 'time':
      return <TimePicker {...common} />;
    case 'time-range':
      return (
        <TimePicker.RangePicker
          placeholder={[
            widget.placeholder || '开始时间',
            widget.placeholder || '结束时间',
          ]}
          style={{ width: '100%' }}
        />
      );
    case 'select':
      return (
        <Select
          {...common}
          placeholder={widget.placeholder || '请选择'}
          options={(widget.options || []).map((o) => ({ value: o, label: o }))}
        />
      );
    case 'cascader':
      return (
        <Cascader
          {...common}
          placeholder={widget.placeholder || '请选择'}
          options={toCascaderOptions(widget.options)}
        />
      );
    case 'radio':
      return (
        <Radio.Group
          options={(widget.options || []).map((o) => ({ value: o, label: o }))}
        />
      );
    case 'checkbox':
      return (
        <Checkbox.Group
          options={(widget.options || []).map((o) => ({ value: o, label: o }))}
        />
      );
    case 'switch':
      return <Switch />;
    case 'slider':
      return (
        <Slider
          min={widget.min ?? 0}
          max={widget.max ?? 100}
          step={widget.step ?? 1}
        />
      );
    case 'rate':
      return <Rate count={widget.maxLength ?? 5} />;
    case 'color':
      return <ColorPicker defaultValue="#1677ff" />;
    case 'upload':
      return (
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>
            {widget.uploadText || '点击上传'}
          </Button>
        </Upload>
      );
    case 'button':
      return (
        <Button type={widget.buttonType || 'primary'}>{widget.label}</Button>
      );
    default:
      return <Input {...common} />;
  }
};

/** 左侧组件库可拖拽条目 */
const PaletteItem = ({
  type,
  onAdd,
}: {
  type: WidgetType;
  onAdd: (type: WidgetType) => void;
}) => {
  const { styles } = useStyles();
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: { fromPalette: true, type },
  });
  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={styles.paletteItem}
      style={isDragging ? { opacity: 0.4 } : undefined}
      onClick={() => onAdd(type)}
    >
      {widgetIcons[type]}
      {widgetTitles[type]}
    </div>
  );
};

/** 画布可排序列条目（普通表单项） */
const SortableWidget = ({
  widget,
  selected,
  selectedId,
  draggingFromPalette,
  onSelect,
  onDelete,
}: {
  widget: FormWidget;
  selected: boolean;
  selectedId?: number;
  draggingFromPalette: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const { styles } = useStyles();
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: widget.id });
  /* 拖拽左侧组件时画布不实时让位，仅拖拽画布内组件时给出排序位移 */
  const style = {
    transform: draggingFromPalette
      ? undefined
      : CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { zIndex: 999, opacity: 0.5 } : {}),
  };

  /* 行容器：内部嵌套可拖拽子组件 */
  if (widget.type === 'row') {
    return (
      <Col
        span={widget.span || 24}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(widget.id);
        }}
        className={selected ? styles.rowSelected : undefined}
      >
        <div
          ref={setNodeRef}
          style={style}
          className={
            selected
              ? `${styles.rowWidget} ${styles.rowSelected}`
              : styles.rowWidget
          }
        >
          <div
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            className={styles.rowTitle}
            style={{ cursor: 'move' }}
          >
            <HolderOutlined style={{ marginRight: 6 }} />
            {widget.label}
            <DeleteOutlined
              style={{
                position: 'absolute',
                marginLeft: 8,
                color: '#ff4d4f',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(widget.id);
              }}
            />
          </div>
          <RowBody
            widget={widget}
            selectedId={selectedId}
            draggingFromPalette={draggingFromPalette}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        </div>
      </Col>
    );
  }

  return (
    <Col
      ref={setNodeRef}
      span={widget.span || 24}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(widget.id);
      }}
    >
      <div
        className={
          selected ? `${styles.widget} ${styles.selected}` : styles.widget
        }
        {...attributes}
        {...listeners}
      >
        <Form.Item
          label={widget.label}
          required={widget.required}
          style={{ marginBottom: 0 }}
        >
          {renderPreview(widget)}
        </Form.Item>
        <DeleteOutlined
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            color: '#ff4d4f',
            cursor: 'pointer',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(widget.id);
          }}
        />
      </div>
    </Col>
  );
};

/** 行容器子组件区域（可放置、可排序） */
const RowBody = ({
  widget,
  selectedId,
  draggingFromPalette,
  onSelect,
  onDelete,
}: {
  widget: FormWidget;
  selectedId?: number;
  draggingFromPalette: boolean;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}) => {
  const { styles } = useStyles();
  const { setNodeRef } = useDroppable({
    id: `row-${widget.id}`,
    data: { containerId: widget.id },
  });
  return (
    <div ref={setNodeRef} className={styles.rowBody}>
      {(widget.children || []).length === 0 ? (
        <div className={styles.rowEmpty}>从左侧拖入或点击添加组件</div>
      ) : (
        <SortableContext
          items={(widget.children || []).map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          <Row gutter={widget.gutter || 0}>
            {(widget.children || []).map((child) => (
              <SortableWidget
                key={child.id}
                widget={child}
                selected={child.id === selectedId}
                selectedId={selectedId}
                draggingFromPalette={draggingFromPalette}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </Row>
        </SortableContext>
      )}
    </div>
  );
};

const PageGen = () => {
  const { styles } = useStyles();
  const { message, modal } = App.useApp();
  const idRef = useRef(100);

  const [widgets, setWidgets] = useState<FormWidget[]>([]);
  const [selectedId, setSelectedId] = useState<number>();
  const [config, setConfig] = useState<FormConfig>(defaultFormConfig);
  const [genOpen, setGenOpen] = useState(false);
  const [genShowFileName, setGenShowFileName] = useState(false);
  const [activeType, setActiveType] = useState<WidgetType>();
  /* 是否正在拖拽左侧组件库组件（拖拽期间画布不实时让位） */
  const [draggingFromPalette, setDraggingFromPalette] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const selectedWidget = useMemo(() => {
    if (selectedId == null) return undefined;
    return findWidgetById(widgets, selectedId) || undefined;
  }, [widgets, selectedId]);

  /** 点击左侧组件添加（追加到画布末尾） */
  const addWidget = (type: WidgetType) => {
    const widget = createWidget(type, ++idRef.current);
    setWidgets((prev) => [...prev, widget]);
    setSelectedId(widget.id);
  };

  /** 解析拖拽目标位置：返回目标列表与插入下标 */
  const resolveTarget = (
    list: FormWidget[],
    overId: number | string,
  ): { list: FormWidget[]; index: number } | null => {
    if (overId === 'canvas-body') {
      return { list, index: list.length };
    }
    if (typeof overId === 'string' && overId.startsWith('row-')) {
      const rowId = Number(overId.replace('row-', ''));
      const row = findWidgetById(list, rowId);
      if (row?.children) {
        return { list: row.children, index: row.children.length };
      }
      return null;
    }
    const loc = findWidgetList(list, Number(overId));
    if (loc) {
      const target = loc.list[loc.index];
      /* 拖到行容器上：进入行容器子列表 */
      if (target.type === 'row' && target.children) {
        return { list: target.children, index: target.children.length };
      }
      return loc;
    }
    return null;
  };

  /** 拖拽结束：新增组件或排序 */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const overId = over.id;
    const fromPalette = active.data.current?.fromPalette;
    /* 基于当前状态做一次深拷贝，避免诸多嵌套引用被直接修改 */
    const next = JSON.parse(JSON.stringify(widgets)) as FormWidget[];
    let newSelected: number | undefined;

    /* 从左侧组件库拖入画布 */
    if (fromPalette) {
      const type = active.data.current?.type as WidgetType;
      const newWidget = createWidget(type, ++idRef.current);
      const target = resolveTarget(next, overId);
      if (target) {
        target.list.splice(target.index, 0, newWidget);
      } else {
        next.push(newWidget);
      }
      newSelected = newWidget.id;
      setWidgets(next);
    } else {
      /* 画布内排序 / 跨容器移动 */
      const activeLoc = findWidgetList(next, Number(active.id));
      const target = resolveTarget(next, overId);
      if (activeLoc && target) {
        const movedWidget = activeLoc.list[activeLoc.index];
        /* 行容器禁止拖入自身子列表 */
        const canMove = !(
          movedWidget.type === 'row' &&
          movedWidget.children &&
          target.list === movedWidget.children
        );
        if (!canMove) {
          setActiveType(undefined);
          setDraggingFromPalette(false);
          return;
        }

        newSelected = Number(active.id);
        if (activeLoc.list === target.list) {
          /* 同列表：直接排序 */
          const arr = arrayMove(activeLoc.list, activeLoc.index, target.index);
          activeLoc.list.splice(0, activeLoc.list.length, ...arr);
        } else {
          /* 跨容器：先出后入 */
          const [moved] = activeLoc.list.splice(activeLoc.index, 1);
          target.list.splice(target.index, 0, moved);
        }
      }
      setWidgets(next);
    }

    if (newSelected !== undefined) setSelectedId(newSelected);
    setActiveType(undefined);
    setDraggingFromPalette(false);
  };

  /** 拖拽开始：记录拖拽组件类型（用于浮层展示） */
  const handleDragStart = (event: DragStartEvent) => {
    setActiveType(event.active.data.current?.type as WidgetType | undefined);
    setDraggingFromPalette(!!event.active.data.current?.fromPalette);
  };

  /** 构建 TSX 代码 */
  const buildCode = (type: 'file' | 'dialog') =>
    generateTsx(widgets, config, type);

  /** 导出文件：弹框选择生成类型后下载 */
  const handleExport = (data: { type: string; fileName?: string }) => {
    const code = buildCode(data.type as 'file' | 'dialog');
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = data.fileName || `${Date.now()}.tsx`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /** 复制代码：弹框选择生成类型后复制 */
  const handleCopy = async (data: { type: string; fileName?: string }) => {
    const code = buildCode(data.type as 'file' | 'dialog');
    try {
      await navigator.clipboard.writeText(code);
      message.success('代码已复制');
    } catch {
      message.error('复制失败');
    }
  };

  /** 清空画布：二次确认 */
  const handleClear = () => {
    modal.confirm({
      title: '系统提示',
      content: '确定要清空所有组件吗？',
      onOk: () => {
        idRef.current = 100;
        setWidgets([]);
        setSelectedId(undefined);
      },
    });
  };

  return (
    <PageContainer ghost title={false}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => {
          setActiveType(undefined);
          setDraggingFromPalette(false);
        }}
      >
        <div className={styles.container}>
          {/* 左：组件面板 */}
          <div className={`${styles.panel} ${styles.palette}`}>
            {paletteGroups.map((group) => (
              <div key={group.title} className={styles.paletteGroup}>
                <div className={styles.paletteGroupTitle}>{group.title}</div>
                {group.types.map((type) => (
                  <PaletteItem key={type} type={type} onAdd={addWidget} />
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
                  icon={<DownloadOutlined />}
                  size="small"
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    setGenShowFileName(true);
                    setGenOpen(true);
                  }}
                >
                  导出文件
                </Button>
                <Button
                  icon={<CopyOutlined />}
                  size="small"
                  style={{ marginRight: 8 }}
                  onClick={() => {
                    setGenShowFileName(false);
                    setGenOpen(true);
                  }}
                >
                  复制代码
                </Button>
                <Button danger size="small" onClick={handleClear}>
                  清空
                </Button>
              </div>
            </div>
            <CanvasBody>
              {widgets.length === 0 ? (
                <div className={styles.empty}>
                  从左侧拖入或点选组件进行表单设计
                </div>
              ) : (
                <SortableContext
                  items={widgets.map((w) => w.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <Form
                    layout={config.layout}
                    labelCol={
                      config.layout === 'horizontal'
                        ? { flex: '80px' }
                        : undefined
                    }
                  >
                    <Row gutter={config.gutter || 0}>
                      {widgets.map((w) => (
                        <SortableWidget
                          key={w.id}
                          widget={w}
                          selected={w.id === selectedId}
                          selectedId={selectedId}
                          draggingFromPalette={draggingFromPalette}
                          onSelect={setSelectedId}
                          onDelete={(id) => {
                            setWidgets((prev) => removeWidget(prev, id));
                            if (selectedId === id) setSelectedId(undefined);
                          }}
                        />
                      ))}
                    </Row>
                  </Form>
                </SortableContext>
              )}
            </CanvasBody>
            <DragOverlay dropAnimation={defaultDropAnimation}>
              {activeType ? (
                <div className={styles.overlay}>
                  {activeType === 'row' ? (
                    <div className={styles.rowTitle}>
                      <HolderOutlined style={{ marginRight: 6 }} />
                      {widgetTitles.row}
                    </div>
                  ) : (
                    <Form.Item
                      label={widgetTitles[activeType]}
                      style={{ marginBottom: 0, width: 320 }}
                    >
                      {renderPreview(createWidget(activeType, -1))}
                    </Form.Item>
                  )}
                </div>
              ) : null}
            </DragOverlay>
          </div>

          {/* 右：属性面板 */}
          <div className={`${styles.panel} ${styles.properties}`}>
            <div style={{ marginLeft: 8, fontWeight: 600 }}>属性配置</div>
            <RightPanel
              activeData={selectedWidget}
              formConfig={config}
              onWidgetChange={(patch) => {
                if (selectedId == null) return;
                setWidgets((prev) => patchWidget(prev, selectedId, patch));
              }}
              onFormChange={(patch) =>
                setConfig((prev) => ({ ...prev, ...patch }))
              }
            />
          </div>
        </div>
      </DndContext>

      {/* 生成类型选择弹窗 */}
      <CodeTypeDialog
        open={genOpen}
        onOpenChange={setGenOpen}
        showFileName={genShowFileName}
        onConfirm={(data) => {
          if (genShowFileName) {
            handleExport(data);
          } else {
            handleCopy(data);
          }
        }}
      />
    </PageContainer>
  );
};

/** 画布放置区域（支持接收左侧组件拖入） */
const CanvasBody = ({ children }: { children: React.ReactNode }) => {
  const { styles } = useStyles();
  const { setNodeRef } = useDroppable({ id: 'canvas-body' });
  return (
    <div ref={setNodeRef} className={styles.canvasBody}>
      {children}
    </div>
  );
};

export default PageGen;
