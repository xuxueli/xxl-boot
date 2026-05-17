/**
 * 插件名称：cache（浏览器缓存封装插件）
 *
 * 能力说明：
 * - 对浏览器原生 sessionStorage 和 localStorage 进行统一封装
 * - 支持字符串值的存取（set / get）和 JSON 对象的序列化存取（setJSON / getJSON）
 * - 对存储环境不可用或参数为空的情况做了防御性处理，避免运行时异常
 *
 * 设计说明：
 * - 内部定义 sessionCache 和 localCache 两个独立对象，分别对应两种存储作用域：
 *     · sessionCache：页面会话级缓存，浏览器标签页关闭后自动清除
 *     · localCache：本地持久化缓存，手动清除前长期有效
 * - 对外以 { session, local } 结构导出，与实际存储类型语义一致
 * - 挂载到 Vue 全局属性（$cache）后，可在任意组件中调用，无需单独引入
 *
 * 典型用法（组件内）：
 *   // 存储字符串
 *   this.$cache.session.set('token', 'abc123')
 *   this.$cache.local.set('theme', 'dark')
 *
 *   // 读取字符串
 *   const token = this.$cache.session.get('token')
 *
 *   // 存储 JSON 对象（会自动序列化）
 *   this.$cache.local.setJSON('userInfo', { name: 'Tom', age: 20 })
 *
 *   // 读取 JSON 对象（会自动反序列化）
 *   const userInfo = this.$cache.local.getJSON('userInfo')
 *
 *   // 删除指定缓存项
 *   this.$cache.session.remove('token')
 *   this.$cache.local.remove('theme')
 */

/**
 * sessionCache：基于 sessionStorage 的会话级缓存操作对象
 *
 * 特性：
 * - 数据仅在当前浏览器标签页的会话周期内有效
 * - 标签页关闭后数据自动清除，适合存储临时登录态、页面临时状态等
 * - 在 sessionStorage 不可用的环境（如某些隐私模式）下会静默降级
 */
const sessionCache = {
  /**
   * 存储字符串值
   * - 若 sessionStorage 不可用则静默跳过
   * - key 或 value 为 null 时跳过，防止写入无效数据
   *
   * @param {string} key   缓存键名
   * @param {string} value 缓存值（字符串）
   */
  set (key, value) {
    if (!sessionStorage) {
      return
    }
    if (key != null && value != null) {
      sessionStorage.setItem(key, value)
    }
  },

  /**
   * 读取字符串值
   * - 若 sessionStorage 不可用或 key 为 null，则返回 null
   *
   * @param {string} key 缓存键名
   * @returns {string|null} 对应的缓存值，不存在时返回 null
   */
  get (key) {
    if (!sessionStorage) {
      return null
    }
    if (key == null) {
      return null
    }
    return sessionStorage.getItem(key)
  },

  /**
   * 存储 JSON 对象（自动序列化为 JSON 字符串）
   * - jsonValue 为 null 时跳过，防止写入无效数据
   *
   * @param {string} key       缓存键名
   * @param {object} jsonValue 需要缓存的 JSON 对象
   */
  setJSON (key, jsonValue) {
    if (jsonValue != null) {
      // 调用 set 方法，将对象序列化为字符串后存储
      this.set(key, JSON.stringify(jsonValue))
    }
  },

  /**
   * 读取并反序列化 JSON 对象
   * - 若缓存不存在则返回 null
   *
   * @param {string} key 缓存键名
   * @returns {object|null} 反序列化后的 JSON 对象，不存在时返回 null
   */
  getJSON (key) {
    const value = this.get(key)
    if (value != null) {
      // 将 JSON 字符串反序列化为对象后返回
      return JSON.parse(value)
    }
    return null
  },

  /**
   * 删除指定缓存项
   *
   * @param {string} key 缓存键名
   */
  remove (key) {
    sessionStorage.removeItem(key)
  }
}

/**
 * localCache：基于 localStorage 的本地持久化缓存操作对象
 *
 * 特性：
 * - 数据持久化保存在本地，不随页面或标签页关闭而清除
 * - 适合存储用户偏好设置、长效登录 token、主题配置等
 * - 在 localStorage 不可用的环境下会静默降级
 */
const localCache = {
  /**
   * 存储字符串值
   * - 若 localStorage 不可用则静默跳过
   * - key 或 value 为 null 时跳过，防止写入无效数据
   *
   * @param {string} key   缓存键名
   * @param {string} value 缓存值（字符串）
   */
  set (key, value) {
    if (!localStorage) {
      return
    }
    if (key != null && value != null) {
      localStorage.setItem(key, value)
    }
  },

  /**
   * 读取字符串值
   * - 若 localStorage 不可用或 key 为 null，则返回 null
   *
   * @param {string} key 缓存键名
   * @returns {string|null} 对应的缓存值，不存在时返回 null
   */
  get (key) {
    if (!localStorage) {
      return null
    }
    if (key == null) {
      return null
    }
    return localStorage.getItem(key)
  },

  /**
   * 存储 JSON 对象（自动序列化为 JSON 字符串）
   * - jsonValue 为 null 时跳过，防止写入无效数据
   *
   * @param {string} key       缓存键名
   * @param {object} jsonValue 需要缓存的 JSON 对象
   */
  setJSON (key, jsonValue) {
    if (jsonValue != null) {
      // 调用 set 方法，将对象序列化为字符串后存储
      this.set(key, JSON.stringify(jsonValue))
    }
  },

  /**
   * 读取并反序列化 JSON 对象
   * - 若缓存不存在则返回 null
   *
   * @param {string} key 缓存键名
   * @returns {object|null} 反序列化后的 JSON 对象，不存在时返回 null
   */
  getJSON (key) {
    const value = this.get(key)
    if (value != null) {
      // 将 JSON 字符串反序列化为对象后返回
      return JSON.parse(value)
    }
    return null
  },

  /**
   * 删除指定缓存项
   *
   * @param {string} key 缓存键名
   */
  remove (key) {
    localStorage.removeItem(key)
  }
}

/**
 * 导出缓存插件对象
 *
 * 结构：
 * - session：会话级缓存（sessionStorage 封装）
 * - local：本地持久化缓存（localStorage 封装）
 *
 * 挂载方式（main.js）：
 *   app.config.globalProperties.$cache = cache
 */
export default {
  /**
   * 会话级缓存（页面标签关闭后自动清除）
   */
  session: sessionCache,
  /**
   * 本地持久化缓存（手动清除前长期有效）
   */
  local: localCache
}
