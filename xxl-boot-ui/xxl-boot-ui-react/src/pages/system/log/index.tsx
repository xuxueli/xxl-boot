/**
 * 页面：审计日志
 * 功能：日志分页表格 + 筛选/导出/详情/删除
 */
import { DeleteOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { loadEnum, toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delOperlog, pageList } from '@/services/system/log';
import { download } from '@/utils/download';
import LogDetail, { type LogDetailRef } from './LogDetail';

/**
 * 日志表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  logTable: css`
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

const LogList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const detailRef = useRef<LogDetailRef>(null);
  const { hasRole } = usePermission();
  const { styles } = useStyles();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [moduleMap, setModuleMap] = useState<Record<number, string>>({});
  const searchParamsRef = useRef<Record<string, any>>({});

  const logTypeOptions = useEnumOption('LogTypeEnum');
  const logModuleOptions = useEnumOption('LogModuleEnum');

  // 模块枚举：code → title 映射（详情展示用）
  React.useEffect(() => {
    loadEnum('LogModuleEnum').then((data) => {
      const map: Record<number, string> = {};
      data.forEach((o) => {
        map[o.code] = o.title || '';
      });
      setModuleMap(map);
    });
  }, []);

  /** 删除日志 */
  const handleDelete = (row?: API.Log) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content: '是否确认删除选中的日志？',
      onOk: async () => {
        await delOperlog(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  /** 导出日志 */
  const handleExport = () => {
    download(
      '/system/log/export',
      {
        ...searchParamsRef.current,
        type: searchParamsRef.current.type ?? -1,
        module: searchParamsRef.current.module ?? 0,
      },
      `log_${Date.now()}.xlsx`,
    );
  };

  const columns: ProColumns<API.Log>[] = [
    { title: '日志编号', dataIndex: 'id', search: false, width: 90 },
    {
      title: '日志类型',
      dataIndex: 'type',
      width: 100,
      valueEnum: toValueEnum(logTypeOptions),
      render: (_, record) => (
        <Tag color={record.type === 0 ? 'geekblue' : 'warning'}>
          {record.type === 0 ? '操作日志' : '登陆日志'}
        </Tag>
      ),
    },
    {
      title: '系统模块',
      dataIndex: 'module',
      width: 120,
      valueEnum: toValueEnum(logModuleOptions),
      render: (_, record) =>
        moduleMap[record.module as number] || record.module,
    },
    { title: '操作名称', dataIndex: 'title' },
    { title: '操作人', dataIndex: 'operator', search: false },
    {
      title: 'IP',
      dataIndex: 'ip',
      search: false,
      render: (_, record) => record.ipAddress || record.ip || '-',
    },
    { title: '操作时间', dataIndex: 'addTime', search: false, width: 160 },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            detailRef.current?.open(record, moduleMap);
          }}
        >
          详细
        </a>,
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div className={styles.logTable}>
        <ProTable<API.Log>
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
            searchParamsRef.current = params;
            const res = await pageList(params);
            return {
              data: res.data?.data || [],
              total: res.data?.total || 0,
              success: true,
            };
          }}
          toolBarRender={() => [
            hasRole('admin') && (
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                disabled={!selectedIds.length}
                onClick={() => handleDelete()}
              >
                删除
              </Button>
            ),
            hasRole('admin') && (
              <Button
                key="export"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
            ),
          ]}
          rowSelection={{
            onChange: (_keys, rows) => {
              setSelectedIds(rows.map((r) => r.id as number));
            },
          }}
          tableAlertRender={false}
        />
      </div>
      <LogDetail ref={detailRef} />
    </PageContainer>
  );
};

export default LogList;
