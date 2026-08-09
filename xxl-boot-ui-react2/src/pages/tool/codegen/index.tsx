/**
 * 页面：代码生成
 * 功能：代码生成表分页 + 创建表/编辑/预览/删除/生成代码
 */
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Input, Modal } from 'antd';
import React, { useRef, useState } from 'react';
import { delTable, listTable } from '@/services/xxl-boot/tool/codegen';
import { downloadGet } from '@/utils/download';
import { usePermission } from '@/utils/permission';
import EditTableModal from './EditTableModal';
import PreviewModal, { type PreviewModalRef } from './PreviewModal';

const demoTableSql = `CREATE TABLE \`product01\` (
  \`id\` int(11) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  \`product_name\` varchar(50) DEFAULT NULL COMMENT '商品名称',
  \`product_code\` varchar(50) DEFAULT NULL COMMENT '商品编码',
  \`product_status\` tinyint(1) DEFAULT '0' COMMENT '商品状态（0正常 1停用）',
  \`product_price\` decimal(10,2) DEFAULT NULL COMMENT '商品价格',
  PRIMARY KEY (\`id\`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品信息表';`;

const CodegenList: React.FC = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const previewRef = useRef<PreviewModalRef>(null);
  const { hasRole } = usePermission();

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
      title: '系统提示',
      content: `是否确认删除表"${row?.tableName || '选中的数据'}"的生成配置？`,
      onOk: async () => {
        await delTable(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  /** 生成代码（zip 下载） */
  const handleGenCode = (rows?: API.Codegen[]) => {
    const ids = rows ? rows.map((r) => r.id as number) : selectedIds;
    if (ids.length === 0) {
      message.warning('请选择要生成的表');
      return;
    }
    downloadGet('/tool/codegen/batchGenCode', { ids }, 'xxl-boot-codegen.zip');
  };

  /** 创建数据表 */
  const handleCreateTable = async () => {
    if (!tableSql.trim()) {
      message.warning('建表 SQL 不能为空');
      return;
    }
    setCreating(true);
    try {
      const { createTable } = await import('@/services/xxl-boot/tool/codegen');
      await createTable(tableSql);
      message.success('创建成功');
      setCreateOpen(false);
      actionRef.current?.reload();
    } finally {
      setCreating(false);
    }
  };

  const columns: ProColumns<API.Codegen>[] = [
    {
      title: '序号',
      search: false,
      width: 70,
      render: (_, _r, index) => index + 1,
    },
    { title: '表名称', dataIndex: 'tableName' },
    { title: '表描述', dataIndex: 'tableComment' },
    { title: '创建时间', dataIndex: 'addTime', search: false, width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', search: false, width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 220,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setEditId(record.id);
            setEditOpen(true);
          }}
        >
          编辑
        </a>,
        <a
          key="preview"
          onClick={() => {
            previewRef.current?.open(record.id as number);
          }}
        >
          预览
        </a>,
        <a key="gen" onClick={() => handleGenCode([record])}>
          生成代码
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost>
      <ProTable<API.Codegen>
        headerTitle="代码生成列表"
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
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
              icon={<PlusOutlined />}
              onClick={() => {
                setTableSql(demoTableSql);
                setCreateOpen(true);
              }}
            >
              创建表
            </Button>
          ),
          hasRole('admin') && (
            <Button key="gen" type="primary" onClick={() => handleGenCode()}>
              生成代码
            </Button>
          ),
        ]}
        rowSelection={{
          onChange: (_keys, rows) => {
            setSelectedIds(rows.map((r) => r.id as number));
          },
        }}
        tableAlertOptionRender={() => [
          <a key="delete" onClick={() => handleDelete()}>
            批量删除
          </a>,
        ]}
      />

      <EditTableModal
        open={editOpen}
        onOpenChange={setEditOpen}
        id={editId}
        onSuccess={() => actionRef.current?.reload()}
      />
      <PreviewModal ref={previewRef} />

      <Modal
        title="创建数据表"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        onOk={handleCreateTable}
        confirmLoading={creating}
        width={720}
        okText="创建"
        cancelText="取消"
      >
        <Input.TextArea
          rows={12}
          value={tableSql}
          onChange={(e) => setTableSql(e.target.value)}
          style={{ fontFamily: 'monospace', fontSize: 12 }}
          placeholder="请输入建表 SQL"
        />
      </Modal>
    </PageContainer>
  );
};

export default CodegenList;
