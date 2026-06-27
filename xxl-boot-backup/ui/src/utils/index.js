/**
 * 前端通用工具函数集合（index.js）
 *
 * 职责：
 *   - 汇集日期格式化、URL 参数处理、DOM 操作、防抖、深克隆、
 *     字符串转换、代码生成器配置等多类通用工具。
 *   - 所有函数均为纯函数或轻量 DOM 工具，无业务耦合，可跨模块复用。
 *   - 同时导出代码生成器（generator）所需的公共配置常量。
 *
 * 分组说明：
 *   1. 日期 / 时间格式化   - formatDate, formatTime
 *   2. URL / 参数处理      - getQueryObject, param, param2Obj
 *   3. 字符串工具           - byteLength, html2Text, titleCase, camelCase, isNumberStr
 *   4. 数组工具             - cleanArray, uniqueArr, createUniqueString
 *   5. 对象工具             - objectMerge, deepClone
 *   6. DOM 工具             - toggleClass, hasClass, addClass, removeClass
 *   7. 时间工具             - getTime
 *   8. 函数工具             - debounce
 *   9. 代码生成器配置       - makeMap, exportDefault, beautifierConf
 */
import { parseTime } from './boot'

// ─────────────────────────────────────────────
// 1. 日期 / 时间格式化
// ─────────────────────────────────────────────

/**
 * 表格时间格式化
 *
 * 将时间戳或时间字符串格式化为 'YYYY-MM-DD HH:mm:ss' 形式，
 * 专为 Element Plus 表格列的 formatter 场景设计。
 *
 * @param {number|string} cellValue - 表格单元格的时间值
 * @returns {string} 格式化后的时间字符串；值为空时返回 ''
 */
export function formatDate(cellValue) {
  if (cellValue == null || cellValue == "") return ""
  const date = new Date(cellValue) 
  const year = date.getFullYear()
  const month = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() 
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours() 
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() 
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds
}

/**
 * 相对时间格式化（如"刚刚"、"5分钟前"等）
 *
 * 根据与当前时间的差值返回人性化的相对时间描述；
 * 超出 2 天时，若提供了 option 则使用 parseTime 格式化，否则返回 "M月D日H时I分"。
 *
 * @param {number} time   - 时间戳（支持秒级 10 位和毫秒级 13 位）
 * @param {string} [option] - parseTime 格式模板（超出 2 天时使用）
 * @returns {string} 相对时间描述字符串
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

// ─────────────────────────────────────────────
// 2. URL / 参数处理
// ─────────────────────────────────────────────

/**
 * 从 URL 字符串中解析查询参数为对象
 *
 * @param {string} [url] - 含查询参数的 URL，默认取 window.location.href
 * @returns {Object} 键值对形式的查询参数对象
 */
export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 * 将对象序列化为 URL 查询字符串（& 连接，undefined 值被忽略）
 *
 * @param {Object} json - 待序列化的参数对象
 * @returns {string} URL 查询字符串（不含 ?）
 */
export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * 将 URL 查询字符串解析为对象
 *
 * @param {string} url - 含 ? 的完整 URL 或查询字符串部分
 * @returns {Object} 键值对形式的查询参数对象；无查询参数时返回 {}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

// ─────────────────────────────────────────────
// 3. 字符串工具
// ─────────────────────────────────────────────

/**
 * 计算 UTF-8 字符串的字节长度
 *
 * ASCII 字符占 1 字节，2字节 Unicode（U+0080–U+07FF）占 2 字节，
 * 3字节 Unicode（U+0800–U+FFFF）占 3 字节（代理对各 -1 字符）。
 *
 * @param {string} str - 待计算的字符串
 * @returns {number} 字节长度
 */
export function byteLength(str) {
  // returns the byte length of an utf8 string
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xDC00 && code <= 0xDFFF) i--
  }
  return s
}

/**
 * 将 HTML 字符串转换为纯文本
 *
 * 通过临时 div 元素解析 HTML，提取其纯文本内容，可用于展示富文本摘要。
 *
 * @param {string} val - 含 HTML 标签的字符串
 * @returns {string} 去除 HTML 标签后的纯文本
 */
export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 首字母大写
 *
 * 将字符串中每个单词（以空格或开头分隔）的首字母转为大写。
 *
 * @param {string} str - 待处理字符串
 * @returns {string} 处理后的字符串
 */
// 首字母大小
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * 下划线命名转驼峰命名
 *
 * 将 snake_case 格式的字符串转换为 camelCase 格式。
 * 例：'some_field_name' → 'someFieldName'
 *
 * @param {string} str - 下划线命名的字符串
 * @returns {string} 驼峰命名的字符串
 */
