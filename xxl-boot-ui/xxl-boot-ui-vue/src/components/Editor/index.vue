<!--
  组件：Editor（富文本编辑器）
  功能：基于 Quill 的富文本编辑器，支持工具栏、图片上传（url/base64）、粘贴图片、
        自定义高度/只读模式。
  用法：<Editor v-model="form.content" :min-height="210" />
-->
<template>
  <!-- 隐藏的文件上传组件：点击工具栏图片按钮时触发 -->
  <div>
    <el-upload
      :action="uploadUrl"
      :before-upload="handleBeforeUpload"
      :on-success="handleUploadSuccess"
      :on-error="handleUploadError"
      name="file"
      :show-file-list="false"
      :headers="headers"
      class="editor-img-uploader"
      v-if="type === 'url'"
    >
      <i ref="uploadRef" class="editor-img-uploader"></i>
    </el-upload>
  </div>
  <!-- Quill 富文本编辑器 -->
  <div class="editor">
    <QuillEditor
      ref="quillEditorRef"
      v-model:content="content"
      contentType="html"
      @ready="onEditorReady"
      @textChange="(e) => $emit('update:modelValue', content)"
      :options="options"
      :style="styles"
    />
  </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { getAuthHeaders } from '@/utils/auth'
import modal from '@/utils/modal'
import { computed, onBeforeUnmount, ref, toRaw, watch } from 'vue'
import { t } from '@/i18n'

const quillEditorRef = ref<any>() // Quill 编辑器实例
const uploadRef = ref<any>(null) // 图片上传 input 引用
const uploadUrl = ref(import.meta.env.VITE_APP_BASE_API + '/file/upload') // 上传接口地址
const headers = ref(getAuthHeaders()) // 上传请求头（携带 token）

/*
 * defineProps：父传子
 */
const props = defineProps({
  // 编辑器的内容（v-model 双向绑定）
  modelValue: {
    type: String
  },
  // 编辑器高度（px），不传则自适应
  height: {
    type: Number,
    default: null
  },
  // 编辑器最小高度（px）
  minHeight: {
    type: Number,
    default: null
  },
  // 是否只读
  readOnly: {
    type: Boolean,
    default: false
  },
  // 上传文件大小限制（MB）
  fileSize: {
    type: Number,
    default: 5
  },
  // 图片上传方式：url（上传到服务器拿链接）/ base64（转 base64 直接嵌入）
  type: {
    type: String,
    default: 'url'
  }
})

// Quill 编辑器配置：主题、工具栏、只读模式
const options = ref<any>({
  theme: 'snow',
  bounds: document.body,
  debug: 'warn',
  modules: {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video']
    ]
  },
  placeholder: t('common.inputPlaceholder', [t('system.message.content')]),
  readOnly: props.readOnly
})

/**
 * 将文案包装为 CSS content 可用的字符串（带引号并转义）
 *
 * @param text 原始文案
 * @returns 可直接赋给 CSS 自定义属性的字符串
 */
