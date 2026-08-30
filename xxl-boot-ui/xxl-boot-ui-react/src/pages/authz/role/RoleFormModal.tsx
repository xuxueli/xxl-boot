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
import {App, Checkbox, Col, Divider, Space, Tree} from 'antd';
import type {DataNode} from 'antd/es/tree';
import React, {useEffect, useMemo, useState} from 'react';
import {listResource} from '@/services/authz/resource';
import {
    addRole,
    roleMenuTreeselect,
    updateRole,
    updateRoleRes,
} from '@/services/authz/role';
import {handleTree} from '@/utils/common';

/**
 * 资源平铺数组转 antd Tree 数据
 */
const toTreeData = (resources: API.Resource[]): DataNode[] =>
    resources.map((r) => ({
        key: r.id as number,
        title: r.name,
        children: r.children?.length ? toTreeData(r.children) : undefined,
    }));

/**
 * 收集所有节点 key
 *  - 用于全选/全不选、展开/折叠
 */
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

/*
* 组件：RoleFormModal（角色新增/编辑弹窗）
* 功能：角色基本信息 + 菜单权限树（支持展开/折叠、全选、父子联动）
*/
const RoleFormModal = ({
                           open,
                           onOpenChange,
                           current,
                           onSuccess,
                       }: {
    /* 是否打开弹窗 */
    open: boolean;
    /* 弹窗打开状态变化回调 */
    onOpenChange: (open: boolean) => void;
    /* 当前编辑的角色数据，null 表示新增 */
    current?: API.Role | null;
    /* 操作成功回调 */
    onSuccess?: () => void;
}) => {
    // antd 提示
    const {message} = App.useApp();

    // 资源树：全部数据
    const [treeData, setTreeData] = useState<DataNode[]>([]);
    // 资源树：已展开节点 key 集合
    const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
    // 资源树：已勾选节点 key 集合（受控）
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    // 资源树：半勾选节点 key 集合（受控）
    const [halfCheckedKeys, setHalfCheckedKeys] = useState<React.Key[]>([]);
    // 资源树：是否展开所有节点
    const [expandedAll, setExpandedAll] = useState(false);
    // 资源树：是否父子联动勾选
    const [checkStrictly, setCheckStrictly] = useState(false);

    /**
     * 加载资源树与已授权集合
     */
    const loadTree = (roleId?: number) => {
        listResource({}).then((res) => {
            // 数据查询并处理：API查询资源树数据 -> antd Tree 数据
            const tree = toTreeData(handleTree(res.data || []));
            // 设置资源树数据
            setTreeData(tree);

            // 重置展开节点、勾选、半勾选状态
            setExpandedKeys([]);
            setCheckedKeys([]);
            setHalfCheckedKeys([]);

            // 编辑场景：初始化已勾选节点（角色已授权的资源集合）
            if (roleId) {
                roleMenuTreeselect(roleId)
                    .then((roleRes) => {
                        setCheckedKeys(roleRes.data || []);
                    })
                    .catch(() => {
                    });
            }
        });
    };

    // 组件挂载或弹窗打开时加载资源树
    useEffect(() => {
        if (open) {
            loadTree(current?.id);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    // 计算所有节点 key 集合，用于全选/全不选、展开/折叠
    const allKeys = useMemo(() => collectAllKeys(treeData), [treeData]);

    /**
     * 树勾选变化：受控记录勾选与半选节点
     */
    const handleCheck = (keys: React.Key[] | { checked: React.Key[]; halfChecked: React.Key[] }, info: any) => {
        setCheckedKeys(Array.isArray(keys) ? keys : (keys?.checked ?? []));
        setHalfCheckedKeys(info.halfCheckedKeys ?? []);
    };

    /**
     * 收集勾选 + 半勾选的资源 id
     */
    const getMenuAllCheckedKeys = (): number[] => {
        return [...checkedKeys, ...halfCheckedKeys]
            .map((k) => Number(k))
            .filter((k) => !Number.isNaN(k));
    };

    /**
     * 提交：保存角色 + 资源授权
     */
    const handleFinish = async (values: API.Role) => {
        // 过滤掉不需要的字段
        const data = {...values};
        delete data.addTime;
        delete data.updateTime;
        const resourceIds = getMenuAllCheckedKeys();

        // 新增/编辑角色 + 授权资源
        if (current?.id) {
            await updateRole({...data, id: current.id});
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
        /* 表单模态框 */
        <ModalForm<API.Role>
            title={current?.id ? '修改角色' : '新增角色'}
            width={680}
            open={open}                             /* 是否打开弹窗 */
            onOpenChange={onOpenChange}             /* 弹窗打开状态变化回调 */
            modalProps={{destroyOnHidden: true}}
            layout="horizontal"
            grid
            labelCol={{flex: '100px'}}
            onFinish={handleFinish}               /* 提交表单回调 */
            initialValues={{status: 0, order: 0, ...current}}
        >
            {/* 表单项 */}
            <ProFormText
                colProps={{span: 12}}
                name="name"
                label="角色名称"
                placeholder="请输入角色名称"
                fieldProps={{maxLength: 30}}
                rules={[{required: true, message: '角色名称不能为空'}]}
            />
            <ProFormText
                colProps={{span: 12}}
                name="code"
                label="权限字符"
                placeholder="请输入权限字符"
                fieldProps={{maxLength: 30}}
                rules={[{required: true, message: '权限字符不能为空'}]}
            />
            <ProFormDigit
                colProps={{span: 12}}
                name="order"
                label="显示顺序"
                placeholder="请输入显示顺序"
                min={0}
                fieldProps={{style: {width: '100%'}}}
            />
            <ProFormRadio.Group
                colProps={{span: 12}}
                name="status"
                label="状态"
                options={[
                    {value: 0, label: '正常'},
                    {value: 1, label: '停用'},
                ]}
            />
            {/* 复杂表单项：菜单权限tree */}
            <Col span={24}>
                <Divider style={{margin: '12px 0'}}/>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: 8,
                    }}
                >
                    <span style={{fontWeight: 600}}>菜单权限</span>
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
                                setCheckedKeys(allKeys);
                                setHalfCheckedKeys([]);
                            }}
                        >
                            全选
                        </a>
                        <a
                            onClick={() => {
                                setCheckedKeys([]);
                                setHalfCheckedKeys([]);
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
                        checkable                       /* 是否可选择 */
                        blockNode                       /* 占满整行 */
                        checkStrictly={checkStrictly}   /* 是否父子联动勾选 */
                        checkedKeys={checkedKeys}       /* 受控：已勾选节点 key 集合 */
                        onCheck={handleCheck}           /* 勾选变化回调 */
                        expandedKeys={expandedKeys}     /* 受控：已展开节点 key 集合 */
                        onExpand={setExpandedKeys}      /* 展开变化回调 */
                        treeData={treeData}             /* 树节点数据 */
                    />
                </div>
            </Col>
        </ModalForm>
    );
};

export default RoleFormModal;
