<!--
  PageGen（表单设计器）
  功能：拖拽式表单设计，支持组件添加、属性配置、代码生成
  @author xuxueli 2026-11-22
-->
<template>
  <div class="container">
    <!-- 左侧面板 -->
    <div class="left-board">
      <!-- 标题 -->
      <div class="logo-wrapper">
        <div class="logo">{{ t('tool.pagegen.logoTitle') }}</div>
      </div>

      <!-- 组件选择区 -->
      <el-scrollbar class="left-scrollbar">
        <div class="components-list">
          <div class="components-title">
            <SvgIcon icon-class="component" />
            {{ t('tool.pagegen.inputComponents') }}
          </div>
          <draggable
            class="components-draggable"
            :list="inputComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
            item-key="label"
          >
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <SvgIcon :icon-class="element.tagIcon" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>

          <div class="components-title">
            <SvgIcon icon-class="component" />
            {{ t('tool.pagegen.selectComponents') }}
          </div>
          <draggable
            class="components-draggable"
            :list="selectComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
            item-key="label"
          >
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <SvgIcon :icon-class="element.tagIcon" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>

          <div class="components-title">
            <SvgIcon icon-class="component" />
            {{ t('tool.pagegen.layoutComponents') }}
          </div>
          <draggable
            class="components-draggable"
            :list="layoutComponents"
            :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
            :clone="cloneComponent"
            draggable=".components-item"
            :sort="false"
            @end="onEnd"
            item-key="label"
          >
            <template #item="{ element, index }">
              <div :key="index" class="components-item" @click="addComponent(element)">
                <div class="components-body">
                  <SvgIcon :icon-class="element.tagIcon" />
                  {{ element.label }}
                </div>
              </div>
            </template>
          </draggable>
        </div>
      </el-scrollbar>
    </div>

    <!-- 中间画布 -->
    <div class="center-board">
      <!-- 中间画布操作栏 -->
      <div class="action-bar">
        <el-button icon="Download" type="primary" text @click="download"> {{ t('tool.pagegen.exportVue') }} </el-button>
        <el-button class="copy-btn-main" icon="DocumentCopy" type="primary" text @click="copy"> {{ t('tool.pagegen.copyCode') }} </el-button>
        <el-button class="delete-btn" icon="Delete" text @click="empty" type="danger"> {{ t('common.clear') }} </el-button>
      </div>

      <!-- 中间画布 -->
      <el-scrollbar class="center-scrollbar">
        <el-row class="center-board-row" :gutter="formConf.gutter">
          <el-form
            :size="formConf.size"
            :label-position="formConf.labelPosition"
            :disabled="formConf.disabled"
            :label-width="formConf.labelWidth + 'px'"
          >
            <!-- 拖拽区域内容 -->
            <draggable class="drawing-board" :list="canvas.drawingList" :animation="340" group="componentsGroup" item-key="label">
              <template #item="{ element, index }">
                <DraggableItem
                  :key="element.renderKey"
                  :drawing-list="canvas.drawingList"
                  :element="element"
                  :index="index"
                  :active-id="canvas.activeId"
                  :form-conf="formConf"
                  @activeItem="activeFormItem"
                  @copyItem="drawingItemCopy"
                  @deleteItem="drawingItemDelete"
                />
              </template>
            </draggable>

            <!-- 拖拽区域，为空 -->
            <div v-show="!canvas.drawingList.length" class="empty-info">{{ t('tool.pagegen.emptyInfo') }}</div>
          </el-form>
        </el-row>
      </el-scrollbar>
    </div>

    <!-- 右侧属性面板 -->
    <RightPanel :active-data="canvas.activeData" :form-conf="formConf" :show-field="!!canvas.drawingList.length" @tag-change="tagChange" />

    <!-- 代码生成类型选择弹窗 -->
    <CodeTypeDialog
      v-model="genDialog.dialogVisible"
      :title="t('tool.pagegen.selectGenType')"
      :show-file-name="genDialog.showFileName"
      @confirm="generate"
    />

    <!-- 隐藏的复制节点 -->
    <input id="copyNode" type="hidden" />
  </div>
</template>

<script setup lang="ts">
defineOptions({ name: 'PageGen' })