function cssContent(text: string): string {
  return `"${text.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

// Quill 内置提示/字号下拉文案：通过 CSS 变量注入，语言切换时随计算属性更新
const editorTextVars = computed<Record<string, string>>(() => ({
  '--ql-link-tip': cssContent(t('components.editor.linkTip')),
  '--ql-video-tip': cssContent(t('components.editor.videoTip')),
  '--ql-save': cssContent(t('common.save')),
  '--ql-text': cssContent(t('components.editor.text')),
  '--ql-h1': cssContent(t('components.editor.heading1')),
  '--ql-h2': cssContent(t('components.editor.heading2')),
  '--ql-h3': cssContent(t('components.editor.heading3')),
  '--ql-h4': cssContent(t('components.editor.heading4')),
  '--ql-h5': cssContent(t('components.editor.heading5')),
  '--ql-h6': cssContent(t('components.editor.heading6')),
  '--ql-font-normal': cssContent(t('components.editor.fontNormal')),
  '--ql-font-serif': cssContent(t('components.editor.fontSerif')),
  '--ql-font-mono': cssContent(t('components.editor.fontMono'))
}))

// 编辑器样式：最小高度 / 高度（最小高度通过 CSS 变量作用于编辑区 .ql-editor）
const styles = computed(() => {
  let style: Record<string, any> = { ...editorTextVars.value }
  if (props.minHeight) {
    // 设置编辑区最小高度（CSS 变量），保证默认高度展示约 10 行
    style['--editor-min-height'] = `${props.minHeight}px`
  }
  if (props.height) {
    style.height = `${props.height}px`
  }
  return style
})

// 编辑器内部内容（双向同步 props.modelValue）
const content = ref('')
watch(
  () => props.modelValue,
  (v) => {
    if (v !== content.value) {
      content.value = v === undefined ? '<p></p>' : v
    }
  },
  { immediate: true }
)

// 编辑器初始化完成后：劫持工具栏图片按钮 + 监听粘贴事件
function onEditorReady(quill: any) {
  if (props.type === 'url') {
    let toolbar = quill.getModule('toolbar')
    // 劫持工具栏图片按钮
    toolbar.addHandler('image', (value: any) => {
      if (value) {
        uploadRef.value.click()
      } else {
        quill.format('image', false)
      }
    })
    // 粘贴板有图片时走 handlePasteCapture 上传
    quill.root.addEventListener('paste', handlePasteCapture, true)
  }
}

// 编辑器销毁时移除粘贴监听
onBeforeUnmount(() => {
  if (props.type === 'url' && quillEditorRef.value) {
    try {
      let quill = quillEditorRef.value.getQuill()
      quill.root.removeEventListener('paste', handlePasteCapture, true)
    } catch {
      /* editor may not have been initialized */
    }
  }
})

// 上传前校验格式和大小
function handleBeforeUpload(file: any) {
  // 与后端上传白名单保持一致（不含 svg，避免脚本型图片风险）
  const type = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp']
  const isJPG = type.includes(file.type)
  //检验文件格式
  if (!isJPG) {
    modal.msgError(t('components.editor.imageTypeError'))
    return false
  }
  // 校检文件大小
  if (props.fileSize) {
    const isLt = file.size / 1024 / 1024 < props.fileSize
    if (!isLt) {
      modal.msgError(t('components.upload.sizeError', [props.fileSize]))
      return false
    }
  }
  return true
}

// 上传成功：在光标位置插入图片
function handleUploadSuccess(res: any, file?: any) {
  if (res.code === 200) {
    let quill = toRaw(quillEditorRef.value).getQuill()
    // 获取光标位置
    let length = quill.selection.savedRange.index
    // 插入图片，res.data.fileName为服务器返回的图片链接地址
    quill.insertEmbed(length, 'image', import.meta.env.VITE_APP_BASE_API + res.data.fileName)
    // 调整光标到最后
    quill.setSelection(length + 1)
  } else {
    modal.msgError(t('components.editor.imageInsertFail'))
  }
}

// 上传失败处理
function handleUploadError() {
  modal.msgError(t('components.editor.imageInsertFail'))
}

// 粘贴板包含图片时：阻止默认粘贴，改为直接上传图片
function handlePasteCapture(e: ClipboardEvent) {
  const clipboard = e.clipboardData || (window as any).clipboardData
  if (clipboard && clipboard.items) {
    for (let i = 0; i < clipboard.items.length; i++) {
      const item = clipboard.items[i]
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault()
        const file = item.getAsFile()
        insertImage(file)
      }
    }
  }
}

// 粘贴图片时上传到服务器
function insertImage(file: any) {
  const formData = new FormData()
  formData.append('file', file)
  axios
    .post(uploadUrl.value, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        // 复用统一的鉴权头（键名随 XXL-SSO 约定变化，不能写死 Authorization）
        ...getAuthHeaders()
      }
    })
    .then((res) => {
      handleUploadSuccess(res.data)
    })
}
</script>

<style>
.editor-img-uploader {
  display: none;
}

.editor,
.ql-toolbar {
  white-space: pre-wrap !important;
  line-height: normal !important;
}

/* 编辑区最小高度：由 min-height 属性驱动的 CSS 变量决定 */
.editor .ql-editor {
  min-height: var(--editor-min-height, auto);
}

.quill-img {
  display: none;
}

.ql-snow .ql-tooltip[data-mode='link']::before {
  content: var(--ql-link-tip);
}

.ql-snow .ql-tooltip.ql-editing a.ql-action::after {
  border-right: 0px;
  content: var(--ql-save);
  padding-right: 0px;
}

.ql-snow .ql-tooltip[data-mode='video']::before {
  content: var(--ql-video-tip);
}

.ql-snow .ql-picker.ql-size .ql-picker-label::before,
.ql-snow .ql-picker.ql-size .ql-picker-item::before {
  content: '14px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='small']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='small']::before {
  content: '10px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='large']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='large']::before {
  content: '18px';
}

.ql-snow .ql-picker.ql-size .ql-picker-label[data-value='huge']::before,
.ql-snow .ql-picker.ql-size .ql-picker-item[data-value='huge']::before {
  content: '32px';
}

.ql-snow .ql-picker.ql-header .ql-picker-label::before,
.ql-snow .ql-picker.ql-header .ql-picker-item::before {
  content: var(--ql-text);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='1']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='1']::before {
  content: var(--ql-h1);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='2']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='2']::before {
  content: var(--ql-h2);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='3']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='3']::before {
  content: var(--ql-h3);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='4']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='4']::before {
  content: var(--ql-h4);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='5']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='5']::before {
  content: var(--ql-h5);
}

.ql-snow .ql-picker.ql-header .ql-picker-label[data-value='6']::before,
.ql-snow .ql-picker.ql-header .ql-picker-item[data-value='6']::before {
  content: var(--ql-h6);
}

.ql-snow .ql-picker.ql-font .ql-picker-label::before,
.ql-snow .ql-picker.ql-font .ql-picker-item::before {
  content: var(--ql-font-normal);
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='serif']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='serif']::before {
  content: var(--ql-font-serif);
}

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value='monospace']::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value='monospace']::before {
  content: var(--ql-font-mono);
}
</style>
