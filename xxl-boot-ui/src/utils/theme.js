/**
 * Util（工具模块）说明：`theme.js`（主题样式设置：设置 Element Plus 主题色）
 *
 * 典型用法
 *      ```js
 *      import { handleThemeStyle } from '@/utils/theme'
 *      handleThemeStyle('#409EFF')
 *      ```
 *
 * @param {string} theme - 主题色的十六进制值（如：#409EFF）
 */
export function handleThemeStyle(theme) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
    const primary = isDark ? softenPrimaryForDark(theme) : theme
    document.documentElement.style.setProperty('--el-color-primary', primary)
    for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(`--el-color-primary-light-${i}`, `${getLightColor(primary, i / 10)}`)
    }
    for (let i = 1; i <= 9; i++) {
        document.documentElement.style.setProperty(`--el-color-primary-dark-${i}`, `${getDarkColor(primary, i / 10)}`)
    }
}

/**
 * 暗色模式下柔化主题色
 *      - 将主题色与深色背景混合，降低对比度以提升暗色模式下的视觉舒适度
 *
 * @param {string} theme - 原始主题色的十六进制值
 * @returns {string} 柔化后的主题色十六进制值
 */
function softenPrimaryForDark(theme) {
    return mixHexColors(theme, '#2d3036', 0.34)
}

/**
 * 混合两种十六进制颜色
 *      - 使用线性插值算法将前景色和背景色按指定比例混合
 *
 * @param {string} fg - 前景色的十六进制值
 * @param {string} bg - 背景色的十六进制值
 * @param {number} t - 混合比例（0-1之间，0表示完全背景色，1表示完全前景色）
 * @returns {string} 混合后的十六进制颜色值
 */
function mixHexColors(fg, bg, t) {
    const a = hexToRgb(String(fg).replace('#', ''))
    const b = hexToRgb(String(bg).replace('#', ''))
    const out = [0, 1, 2].map((i) => Math.round(a[i] * (1 - t) + b[i] * t))
    return rgbToHex(out[0], out[1], out[2])
}

/**
 * 十六进制颜色转换为 RGB 数组
 *
 * @param {string} str - 十六进制颜色值（可带或不带 # 前缀）
 * @returns {number[]} RGB 数组，包含三个整数元素 [r, g, b]，每个值范围 0-255
 */
function hexToRgb(str) {
    str = str.replace('#', '')
    let hexs = str.match(/../g)
    for (let i = 0; i < 3; i++) {
        hexs[i] = parseInt(hexs[i], 16)
    }
    return hexs
}

/**
 * RGB 颜色转换为十六进制颜色
 *
 * @param {number} r - 红色通道值（0-255）
 * @param {number} g - 绿色通道值（0-255）
 * @param {number} b - 蓝色通道值（0-255）
 * @returns {string} 十六进制颜色值（格式：#RRGGBB）
 */
function rgbToHex(r, g, b) {
    let hexs = [r.toString(16), g.toString(16), b.toString(16)]
    for (let i = 0; i < 3; i++) {
        if (hexs[i].length === 1) {
            hexs[i] = `0${hexs[i]}`
        }
    }
    return `#${hexs.join('')}`
}

/**
 * 计算颜色的浅色变体
 *      - 通过向白色方向插值来提亮颜色，用于生成 Element Plus 的 light 系列色阶
 *
 * @param {string} color - 原始颜色的十六进制值
 * @param {number} level - 提亮程度（0-1之间，值越大颜色越浅）
 * @returns {string} 提亮后的十六进制颜色值
 */
function getLightColor(color, level) {
    let rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor((255 - rgb[i]) * level + rgb[i])
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}

/**
 * 计算颜色的深色变体
 *      - 通过降低亮度来加深颜色，用于生成 Element Plus 的 dark 系列色阶
 *
 * @param {string} color - 原始颜色的十六进制值
 * @param {number} level - 加深程度（0-1之间，值越大颜色越深）
 * @returns {string} 加深后的十六进制颜色值
 */
function getDarkColor(color, level) {
    let rgb = hexToRgb(color)
    for (let i = 0; i < 3; i++) {
        rgb[i] = Math.floor(rgb[i] * (1 - level))
    }
    return rgbToHex(rgb[0], rgb[1], rgb[2])
}
