/**
 * 组件：CodeTypeDialog（代码生成类型选择弹窗）
 * 功能：选择生成类型（页面/弹窗），导出时额外支持输入文件名
 */
import { App, Form, Input, Modal, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { t } from '@/i18n';

/** 生成类型配置 */
const typeOptions = [
  { label: t('tool.pagegen.typeFile'), value: 'file' },
  { label: t('tool.pagegen.typeDialog'), value: 'dialog' },
];

/**
 * 生成类型选择弹窗
 * @param props.open        弹窗是否打开
 * @param props.onOpenChange 弹窗开关变化回调
 * @param props.showFileName 是否显示文件名输入（导出场景）
 * @param props.onConfirm    确认回调，参数为生成类型与文件名
 */
const CodeTypeDialog = ({
  open,
  onOpenChange,
  showFileName = false,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  showFileName?: boolean;
  onConfirm: (data: { type: string; fileName?: string }) => void;
}) => {
  const { message } = App.useApp();

  /* 生成类型选中值 */
  const [type, setType] = useState('file');
  /* 文件名 */
  const [fileName, setFileName] = useState('');

  /* 打开弹窗时重置表单，导出场景生成默认文件名 */
  useEffect(() => {
    if (open) {
      setType('file');
      setFileName(showFileName ? `${Date.now()}.tsx` : '');
    }
  }, [open, showFileName]);

  /** 关闭弹窗 */
  const handleClose = () => {
    onOpenChange(false);
  };

  /** 确认生成 */
  const handleConfirm = () => {
    if (showFileName && !fileName.trim()) {
      message.warning(t('common.inputPlaceholder', [t('tool.pagegen.fileName')]));
      return;
    }
    onConfirm({ type, fileName: fileName.trim() });
    onOpenChange(false);
  };

  return (
    <Modal
      title={t('tool.pagegen.selectGenType')}
      width={500}
      open={open}
      onCancel={handleClose}
      onOk={handleConfirm}
      okText={t('modal.confirmButton')}
      cancelText={t('modal.cancelButton')}
      destroyOnHidden
    >
      <Form layout="vertical" style={{ marginTop: 8 }}>
        <Form.Item label={t('tool.pagegen.genType')}>
          <Radio.Group
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={typeOptions}
            optionType="button"
          />
        </Form.Item>
        {showFileName && (
          <Form.Item label={t('tool.pagegen.fileName')} required>
            <Input
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder={t('common.inputPlaceholder', [t('tool.pagegen.fileName')])}
              allowClear
            />
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default CodeTypeDialog;
