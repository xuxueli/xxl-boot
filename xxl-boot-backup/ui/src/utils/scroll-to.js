/**
 * 平滑滚动工具模块（scroll-to.js）
 *
 * 职责：
 *   - 提供基于 requestAnimationFrame 的平滑页面滚动能力。
 *   - 使用缓动函数（easeInOutQuad）实现先加速后减速的自然滚动效果。
 *   - 兼容多种浏览器的滚动属性写法，确保跨浏览器一致性。
 *
 * 典型用法：
 *   import { scrollTo } from '@/utils/scroll-to'
 *   scrollTo(0, 800)                    // 800ms 内平滑滚动到顶部
 *   scrollTo(500, 500, () => { ... })   // 滚动完成后执行回调
 */

/**
 * 缓动函数：二次方 easeInOutQuad
 *
 * 实现"先加速、后减速"的平滑动画效果，常用于滚动/位移动画。
 * 算法来源：Robert Penner 缓动函数。
 *
 * @param {number} t - 当前时间（elapsed time）
 * @param {number} b - 起始值（beginning value）
 * @param {number} c - 变化量（change in value = 目标值 - 起始值）
 * @param {number} d - 总持续时间（duration）
 * @returns {number} 当前时刻对应的插值结果
 */
Math.easeInOutQuad = function(t, b, c, d) {
  t /= d / 2
  if (t < 1) {
    return c / 2 * t * t + b
  }
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

// requestAnimationFrame for Smart Animating http://goo.gl/sx5sts
// 跨浏览器兼容：依次尝试标准 API 及各浏览器前缀版本，最终降级为 setTimeout(60fps)
const requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) { window.setTimeout(callback, 1000 / 60) }
})()

/**
 * 设置页面滚动位置（兼容多浏览器写法）
 *
 * 因为不同浏览器对滚动属性的支持不一致，同时写入三个属性以确保生效。
 *
 * @param {number} amount - 目标滚动距离（px）
 */
function move(amount) {
  document.documentElement.scrollTop = amount
  document.body.parentNode.scrollTop = amount
  document.body.scrollTop = amount
}

/**
 * 读取当前页面滚动位置
 *
 * 依次检测各浏览器的滚动属性，返回第一个非零值（或最终为 0）。
 *
 * @returns {number} 当前滚动位置（px）
 */
function position() {
  return document.documentElement.scrollTop || document.body.parentNode.scrollTop || document.body.scrollTop
}

/**
 * 平滑滚动到指定位置
 *
 * 基于 requestAnimationFrame 驱动逐帧更新，配合 easeInOutQuad 缓动函数
 * 实现流畅的视觉效果。每帧推进 20ms 的时间步长，直到达到目标位置或
 * 超过指定持续时间。
 *
 * @param {number}    to       - 目标滚动位置（距页面顶部的像素值）
 * @param {number}    [duration=500] - 动画持续时间（ms），默认 500ms
 * @param {Function}  [callback]     - 动画结束后的回调函数（可选）
 */
export function scrollTo(to, duration, callback) {
  const start = position()           // 起始滚动位置
  const change = to - start          // 需要变化的距离（正数向下，负数向上）
  const increment = 20               // 每帧时间步长（ms），约等于 50fps
  let currentTime = 0
  duration = (typeof (duration) === 'undefined') ? 500 : duration
  const animateScroll = function() {
    // increment the time
    currentTime += increment
    // find the value with the quadratic in-out easing function
    const val = Math.easeInOutQuad(currentTime, start, change, duration)
    // move the document.body
    move(val)
    // do the animation unless its over
    if (currentTime < duration) {
      requestAnimFrame(animateScroll)
    } else {
      if (callback && typeof (callback) === 'function') {
        // the animation is done so lets callback
        callback()
      }
    }
  }
  animateScroll()
}
