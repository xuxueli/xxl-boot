/**
 * common - 通用工具函数
 *
 * 工具列表：
 *   1. parseTime          - 日期格式化（支持多种输入和自定义模板）
 *   2. formatDate         - 表格列日期格式化（YYY-MM-DD HH:mm:ss 固定格式）
 *   3. formatTime         - 相对时间描述（刚刚/N分钟前/小时前/天前）
 *   4. getTime            - 获取时间范围边界（90天前/今日起始）
 *   6. parseStrEmpty      - 无效值转空字符串
 *   7. byteLength         - 计算 UTF-8 字符串字节长度
 *   8. html2Text          - HTML 转纯文本
 *   9. titleCase          - 首字母大写
 *  10. camelCase          - 下划线转驼峰
 *  11. isNumberStr        - 判断是否为合法数字
 *  12. cleanArray         - 过滤数组假值
 *  13. uniqueArr          - 数组去重
 *  14. createUniqueString - 生成唯一字符串 ID
 *  15. mergeRecursive     - 递归合并对象（target 覆盖 source）
 *  16. objectMerge        - 深度合并对象（source 覆盖 target）
 *  17. deepClone          - 简易深克隆
 *  18. toggleClass        - 切换 DOM 元素 CSS 类名
 *  19. hasClass           - 检测 DOM 元素是否包含指定类名
 *  20. addClass           - 添加 CSS 类名
 *  21. removeClass        - 移除 CSS 类名
 *  22. debounce           - 防抖函数
 *  23. getQueryObject     - URL 查询参数解析为对象
 *  24. param              - 对象转 URL 查询字符串
 *  25. param2Obj          - URL 查询字符串解析为对象
 *  26. tansParams         - 参数序列化（支持嵌套对象展开）
 *  27. getNormalPath      - 规范化路径（去除重复/末尾斜杠）
 *  28. resetForm          - 重置 el-form 表单（Options API）
 *  29. addDateRange       - 添加日期范围到查询参数
 *  30. selectDictLabel    - 字典回显单值
 *  31. selectDictLabels   - 字典回显多值
 *  32. handleTree         - 扁平数组转树形结构
 *  33. blobValidate       - 验证 blob 是否为合法文件数据
 *
 * 用法：
 *   import { parseTime, handleTree } from '@/utils/common'
 *   parseTime(new Date(), '{y}-{m}-{d}')  // 日期格式化
 *   handleTree(list)                        // 扁平数组转树形
 */
import { h } from 'vue'

// ==================== 日期 / 时间 ====================

/**
 * 日期格式化
 *
 * @param time    - Date 对象 / 时间戳 / ISO 字符串
 * @param pattern - 模板，默认 '{y}-{m}-{d} {h}:{i}:{s}'
 *   占位符：{y}年 {m}月 {d}日 {h}时 {i}分 {s}秒 {a}星期
 * @returns 格式化后的日期字符串；无有效输入时返回 null
 *
 * 示例：
 *   parseTime('2024-01-15', '{y}/{m}/{d}')   // '2024/01/15'
 *   parseTime(1705315200000)                   // '2024-01-15 12:00:00'
 */
export function parseTime(time: Date | number | string, pattern?: string): string | null {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    } else if (typeof time === 'string') {
      time = time
        .replace(new RegExp(/-/gm), '/')
        .replace('T', ' ')
        .replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: Record<string, number> = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result: string, key: string): string => {
    let value: number | string = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return String(value || '0')
  })
  return timeStr
}

/**
 * 表格列时间格式化（parseTime 的简化版，固定 YYYY-MM-DD HH:mm:ss）
 *
 * 适用于 Element Plus el-table-column 的 formatter 属性。
 *
 * @param cellValue - 时间值
 * @returns 格式化后的时间字符串
 *
 * 示例：
 *   formatDate('2024-01-15T12:00:00')  // '2024-01-15 12:00:00'
 */
export function formatDate(cellValue: number | string | null | undefined): string {
  if (cellValue == null || cellValue === '') return ''
  return parseTime(cellValue) || ''
}

