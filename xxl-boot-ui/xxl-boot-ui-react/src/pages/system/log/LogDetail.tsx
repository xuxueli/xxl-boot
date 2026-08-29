/**
 * 组件：LogDetail（日志详情弹窗）
 * 功能：按卡片分组展示日志基本信息、操作人信息与日志内容（支持复制）
 */
import {
  FileTextOutlined,
  InfoCircleOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { App, Button, Col, Modal, Row } from 'antd';
import { createStyles } from 'antd-style';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';

export type LogDetailRef = {
  open: (row: API.Log, moduleMap: Record<number, string>) => void;
};

/**
 * 日志详情样式
 * 功能：卡片分组布局，参考 Vue 端日志详情弹框
 */
const useStyles = createStyles(({ css }) => ({
  detailWrap: css`
    padding: 0 4px;
  `,
  detailCard: css`
    border: 1px solid #ebeef5;
    border-radius: 6px;
    margin-bottom: 14px;
    overflow: hidden;
  `,
  detailCardTitle: css`
    display: flex;
    align-items: center;
    gap: 5px;
    background: #f7f9fb;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 600;
    color: #333;
    border-bottom: 1px solid #ebeef5;

    .anticon {
      color: #409eff;
    }
  `,
  detailRow: css`
    padding: 0 8px;
  `,
  detailItem: css`
    display: flex;
    align-items: flex-start;
    padding: 10px 8px;
    font-size: 13px;
  `,
  detailLabel: css`
    flex-shrink: 0;
    width: 72px;
    color: #909399;
    margin-right: 12px;
  `,
  detailValue: css`
    color: #303133;
    flex: 1;
    word-break: break-all;
  `,
  codeBody: css`
    padding: 14px;
  `,
  codeWrap: css`
    background: #f7f9fb;
    border: 1px solid #e8ecf0;
    border-radius: 4px;
    overflow: hidden;
    position: relative;
    min-height: 350px;
  `,
  codeAction: css`
    position: absolute;
    top: 8px;
    right: 8px;
    z-index: 10;
  `,
  codePre: css`
    margin: 0;
    padding: 12px 14px;
    font-size: 12px;
    line-height: 1.6;
    font-family: Consolas, 'SFMono-Regular', monospace;
    color: #444;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: auto;
    min-height: 350px;
    display: block;
  `,
}));

const LogDetail = forwardRef<LogDetailRef>((_, ref) => {
  const { message } = App.useApp();
  const { styles } = useStyles();
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
      destroyOnHidden
    >
      {row && (
        <div className={styles.detailWrap}>
          {/* 基本信息 */}
          <div className={styles.detailCard}>
            <div className={styles.detailCardTitle}>
              <InfoCircleOutlined /> 基本信息
            </div>
            <Row className={styles.detailRow}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>日志类型</span>
                  <span className={styles.detailValue}>
                    {row.type === 0
                      ? '操作日志'
                      : row.type === 1
                        ? '登陆日志'
                        : row.type}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>系统模块</span>
                  <span className={styles.detailValue}>
                    {moduleMap[row.module as number] || row.module}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className={styles.detailRow}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>日志编号</span>
                  <span className={styles.detailValue}>{row.id}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>日志标题</span>
                  <span className={styles.detailValue}>{row.title}</span>
                </div>
              </Col>
            </Row>
          </div>

          {/* 操作人信息 */}
          <div className={styles.detailCard}>
            <div className={styles.detailCardTitle}>
              <UserOutlined /> 操作人信息
            </div>
            <Row className={styles.detailRow}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>操作人</span>
                  <span className={styles.detailValue}>
                    {row.operator}
                  </span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>操作时间</span>
                  <span className={styles.detailValue}>
                    {row.addTime}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className={styles.detailRow}>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>操作IP</span>
                  <span className={styles.detailValue}>{row.ip}</span>
                </div>
              </Col>
              <Col span={12}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>操作地址</span>
                  <span className={styles.detailValue}>
                    {row.ipAddress || row.ip}
                  </span>
                </div>
              </Col>
            </Row>
          </div>

          {/* 日志内容 */}
          <div className={styles.detailCard}>
            <div className={styles.detailCardTitle}>
              <FileTextOutlined /> 日志内容
            </div>
            <div className={styles.codeBody}>
              <div className={styles.codeWrap}>
                <div className={styles.codeAction}>
                  <Button
                    size="small"
                    onClick={() => copyText(row.content || '')}
                  >
                    复制
                  </Button>
                </div>
                <pre className={styles.codePre}>
                  {row.content || '（无数据）'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
});

export default LogDetail;