/**
 * 页面：用户管理
 * 功能：左侧组织树 + 用户分页表格，支持新增/修改/删除/重置密码/状态切换/详情
 */
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Dropdown, Input, Modal, Switch } from 'antd';
import { createStyles } from 'antd-style';
import React, { useEffect, useRef, useState } from 'react';
import { TreePanel } from '@/components';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { listOrg } from '@/services/authz/org';
import { listRole } from '@/services/authz/role';
import { delUser, listUser, updateUser } from '@/services/authz/user';
import { deepClone, handleTree } from '@/utils/common';
import UserFormModal from './UserFormModal';
import UserView, { type UserViewRef } from './UserView';

/**
 * 用户表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  userTable: css`
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

const Dashboard = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const viewRef = useRef<UserViewRef>(null);
  const { hasPermi } = usePermission();
  const { styles } = useStyles();

  // 组织树数据（左侧 + 表单）
  const [deptOptions, setDeptOptions] = useState<API.Org[]>([]);
  const [orgOptions, setOrgOptions] = useState<API.Org[]>([]);
  // 角色下拉
  const [roleOptions, setRoleOptions] = useState<API.Role[]>([]);
  // 查询参数（组织过滤）
  const [queryParams, setQueryParams] = useState<{
    orgIds?: number[];
  }>({});
  // 表单状态
  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.User | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  // 重置密码弹窗
  const [resetRow, setResetRow] = useState<API.User | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const resetPwdLoading = useRef(false);

  const userStatusOptions = useEnumOption('UserStatuEnum');
  const statusValueEnum = toValueEnum(userStatusOptions);

  /** 加载组织树与角色下拉 */
  const loadOptions = () => {
    listOrg({})
      .then((res) => {
        const list = res.data || [];
        // 左侧组织树：深拷贝转树，避免互相污染
        setDeptOptions(handleTree(deepClone(list)));
        // 表单组织树：带"未选择"根节点
        setOrgOptions([
          {
            id: 0,
            parentId: -1,
            name: '未选择',
            children: handleTree(deepClone(list)),
          },
        ]);
      })
      .catch(() => {});
    listRole({ current: 1, pageSize: 999 })
      .then((res) => {
        setRoleOptions(res.data?.data || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadOptions();
  }, []);

  /** 收集组织节点及其所有子孙 id */
  const collectOrgIds = (node: API.Org): number[] => {
    const ids: number[] = [];
    const walk = (n: API.Org) => {
      ids.push(n.id as number);
      if (n.children?.length) {
        n.children.forEach(walk);
      }
    };
    walk(node);
    return ids;
  };

  /** 组织树节点点击：按组织过滤 */
  const handleNodeClick = (node: API.Org) => {
    setQueryParams((prev) => ({ ...prev, orgIds: collectOrgIds(node) }));
    actionRef.current?.reload();
  };

  /** 删除用户 */
  const handleDelete = (row?: API.User) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: `是否确认删除名称为"${row?.username || '这些用户'}"的数据项？`,
      onOk: async () => {
        await delUser(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  /** 状态切换 */
  const handleStatusChange = async (row: API.User, status: number) => {
    const data = { ...row, status };
    delete data.addTime;
    delete data.updateTime;
    delete data.orgName;
    delete data.roleNames;
    try {
      await updateUser(data);
      message.success('操作成功');
      actionRef.current?.reload();
    } catch {
      // 失败回滚由 reload 保证
    }
  };

  /** 重置密码确认 */
  const handleResetPwd = () => {
    if (!resetRow) return;
    if (resetPwdLoading.current) return;
    if (
      !resetPassword ||
      resetPassword.length < 4 ||
      resetPassword.length > 20
    ) {
      message.warning('新密码长度必须在 4 到 20 个字符之间');
      return;
    }
    resetPwdLoading.current = true;
    const data = { ...resetRow, password: resetPassword };
    delete data.addTime;
    delete data.updateTime;
    delete data.orgName;
    delete data.roleNames;
    updateUser(data)
      .then(() => {
        message.success('重置成功');
        setResetRow(null);
        setResetPassword('');
        actionRef.current?.reload();
      })
      .finally(() => {
        resetPwdLoading.current = false;
      });
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: '用户编号',
      dataIndex: 'id',
      search: false,
      width: 90,
    },
    {
      title: '用户账号',
      dataIndex: 'username',
      render: (_, record) => (
        <a
          onClick={() => {
            viewRef.current?.open(record);
          }}
        >
          {record.username}
        </a>
      ),
    },
    {
      title: '用户名称',
      dataIndex: 'realName',
      search: false,
    },
    {
      title: '所属组织',
      dataIndex: 'orgName',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      align: 'center',
      valueEnum: statusValueEnum,
      render: (_, record) => (
        <Switch
          checkedChildren="正常"
          unCheckedChildren="停用"
          checked={record.status === 0}
          onChange={(checked) => handleStatusChange(record, checked ? 0 : 1)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      search: false,
      width: 160,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 180,
      render: (_, record) => [
        <a
          key="edit"
          onClick={() => {
            setFormCurrent(record);
            setFormOpen(true);
          }}
        >
          修改
        </a>,
        <a key="delete" onClick={() => handleDelete(record)}>
          删除
        </a>,
        <Dropdown
          key="more"
          menu={{
            items: [{ key: 'resetPwd', label: '重置密码' }],
            onClick: () => {
              setResetRow(record);
              setResetPassword('');
            },
          }}
        >
          <a onClick={(e) => e.preventDefault()}>更多</a>
        </Dropdown>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div style={{ display: 'flex', gap: 16 }}>
        <TreePanel
          treeData={deptOptions}
          title="组织机构"
          defaultExpandAll
          onNodeClick={handleNodeClick}
          onRefresh={loadOptions}
          storageKey="boot-user-org-sidebar-width"
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.userTable}>
            <ProTable<API.User>
              actionRef={actionRef}
              rowKey="id"
              columns={columns}
              search={{
                labelWidth: 80,
                defaultCollapsed: false,
                optionRender: (_searchConfig, formProps, dom) => [
                  ...dom.filter(
                    (item) => (item as React.ReactElement)?.key !== 'rest',
                  ),
                  <Button
                    key="reset-org"
                    onClick={() => {
                      setQueryParams({});
                      formProps.form?.resetFields();
                      actionRef.current?.reload();
                    }}
                  >
                    重置
                  </Button>,
                ],
              }}
              params={queryParams}
              request={async (params) => {
                const res = await listUser(params);
                return {
                  data: res.data?.data || [],
                  total: res.data?.total || 0,
                  success: true,
                };
              }}
              toolBarRender={() => [
                hasPermi('authz:user') && (
                  <Button
                    key="add"
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setFormCurrent(null);
                      setFormOpen(true);
                    }}
                  >
                    新增
                  </Button>
                ),
                hasPermi('authz:user') && (
                  <Button
                    key="delete"
                    danger
                    icon={<DeleteOutlined />}
                    disabled={selectedIds.length === 0}
                    onClick={() => handleDelete()}
                  >
                    删除
                  </Button>
                ),
              ]}
              rowSelection={{
                onChange: (_keys, rows) => {
                  setSelectedIds(rows.map((r) => r.id as number));
                },
              }}
              tableAlertRender={false}
              tableAlertOptionRender={false}
            />
          </div>
        </div>
      </div>

      <UserFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        current={formCurrent}
        roleOptions={roleOptions}
        orgOptions={orgOptions}
        onSuccess={() => actionRef.current?.reload()}
      />
      <UserView ref={viewRef} />

      <Modal
        title="重置密码"
        open={!!resetRow}
        onOk={handleResetPwd}
        onCancel={() => {
          setResetRow(null);
          setResetPassword('');
        }}
        confirmLoading={resetPwdLoading.current}
        okButtonProps={{ loading: resetPwdLoading.current }}
      >
        <p style={{ marginBottom: 8 }}>
          为「{resetRow?.username}」设置新密码：
        </p>
        <Input.Password
          placeholder="请输入新密码（4-20 位）"
          value={resetPassword}
          onChange={(e) => setResetPassword(e.target.value)}
          maxLength={20}
        />
      </Modal>
    </PageContainer>
  );
};

export default Dashboard;
