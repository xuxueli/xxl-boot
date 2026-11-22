/**
 * @fileoverview 审计日志
 * @description 日志分页表格 + 筛选/导出/详情/删除
 * @author xuxueli 2026-11-21
 */
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Tag } from 'antd';
import { useMemo, useRef, useState } from 'react';
import { toValueEnum, useEnumOption } from '@/hooks/useEnumOption';
import { usePermission } from '@/hooks/usePermission';
import { t } from '@/i18n';
import { logApi } from '@/modules/framework/system/log/api';
import { download } from '@/utils/download';
import LogDetail from './LogDetail';

/** 日志列表页 */
const LogList = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const [detailOpen, setDetailOpen] = useState(false); /* 详情弹窗显隐 */
  const [detailRow, setDetailRow] = useState<API.Log | null>(
    null,
  ); /* 当前日志 */
  const { hasPermi } = usePermission();

  // ---------------------- 页面状态 ----------------------

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const searchParamsRef = useRef<Record<string, any>>({});

  const logTypeOptions = useEnumOption('LogTypeEnum');
  const logModuleOptions = useEnumOption('LogModuleEnum');

  // 模块枚举：code → title 映射（详情展示用），复用 useEnumOption 已加载的选项
  const moduleMap = useMemo(() => {
    const map: Record<number, string> = {};
    logModuleOptions.forEach((o) => {
      map[o.code] = o.title || '';
    });
    return map;
  }, [logModuleOptions]);

  // 日志类型：code → title 映射，文案取后端枚举
  const typeMap = useMemo(() => {
    const map: Record<number, string> = {};
    logTypeOptions.forEach((o) => {
      map[o.code] = o.title || '';
    });
    return map;
  }, [logTypeOptions]);

  // ---------------------- 数据操作 ----------------------

  /** 删除日志 */
  const handleDelete = (row?: API.Log) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: t('modal.title'),
      content: t('system.log.confirmDelete'),
      onOk: async () => {
        await logApi.delete(ids);
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

  // ---------------------- 表格“列”定义 ----------------------

  const columns: ProColumns<API.Log>[] = [
    { title: t('common.id'), dataIndex: 'id', search: false, width: 80 },
    {
      title: t('system.log.logType'),
      dataIndex: 'type',
      width: 100,
      valueEnum: toValueEnum(logTypeOptions),
      render: (_, record) => (
        <Tag color={record.type === 0 ? 'geekblue' : 'warning'}>
          {typeMap[record.type ?? -1] || record.type}
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
    {
      title: t('common.addTime'),
      dataIndex: 'addTime',
      search: false,
      width: 180,
    },
    {
      title: t('common.operation'),
      valueType: 'option',
      width: 100,
      render: (_, record) => [
        <a
          key="detail"
          onClick={() => {
            setDetailRow(record);
            setDetailOpen(true);
          }}
        >
          <EyeOutlined /> {t('system.log.detail')}
        </a>,
      ],
    },
  ];

  // ---------------------- 数据列表渲染 ----------------------

  return (
    <PageContainer ghost title={false}>
      <ProTable<API.Log>
        actionRef={actionRef}
        rowKey="id"
        columns={columns}
        search={{
          labelWidth: 80,
          optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
        }}
        request={async (params) => {
          searchParamsRef.current = params;
          const res = await logApi.pageList(params);
          return {
            data: res.data?.data || [],
            total: res.data?.total || 0,
            success: true,
          };
        }}
        toolBarRender={() => [
          hasPermi('system:log') && (
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
          hasPermi('system:log') && (
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
          showTotal: (total) => t('common.paginationTotal', [total]),
        }}
        /* 默认批量选择提示隐藏 */
        tableAlertRender={false}
      />
      <LogDetail
        open={detailOpen}
        row={detailRow}
        moduleMap={moduleMap}
        onClose={() => setDetailOpen(false)}
      />
    </PageContainer>
  );
};

export default LogList;
