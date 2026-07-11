/**
 * 通用 JS 工具方法封装模块（boot.js）
 *
 * 职责：
 *   - 集中提供与业务逻辑无关、可在全局复用的基础工具函数。
 *   - 包含：日期格式化、表单重置、日期范围处理、字典回显、
 *     字符串格式化、参数序列化、树形结构构建、路径规范化、blob 校验等。
 *   - 大部分函数为纯函数，少数（如 resetForm）依赖 Vue 组件实例上下文（this）。
 *
 * 典型用法：
 *   import { parseTime, handleTree, tansParams } from '@/utils/common'
 */

// ─────────────────────────────────────────────
// 1. 日期 / 时间处理
// ─────────────────────────────────────────────

/**
 * 日期格式化
 *
 * 将时间值转换为格式化字符串，支持 Date 对象、时间戳（秒/毫秒）、
 * ISO 字符串等多种输入形式。
 *
 * 格式占位符：
 *   {y} 年  {m} 月  {d} 日  {h} 时  {i} 分  {s} 秒  {a} 星期（中文）
 *
 * @param {Date|number|string} time    - 时间来源（Date 对象 / 时间戳 / 字符串）
 * @param {string}             [pattern] - 格式模板，默认 '{y}-{m}-{d} {h}:{i}:{s}'
 * @returns {string|null} 格式化后的时间字符串；time 为空时返回 null
 */
