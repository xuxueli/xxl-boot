/**
 * 组件：PreviewModal（代码生成预览弹窗）
 * 功能：按模板文件 Tabs 预览生成代码，支持复制
 */
import { App, Button, Modal, Spin, Tabs } from 'antd';
import { useEffect, useState } from 'react';
import { previewTable } from '@/modules/framework/tool/codegen/api';
import { t } from '@/i18n';
import { copyToClipboard } from '@/utils/common';

/* 组件入参 */
interface PreviewModalProps {
  open: boolean;       /* 是否显示 */
  id?: number;         /* 待预览的表 ID */
  onClose: () => void; /* 关闭回调 */
}

/** 模板文件名 → 标签（去掉目录与 .ftl 后缀） */
const fileNameToLabel = (fileName: string): string => {
  const base = fileName.split('/').pop() || fileName;
  return base.replace(/\.ftl$/, '');
};

function PreviewModal({ open, id, onClose }: PreviewModalProps) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [codeMap, setCodeMap] = useState<Record<string, string>>({});
  const [activeKey, setActiveKey] = useState('');

  /* 打开弹窗时加载预览代码 */
  useEffect(() => {
    if (!open || id == null) return;
    setLoading(true);
    setActiveKey('');
    setCodeMap({});
    previewTable(id)
      .then((res) => {
        const data = res.data || {};
        setCodeMap(data);
        /* 默认选中第一个模板文件 */
        setActiveKey(Object.keys(data)[0] || '');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [open, id]);

  /** 复制代码 */
  const copyText = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      message.success(t('common.copied'));
    } else {
      message.error(t('tool.codegen.copyFailed'));
    }
  };

  const fileNames = Object.keys(codeMap);

  return (
    <Modal
      title={t('tool.codegen.codePreview')}
      width="80%"
      open={open}
      onCancel={onClose}
      footer={null}
      destroyOnHidden
    >
      <Spin spinning={loading}>
        <Tabs
          activeKey={activeKey}
          onChange={setActiveKey}
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
                    {t('common.copy')}
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
}

export default PreviewModal;
