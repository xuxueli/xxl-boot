/**
 * 页面：审计日志
 * 功能：日志分页表格 + 筛选/导出/详情/删除
 */
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { t } from '@/i18n';
import { loadEnum, toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { delOperlog, pageList } from '@/modules/framework/system/log/api';
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
      title: t('modal.title'),
      content: t('system.log.confirmDelete'),
      onOk: async () => {
        await delOperlog(ids);
        message.success(t('common.deleteSuccess'));
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
    { title: t('system.log.logId'), dataIndex: 'id', search: false, width: 80 },
    {
      title: t('system.log.logType'),
      dataIndex: 'type',
      width: 100,
      valueEnum: toValueEnum(logTypeOptions),
      render: (_, record) => (
        <Tag color={record.type === 0 ? 'geekblue' : 'warning'}>
          {record.type === 0 ? t('system.log.operLog') : t('system.log.loginLog')}
        </Tag>
      ),
    },
    {
      title: t('system.log.logModule'),
      dataIndex: 'module',
      ellipsis: true,
      valueEnum: toValueEnum(logModuleOptions),
      render: (_, record) =>
        moduleMap[record.module as number] || record.module,
    },
    { title: t('system.log.logTitle'), dataIndex: 'title', ellipsis: true },
    {
      title: t('system.log.operator'),
      dataIndex: 'operator',
      search: false,
      width: 110,
      ellipsis: true,
    },
    {
      title: t('system.log.ipAddress'),
      dataIndex: 'ip',
      search: false,
      width: 160,
      ellipsis: true,
      render: (_, record) => record.ipAddress || record.ip,
    },
    { title: t('common.addTime'), dataIndex: 'addTime', search: false, width: 180 },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            detailRef.current?.open(record, moduleMap);
          }}
        >
          <EyeOutlined /> {t('system.log.detail')}
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
                {t('common.delete')}
              </Button>
            ),
            hasRole('admin') && (
              <Button
                key="export"
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                {t('system.log.export')}
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
      <LogDetail ref={detailRef} />
    </PageContainer>
  );
};

export default LogList;