/**
 * 相对时间描述（刚刚 / N分钟前 / N小时前 / N天前 / 具体日期）
 *
 * @param time   - 时间戳（10 位秒级或 13 位毫秒级）
 * @param option - 超过 2 天时的格式模板，默认 'M月D日H时I分'
 * @returns 相对时间或具体日期描述
 *
 * 示例：
 *   formatTime(Date.now() - 300000)   // '5分钟前'
 *   formatTime(1700000000)             // 超过 2 天时 → '11月15日3时33分'
 */
export function formatTime(time: number | string, option?: string): string {
  const t: number = typeof time === 'string' && time.length === 10 ? parseInt(time) * 1000 : Number(time)
  const d = new Date(t)
  const now = Date.now()
  const diff = (now - d.getTime()) / 1000
  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(t, option) || ''
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/**
 * 获取时间范围边界
 *
 * @param type - 'start' 返回 90 天前时间戳，其他返回今日起始
 * @returns 时间戳或 Date 对象
 *
 * 示例：
 *   getTime('start')   // 90 天前的时间戳
 *   getTime()           // 今日 00:00:00 Date 对象
 */
export function getTime(type?: string): number | Date {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

// ==================== 字符串 ====================

/**
 * 将无效值转为空字符串
 *
 * @param str - 待处理值
 * @returns 有效字符串
 *
 * 示例：
 *   parseStrEmpty(null)        // ''
 *   parseStrEmpty('hello')     // 'hello'
 */
export function parseStrEmpty(str: unknown): string {
  if (!str || str === 'undefined' || str === 'null') {
    return ''
  }
  return String(str)
}

/**
 * 计算 UTF-8 字符串字节长度
 *
 * @param str - 待计算字符串
 * @returns 字节长度
 *
 * 示例：
 *   byteLength('hello')     // 5
 *   byteLength('你好')       // 6
 */
export function byteLength(str: string): number {
  let s = str.length
  for (let i = str.length - 1; i >= 0; i--) {
    const code = str.charCodeAt(i)
    if (code > 0x7f && code <= 0x7ff) s++
    else if (code > 0x7ff && code <= 0xffff) s += 2
    if (code >= 0xdc00 && code <= 0xdfff) i--
  }
  return s
}

/**
 * HTML 转纯文本
 *
 * @param val - 含 HTML 标签的字符串
 * @returns 纯文本内容
 *
 * 示例：
 *   html2Text('<p>hello</p>')  // 'hello'
 */
export function html2Text(val: string): string {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

/**
 * 首字母大写
 *
 * @param str - 待转换字符串
 * @returns 首字母大写结果
 *
 * 示例：
 *   titleCase('hello world')  // 'Hello World'
 */
export function titleCase(str: string): string {
  return str.replace(/( |^)[a-z]/g, (L) => L.toUpperCase())
}

/**
 * 下划线转驼峰
 *
 * @param str - 待转换字符串
 * @returns 驼峰形式
 *
 * 示例：
 *   camelCase('some_field')  // 'someField'
 */
export function camelCase(str: string): string {
  return str.replace(/_[a-z]/g, (str1) => str1.substr(-1).toUpperCase())
}

/**
 * 判断是否为合法数字
 *
 * @param str - 待判断字符串
 * @returns 是否为数字
 *
 * 示例：
 *   isNumberStr('123')    // true
 *   isNumberStr('12.3')   // true
 *   isNumberStr('abc')    // false
 */
export function isNumberStr(str: string): boolean {
  return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// ==================== 数组 ====================

/**
 * 过滤假值（null / undefined / 0 / '' / false）
 *
 * @param actual - 原数组
 * @returns 过滤后的数组
 *
 * 示例：
 *   cleanArray([0, 1, '', null, 2])  // [1, 2]
 */
export function cleanArray(actual: unknown[]): unknown[] {
  const newArray: unknown[] = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

/**
 * 数组去重（Set，保留首次出现顺序）
 *
 * @param arr - 原数组
 * @returns 去重后的数组
 *
 * 示例：
 *   uniqueArr([1,2,1,3])  // [1,2,3]
 */
export function uniqueArr<T>(arr: T[]): T[] {
  return Array.from(new Set(arr))
}

/**
 * 生成唯一字符串 ID（时间戳 + 随机数，32 进制）
 *
 * @returns 唯一字符串
 */
export function createUniqueString(): string {
  const timestamp = +new Date() + ''
  const randomNum = Math.floor((1 + Math.random()) * 65536) + ''
  return (+(randomNum + timestamp)).toString(32)
}

// ==================== 对象 ====================

/**
 * 递归合并两个对象（source 的同名字段被 target 覆盖）
 *
 * 注意：参数顺序与 objectMerge 相反！
 *   mergeRecursive(a, b)  → b 覆盖 a
 *   objectMerge(a, b)     → b 覆盖 a（参数名不同但效果相同）
 *
 * @param source - 被合并的目标（会被修改）
 * @param target - 提供新值的来源
 * @returns 合并后的对象
 */
export function mergeRecursive(source: Record<string, any>, target: Record<string, any>): Record<string, any> {
  for (const p in target) {
    try {
      if (target[p].constructor == Object) {
        source[p] = mergeRecursive(source[p], target[p])
      } else {
        source[p] = target[p]
      }
    } catch (e) {
      source[p] = target[p]
    }
  }
  return source
}

/**
 * 深度合并（source 覆盖 target 中的同名字段）
 *
 * 注意：参数顺序与 mergeRecursive 相同，但语义更接近 Object.assign。
 * 若 source 为数组，返回 source 的浅拷贝。
 *
 * @param target - 被更新的目标
 * @param source - 提供新值的来源
 * @returns 合并后的对象
 */
export function objectMerge(target: Record<string, any>, source: any): Record<string, any> {
  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach((property) => {
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
 * 简易深克隆（递归复制，不处理 Date/RegExp/Function）
 *
 * @param source - 待克隆对象
 * @returns 完全独立的拷贝
 *
 * 示例：
 *   const b = deepClone(a)  // b !== a，完全独立
 */
export function deepClone<T>(source: T): T {
  if (!source || typeof source !== 'object') {
    throw new Error('error arguments: deepClone')
  }
  const targetObj: any = (source as any).constructor === Array ? [] : {}
  Object.keys(source as any).forEach((keys) => {
    if ((source as any)[keys] && typeof (source as any)[keys] === 'object') {
      targetObj[keys] = deepClone((source as any)[keys])
    } else {
      targetObj[keys] = (source as any)[keys]
    }
  })
  return targetObj as T
}

// ==================== DOM ====================

/**
 * 切换 CSS 类名（有则移除，无则添加）
 *
 * @param element   - DOM 元素
 * @param className - CSS 类名
 */
export function toggleClass(element: HTMLElement, className: string): void {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

/**
 * 检测是否包含 CSS 类名
 *
 * @param ele - DOM 元素
 * @param cls - CSS 类名
 * @returns 是否包含
 */
export function hasClass(ele: HTMLElement, cls: string): boolean {
  return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 添加 CSS 类名（已存在时不重复）
 *
 * @param ele - DOM 元素
 * @param cls - CSS 类名
 */
export function addClass(ele: HTMLElement, cls: string): void {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 移除 CSS 类名
 *
 * @param ele - DOM 元素
 * @param cls - CSS 类名
 */
export function removeClass(ele: HTMLElement, cls: string): void {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// ==================== 函数工具 ====================

/**
 * 防抖函数
 *
 * 连续触发期间，仅在最后一次触发结束后延迟 wait ms 执行。
 * immediate 为 true 时首次触发立即执行。
 *
 * @param func       - 待防抖函数
 * @param wait       - 等待时间（ms）
 * @param immediate  - 是否立即执行（可选）
 * @returns 防抖后的函数
 *
 * 示例：
 *   const debounced = debounce(() => search(), 300)
 *   input.addEventListener('input', debounced)
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let timeout: ReturnType<typeof setTimeout> | null = null
  let context: any = null
  let args: Parameters<T> | null = null
  let timestamp = 0
  let result: ReturnType<T> | undefined
  const later = function () {
    const last = +new Date() - timestamp
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      if (!immediate && args) {
        result = func.apply(context, args)
        if (!timeout) {
          context = null
          args = null
        }
      }
    }
  }
  return function (this: unknown, ...innerArgs: Parameters<T>) {
    context = this
    args = innerArgs
    timestamp = +new Date()
    const callNow = immediate && !timeout
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = null
      args = null
    }
    return result
  }
}

// ==================== URL / 参数 ====================

/**
 * 从 URL 中解析查询参数为对象
 *
 * @param url - 默认取 window.location.href
 * @returns 查询参数对象
 *
 * 示例：
 *   getQueryObject('http://a.com?name=1&age=2')  // { name: '1', age: '2' }
 */
export function getQueryObject(url?: string): Record<string, string> {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj: Record<string, string> = {}
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
 * 对象转 URL 查询字符串（过滤 undefined）
 *
 * @param json - 参数对象
 * @returns 不含 ? 前缀的查询字符串
 *
 * 示例：
 *   param({ name: 'a', age: 1 })  // 'name=a&age=1'
 */
export function param(json?: Record<string, any> | null): string {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map((key) => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

/**
 * URL 查询字符串解析为对象
 *
 * @param url - 含 ? 的完整 URL
 * @returns 参数对象
 *
 * 示例：
 *   param2Obj('http://a.com?name=1&age=2')  // { name: '1', age: '2' }
 */
export function param2Obj(url: string): Record<string, string> {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj: Record<string, string> = {}
  const searchArr = search.split('&')
  searchArr.forEach((v) => {
    const index = v.indexOf('=')
    if (index !== -1) {
      obj[v.substring(0, index)] = v.substring(index + 1)
    }
  })
  return obj
}

/**
 * 参数序列化到 URL 查询字符串（支持嵌套对象与数组）
 *
 * 嵌套对象展开为 key[subKey]=value 格式，数组输出 key[]=v1&key[]=v2（后端 List 参数兼容），
 * 忽略 null/''/undefined。末尾带 &，调用方需自行处理。
 *
 * @param params - 参数对象
 * @returns 序列化结果（末尾带 &）
 *
 * 示例：
 *   tansParams({ a: 1, b: { c: 2 } })  // 'a=1&b[c]=2&'
 *   tansParams({ ids: [1, 2] })        // 'ids[]=1&ids[]=2&'
 */
export function tansParams(params: Record<string, any>): string {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + '='
    if (value !== null && value !== '' && typeof value !== 'undefined') {
      // 数组：输出 key[]=v1&key[]=v2（后端 List 参数兼容）
      if (Array.isArray(value)) {
        value.forEach((item) => {
          if (item !== null && item !== '' && typeof item !== 'undefined') {
            result += part + '[]=' + encodeURIComponent(item) + '&'
          }
        })
      } else if (typeof value === 'object') {
        for (const key of Object.keys(value)) {
          if (value[key] !== null && value[key] !== '' && typeof value[key] !== 'undefined') {
            const p = propName + '[' + key + ']'
            const subPart = encodeURIComponent(p) + '='
            result += subPart + encodeURIComponent(value[key]) + '&'
          }
        }
      } else {
        result += part + encodeURIComponent(value) + '&'
      }
    }
  }
  return result
}

/**
 * 规范化路径（去除重复斜杠及末尾斜杠）
 *
 * @param p - 原始路径
 * @returns 规范化后的路径
 *
 * 示例：
 *   getNormalPath('//a//b/')  // '/a/b'
 */
export function getNormalPath(p: string): string {
  if (p.length === 0 || !p || p === 'undefined') {
    return p
  }
  const res = p.replace('//', '/')
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)
  }
  return res
}

// ==================== 表单 ====================

/**
 * 重置表单（Options API 下使用，依赖 this.$refs）
 *
 * @param refName - el-form 的 ref 名称
 *
 * 用法：resetForm.call(this, 'formRef')
 */
export function resetForm(this: { $refs: Record<string, any> }, refName: string): void {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

/**
 * 添加日期范围到查询参数
 *
 * 将 dateRange 拆分为 beginTime/endTime（或自定义前缀）挂到 params.params。
 *
 * @param params    - 查询参数（会被修改）
 * @param dateRange - [start, end]
 * @param propName  - 自定义前缀，如 'Create' → beginCreate/endCreate
 * @returns 查询参数对象
 */
export function addDateRange(
  params: Record<string, any>,
  dateRange?: Array<string | number | Date> | null,
  propName?: string
): Record<string, any> {
  const search = params
  search.params = typeof search.params === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {}
  const range = Array.isArray(dateRange) ? dateRange : []
  if (typeof propName === 'undefined') {
    search.params['beginTime'] = range[0]
    search.params['endTime'] = range[1]
  } else {
    search.params['begin' + propName] = range[0]
    search.params['end' + propName] = range[1]
  }
  return search
}

// ==================== 字典 ====================

/**
 * 字典回显单值
 *
 * @param datas - 字典项数组 [{ value, label }]
 * @param value - 当前值
 * @returns 匹配到 label 或原始值
 *
 * 示例：
 *  selectDictLabel([{ value: '1', label: '启用' }, { value: '0', label: '禁用' }], '1')  // '启用'
 */
export function selectDictLabel(datas: Record<string, any>, value: any): string {
  if (value === undefined) {
    return ''
  }
  const actions: any[] = []
  Object.keys(datas).some((key) => {
    if (datas[key].value === '' + value) {
      actions.push(datas[key].label)
      return true
    }
  })
  if (actions.length === 0) {
    actions.push(value)
  }
  return actions.join('')
}

/**
 * 字典回显多值（逗号分隔字符串或数组）
 *
 * @param datas     - 字典项数组
 * @param value     - 逗号分隔值或数组
 * @param separator - 分隔符，默认 ','
 * @returns 匹配到的标签拼接结果
 *
 * 示例：
 *  selectDictLabels([{ value: '1', label: '启用' }, { value: '0', label: '禁用' }], '1,0')  // '启用,禁用'
 */
export function selectDictLabels(datas: Record<string, any>, value: string | any[] | undefined, separator?: string): string {
  if (value === undefined || value.length === 0) {
    return ''
  }
  if (Array.isArray(value)) {
    value = value.join(',')
  }
  const actions: any[] = []
  const currentSeparator = undefined === separator ? ',' : separator
  const temp = value.split(currentSeparator)
  temp.some((item, index) => {
    let match = false
    Object.keys(datas).some((key) => {
      if (datas[key].value === '' + item) {
        actions.push(datas[key].label + currentSeparator)
        match = true
      }
    })
    if (!match) {
      actions.push(item + currentSeparator)
    }
    return false
  })
  return actions.join('').substring(0, actions.join('').length - 1)
}

// ==================== 树形 ====================

/**
 * 扁平数组转树形结构
 *
 * 两次遍历：先建 id→节点 映射，再挂载子节点到父节点。
 *
 * @param data     - 含 id/parentId 的扁平数组
 * @param id       - id 字段名，默认 'id'
 * @param parentId - 父 id 字段名，默认 'parentId'
 * @param children - 子节点数组字段名，默认 'children'
 * @returns 根节点列表
 *
 * 示例：
 *   handleTree([{id:1,parentId:0},{id:2,parentId:1}])
 *   // → [{id:1, children:[{id:2}]}]
 */
export function handleTree<T extends Record<string, any>>(data: T[], id?: string, parentId?: string, children?: string): T[] {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }
  const childrenListMap: Record<string, T> = {}
  const tree: T[] = []
  for (const d of data) {
    childrenListMap[d[config.id]] = d
    if (!d[config.childrenList]) {
      ;(d as Record<string, any>)[config.childrenList] = []
    }
  }
  for (const d of data) {
    const parent = childrenListMap[d[config.parentId]]
    if (!parent) {
      tree.push(d)
    } else {
      ;(parent as Record<string, any>)[config.childrenList].push(d)
    }
  }
  return tree
}

// ==================== 文件 / Blob ====================

/**
 * 验证 blob 是否为合法文件数据（非 JSON 错误报文）
 *
 * @param data - Blob 数据
 * @returns true 为文件数据，false 为 JSON 错误
 */
export function blobValidate(data: Blob): boolean {
  return data.type !== 'application/json'
}
