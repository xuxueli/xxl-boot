/**
 * 页面：PageGen（表单/页面生成器）
 * 功能：拖拽式表单设计，支持组件添加、属性配置、React+antd 代码生成
 */
import { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Drawer, Form, Input, InputNumber, Modal, Radio, Select, Tabs } from 'antd'
import { CopyOutlined, DownloadOutlined, DeleteOutlined, ClearOutlined, EyeOutlined } from '@ant-design/icons'
import ClipboardJS from 'clipboard'
import beautifier from 'js-beautify'
import SvgIcon from '@/components/SvgIcon'
import IconSelect, { type IconSelectHandle } from '@/components/IconSelect'
import {
  inputComponents,
  selectComponents,
  layoutComponents,
  formConf as formConfData,
  beautifierConf,
  type FormConf,
  type FormItemConf
} from '@/utils/generator/config'
import { drawingDefaultValue, initDrawingDefaultValue, cleanDrawingDefaultValue } from '@/utils/generator/drawingDefault'
import { makeUpHtml, vueTemplate, vueScript, cssStyle } from '@/utils/generator/html'
import { makeUpJs } from '@/utils/generator/js'
import { makeUpCss } from '@/utils/generator/css'
import RenderForm from '@/utils/generator/render'
import Download from '@/utils/download'
import modal from '@/utils/modal'
import './pagegen.scss'

/** 画布状态 */
interface CanvasState {
  drawingList: FormItemConf[]
  activeData: FormItemConf
  activeId: number | string
}

