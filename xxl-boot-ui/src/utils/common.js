/**
 * common - 通用工具函数
 *
 * 工具列表：
 *   1. parseTime          - 日期格式化（支持多种输入和自定义模板）
 *   2. formatDate         - 表格列日期格式化（YYY-MM-DD HH:mm:ss 固定格式）
 *   3. formatTime         - 相对时间描述（刚刚/N分钟前/小时前/天前）
 *   4. getTime            - 获取时间范围边界（90天前/今日起始）
 *   5. sprintf            - printf 风格字符串格式化（%s 占位符）
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

// ==================== 日期 / 时间 ====================

/**
 * 日期格式化
 *
 * @param {Date|number|string} time    - Date 对象 / 时间戳 / ISO 字符串
 * @param {string}             [pattern] - 模板，默认 '{y}-{m}-{d} {h}:{i}:{s}'
 *   占位符：{y}年 {m}月 {d}日 {h}时 {i}分 {s}秒 {a}星期
 * @returns {string|null}
 *
 * 示例：
 *   parseTime('2024-01-15', '{y}/{m}/{d}')   // '2024/01/15'
 *   parseTime(1705315200000)                   // '2024-01-15 12:00:00'
 */
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
        return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        } else if (typeof time === 'string') {
            time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '')
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        if (key === 'a') {
            return ['日', '一', '二', '三', '四', '五', '六'][value]
        }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

/**
 * 表格列时间格式化（parseTime 的简化版，固定 YYYY-MM-DD HH:mm:ss）
 *
 * 适用于 Element Plus el-table-column 的 formatter 属性。
 *
 * @param {number|string} cellValue - 时间值
 * @returns {string}
 *
 * 示例：
 *   formatDate('2024-01-15T12:00:00')  // '2024-01-15 12:00:00'
 */
export function formatDate(cellValue) {
    if (cellValue == null || cellValue === "") return ""
    return parseTime(cellValue)
}

/**
 * 相对时间描述（刚刚 / N分钟前 / N小时前 / N天前 / 具体日期）
 *
 * @param {number} time     - 时间戳（10 位秒级或 13 位毫秒级）
 * @param {string} [option] - 超过 2 天时的格式模板，默认 'M月D日H时I分'
 * @returns {string}
 *
 * 示例：
 *   formatTime(Date.now() - 300000)   // '5分钟前'
 *   formatTime(1700000000)             // 超过 2 天时 → '11月15日3时33分'
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
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
    }
}

/**
 * 获取时间范围边界
 *
 * @param {string} type - 'start' 返回 90 天前时间戳，其他返回今日起始
 * @returns {number|Date}
 *
 * 示例：
 *   getTime('start')   // 90 天前的时间戳
 *   getTime()           // 今日 00:00:00 Date 对象
 */
export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

// ==================== 字符串 ====================

/**
 * printf 风格字符串格式化（%s 占位符）
 *
 * @param {string} str - 含 %s 的模板
 * @param {...*}   args - 替换值
 * @returns {string} 参数不足时返回 ''
 *
 * 示例：
 *   sprintf('hello %s', 'world')   // 'hello world'
 */
export function sprintf(str) {
    let flag = true, i = 1
    str = str.replace(/%s/g, function () {
        const arg = args[i++]
        if (typeof arg === 'undefined') {
            flag = false
            return ''
        }
        return arg
    })
    return flag ? str : ''
}

/**
 * 将无效值转为空字符串
 *
 * @param {*} str - 待处理值
 * @returns {string}
 *
 * 示例：
 *   parseStrEmpty(null)        // ''
 *   parseStrEmpty('hello')     // 'hello'
 */
export function parseStrEmpty(str) {
    if (!str || str === "undefined" || str === "null") {
        return ""
    }
    return str
}

/**
 * 计算 UTF-8 字符串字节长度
 *
 * @param {string} str
 * @returns {number}
 *
 * 示例：
 *   byteLength('hello')     // 5
 *   byteLength('你好')       // 6
 */
export function byteLength(str) {
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
 * HTML 转纯文本
 *
 * @param {string} val - 含 HTML 标签的字符串
 * @returns {string}
 *
 * 示例：
 *   html2Text('<p>hello</p>')  // 'hello'
 */
export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

/**
 * 首字母大写
 *
 * @param {string} str
 * @returns {string}
 *
 * 示例：
 *   titleCase('hello world')  // 'Hello World'
 */
export function titleCase(str) {
    return str.replace(/( |^)[a-z]/g, L => L.toUpperCase())
}

/**
 * 下划线转驼峰
 *
 * @param {string} str
 * @returns {string}
 *
 * 示例：
 *   camelCase('some_field')  // 'someField'
 */
export function camelCase(str) {
    return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase())
}