import { nextTick, onMounted, onUnmounted, provide, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import ClipboardJS from 'clipboard'
import beautifier from 'js-beautify'
import { ElNotification } from 'element-plus'
import { t } from '@/i18n'
import { SvgIcon } from '@/components'
import type { FormConf, FormItemConf } from '@/utils/generator/config'
import { beautifierConf, formConf as formConfData, inputComponents, layoutComponents, selectComponents } from '@/utils/generator/config'
import { cleanDrawingDefaultValue, drawingDefaultValue, initDrawingDefaultValue } from '@/utils/generator/drawingDefault'
import { cssStyle, makeUpHtml, vueScript, vueTemplate } from '@/utils/generator/html'
import { makeUpCss } from '@/utils/generator/css'
import { makeUpJs } from '@/utils/generator/js'
import Download from '@/utils/download'
import modal from '@/utils/modal'
import CodeTypeDialog from './CodeTypeDialog.vue'
import DraggableItem from './DraggableItem.vue'
import RightPanel from './RightPanel.vue'

/** 代码生成方式 */
type GenerateOperation = 'copy' | 'download'

/** 代码生成弹窗回传的生成配置 */
interface GenerateConfig {
  /** 下载文件名 */
  fileName?: string
  /** 生成类型：file-页面、dialog-弹窗 */
  type: string
}

/** 画布状态 */
interface CanvasState {
  /** 画布中的组件列表 */
  drawingList: FormItemConf[]
  /** 当前选中组件 */
  activeData: FormItemConf
  /** 当前选中组件 ID */
  activeId: number | string
}

/** 代码生成弹窗状态 */
interface GenDialogState {
  /** 弹窗显隐 */
  dialogVisible: boolean
  /** 是否显示文件名输入 */
  showFileName: boolean
  /** 生成方式 */
  operationType: GenerateOperation | ''
  /** 生成配置，确认生成后写入 */
  generateConf: GenerateConfig | null
  /** 表单组装数据：全局配置 + 画布组件 */
  formData: FormConf & { fields: FormItemConf[] }
}

/** 拖拽结束事件，仅关心来源与目标容器 */
interface DragEndEvent {
  /** 拖拽来源容器 */
  from: unknown
  /** 拖拽目标容器 */
  to: unknown
}

// ---------------------- 响应式数据 ----------------------

// 初始化画布默认配置
initDrawingDefaultValue()

// 画布状态
const canvas = ref<CanvasState>({
  drawingList: drawingDefaultValue,
  activeData: drawingDefaultValue[0],
  activeId: drawingDefaultValue[0].formId ?? 0
})

// 上一次选中 ID，用于占位提示联动
let oldActiveId: number | string | undefined
// 拖拽结束暂存的激活组件
let tempActiveData: FormItemConf | undefined

// 代码生成弹窗状态
const genDialog = ref<GenDialogState>({
  dialogVisible: false,
  showFileName: false,
  operationType: '',
  generateConf: null,
  formData: {} as FormConf & { fields: FormItemConf[] }
})

// 全局组件 ID 自增，通过 provide 供子组件分配组件 ID
const idGlobal = ref(100)
// 将 ID 生成器注入画布子组件
provide('idGlobal', idGlobal)
// 表单全局配置
const formConf = ref(formConfData)

// ---------------------- 画布操作 ----------------------

/**
 * 激活选中组件，同步属性面板数据
 *
 * @param element 被选中的组件
 */
function activeFormItem(element: FormItemConf) {
  canvas.value.activeData = element
  canvas.value.activeId = element.formId!
}

/**
 * 拖拽结束回调：从组件库拖入画布时，激活拖入的组件
 *
 * @param event 拖拽结束事件
 */
function onEnd(event: DragEndEvent) {
  // 仅处理跨容器拖拽（组件库 → 画布），同容器内排序不切换选中项
  if (event.from !== event.to && tempActiveData) {
    canvas.value.activeData = tempActiveData
    canvas.value.activeId = idGlobal.value
  }
}

/**
 * 点击添加组件到画布
 *
 * @param item 组件库中的源组件
 */
function addComponent(item: FormItemConf) {
  const clone = cloneComponent(item)
  canvas.value.drawingList.push(clone)
  activeFormItem(clone)
}

/**
 * 克隆组件：生成新 ID，并设置 vModel / componentName
 *
 * @param origin 源组件配置
 * @returns 克隆后的组件配置
 */
function cloneComponent(origin: FormItemConf): FormItemConf {
  const clone: FormItemConf = JSON.parse(JSON.stringify(origin)) as FormItemConf
  clone.formId = ++idGlobal.value
  clone.span = formConf.value.span
  // 改变 renderKey 实现画布强制更新
  clone.renderKey = +new Date()
  if (!clone.layout) clone.layout = 'colFormItem'
  if (clone.layout === 'colFormItem') {
    clone.vModel = `field${idGlobal.value}`
    // 占位提示需要跟随字段标题，保持两者语义一致
    if (clone.placeholder !== undefined) clone.placeholder += clone.label
    tempActiveData = clone
  } else if (clone.layout === 'rowFormItem') {
    delete clone.label
    clone.componentName = `row${idGlobal.value}`
    clone.gutter = formConf.value.gutter
    tempActiveData = clone
  }
  return clone
}

/**
 * 复制画布中的组件，副本插入到同一父级列表
 *
 * @param item 被复制的组件
 * @param parent 组件所属列表
 */
function drawingItemCopy(item: FormItemConf, parent: FormItemConf[]) {
  const clone = createIdAndKey(JSON.parse(JSON.stringify(item)) as FormItemConf)
  parent.push(clone)
  activeFormItem(clone)
}

/**
 * 递归生成新 ID 和 renderKey
 *
 * @param item 待处理的组件
 * @returns 处理后的组件
 */
function createIdAndKey(item: FormItemConf): FormItemConf {
  item.formId = ++idGlobal.value
  item.renderKey = +new Date()
  if (item.layout === 'colFormItem') {
    item.vModel = `field${idGlobal.value}`
  } else if (item.layout === 'rowFormItem') {
    item.componentName = `row${idGlobal.value}`
  }
  if (Array.isArray(item.children)) {
    item.children = item.children.map((childItem) => createIdAndKey(childItem))
  }
  return item
}

/**
 * 删除画布中的组件
 *
 * @param index 待删除组件下标
 * @param parent 组件所属列表
 */
function drawingItemDelete(index: number | undefined, parent: FormItemConf[]) {
  // 下标缺失时无法定位组件，直接返回避免误删首项
  if (index == null) return
  parent.splice(index, 1)
  nextTick(() => {
    // 删除后选中画布最后一个组件，避免属性面板停留在已删除数据
    const len = canvas.value.drawingList.length
    if (len) {
      activeFormItem(canvas.value.drawingList[len - 1])
    }
  })
}

/**
 * 切换组件类型：保留 vModel / formId / span，其余同类型属性沿用原值
 *
 * @param newTag 新组件类型配置
 */
function tagChange(newTag: FormItemConf) {
  newTag = cloneComponent(newTag)
  newTag.vModel = canvas.value.activeData.vModel
  newTag.formId = canvas.value.activeId
  newTag.span = canvas.value.activeData.span
  delete canvas.value.activeData.tag
  delete canvas.value.activeData.tagIcon
  delete canvas.value.activeData.document
  for (const key of Object.keys(newTag)) {
    if (canvas.value.activeData[key] !== undefined && typeof canvas.value.activeData[key] === typeof newTag[key]) {
      newTag[key] = canvas.value.activeData[key]
    }
  }
  canvas.value.activeData = newTag
  updateDrawingList(newTag, canvas.value.drawingList)
}

/**
 * 更新画布中的组件数据（支持行容器递归替换）
 *
 * @param newTag 新组件数据
 * @param list 待查找的组件列表
 */
function updateDrawingList(newTag: FormItemConf, list: FormItemConf[]) {
  const index = list.findIndex((item) => item.formId === canvas.value.activeId)
  if (index > -1) {
    list.splice(index, 1, newTag)
  } else {
    list.forEach((item) => {
      if (Array.isArray(item.children)) updateDrawingList(newTag, item.children)
    })
  }
}

/**
 * 清空画布所有组件
 */
function empty() {
  modal
    .confirm(t('tool.pagegen.confirmClear'))
    .then(() => {
      idGlobal.value = 100
      canvas.value.drawingList = []
      cleanDrawingDefaultValue()
    })
    .catch(() => {})
}

// ---------------------- 代码生成 ----------------------

/**
 * 复制代码到剪贴板：打开弹窗，不显示文件名输入
 */
function copy() {
  genDialog.value.dialogVisible = true
  genDialog.value.showFileName = false
  genDialog.value.operationType = 'copy'
}

/**
 * 下载 vue 文件：打开弹窗，显示文件名输入
 */
function download() {
  genDialog.value.dialogVisible = true
  genDialog.value.showFileName = true
  genDialog.value.operationType = 'download'
}

/**
 * 生成代码：弹窗确认后按操作类型执行复制或下载
 *
 * @param conf 弹窗回传的生成配置
 */
function generate(conf: GenerateConfig) {
  genDialog.value.generateConf = conf
  nextTick(() => {
    switch (genDialog.value.operationType) {
      case 'copy':
        execCopy()
        break
      case 'download':
        execDownload(conf)
        break
      default:
        break
    }
  })
}

/**
 * 下载生成的 vue 文件
 *
 * @param conf 生成配置（含文件名）
 */
function execDownload(conf: GenerateConfig) {
  const codeStr = generateCode()
  const blob = new Blob([codeStr], { type: 'text/plain;charset=utf-8' })
  // 文件名缺失时回退到时间戳，避免保存流程因空文件名中断
  Download.saveAs(blob, conf.fileName ?? `${+new Date()}.vue`)
}

/**
 * 复制代码到剪贴板：触发隐藏节点，内容由 ClipboardJS 回调生成
 */
function execCopy() {
  document.getElementById('copyNode')?.click()
}

/**
 * 组装生成数据：画布组件快照 + 表单全局配置
 */
function assembleFormData() {
  genDialog.value.formData = {
    // 深拷贝画布组件，避免生成过程反向修改画布
    fields: JSON.parse(JSON.stringify(canvas.value.drawingList)) as FormItemConf[],
    ...formConf.value
  } as FormConf & { fields: FormItemConf[] }
}

/**
 * 生成 vue 代码（template + script + style）
 *
 * @returns 格式化后的完整代码
 */
function generateCode() {
  const type = genDialog.value.generateConf?.type ?? 'file'
  assembleFormData()
  const script = vueScript(makeUpJs(genDialog.value.formData, type))
  const html = vueTemplate(makeUpHtml(genDialog.value.formData, type))
  const css = cssStyle(makeUpCss(genDialog.value.formData))
  return beautifier.html(html + script + css, beautifierConf.html)
}

// ---------------------- 页面初始化 ----------------------

// 监听选中组件标题变化，同步更新占位提示
watch(
  () => canvas.value.activeData.label,
  (val, oldVal) => {
    const activeData = canvas.value.activeData
    // 占位提示未初始化、组件无 tag 或切换了选中项时不做联动
    if (activeData.placeholder === undefined || !activeData.tag || oldActiveId !== canvas.value.activeId) {
      return
    }
    activeData.placeholder = activeData.placeholder.replace(oldVal ?? '', '') + (val ?? '')
  }
)

// 记录当前激活 ID，供上方标题监听判断是否切换了选中项
watch(
  () => canvas.value.activeId,
  (val) => {
    oldActiveId = val
  },
  { immediate: true }
)

// 剪切板实例，组件卸载时销毁
let clipboard: ClipboardJS | null = null

// 页面挂载后初始化剪贴板，用于复制生成的页面配置代码
onMounted(() => {
  // 复制动作由隐藏节点触发，ClipboardJS 在回调中生成代码并写入剪贴板
  clipboard = new ClipboardJS('#copyNode', {
    text: () => {
      const codeStr = generateCode()
      ElNotification({ title: t('tool.pagegen.success'), message: t('tool.pagegen.copyClipboard'), type: 'success' })
      return codeStr
    }
  })
  clipboard.on('error', () => {
    modal.msgError(t('tool.pagegen.copyFail'))
  })
})

// 页面卸载时销毁剪贴板实例，避免内存泄漏
onUnmounted(() => {
  clipboard?.destroy()
})
</script>

<style lang="scss">
$lighterBlue: #409eff;

.container {
  position: relative;
  width: 100%;
  background-color: var(--el-bg-color-overlay);
  height: calc(100vh - 50px - 40px);
  overflow: hidden;

  .left-board {
    width: 260px;
    position: absolute;
    left: 0;
    top: 0;
    height: calc(100vh - 50px - 40px);

    .logo-wrapper {
      position: relative;
      height: 42px;
      border-bottom: 1px solid var(--el-border-color-extra-light);
      box-sizing: border-box;

      .logo {
        position: absolute;
        left: 12px;
        top: 6px;
        line-height: 30px;
        color: #00afff;
        font-weight: 600;
        font-size: 17px;
        white-space: nowrap;

        .github {
          display: inline-block;
          vertical-align: sub;
          margin-left: 15px;
        }
      }
    }

    .left-scrollbar {
      .el-scrollbar__wrap {
        box-sizing: border-box;
        overflow-x: hidden !important;
        margin-bottom: 0 !important;

        .components-list {
          padding: 8px;
          box-sizing: border-box;
          height: 100%;

          .components-title {
            font-size: 14px;
            // color: #222;
            margin: 6px 2px;

            .svg-icon {
              // color: #666;
              font-size: 18px;
              margin-right: 5px;
            }
          }

          .components-draggable {
            padding-bottom: 20px;

            .components-item {
              display: inline-block;
              width: 48%;
              margin: 1%;
              transition: transform 0ms !important;

              .components-body {
                padding: 8px 10px;
                background: var(--el-border-color-extra-light);
                font-size: 12px;
                cursor: move;
                border: 1px dashed var(--el-border-color-extra-light);
                border-radius: 3px;

                .svg-icon {
                  // color: #777;
                  font-size: 15px;
                  margin-right: 5px;
                }

                &:hover {
                  border: 1px dashed #787be8;
                  color: #787be8;

                  .svg-icon {
                    color: #787be8;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  .center-board {
    height: calc(100vh - 50px - 40px);
    width: auto;
    margin: 0 350px 0 260px;
    box-sizing: border-box;

    .action-bar {
      position: relative;
      height: 42px;
      padding: 0 15px;
      box-sizing: border-box;
      border: 1px solid var(--el-border-color-extra-light);
      border-top: none;
      border-left: none;
      display: flex;
      align-items: center;
      justify-content: flex-end;

      u .delete-btn {
        color: #f56c6c;
      }
    }

    .center-scrollbar {
      height: calc(100vh - 50px - 40px - 42px);
      overflow: hidden;
      border-left: 1px solid var(--el-border-color-extra-light);
      border-right: 1px solid var(--el-border-color-extra-light);
      box-sizing: border-box;

      .el-scrollbar__view {
        overflow-x: hidden;
      }

      .center-board-row {
        padding: 12px 12px 15px 12px;
        box-sizing: border-box;

        & > .el-form {
          // 69 = 12+15+42
          height: calc(100vh - 50px - 40px - 69px);
          flex: 1;

          .drawing-board {
            height: 100%;
            position: relative;

            .components-body {
              padding: 0;
              margin: 0;
              font-size: 0;
            }

            .sortable-ghost {
              position: relative;
              display: block;
              overflow: hidden;

              &::before {
                content: ' ';
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                height: 3px;
                background: rgb(89, 89, 223);
                z-index: 2;
              }
            }

            .components-item.sortable-ghost {
              width: 100%;
              height: 60px;
              background: var(--el-border-color-extra-light);
            }

            .active-from-item {
              & > .el-form-item {
                background: var(--el-border-color-extra-light);
                border-radius: 6px;
              }

              & > .drawing-item-copy,
              & > .drawing-item-delete {
                display: initial;
              }

              & > .component-name {
                color: $lighterBlue;
              }

              .el-input__wrapper {
                box-shadow: 0 0 0 1px var(--el-input-hover-border-color) inset;
              }
            }

            .el-form-item {
              margin-bottom: 15px;
            }
          }

          .drawing-item {
            position: relative;
            cursor: move;

            &.unfocus-bordered:not(.activeFromItem) > div:first-child {
              border: 1px dashed #ccc;
            }

            .el-form-item {
              padding: 12px 10px;
            }
          }

          .drawing-row-item {
            position: relative;
            cursor: move;
            box-sizing: border-box;
            border: 1px dashed #ccc;
            border-radius: 3px;
            padding: 0 2px;
            margin-bottom: 15px;

            .drawing-row-item {
              margin-bottom: 2px;
            }

            .el-col {
              margin-top: 22px;
            }

            .el-form-item {
              margin-bottom: 0;
            }

            .drag-wrapper {
              min-height: 80px;
              flex: 1;
              display: flex;
              flex-wrap: wrap;
            }

            &.active-from-item {
              border: 1px dashed $lighterBlue;
            }

            .component-name {
              position: absolute;
              top: 0;
              left: 0;
              font-size: 12px;
              color: #bbb;
              display: inline-block;
              padding: 0 6px;
            }
          }

          .drawing-item,
          .drawing-row-item {
            &:hover {
              & > .el-form-item {
                background: var(--el-border-color-extra-light);
                border-radius: 6px;
              }

              & > .drawing-item-copy,
              & > .drawing-item-delete {
                display: initial;
              }
            }

            & > .drawing-item-copy,
            & > .drawing-item-delete {
              display: none;
              position: absolute;
              top: -10px;
              width: 22px;
              height: 22px;
              line-height: 22px;
              text-align: center;
              border-radius: 50%;
              font-size: 12px;
              border: 1px solid;
              cursor: pointer;
              z-index: 1;
            }

            & > .drawing-item-copy {
              right: 56px;
              border-color: $lighterBlue;
              color: $lighterBlue;
              background: #fff;

              &:hover {
                background: $lighterBlue;
                color: #fff;
              }
            }

            & > .drawing-item-delete {
              right: 24px;
              border-color: #f56c6c;
              color: #f56c6c;
              background: #fff;

              &:hover {
                background: #f56c6c;
                color: #fff;
              }
            }
          }

          .empty-info {
            position: absolute;
            top: 46%;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 18px;
            color: #ccb1ea;
            letter-spacing: 4px;
          }
        }
      }
    }
  }
}
</style>
