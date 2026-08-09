/**
 * 组件：LogDetail（日志详情弹窗）
 * 功能：展示日志基本信息、操作人信息与日志内容（支持复制）
 */
import { App, Button, Descriptions, Modal, Tag } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

export type LogDetailRef = {
  open: (row: API.Log, moduleMap: Record<number, string>) => void;
};

const LogDetail = forwardRef<LogDetailRef>((_, ref) => {
  const { message } = App.useApp();
  const [visible, setVisible] = useState(false);
  const [row, setRow] = useState<API.Log | null>(null);
  const [moduleMap, setModuleMap] = useState<Record<number, string>>({});

  const open = useCallback((data: API.Log, map: Record<number, string>) => {
    setRow(data);
    setModuleMap(map);
    setVisible(true);
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  /** 复制内容 */
  const copyText = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success('已复制');
    } catch {
      // 降级：execCommand 兜底
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      message.success('已复制');
    }
  };

  return (
    <Modal
      title="日志详情"
      width={700}
      open={visible}
      onCancel={() => setVisible(false)}
      footer={null}
      destroyOnClose
    >
      {row && (
        <>
          <Descriptions column={2} size="middle" bordered>
            <Descriptions.Item label="日志类型">
              <Tag color={row.type === 0 ? 'geekblue' : 'warning'}>
                {row.type === 0 ? '操作日志' : '登陆日志'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="模块">
              {moduleMap[row.module as number] || row.module}
            </Descriptions.Item>
            <Descriptions.Item label="日志编号">{row.id}</Descriptions.Item>
            <Descriptions.Item label="标题">
              {row.title || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="操作人">
              {row.operator || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="时间">
              {row.addTime || '-'}
            </Descriptions.Item>
            <Descriptions.Item label="IP">{row.ip || '-'}</Descriptions.Item>
            <Descriptions.Item label="IP位置">
              {row.ipAddress || row.ip || '-'}
            </Descriptions.Item>
          </Descriptions>
          <div style={{ marginTop: 16, position: 'relative' }}>
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              日志内容
              <Button
                type="link"
                size="small"
                style={{ float: 'right' }}
                onClick={() => copyText(row.content || '')}
              >
                复制
              </Button>
            </div>
            <pre
              style={{
                background: 'rgba(0,0,0,0.03)',
                padding: 12,
                borderRadius: 6,
                maxHeight: 260,
                overflow: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                margin: 0,
              }}
            >
              {row.content || '（无数据）'}
            </pre>
          </div>
        </>
      )}
    </Modal>
  );
});

export default LogDetail;
