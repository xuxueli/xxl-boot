/**
 * 组件：Copyright（底部版权）
 * 功能：系统布局底部版权信息，通过 settingsStore 控制显隐与文案
 */
import { useSettingsStore } from '@/stores'

/**
 * 底部版权
 */
export default function Copyright() {
  const settingsStore = useSettingsStore()

  if (!settingsStore.footerVisible) {
    return null
  }

  return (
    <footer className="copyright">
      <span>{settingsStore.footerContent}</span>
      <a href="https://www.xuxueli.com/xxl-boot/" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
        xuxueli
      </a>
      <a href="https://github.com/xuxueli/xxl-boot" target="_blank" rel="noreferrer" style={{ marginLeft: 5, textDecoration: 'underline' }}>
        github
      </a>
    </footer>
  )
}
