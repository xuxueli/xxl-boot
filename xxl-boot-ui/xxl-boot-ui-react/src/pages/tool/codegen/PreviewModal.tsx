/**
 * 组件：PreviewModal（代码生成预览弹窗）
 * 功能：按模板文件 Tabs 预览生成代码，支持复制
 */
import { App, Button, Modal, Spin, Tabs } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { previewTable } from '@/services/tool/codegen';

export type PreviewModalRef = {
  open: (id: number) => void;
};

/** 模板文件名 → 标签（去掉目录与 .ftl 后缀） */
const fileNameToLabel = (fileName: string): string => {
  const base = fileName.split('/').pop() || fileName;
  return base.replace(/\.ftl$/, '');
};

const PreviewModal = forwardRef<PreviewModalRef>((_, ref) => {
  const { message } = App.useApp();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});

  const open = useCallback((id: number) => {
    setVisible(true);
    setLoading(true);
    setCodeMap({});
    previewTable(id)
      .then((res) => {
        setCodeMap(res.data || {});
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  /** 复制代码 */
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制');
    } catch {
      message.error('复制失败');
    }
  };

  const fileNames = Object.keys(codeMap);
  const activeKey = fileNames[0] || '';

  return (
    <Modal
      title="代码预览"
      width="80%"
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeKey}
          items={fileNames.map((name) => ({
            key: name,
            label: fileNameToLabel(name),
            children: (
              <div>
                <div style={{ textAlign: 'right', marginBottom: 8 }}>
                  <Button
                    size="small"
                    onClick={() => copyText(codeMap[name] || '')}
                  >
                    复制
                  </Button>
                </div>
                <pre
                  style={{
                    background: 'rgba(0,0,0,0.03)',
                    padding: 12,
                    borderRadius: 6,
                    maxHeight: 480,
                    overflow: 'auto',
                    fontSize: 12,
                    margin: 0,
                  }}
                >
                  {codeMap[name]}
                </pre>
              </div>
            ),
          }))}
        />
      </Spin>
    </Modal>
  );
});

export default PreviewModal;
