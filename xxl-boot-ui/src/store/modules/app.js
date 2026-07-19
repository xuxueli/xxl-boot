/**
 * 名称：应用状态Store
 * 描述：用于管理全局状态，包括 侧边栏状态、字体大小 ... 等。
 */
import Cookies from 'js-cookie'

const useAppStore = defineStore(
    'app',
    {
        state: () => ({
            // 侧边栏状态
            sidebar: {
                // 是否展开：0-折叠 1-展开
                opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
                // 是否无切换动画：true-无动画 false-有动画
                withoutAnimation: false,
                // 是否隐藏：true-隐藏 false-显示
                hide: false
            },
            // 设备状态
            device: 'desktop',
            // 字体大小
            size: Cookies.get('size') || 'default'
        }),
        actions: {
            /**
             * 侧边栏 - 切换状态
             *
             * @param withoutAnimation   切换动画
             */
            toggleSideBar(withoutAnimation) {
                if (this.sidebar.hide) {
                    return false
                }
                // 切换侧边栏状态
                this.sidebar.opened = !this.sidebar.opened
                // 设置是否无动画
                this.sidebar.withoutAnimation = withoutAnimation
                // 设置侧边栏状态
                if (this.sidebar.opened) {
                    Cookies.set('sidebarStatus', 1)
                } else {
                    Cookies.set('sidebarStatus', 0)
                }
            },
            /**
             * 侧边栏 - 折叠
             *
             * @param withoutAnimation  设置是否无动画
             */
            closeSideBar({withoutAnimation}) {
                // 取消隐藏
                if (this.sidebar.hide) {
                    this.hideSideBar(false);
                }

                // 修改状态
                Cookies.set('sidebarStatus', 0)
                this.sidebar.opened = false
                this.sidebar.withoutAnimation = withoutAnimation
            },
            /**
             * 侧边栏 - 展开
             * @param withoutAnimation  设置是否无动画
             */
            openSideBar({withoutAnimation}) {
                // 取消隐藏
                if (this.sidebar.hide) {
                    this.hideSideBar(false);
                }

                // 修改状态
                Cookies.set('sidebarStatus', 1)
                this.sidebar.opened = true
                this.sidebar.withoutAnimation = withoutAnimation
            },
            /**
             * 侧边栏 - 隐藏/关闭
             *
             * @param status  侧边栏隐藏状态
             */
            hideSideBar(status) {
                this.sidebar.hide = status
            },
            /**
             * 设备 - 切换状态
             *
             * @param device  设备状态
             */
            toggleDevice(device) {
                this.device = device
            },
            /**
             * 设置字体大小
             *
             * @param size  字体大小
             */
            setSize(size) {
                this.size = size
                Cookies.set('size', size)
            }
        }
    })

export default useAppStore
