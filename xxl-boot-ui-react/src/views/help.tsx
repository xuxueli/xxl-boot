/**
 * 页面：Help（帮助中心）
 * 功能：显示 GitHub 地址、Star 数、帮助文档链接
 */
import { Button, Card, Divider } from 'antd'
import { GithubOutlined, HomeOutlined } from '@ant-design/icons'
import defaultSettings from '@/default-settings'
import './help.scss'

export default function Help() {
  const title = defaultSettings.title
  const version = defaultSettings.version
  const footerContent = defaultSettings.footerContent

  /** 跳转外部链接 */
  const goTarget = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className="app-container help">
      <Card>
        <h2>XXL-BOOT｜{title}</h2>
        <p>
          XXL-BOOT 是一个快速开发平台，易学易用、扩展丰富、开箱即用。整合前后端流行技术，致力为 中小企业、个人开发者
          打造开箱即用的中后台解决方案。
        </p>

        <p>
          {/* GitHub */}
          <Button type="primary" icon={<GithubOutlined />} onClick={() => goTarget('https://github.com/xuxueli/xxl-boot')}>
            访问GitHub
          </Button>
          {/* 帮助文档 */}
          <Button icon={<HomeOutlined />} onClick={() => goTarget('https://www.xuxueli.com/xxl-boot/')}>
            帮助文档
          </Button>
          &nbsp;&nbsp;｜&nbsp;&nbsp;
          <iframe
            src="https://ghbtns.com/github-btn.html?user=xuxueli&repo=xxl-boot&type=star&count=true"
            frameBorder="0"
            scrolling="0"
            width="170px"
            height="20px"
            style={{ marginBottom: -5 }}
            title="star"
          />
          <br />
          <br />
        </p>

        <Divider className="divider" />
        <p>
          Powered by <b>XXL-BOOT</b> v{version}
          <span style={{ float: 'right' }}>
            {footerContent}
            <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
              xuxueli
            </a>
            <a href="https://github.com/xuxueli/xxl-boot" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
              github
            </a>
          </span>
        </p>
      </Card>
    </div>
  )
}
