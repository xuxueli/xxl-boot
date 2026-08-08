/**
 * 页面：404（未找到）
 * 功能：提示用户页面不存在，提供返回首页入口
 */
import { Link } from 'react-router-dom'
import defaultSettings from '@/default-settings'
import errParent from '@/assets/images/404.png'
import errCloud from '@/assets/images/404_cloud.png'
import './errPage.scss'

export default function Err404() {
  // 提示文字
  const message = '找不到网页！'

  return (
    <div className="wscn-http404-container">
      <div className="wscn-http404">
        {/* 404 插画 */}
        <div className="pic-404">
          <img className="pic-404__parent" src={errParent} alt="404" />
          <img className="pic-404__child left" src={errCloud} alt="404" />
          <img className="pic-404__child mid" src={errCloud} alt="404" />
          <img className="pic-404__child right" src={errCloud} alt="404" />
        </div>

        {/* 提示文案 */}
        <div className="bullshit">
          <div className="bullshit__oops">404错误!</div>
          <div className="bullshit__headline">{message}</div>
          <div className="bullshit__info">
            对不起，您正在寻找的页面不存在。尝试检查URL的错误，然后按浏览器上的刷新按钮或尝试在我们的应用程序中找到其他内容。
          </div>
          <Link to={defaultSettings.homePath} className="bullshit__return-home">
            返回首页
          </Link>
        </div>
      </div>
    </div>
  )
}
