/**
 * 组件：DictDataDrawer（字典项抽屉）
 * 功能：展示指定字典下的全部字典项
 * @author xuxueli 2026-08-09
 */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Drawer, Row, Col, Spin, Tag } from 'antd'
import { UnorderedListOutlined, LoadingOutlined, FileTextOutlined } from '@ant-design/icons'
import { listData } from '@/api/system/dict/data'
import type { Dict, DictItem } from '@/types/api'
import './detail.scss'

export interface DictDataDrawerHandle {
  /** 打开抽屉：加载指定字典下的字典项列表 */
  open: (row: Dict) => void
}

/**
 * 字典项抽屉
 */
const DictDataDrawer = forwardRef<DictDataDrawerHandle>(function DictDataDrawer(_, ref) {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [row, setRow] = useState<Dict>({})
  const [dataList, setDataList] = useState<DictItem[]>([])

  // 正常条数 / 停用条数
  const normalCount = dataList.filter((r) => r.status === 0).length
  const disabledCount = dataList.filter((r) => r.status !== 0).length

  /** 加载字典项列表 */
  function loadData(row: Dict) {
    if (!row?.id) return
    setLoading(true)
    setDataList([])
    listData({ dictId: row.id, offset: 0, pagesize: 100 })
      .then((response) => {
        setDataList(response.data.data || [])
      })
      .catch(() => {})
      .finally(() => {
        setLoading(false)
      })
  }

  /** 打开抽屉 */
  function open(row: Dict) {
    setRow(row)
    setVisible(true)
    loadData(row)
  }

  /** 关闭抽屉：清空字典项列表 */
  function handleClose() {
    setVisible(false)
    setDataList([])
  }

  useImperativeHandle(ref, () => ({ open }))

  return (
    <Drawer
      open={visible}
      placement="right"
      width={700}
      onClose={handleClose}
      title={
        <div className="drawer-head">
          <UnorderedListOutlined style={{ color: '#5b9bd5', marginRight: 8 }} />
          <span className="drawer-head-name">{row.name}</span>
          <span className="drawer-head-type">{row.type}</span>
        </div>
      }
    >
      <div className="drawer-wrap">
        {/* 加载中 */}
        {loading ? (
          <div className="drawer-loading">
            <LoadingOutlined spin />
            <span>加载中...</span>
          </div>
        ) : !dataList.length ? (
          /* 空数据 */
          <div className="drawer-empty">
            <FileTextOutlined style={{ fontSize: 36 }} />
            <div>暂无字典数据</div>
          </div>
        ) : (
          <>
            {/* 统计卡片 */}
            <Row gutter={12} className="stat-row">
              <Col span={disabledCount > 0 ? 8 : 12}>
                <div className="stat-card">
                  <div className="stat-num">{dataList.length}</div>
                  <div className="stat-label">共计条目</div>
                </div>
              </Col>
              <Col span={disabledCount > 0 ? 8 : 12}>
                <div className="stat-card">
                  <div className="stat-num success">{normalCount}</div>
                  <div className="stat-label">正常</div>
                </div>
              </Col>
              {disabledCount > 0 && (
                <Col span={8}>
                  <div className="stat-card">
                    <div className="stat-num danger">{disabledCount}</div>
                    <div className="stat-label">停用</div>
                  </div>
                </Col>
              )}
            </Row>

            {/* 字典项列表 */}
            {dataList.map((item) => (
              <div key={item.id} className="dict-item">
                <div className="dict-cell">
                  <div className="dict-cell-key">字典项名称</div>
                  <div className="dict-cell-val">{item.name}</div>
                </div>
                <div className="dict-cell">
                  <div className="dict-cell-key">字典项Code</div>
                  <div className="dict-cell-val">{item.code}</div>
                </div>
                <div className="dict-cell">
                  <div className="dict-cell-key">状态</div>
                  <div className="dict-cell-val">
                    <Tag color={item.status === 0 ? 'green' : 'red'}>{item.status === 0 ? '正常' : '停用'}</Tag>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </Drawer>
  )
})

DictDataDrawer.displayName = 'DictDataDrawer'
export default DictDataDrawer
