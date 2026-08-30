/**
 * 组件：Editor（富文本编辑器）
 * 功能：基于 Quill 的富文本编辑器，支持工具栏、图片上传（url/base64）、粘贴图片、
 *       自定义高度/只读模式。
 */
import { message } from 'antd';
import { createStyles } from 'antd-style';
import React, { useCallback, useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { request } from '@/utils/request';

/** 后端 API 前缀（上传返回的相对路径需拼接该前缀才能访问） */
const BASE_URL = import.meta.env.VITE_APP_BASE_API;

/**
 * 编辑器样式
 * 功能：通过 CSS 变量将最小高度作用到编辑区，保证默认高度展示约 10 行
 */
const useStyles = createStyles(({ css }) => ({
  editor: css`
    .ql-editor {
      min-height: var(--editor-min-height, auto);
    }
  `,
}));

export type EditorProps = {
  /** 编辑器内容（双向绑定） */
  value?: string;
  /** 内容变化回调 */
  onChange?: (value: string) => void;
  /** 编辑器高度（px），不传则自适应 */
  height?: number;
  /** 编辑器最小高度（px） */
  minHeight?: number;
  /** 是否只读 */
  readOnly?: boolean;
  /** 上传文件大小限制（MB） */
  fileSize?: number;
  /** 图片上传方式：url（上传到服务器拿链接）/ base64（转 base64 直接嵌入） */
  type?: 'url' | 'base64';
};

const Editor = ({
  value = '',
  onChange,
  height,
  minHeight,
  readOnly = false,
  fileSize = 5,
  type = 'url',
}: EditorProps) => {
  const { styles } = useStyles();
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /** 在光标位置插入图片 */
  const insertImage = useCallback((imgUrl: string) => {
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const range = quill.getSelection();
    const index = range ? range.index : quill.getLength();
    quill.insertEmbed(index, 'image', imgUrl);
    quill.setSelection(index + 1);
  }, []);

  /** 文件转 base64（type=base64 场景兜底） */
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  /** 上传图片：校验后上传服务器或转 base64，返回可插入的图片地址 */
  const doUpload = useCallback(
    async (file: File): Promise<string> => {
      const allowTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg'];
      if (!allowTypes.includes(file.type)) {
        message.error('图片格式错误!');
        return '';
      }
      if (file.size / 1024 / 1024 > fileSize) {
        message.error(`上传文件大小不能超过 ${fileSize} MB!`);
        return '';
      }
      if (type === 'base64') {
        return fileToBase64(file);
      }
      const formData = new FormData();
      formData.append('file', file);
      const res = await request<API.Response<{ fileName: string }>>(
        '/file/upload',
        { method: 'POST', data: formData },
      );
      return BASE_URL + (res?.data?.fileName || '');
    },
    [fileSize, type],
  );

  /** 粘贴图片：转为上传服务器后插入 */
  const handlePaste = useCallback(
    (e: ClipboardEvent) => {
      const clipboard =
        e.clipboardData ||
        (
          window as typeof window & {
            clipboardData?: ClipboardEvent['clipboardData'];
          }
        ).clipboardData;
      if (!clipboard) return;
      const imageItem = Array.from(clipboard.items || []).find(
        (i) => i.type.indexOf('image') !== -1,
      );
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (file) {
        doUpload(file).then((url) => {
          if (url) insertImage(url);
        });
      }
    },
    [doUpload, insertImage],
  );

  // 编辑器挂载后：劫持工具栏图片按钮 + 监听粘贴事件
  useEffect(() => {
    if (type !== 'url') return;
    const quill = quillRef.current?.getEditor();
    if (!quill) return;
    const toolbar = quill.getModule('toolbar') as
      | { addHandler: (name: string, handler: () => void) => void }
      | undefined;
    toolbar?.addHandler('image', () => {
      fileInputRef.current?.click();
    });
    quill.root.addEventListener('paste', handlePaste);
    return () => {
      quill.root.removeEventListener('paste', handlePaste);
    };
  }, [type, handlePaste]);

  // 编辑器样式：高度 / 最小高度（最小高度通过 CSS 变量作用于编辑区）
  const editorStyle = {} as React.CSSProperties & { [key: string]: string };
  if (minHeight) {
    editorStyle['--editor-min-height'] = `${minHeight}px`;
  }
  if (height) {
    editorStyle.height = `${height}px`;
  }

  return (
    <div className={styles.editor}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        style={editorStyle}
        value={value}
        onChange={(v) => onChange?.(v)}
        readOnly={readOnly}
        placeholder="请输入内容"
        modules={{
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
            ['link', 'image', 'video'],
          ],
        }}
      />
      {/* 隐藏的文件上传组件：点击工具栏图片按钮时触发 */}
      {type === 'url' && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            e.target.value = '';
            if (!file) return;
            doUpload(file).then((url) => {
              if (url) insertImage(url);
            });
          }}
        />
      )}
    </div>
  );
};

export default Editor;