export function parseTime(time, pattern) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    // 直接使用 Date 对象
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      // 纯数字字符串 → 转为整数时间戳
      time = parseInt(time)
    } else if (typeof time === 'string') {
      // ISO 格式字符串兼容处理：替换连字符、T 分隔符、毫秒部分
      time = time.replace(new RegExp(/-/gm), '/').replace('T', ' ').replace(new RegExp(/\.[\d]{3}/gm), '')
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      // 10 位时间戳（秒级）→ 转为毫秒级
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
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    // 补零：单个字符的数字前面补 '0'
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

// ─────────────────────────────────────────────
// 2. 表单处理
// ─────────────────────────────────────────────

/**
 * 表单重置
 *
 * 通过 Vue 模板 ref 调用 Element Plus 表单组件的 resetFields 方法，
 * 将表单字段恢复到初始值并清除校验状态。
 * 注意：此函数需在 Vue 组件方法上下文中调用（依赖 this.$refs）。
 *
 * @param {string} refName - 表单组件的 ref 名称
 */
export function resetForm(refName) {
  if (this.$refs[refName]) {
    this.$refs[refName].resetFields()
  }
}

/**
 * 添加日期范围到查询参数
 *
 * 将日期范围数组拆分为 beginTime/endTime（或自定义字段名）并挂载到
 * params.params 对象中，便于后端统一接收日期范围查询参数。
 *
 * @param {Object}   params      - 查询参数对象（会被修改并返回）
 * @param {Array}    dateRange   - 日期范围数组：[startDate, endDate]
 * @param {string}   [propName]  - 自定义字段名前缀（如 'Create' → beginCreate/endCreate）
 * @returns {Object} 附加了日期范围的查询参数对象
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

// ─────────────────────────────────────────────
// 3. 数据字典回显
// ─────────────────────────────────────────────

/**
 * 回显数据字典（单值）
 *
 * 根据字典项数组和目标值，查找并返回对应的显示标签（label）。
 * 未找到匹配项时，直接返回原始 value 作为兜底展示。
 *
 * @param {Array}  datas - 字典项数组（每项含 value / label 字段）
 * @param {*}      value - 待回显的字典值
 * @returns {string} 对应的字典标签；无匹配时返回原始值字符串
 */
export function selectDictLabel(datas, value) {
  if (value === undefined) {
    return ""
  }
  const actions = []
  Object.keys(datas).some((key) => {
    if (datas[key].value == ('' + value)) {
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
 * 回显数据字典（多值，支持字符串和数组两种输入形式）
 *
 * 将逗号分隔的多值字符串或数组，逐一查找对应 label 并拼接返回。
 * 支持自定义分隔符，默认为英文逗号。
 *
 * @param {Array}   datas        - 字典项数组（每项含 value / label 字段）
 * @param {string|Array} value   - 待回显的字典值（逗号分隔字符串或数组）
 * @param {string}  [separator]  - 分隔符，默认 ','
 * @returns {string} 拼接好的标签字符串（末尾分隔符已去除）
 */
export function selectDictLabels(datas, value, separator) {
  if (value === undefined || value.length ===0) {
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
      if (datas[key].value == ('' + temp[val])) {
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

// ─────────────────────────────────────────────
// 4. 字符串处理
// ─────────────────────────────────────────────

/**
 * printf 风格字符串格式化（%s 占位符）
 *
 * 将字符串中的 %s 占位符依次替换为后续参数，若参数不足则返回空字符串。
 *
 * @param {string} str    - 含 %s 占位符的模板字符串
 * @param {...*}   [args] - 替换占位符的实际参数列表
 * @returns {string} 格式化后的字符串；参数不足时返回 ''
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
 * 将 undefined / null / "undefined" / "null" 等无效字符串转换为空字符串
 *
 * 用于安全地展示可能为空的字段值，避免页面渲染 "undefined" 或 "null" 文本。
 *
 * @param {*} str - 待处理的值
 * @returns {string} 有效字符串原样返回；无效值返回 ''
 */
export function parseStrEmpty(str) {
  if (!str || str == "undefined" || str == "null") {
    return ""
  }
  return str
}

// ─────────────────────────────────────────────
// 5. 对象 / 树形数据处理
// ─────────────────────────────────────────────

/**
 * 递归合并两个对象（target 被 target 中的同名字段覆盖）
 *
 * 深度遍历 target 的每个属性，若 source 中存在同名属性且为对象类型，
 * 则递归合并；否则直接用 source 的值覆盖 target。
 *
 * @param {Object} source - 被合并的目标对象（会被直接修改）
 * @param {Object} target - 提供新值的来源对象
 * @returns {Object} 合并后的 source 对象
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
 * 构造树型结构数据
 *
 * 将扁平数组按父子 ID 关系转换为嵌套树形结构。
 * 算法：两次遍历，第一次建立 id→节点 映射，第二次挂载子节点到父节点。
 * 无父节点（或父节点不存在）的节点作为根节点加入结果数组。
 *
 * @param {Array}  data       - 扁平数据源数组（每项含 id 和 parentId 字段）
 * @param {string} [id]       - id 字段名，默认 'id'
 * @param {string} [parentId] - 父节点 id 字段名，默认 'parentId'
 * @param {string} [children] - 子节点列表字段名，默认 'children'
 * @returns {Array} 树形结构数组（根节点列表）
 */
export function handleTree(data, id, parentId, children) {
  const config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  // 第一次遍历：建立 id→节点 映射表，并初始化每个节点的 children 数组
  const childrenListMap = {}
  const tree = []
  for (const d of data) {
    const id = d[config.id]
    childrenListMap[id] = d
    if (!d[config.childrenList]) {
      d[config.childrenList] = []
    }
  }

  // 第二次遍历：将每个节点挂载到父节点的 children 中，无父节点的作为根节点
  for (const d of data) {
    const parentId = d[config.parentId]
    const parentObj = childrenListMap[parentId]
    if (!parentObj) {
      tree.push(d)
    } else {
      parentObj[config.childrenList].push(d)
    }
  }
  return tree
}

// ─────────────────────────────────────────────
// 6. 请求参数处理
// ─────────────────────────────────────────────

/**
 * 参数序列化（将对象转换为 URL 查询字符串）
 *
 * 支持普通键值对和嵌套对象（转换为 key[subKey]=value 格式）。
 * 忽略值为 null / 空字符串 / undefined 的字段。
 * 返回末尾带 & 的字符串（调用方需自行处理末尾 &）。
 *
 * @param {Object} params - 待序列化的参数对象
 * @returns {string} URL 查询字符串（末尾含 &）
 */
export function tansParams(params) {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    const part = encodeURIComponent(propName) + "="
    if (value !== null && value !== "" && typeof (value) !== "undefined") {
      if (typeof value === 'object') {
        // 嵌套对象展开为 propName[key]=value 格式
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
 * @param {string} p - 待处理的路径字符串
 * @returns {string} 规范化后的路径
 */
export function getNormalPath(p) {
  if (p.length === 0 || !p || p == 'undefined') {
    return p
  }
  let res = p.replace('//', '/')  // 去除重复斜杠
  if (res[res.length - 1] === '/') {
    return res.slice(0, res.length - 1)  // 去除末尾斜杠
  }
  return res
}

/**
 * 验证响应内容是否为 blob（文件）格式
 *
 * 通过检测 Content-Type 是否为 application/json 来区分文件响应与 JSON 错误响应。
 * 文件下载场景下，若服务端返回业务错误，Content-Type 仍可能为 application/json。
 *
 * @param {Blob} data - 接口响应的 blob 数据
 * @returns {boolean} 非 JSON 内容类型时返回 true，表示是真正的文件数据
 */
export function blobValidate(data) {
  return data.type !== 'application/json'
}
