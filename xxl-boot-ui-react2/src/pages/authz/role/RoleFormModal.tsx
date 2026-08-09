/**
 * 组件：RoleFormModal（角色新增/编辑弹窗）
 * 功能：角色基本信息 + 菜单权限树（支持展开/折叠、全选、父子联动）
 */
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Checkbox, Divider, Space, Tree } from 'antd';
import type { DataNode } from 'antd/es/tree';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { listResource } from '@/services/authz/resource';
import {
  addRole,
  roleMenuTreeselect,
  updateRole,
  updateRoleRes,
} from '@/services/authz/role';
import { handleTree } from '@/utils/common';

/** 资源平铺数组转 antd Tree 数据 */
const toTreeData = (resources: API.Resource[]): DataNode[] =>
  resources.map((r) => ({
    key: r.id as number,
    title: r.name,
    children: r.children?.length ? toTreeData(r.children) : undefined,
  }));

/** 收集所有节点 key */
const collectAllKeys = (nodes: DataNode[]): React.Key[] => {
  const keys: React.Key[] = [];
  const walk = (list: DataNode[]) => {
    list.forEach((n) => {
      keys.push(n.key);
      if (n.children?.length) walk(n.children);
    });
  };
  walk(nodes);
  return keys;
};

const RoleFormModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Role | null;
  onSuccess?: () => void;
}> = ({ open, onOpenChange, current, onSuccess }) => {
  const { message } = App.useApp();
  const treeRef = useRef<any>(null);

  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [expandedAll, setExpandedAll] = useState(false);
  const [checkStrictly, setCheckStrictly] = useState(false);

  /** 加载资源树与已授权集合 */
  const loadTree = (roleId?: number) => {
    listResource({}).then((res) => {
      const tree = toTreeData(handleTree(res.data || []));
      setTreeData(tree);
      const allKeys = collectAllKeys(tree);
      setExpandedKeys(allKeys);
      if (roleId) {
        roleMenuTreeselect(roleId)
          .then((roleRes) => {
            const checked = roleRes.data || [];
            if (treeRef.current) {
              treeRef.current.setCheckedKeys(checked);
            }
          })
          .catch(() => {});
      }
    });
  };

  useEffect(() => {
    if (open) {
      loadTree(current?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const allKeys = useMemo(() => collectAllKeys(treeData), [treeData]);

  /** 收集勾选 + 半勾选的资源 id */
  const getMenuAllCheckedKeys = (): number[] => {
    if (!treeRef.current) return [];
    const checked = (treeRef.current.getCheckedKeys() as React.Key[]) || [];
    const halfChecked =
      (treeRef.current.getHalfCheckedKeys() as React.Key[]) || [];
    return [...checked, ...halfChecked]
      .map((k) => Number(k))
      .filter((k) => !Number.isNaN(k));
  };

  /** 提交：保存角色 + 资源授权 */
  const handleFinish = async (values: API.Role) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    const resourceIds = getMenuAllCheckedKeys();
    if (current?.id) {
      await updateRole({ ...data, id: current.id });
      await updateRoleRes(current.id, resourceIds);
    } else {
      const res = await addRole(data);
      const newId = Number(res.data);
      await updateRoleRes(newId, resourceIds);
    }
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Role>
      title={current?.id ? '修改角色' : '新增角色'}
      width={680}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{ status: 0, order: 1, ...current }}
    >
      <ProFormText
        name="name"
        label="角色名称"
        placeholder="请输入角色名称"
        fieldProps={{ maxLength: 30 }}
        rules={[{ required: true, message: '角色名称不能为空' }]}
      />
      <ProFormText
        name="code"
        label="权限字符"
        placeholder="请输入权限字符"
        fieldProps={{ maxLength: 30 }}
        rules={[{ required: true, message: '权限字符不能为空' }]}
      />
      <ProFormDigit
        name="order"
        label="显示顺序"
        placeholder="请输入显示顺序"
        min={0}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { value: 0, label: '正常' },
          { value: 1, label: '停用' },
        ]}
      />
      <Divider style={{ margin: '12px 0' }} />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
        }}
      >
        <span style={{ fontWeight: 600 }}>菜单权限</span>
        <Space size={16}>
          <Checkbox
            checked={expandedAll}
            onChange={(e) => {
              setExpandedAll(e.target.checked);
              setExpandedKeys(e.target.checked ? allKeys : []);
            }}
          >
            展开/折叠
          </Checkbox>
          <Checkbox
            checked={checkStrictly}
            onChange={(e) => setCheckStrictly(e.target.checked)}
          >
            父子联动
          </Checkbox>
          <a
            onClick={() => {
              if (treeRef.current) {
                treeRef.current.setCheckedKeys(allKeys);
              }
            }}
          >
            全选
          </a>
          <a
            onClick={() => {
              if (treeRef.current) {
                treeRef.current.setCheckedKeys([]);
              }
            }}
          >
            全不选
          </a>
        </Space>
      </div>
      <div
        style={{
          maxHeight: 320,
          overflow: 'auto',
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          padding: 8,
        }}
      >
        <Tree
          ref={treeRef}
          checkable
          blockNode
          defaultExpandAll
          checkStrictly={checkStrictly}
          expandedKeys={expandedKeys}
          onExpand={setExpandedKeys}
          treeData={treeData}
        />
      </div>
    </ModalForm>
  );
};

export default RoleFormModal;
