/**
 * 页面：301（无权限）
 * 功能：提示用户无访问权限，提供返回上一页或回首页入口
 */
import { Button, Col, Row } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import errImage from '@/assets/images/301.gif'
import './errPage.scss'

export default function Err301() {
  const location = useLocation()
  const navigate = useNavigate()

  // 301 动图（加时间戳防缓存）
  const errGif = `${errImage}?${+new Date()}`

  /** 返回上一页或首页 */
  const back = () => {
    const query = new URLSearchParams(location.search)
    if (query.get('noGoBack')) {
      // 标记不回退时跳转首页
      navigate({ pathname: '/' })
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="errPage-container">
      {/* 返回按钮 */}
      <Button icon={<ArrowLeftOutlined />} className="pan-back-btn" onClick={back}>
        返回
      </Button>

      <Row>
        {/* 提示信息 */}
        <Col span={12}>
          <h1 className="text-jumbo text-ginormous">301错误!</h1>
          <h2>您没有访问权限！</h2>
          <h6>对不起，您没有访问权限，请不要进行非法操作！您可以返回主页面</h6>
          <ul className="list-unstyled">
            <li className="link-type">
              <Link to="/">回首页</Link>
            </li>
          </ul>
        </Col>

        {/* 插画 */}
        <Col span={12}>
          <img src={errGif} width="313" height="428" alt="Girl has dropped her ice cream." />
        </Col>
      </Row>
    </div>
  )
}