/**
 * 判断是否为合法数字
 *
 * @param {string} str
 * @returns {boolean}
 *
 * 示例：
 *   isNumberStr('123')    // true
 *   isNumberStr('12.3')   // true
 *   isNumberStr('abc')    // false
 */
export function isNumberStr(str) {
    return /^[+-]?(0|([1-9]\d*))(\.\d+)?$/g.test(str)
}

// ==================== 数组 ====================

/**
 * 过滤假值（null / undefined / 0 / '' / false）
 *
 * @param {Array} actual
 * @returns {Array}
 *
 * 示例：
 *   cleanArray([0, 1, '', null, 2])  // [1, 2]
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
 * 数组去重（Set，保留首次出现顺序）
 *
 * @param {Array} arr
 * @returns {Array}
 *
 * 示例：
 *   uniqueArr([1,2,1,3])  // [1,2,3]
 */
export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

/**
 * 生成唯一字符串 ID（时间戳 + 随机数，32 进制）
 *
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
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
 * @param {Object} source - 被合并的目标（会被修改）
 * @param {Object} target - 提供新值的来源
 * @returns {Object}
 */
export function mergeRecursive(source, target) {
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
 * @param {Object}        target - 被更新的目标
 * @param {Object|Array}  source - 提供新值的来源
 * @returns {Object}
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
 * 简易深克隆（递归复制，不处理 Date/RegExp/Function）
 *
 * @param {Object|Array} source
 * @returns {Object|Array}
 *
 * 示例：
 *   const b = deepClone(a)  // b !== a，完全独立
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

// ==================== DOM ====================

/**
 * 切换 CSS 类名（有则移除，无则添加）
 *
 * @param {HTMLElement} element
 * @param {string}      className
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
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

/**
 * 检测是否包含 CSS 类名
 *
 * @param {HTMLElement} ele
 * @param {string}      cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * 添加 CSS 类名（已存在时不重复）
 *
 * @param {HTMLElement} ele
 * @param {string}      cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * 移除 CSS 类名
 *
 * @param {HTMLElement} ele
 * @param {string}      cls
 */
export function removeClass(ele, cls) {
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
 * @param {Function} func
 * @param {number}   wait      - 等待时间（ms）
 * @param {boolean}  [immediate=false]
 * @returns {Function}
 *
 * 示例：
 *   const debounced = debounce(() => search(), 300)
 *   input.addEventListener('input', debounced)
 */
export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result
    const later = function () {
        const last = +new Date() - timestamp
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }
    return function (...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }
        return result
    }
}

// ==================== URL / 参数 ====================

/**
 * 从 URL 中解析查询参数为对象
 *
 * @param {string} [url] - 默认取 window.location.href
 * @returns {Object}
 *
 * 示例：
 *   getQueryObject('http://a.com?name=1&age=2')  // { name: '1', age: '2' }
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
 * 对象转 URL 查询字符串（过滤 undefined）
 *
 * @param {Object} json
 * @returns {string} 不含 ? 前缀
 *
 * 示例：
 *   param({ name: 'a', age: 1 })  // 'name=a&age=1'
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
 * URL 查询字符串解析为对象
 *
 * @param {string} url - 含 ? 的完整 URL
 * @returns {Object}
 *
 * 示例：
 *   param2Obj('http://a.com?name=1&age=2')  // { name: '1', age: '2' }
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
            obj[v.substring(0, index)] = v.substring(index + 1)
        }
    })
    return obj
}

/**
 * 参数序列化到 URL 查询字符串（支持嵌套对象）
 *
 * 嵌套对象展开为 key[subKey]=value 格式，忽略 null/''/undefined。
 * 末尾带 &，调用方需自行处理。
 *
 * @param {Object} params
 * @returns {string}
 *
 * 示例：
 *   tansParams({ a: 1, b: { c: 2 } })  // 'a=1&b[c]=2&'
 */
export function tansParams(params) {
    let result = ''
    for (const propName of Object.keys(params)) {
        const value = params[propName]
        const part = encodeURIComponent(propName) + "="
        if (value !== null && value !== "" && typeof (value) !== "undefined") {
            if (typeof value === 'object') {
                for (const key of Object.keys(value)) {
                    if (value[key] !== null && value[key] !== "" && typeof (value[key]) !== 'undefined') {
                        const params = propName + '[' + key + ']'
                        const subPart = encodeURIComponent(params) + "="
                        result += subPart + encodeURIComponent(value[key]) + "&"
                    }
                }
            } else {
                result += part + encodeURIComponent(value) + "&"
            }
        }
    }
    return result
}

/**
 * 规范化路径（去除重复斜杠及末尾斜杠）
 *
 * @param {string} p
 * @returns {string}
 *
 * 示例：
 *   getNormalPath('//a//b/')  // '/a/b'
 */
