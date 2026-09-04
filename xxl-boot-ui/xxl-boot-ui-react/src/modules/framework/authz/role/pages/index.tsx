/**
 * 页面：角色管理
 * 功能：角色分页表格 + 新增/修改（含菜单权限树）/删除
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { t } from '@/i18n';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delRole, listRole } from '@/modules/framework/authz/role/api';
import RoleFormModal from './RoleFormModal';

/**
 * 表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  roleTable: css`
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

/*
 * 管理页面
 * 功能：角色分页表格 + 新增/修改（含菜单权限树）/删除
 */
const RoleList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();
  const { styles } = useStyles();

  // 表单弹窗状态：是否打开 + 当前编辑的角色数据
  const [formOpen, setFormOpen] = useState(false);
  // 当前编辑的角色数据，null 表示新增
  const [formCurrent, setFormCurrent] = useState<API.Role | null>(null);
  // 选中行的ID集合，用于批量删除
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 角色状态枚举选项，用于表格筛选条件和状态渲染
  const roleStatusOptions = useEnumOption('RoleStatusEnum');
  const statusValueEnum = toValueEnum(roleStatusOptions);

  /**
   * 批量删除
   */
  const handleDelete = (row?: API.Role) => {
    // 如果传入了 row，则删除单条数据，否则删除选中的多条数据
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    // 弹出确认框，确认后操作删除
    modal.confirm({
      title: t('modal.title'),
      content: row?.name
        ? t('authz.role.confirmDelete', [row.name])
        : t('authz.role.confirmDeleteBatch'),
      onOk: async () => {
        // 调用删除接口
        await delRole(ids);
        message.success(t('common.deleteSuccess'));

        // 删除成功后，清空选中项，并刷新表格
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  /*
   * 表格列配置：表格列 + 操作列 + 筛选条件
   *   - 表格列表
   *   - 筛选条件：search=true 的参数，会在表格上方生成筛选条件
   *   - 操作列：修改/删除
   */
  const columns: ProColumns<API.Role>[] = [
    { title: t('authz.role.id'), dataIndex: 'id', search: false, width: 90 },
    { title: t('authz.role.name'), dataIndex: 'name' },
    {
      title: t('authz.role.roleKey'),
      dataIndex: 'code',
      search: false,
    },
    {
      title: t('authz.role.order'),
      dataIndex: 'order',
      search: false,
      width: 90,
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      width: 90,
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Tag color={record.status === 0 ? 'success' : 'error'}>
          {record.status === 0 ? t('common.normal') : t('common.disabled')}
        </Tag>
      ),
    },
    {
      title: t('common.createTime'),
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 140,
      /* 操作列：修改/删除 */
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setFormCurrent(record);
            setFormOpen(true);
          }}
        >
          <EditOutlined /> {t('common.modify')}
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          <DeleteOutlined /> {t('common.delete')}
        </a>,
      ],
    },
  ];

  return (
    /*
     * 页面容器：
     *   - ghost: true，去掉默认的白色背景和 padding
     *   - title: false，去掉默认的标题栏
     */
    <PageContainer ghost title={false}>
      <div className={styles.roleTable}>
        {/* 表格区域 */}
        <ProTable<API.Role>
          /* 表格Ref */
          actionRef={actionRef}
          /* 行唯一标识 */
          rowKey="id"
          /* 表格列配置：表格列 + 操作列 + 筛选条件 */
          columns={columns}
          /* 搜索配置：搜索参数见 “列定义” */
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [
              ...dom.reverse(),
            ],
          }}
          /* 表格API请求 */
          request={async (params) => {
            const res = await listRole(params);
            return {
              data: res.data?.data || [],
              total: res.data?.total || 0,
              success: true,
            };
          }}
          /* 工具栏配置：新增 + 删除 */
          toolBarRender={() => [
            hasPermi('authz:role') && (
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => {
                  setFormCurrent(null);
                  setFormOpen(true);
                }}
              >
                {t('common.add')}
              </Button>
            ),
            hasPermi('authz:role') && (
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
          ]}
          /* 表格行选择配置：选中行的ID集合 */
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
      {/* 表单模态框：新增、编辑 */}
      <RoleFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        onSuccess={() => actionRef.current?.reload()}
      />
    </PageContainer>
  );
};

export default RoleList;