export default function PageGen() {
  // 初始化画布默认配置
  useEffect(() => {
    initDrawingDefaultValue()
  }, [])

  // 画布状态
  const [canvas, setCanvas] = useState<CanvasState>({
    drawingList: drawingDefaultValue,
    activeData: drawingDefaultValue[0],
    activeId: drawingDefaultValue[0].formId!
  })

  // 生成代码弹窗状态
  const [genDialog, setGenDialog] = useState({
    dialogVisible: false,
    showFileName: false,
    operationType: '' as 'copy' | 'download',
    generateConf: null as any,
    formData: {} as FormConf & { fields: FormItemConf[] }
  })

  // 全局组件 ID 自增
  const idGlobalRef = useRef(100)
  // 表单全局配置
  const [formConf, setFormConf] = useState<FormConf>(formConfData)
  // 预览弹窗
  const [previewVisible, setPreviewVisible] = useState(false)
  // 生成类型
  const [genType, setGenType] = useState('file')
  // 文件名
  const [fileName, setFileName] = useState('form')

  /**
   * 激活选中组件
   */
  function activeFormItem(element: FormItemConf) {
    setCanvas((prev) => ({ ...prev, activeData: element, activeId: element.formId! }))
  }

  /**
   * 复制代码：打开弹框
   */
  function copy() {
    setGenDialog((prev) => ({ ...prev, dialogVisible: true, showFileName: false, operationType: 'copy' }))
  }

  /**
   * 下载文件：打开弹框
   */
  function download() {
    setGenDialog((prev) => ({ ...prev, dialogVisible: true, showFileName: true, operationType: 'download' }))
  }

  /**
   * 清空画布
   */
  function empty() {
    modal.confirm('确定要清空所有组件吗？').then(() => {
      idGlobalRef.current = 100
      cleanDrawingDefaultValue()
      setCanvas((prev) => ({ ...prev, drawingList: [] }))
    })
  }

  /**
   * 克隆组件：生成新 ID、设置 vModel
   */
  function cloneComponent(origin: FormItemConf): FormItemConf {
    const clone: FormItemConf = JSON.parse(JSON.stringify(origin))
    clone.formId = ++idGlobalRef.current
    clone.span = formConf.span
    clone.renderKey = +new Date()
    if (!clone.layout) clone.layout = 'colFormItem'
    if (clone.layout === 'colFormItem') {
      clone.vModel = `field${idGlobalRef.current}`
    } else if (clone.layout === 'rowFormItem') {
      delete clone.label
      clone.componentName = `row${idGlobalRef.current}`
      clone.gutter = formConf.gutter
    }
    return clone
  }

  /**
   * 点击添加组件到画布
   */
  function addComponent(item: FormItemConf) {
    const clone = cloneComponent(item)
    const drawingList = [...canvas.drawingList, clone]
    setCanvas((prev) => ({ ...prev, drawingList }))
    activeFormItem(clone)
  }

  /**
   * 画布拖拽排序：拖拽结束
   */
  const handleCanvasDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  /**
   * 组件库拖拽开始：记录拖拽的组件
   */
  const handlePaletteDragStart = (e: React.DragEvent, item: FormItemConf) => {
    e.dataTransfer.setData('text/plain', '')
    e.dataTransfer.effectAllowed = 'copy'
    dragItemRef.current = item
  }

  /**
   * 画布放置：克隆组件入库
   */
  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (dragItemRef.current) {
      const clone = cloneComponent(dragItemRef.current)
      const drawingList = [...canvas.drawingList, clone]
      setCanvas((prev) => ({ ...prev, drawingList }))
      activeFormItem(clone)
      dragItemRef.current = null
    }
  }

  const dragItemRef = useRef<FormItemConf | null>(null)

  /**
   * 删除画布中的组件
   */
  function drawingItemDelete(index: number) {
    const drawingList = canvas.drawingList.filter((_, i) => i !== index)
    setCanvas((prev) => ({ ...prev, drawingList }))
    if (drawingList.length) {
      activeFormItem(drawingList[drawingList.length - 1])
    }
  }

  /**
   * 组装表单数据
   */
  function assembleFormData() {
    return { fields: JSON.parse(JSON.stringify(canvas.drawingList)), ...formConf }
  }

  /**
   * 生成代码
   */
  function generateCode(): string {
    const formData = assembleFormData()
    const script = vueScript(makeUpJs(formData, genType))
    const html = vueTemplate(makeUpHtml(formData, genType))
    const css = cssStyle(makeUpCss(formData))
    return beautifier.html(html + script + css, beautifierConf.html)
  }

  /**
   * 生成代码：弹窗确认后执行
   */
  function generate(data: any) {
    setGenDialog((prev) => ({ ...prev, generateConf: data }))
    if (genDialog.operationType === 'download') {
      const codeStr = generateCode()
      const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
      Download.saveAs(blob, data.fileName || 'form.jsx')
    }
    // copy 类型由 clipboard 按钮触发
  }

  // 初始化剪切板复制
  useEffect(() => {
    const clipboard = new ClipboardJS('#copyNode', {
      text: () => {
        const codeStr = generateCode()
        modal.msgSuccess('代码已复制到剪切板，可粘贴。')
        return codeStr
      }
    })
    clipboard.on('error', () => {
      modal.msgError('代码复制失败')
    })
    return () => {
      clipboard.destroy()
    }
     
  }, [])

  // 组件分组
  const componentGroups = [
    { title: '输入型组件', list: inputComponents },
    { title: '选择型组件', list: selectComponents },
    { title: '布局型组件', list: layoutComponents }
  ]

  // 预览渲染数据
  const previewValue = useMemo(() => {
    const obj: Record<string, unknown> = {}
    canvas.drawingList.forEach((el) => {
      if (el.vModel) obj[el.vModel] = el.defaultValue
      el.children?.forEach((c) => {
        if (c.vModel) obj[c.vModel] = c.defaultValue
      })
    })
    return obj
  }, [canvas.drawingList])

  return (
    <div className="container">
      {/* 左侧面板 */}
      <div className="left-board">
        <div className="logo-wrapper">
          <div className="logo">表单生成器 / Form Generator</div>
        </div>
        <div className="left-scrollbar">
          <div className="components-list">
            {componentGroups.map((group) => (
              <div key={group.title}>
                <div className="components-title">
                  <SvgIcon iconClass="component" />
                  {group.title}
                </div>
                <div className="components-draggable">
                  {group.list.map((item, index) => (
                    <div
                      key={index}
                      className="components-item"
                      draggable
                      onDragStart={(e) => handlePaletteDragStart(e, item)}
                      onClick={() => addComponent(item)}
                    >
                      <div className="components-body">
                        <SvgIcon iconClass={item.tagIcon} />
                        {item.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 中间画布 */}
      <div className="center-board">
        <div className="action-bar">
          <Button icon={<CopyOutlined />} onClick={copy}>
            复制代码
          </Button>
          <Button icon={<DownloadOutlined />} onClick={download}>
            下载代码
          </Button>
          <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)}>
            预览
          </Button>
          <Button danger icon={<ClearOutlined />} onClick={empty}>
            清空
          </Button>
        </div>
        <div
          className="center-scrollbar"
          onDragOver={handleCanvasDragOver}
          onDrop={handleCanvasDrop}
        >
          <RenderForm
            conf={formConf}
            draw={canvas.drawingList}
            value={previewValue}
            activeId={canvas.activeId}
            onSelect={activeFormItem}
          />
        </div>
      </div>

      {/* 右侧属性面板 */}
      <RightPanel
        formConf={formConf}
        onFormConfChange={(v) => setFormConf((prev) => ({ ...prev, ...v }))}
        activeData={canvas.activeData}
        drawingList={canvas.drawingList}
        onDrawingListChange={(list) => setCanvas((prev) => ({ ...prev, drawingList: list }))}
        onDelete={drawingItemDelete}
      />

      {/* 生成类型弹窗 */}
      <Modal
        title="生成代码"
        open={genDialog.dialogVisible}
        onCancel={() => setGenDialog((prev) => ({ ...prev, dialogVisible: false }))}
        onOk={() => generate({ fileName: fileName || 'form' })}
        okText="确 定"
        cancelText="取 消"
      >
        <Form layout="vertical">
          <Form.Item label="生成类型">
            <Radio.Group value={genType} onChange={(e) => setGenType(e.target.value)}>
              <Radio value="file">文件</Radio>
              <Radio value="dialog">弹窗</Radio>
            </Radio.Group>
          </Form.Item>
          {genDialog.showFileName && (
            <Form.Item label="文件名">
              <Input value={fileName} onChange={(e) => setFileName(e.target.value)} placeholder="请输入文件名" />
            </Form.Item>
          )}
          {genDialog.operationType === 'copy' && (
            <Button type="primary" id="copyNode" style={{ width: '100%' }}>
              点击复制代码到剪切板
            </Button>
          )}
        </Form>
      </Modal>

      {/* 预览弹窗 */}
      <Modal title="表单预览" open={previewVisible} footer={null} width={720} onCancel={() => setPreviewVisible(false)}>
        <RenderForm conf={formConf} draw={canvas.drawingList} value={previewValue} />
      </Modal>
    </div>
  )
}

/**
 * 右侧属性面板
 */
interface RightPanelProps {
  formConf: FormConf
  onFormConfChange: (v: Partial<FormConf>) => void
  activeData: FormItemConf
  drawingList: FormItemConf[]
  onDrawingListChange: (list: FormItemConf[]) => void
  onDelete: (index: number) => void
}

function RightPanel({ formConf, onFormConfChange, activeData, drawingList, onDrawingListChange, onDelete }: RightPanelProps) {
  const iconSelectRef = useRef<IconSelectHandle>(null)
  // 编辑模式：组件属性 / 表单属性
  const [mode, setMode] = useState<'field' | 'form'>('field')

  /**
   * 更新当前选中组件属性
   */
  function updateField(partial: Partial<FormItemConf>) {
    const updateIn = (list: FormItemConf[]): FormItemConf[] =>
      list.map((item) => {
        if (item.formId === activeData.formId) {
          return { ...item, ...partial }
        }
        if (item.children && item.children.length) {
          return { ...item, children: updateIn(item.children) }
        }
        return item
      })
    onDrawingListChange(updateIn(drawingList))
  }

  /**
   * 更新选项列表
   */
  function updateOptions(options: any[]) {
    updateField({ options })
  }

  const activeIndex = drawingList.findIndex((item) => item.formId === activeData.formId)

  return (
    <div className="right-board">
      <div className="field-config">
        <Tabs
          activeKey={mode}
          onChange={(key) => setMode(key as 'field' | 'form')}
          items={[
            { key: 'field', label: '组件属性' },
            { key: 'form', label: '表单属性' }
          ]}
        />
        {mode === 'field' && activeData && activeData.tag ? (
          <div className="content">
            <Form layout="vertical" size="small">
              <Form.Item label="字段名">
                <Input value={activeData.vModel} onChange={(e) => updateField({ vModel: e.target.value })} />
              </Form.Item>
              <Form.Item label="标题">
                <Input value={activeData.label} onChange={(e) => updateField({ label: e.target.value })} />
              </Form.Item>
              {activeData.placeholder !== undefined && (
                <Form.Item label="占位提示">
                  <Input value={activeData.placeholder} onChange={(e) => updateField({ placeholder: e.target.value })} />
                </Form.Item>
              )}
              <Form.Item label="栅格">
                <InputNumber
                  min={1}
                  max={24}
                  value={activeData.span}
                  onChange={(v) => updateField({ span: v || 24 })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              {activeData.min !== undefined && (
                <Form.Item label="最小值">
                  <InputNumber value={activeData.min} onChange={(v) => updateField({ min: v })} style={{ width: '100%' }} />
                </Form.Item>
              )}
              {activeData.max !== undefined && (
                <Form.Item label="最大值">
                  <InputNumber value={activeData.max} onChange={(v) => updateField({ max: v })} style={{ width: '100%' }} />
                </Form.Item>
              )}
              <Form.Item label="默认值">
                <Input value={activeData.defaultValue} onChange={(e) => updateField({ defaultValue: e.target.value })} />
              </Form.Item>
              <Form.Item label="是否必填">
                <Radio.Group value={activeData.required} onChange={(e) => updateField({ required: e.target.value })}>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="是否禁用">
                <Radio.Group value={activeData.disabled} onChange={(e) => updateField({ disabled: e.target.value })}>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
              {activeData.clearable !== undefined && (
                <Form.Item label="可清空">
                  <Radio.Group value={activeData.clearable} onChange={(e) => updateField({ clearable: e.target.value })}>
                    <Radio value={true}>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>
                </Form.Item>
              )}
              {activeData.icon !== undefined && (
                <Form.Item label="图标">
                  <IconSelect ref={iconSelectRef} activeIcon={activeData.icon} onSelected={(name) => updateField({ icon: name })} />
                </Form.Item>
              )}
              {Array.isArray(activeData.options) && (
                <Form.Item label="选项配置">
                  <div className="options-editor">
                    {activeData.options.map((opt: any, i: number) => (
                      <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                        <Input
                          placeholder="显示值"
                          value={opt.label}
                          onChange={(e) => {
                            const options = [...(activeData.options as any[])]
                            options[i] = { ...options[i], label: e.target.value }
                            updateOptions(options)
                          }}
                        />
                        <Input
                          placeholder="绑定值"
                          value={opt.value}
                          onChange={(e) => {
                            const options = [...(activeData.options as any[])]
                            options[i] = { ...options[i], value: e.target.value }
                            updateOptions(options)
                          }}
                        />
                        <Button
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => {
                            const options = [...(activeData.options as any[])]
                            options.splice(i, 1)
                            updateOptions(options)
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      block
                      onClick={() => {
                        const options = [...(activeData.options as any[]), { label: '选项', value: new Date().getTime() }]
                        updateOptions(options)
                      }}
                    >
                      添加选项
                    </Button>
                  </div>
                </Form.Item>
              )}
            </Form>
            {activeIndex > -1 && (
              <Button danger block icon={<DeleteOutlined />} onClick={() => onDelete(activeIndex)} style={{ marginTop: 12 }}>
                删除该组件
              </Button>
            )}
          </div>
        ) : (
          <div className="content" style={{ color: '#999' }}>
            请在画布中选中组件
          </div>
        )}

        {mode === 'form' && (
          <div className="content">
            <Form layout="vertical" size="small">
              <Form.Item label="表单栅格间隔">
                <InputNumber
                  value={formConf.gutter}
                  onChange={(v) => onFormConfChange({ gutter: v || 15 })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="标签宽度">
                <InputNumber
                  value={formConf.labelWidth}
                  onChange={(v) => onFormConfChange({ labelWidth: v || 100 })}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Form.Item label="标签位置">
                <Radio.Group
                  value={formConf.labelPosition}
                  onChange={(e) => onFormConfChange({ labelPosition: e.target.value })}
                >
                  <Radio value="right">右对齐</Radio>
                  <Radio value="left">左对齐</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="显示表单按钮">
                <Radio.Group value={formConf.formBtns} onChange={(e) => onFormConfChange({ formBtns: e.target.value })}>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Form>
          </div>
        )}
      </div>
    </div>
  )
}