export function getNormalPath(p) {
    if (p.length === 0 || !p || p === 'undefined') {
        return p
    }
    let res = p.replace('//', '/')
    if (res[res.length - 1] === '/') {
        return res.slice(0, res.length - 1)
    }
    return res
}

// ==================== 表单 ====================

/**
 * 重置表单（Options API 下使用，依赖 this.$refs）
 *
 * @param {string} refName - el-form 的 ref 名称
 *
 * 用法：resetForm.call(this, 'formRef')
 */
export function resetForm(refName) {
    if (this.$refs[refName]) {
        this.$refs[refName].resetFields()
    }
}

/**
 * 添加日期范围到查询参数
 *
 * 将 dateRange 拆分为 beginTime/endTime（或自定义前缀）挂到 params.params。
 *
 * @param {Object} params      - 查询参数（会被修改）
 * @param {Array}  dateRange   - [start, end]
 * @param {string} [propName]  - 自定义前缀，如 'Create' → beginCreate/endCreate
 * @returns {Object}
 */
export function addDateRange(params, dateRange, propName) {
    let search = params
    search.params = typeof (search.params) === 'object' && search.params !== null && !Array.isArray(search.params) ? search.params : {}
    dateRange = Array.isArray(dateRange) ? dateRange : []
    if (typeof (propName) === 'undefined') {
        search.params['beginTime'] = dateRange[0]
        search.params['endTime'] = dateRange[1]
    } else {
        search.params['begin' + propName] = dateRange[0]
        search.params['end' + propName] = dateRange[1]
    }
    return search
}

// ==================== 字典 ====================

/**
 * 字典回显单值
 *
 * @param {Array} datas  - 字典项数组 [{ value, label }]
 * @param {*}     value  - 当前值
 * @returns {string} 匹配到 label 或原始值
 *
 * 示例：
 *  selectDictLabel([{ value: '1', label: '启用' }, { value: '0', label: '禁用' }], '1')  // '启用'
 */
export function selectDictLabel(datas, value) {
    if (value === undefined) {
        return ""
    }
    const actions = []
    Object.keys(datas).some((key) => {
        if (datas[key].value === ('' + value)) {
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
 * @param {Array}  datas     - 字典项数组
 * @param {string|Array} value - 逗号分隔值或数组
 * @param {string} [separator] - 分隔符，默认 ','
 * @returns {string}
 *
 * 示例：
 *  selectDictLabels([{ value: '1', label: '启用' }, { value: '0', label: '禁用' }], '1,0')  // '启用,禁用'
 */
export function selectDictLabels(datas, value, separator) {
    if (value === undefined || value.length === 0) {
        return ""
    }
    if (Array.isArray(value)) {
        value = value.join(",")
    }
    const actions = []
    const currentSeparator = undefined === separator ? "," : separator
    const temp = value.split(currentSeparator)
    Object.keys(value.split(currentSeparator)).some((val) => {
        let match = false
        Object.keys(datas).some((key) => {
            if (datas[key].value === ('' + temp[val])) {
                actions.push(datas[key].label + currentSeparator)
                match = true
            }
        })
        if (!match) {
            actions.push(temp[val] + currentSeparator)
        }
    })
    return actions.join('').substring(0, actions.join('').length - 1)
}

// ==================== 树形 ====================

/**
 * 扁平数组转树形结构
 *
 * 两次遍历：先建 id→节点 映射，再挂载子节点到父节点。
 *
 * @param {Array}  data       - 含 id/parentId 的扁平数组
 * @param {string} [id]       - id 字段名，默认 'id'
 * @param {string} [parentId] - 父 id 字段名，默认 'parentId'
 * @param {string} [children] - 子节点数组字段名，默认 'children'
 * @returns {Array} 根节点列表
 *
 * 示例：
 *   handleTree([{id:1,parentId:0},{id:2,parentId:1}])
 *   // → [{id:1, children:[{id:2}]}]
 */
export function handleTree(data, id, parentId, children) {
    const config = {
        id: id || 'id',
        parentId: parentId || 'parentId',
        childrenList: children || 'children'
    }
    const childrenListMap = {}
    const tree = []
    for (const d of data) {
        childrenListMap[d[config.id]] = d
        if (!d[config.childrenList]) {
            d[config.childrenList] = []
        }
    }
    for (const d of data) {
        const parent = childrenListMap[d[config.parentId]]
        if (!parent) {
            tree.push(d)
        } else {
            parent[config.childrenList].push(d)
        }
    }
    return tree
}

// ==================== 文件 / Blob ====================

/**
 * 验证 blob 是否为合法文件数据（非 JSON 错误报文）
 *
 * @param {Blob} data
 * @returns {boolean} true 为文件数据，false 为 JSON 错误
 */
export function blobValidate(data) {
    return data.type !== 'application/json'
}