// 下划转驼峰
export function camelCase(str) {
  return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

/**
 * 判断字符串是否为合法数字（支持正负整数和小数）
 *
 * @param {string} str - 待检测字符串
 * @returns {boolean} 是合法数字时返回 true
 */
export function isNumberStr(str) {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// ─────────────────────────────────────────────
// 4. 数组工具
// ─────────────────────────────────────────────

/**
 * 过滤数组中的假值（null / undefined / 0 / '' / false）
 *
 * @param {Array} actual - 原始数组
 * @returns {Array} 过滤后只含真值的新数组
 */
export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 数组去重
 *
 * 使用 Set 实现，保留首次出现顺序。
 *
 * @param {Array} arr - 含重复元素的数组
 * @returns {Array} 去重后的新数组
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * 生成唯一字符串 ID
 *
 * 结合当前时间戳与随机数，转为 32 进制字符串，在前端场景下基本不会重复。
 *
 * @returns {string} 唯一字符串（32 进制）
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = parseInt((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

// ─────────────────────────────────────────────
// 5. 对象工具
// ─────────────────────────────────────────────

/**
 * 深度合并两个对象（source 中同名字段被 source 中新值覆盖）
 *
 * 若 source 为数组，返回 source 的浅拷贝。
 * 递归处理对象类型属性，基本类型直接覆盖。
 *
 * @param {Object}        target - 被更新的目标对象
 * @param {Object|Array}  source - 提供新值的来源
 * @returns {Object} 合并后的对象
 */
export function objectMerge(target, source) {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

/**
 * 简易深克隆
 *
 * 递归复制对象/数组的所有属性，创建与原对象完全独立的新对象。
 * 注意：不处理 Date、RegExp、Function 等特殊类型，如需完整深克隆，
 * 请使用 lodash 的 _.cloneDeep。
 *
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 *
 * @param {Object|Array} source - 待克隆的源对象
 * @returns {Object|Array} 深克隆后的新对象
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys])
    } else {
      targetObj[keys] = source[keys]
    }
  })
  return targetObj
}

// ─────────────────────────────────────────────
// 6. DOM 工具
// ─────────────────────────────────────────────

/**
 * 切换 DOM 元素的 CSS 类名（有则移除，无则添加）
 *
 * @param {HTMLElement} element   - 目标 DOM 元素
 * @param {string}      className - 要切换的类名
 */
export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 检测 DOM 元素是否包含指定 CSS 类名
 *
 * @param {HTMLElement} ele - 目标 DOM 元素
 * @param {string}      cls - 要检测的类名
 * @returns {boolean} 包含时返回 true
 */
export function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 向 DOM 元素添加 CSS 类名（已存在时不重复添加）
 *
 * @param {HTMLElement} ele - 目标 DOM 元素
 * @param {string}      cls - 要添加的类名
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 从 DOM 元素移除指定 CSS 类名
 *
 * @param {HTMLElement} ele - 目标 DOM 元素
 * @param {string}      cls - 要移除的类名
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// ─────────────────────────────────────────────
// 7. 时间工具
// ─────────────────────────────────────────────

/**
 * 获取时间范围边界
 *
 * @param {string} type - 'start'：返回 90 天前的时间戳；其他：返回今日起始时间
 * @returns {number|Date} 时间戳或 Date 对象
 */
export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

// ─────────────────────────────────────────────
// 8. 函数工具
// ─────────────────────────────────────────────

/**
 * 防抖函数
 *
 * 在事件连续触发期间，只在最后一次触发结束后延迟 wait ms 执行 func；
 * 若 immediate 为 true，则首次触发立即执行，之后忽略直至停止触发。
 *
 * @param {Function} func      - 需要防抖的函数
 * @param {number}   wait      - 防抖等待时间（ms）
 * @param {boolean}  [immediate=false] - 是否在首次触发时立即执行
 * @returns {Function} 包装后的防抖函数
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

// ─────────────────────────────────────────────
// 9. 代码生成器配置
// ─────────────────────────────────────────────

/**
 * 构建字符串集合的快速查找函数（O(1) 时间复杂度）
 *
 * 将逗号分隔的字符串转为 Set 结构的查找函数，
 * 可选支持大小写不敏感。常用于代码生成器中判断标签名、关键字等。
 *
 * @param {string}  str              - 逗号分隔的字符串集合
 * @param {boolean} [expectsLowerCase] - true 时查找时将输入转小写
 * @returns {Function} 接收一个字符串，返回是否在集合中的函数
 */
export function makeMap(str, expectsLowerCase) {
  const map = Object.create(null)
  const list = str.split(',')
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true
  }
  return expectsLowerCase
    ? val => map[val.toLowerCase()]
    : val => map[val]
}
 
/** 代码生成器：默认导出语句前缀 */
export const exportDefault = 'export default '

/**
 * 代码生成器：js-beautify 格式化配置
 *
 * 包含 HTML 和 JS 两套格式化选项，供代码生成器输出格式化代码时使用。
 * 行宽统一为 110 字符，缩进 2 空格。
 */
export const beautifierConf = {
  html: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'separate',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: false,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  },
  js: {
    indent_size: '2',
    indent_char: ' ',
    max_preserve_newlines: '-1',
    preserve_newlines: false,
    keep_array_indentation: false,
    break_chained_methods: false,
    indent_scripts: 'normal',
    brace_style: 'end-expand',
    space_before_conditional: true,
    unescape_strings: false,
    jslint_happy: true,
    end_with_newline: true,
    wrap_line_length: '110',
    indent_inner_html: true,
    comma_first: false,
    e4x: true,
    indent_empty_lines: true
  }
}
