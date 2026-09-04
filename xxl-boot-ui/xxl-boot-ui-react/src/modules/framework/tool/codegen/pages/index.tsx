/**
 * 页面：代码生成
 * 功能：代码生成表分页 + 创建表/修改/删除/预览/生成代码
 */
import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Input, Modal } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import { delTable, listTable } from '@/modules/framework/tool/codegen/api';
import { downloadGet } from '@/utils/download';
import { t } from '@/i18n';
import EditTableModal from './EditTableModal';
import PreviewModal, { type PreviewModalRef } from './PreviewModal';

const demoTableSql = `CREATE TABLE \`product01\` (
  \`id\`            INT             NOT NULL AUTO_INCREMENT      COMMENT '主键ID',
  \`name\`          VARCHAR(50)     NOT NULL                     COMMENT '产品名称',
  \`num\`           INT             NOT NULL                     COMMENT '产品数量',
  \`add_time\`      DATETIME        NOT NULL                     COMMENT '新增时间',
  \`update_time\`   DATETIME        NOT NULL                     COMMENT '更新时间',
  PRIMARY KEY (\`id\`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT='产品信息表';`;

/**
 * 代码生成表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  codegenTable: css`
    .ant-pro-table-list-toolbar-container {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container .ant-pro-table-list-toolbar-right {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container
      .ant-pro-table-list-toolbar-right
      .ant-pro-table-list-toolbar-setting-items {
      margin-left: auto;
    }
  `,
}));

const CodegenList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const previewRef = useRef<PreviewModalRef>(null);
  const { hasRole } = usePermission();
  const { styles } = useStyles();

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number>();
  const [createOpen, setCreateOpen] = useState(false);
  const [tableSql, setTableSql] = useState(demoTableSql);
  const [creating, setCreating] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  /** 删除代码生成表 */
  const handleDelete = (row?: API.Codegen) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('tool.codegen.confirmDelete', [
        row ? String(row.id) : ids.join(','),
      ]),
      onOk: async () => {
        await delTable(ids);
        message.success(t('common.deleteSuccess'));
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  /** 生成代码（zip 下载） */
  const handleGenCode = (rows?: API.Codegen[]) => {
    const ids = rows ? rows.map((r) => r.id as number) : selectedIds;
    if (ids.length === 0) {
      message.warning(t('tool.codegen.selectData'));
      return;
    }
    downloadGet('/tool/codegen/batchGenCode', { ids }, 'xxl-boot-codegen.zip');
  };

  /** 修改选中的表 */
  const handleEdit = () => {
    if (selectedIds.length !== 1) return;
    setEditId(selectedIds[0]);
    setEditOpen(true);
  };

  /** 创建数据表 */
  const handleCreateTable = async () => {
    if (!tableSql.trim()) {
      message.warning(t('tool.codegen.createTableSqlEmpty'));
      return;
    }
    setCreating(true);
    try {
      const { createTable } = await import('@/modules/framework/tool/codegen/api');
      // 新建时携带前端模板类型（默认第一个选项 antd-typescript），与后端 createTable 入参匹配
      await createTable(tableSql, 'antd-typescript');
      message.success(t('tool.codegen.createSuccess'));
      setCreateOpen(false);
      actionRef.current?.reload();
    } finally {
      setCreating(false);
    }
  };

  const columns: ProColumns<API.Codegen>[] = [
    {
      title: t('common.serialNo'),
      search: false,
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    { title: t('tool.codegen.tableName'), dataIndex: 'tableName' },
    { title: t('tool.codegen.tableComment'), dataIndex: 'tableComment' },
    {
      title: t('common.createTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.updateTime'),
      dataIndex: 'updateTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 300,
      render: (_, record) => [
        hasRole('admin') && (
          <a
            key="edit"
            onClick={() => {
              setEditId(record.id);
              setEditOpen(true);
            }}
          >
            <EditOutlined /> {t('common.edit')}
          </a>
        ),
        hasRole('admin') && (
          <a key="delete" onClick={() => handleDelete(record)}>
            <DeleteOutlined /> {t('common.delete')}
          </a>
        ),
        hasRole('admin') && (
          <a
            key="preview"
            onClick={() => {
              previewRef.current?.open(record.id as number);
            }}
          >
            <EyeOutlined /> {t('tool.codegen.preview')}
          </a>
        ),
        hasRole('admin') && (
          <a key="gen" onClick={() => handleGenCode([record])}>
            <DownloadOutlined /> {t('tool.codegen.generate')}
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.codegenTable}>
        <ProTable<API.Codegen>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [
              ...dom.reverse(),
            ],
          }}
          request={async (params) => {
            const res = await listTable(params);
            return {
              data: res.data?.data || [],
              total: res.data?.total || 0,
              success: true,
            };
          }}
          toolBarRender={() => [
            hasRole('admin') && (
              <Button
                key="create"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setTableSql(demoTableSql);
                  setCreateOpen(true);
                }}
              >
                {t('tool.codegen.create')}
              </Button>
            ),
            hasRole('admin') && (
              <Button
                key="edit"
                icon={<EditOutlined />}
                disabled={selectedIds.length !== 1}
                onClick={handleEdit}
              >
                {t('common.modify')}
              </Button>
            ),
            hasRole('admin') && (
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                disabled={!selectedIds.length}
                onClick={() => handleDelete()}
              >
                {t('common.delete')}
              </Button>
            ),
            hasRole('admin') && (
              <Button
                key="gen"
                type="primary"
                icon={<DownloadOutlined />}
                disabled={!selectedIds.length}
                onClick={() => handleGenCode()}
              >
                {t('tool.codegen.generate')}
              </Button>
            ),
          ]}
          rowSelection={{
            onChange: (_keys, rows) => {
              setSelectedIds(rows.map((r) => r.id as number));
            },
          }}
          /* 分页配置 */
          pagination={{
            defaultPageSize: 10,
            pageSizeOptions: [10, 20, 50, 100],
            showSizeChanger: true,
          }}
          /* 默认批量选择提示隐藏 */
          tableAlertRender={false}
        />
      </div>

      <EditTableModal
        open={editOpen}
        onOpenChange={setEditOpen}
        id={editId}
        onSuccess={() => actionRef.current?.reload()}
      />
      <PreviewModal ref={previewRef} />

      <Modal
        title={t('tool.codegen.createTable')}
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreateTable}
        confirmLoading={creating}
        width={720}
        okText={t('tool.codegen.create')}
        cancelText={t('modal.cancelButton')}
      >
        <Input.TextArea
          rows={12}
          value={tableSql}
          onChange={(e) => setTableSql(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
          placeholder={t('common.inputPlaceholder', [t('common.noun.createTableSql')])}
        />
      </Modal>
    </PageContainer>
  );
};

export default CodegenList;
