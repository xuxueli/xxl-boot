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
 *
 * 典型用法（组件内）：
 *   cache.session.set('token', 'abc123')
 *   cache.local.setJSON('userInfo', { name: 'Tom', age: 20 })
 *   const userInfo = cache.local.getJSON('userInfo')
 */

/** 缓存操作接口：字符串 + JSON 存取 */
interface CacheScope {
  set(key: string, value: string): void
  get(key: string): string | null
  setJSON(key: string, jsonValue: unknown): void
  getJSON<T = unknown>(key: string): T | null
  remove(key: string): void
}

/** 基于 Storage（sessionStorage/localStorage）生成缓存操作对象 */
function createCache(storage: Storage): CacheScope {
  return {
    /**
     * 存储字符串值
     * - 存储环境不可用或 key/value 为 null 时静默跳过
     * @param key   缓存键名
     * @param value 缓存值（字符串）
     */
    set(key, value) {
      if (key != null && value != null) {
        storage.setItem(key, value)
      }
    },
    /**
     * 读取字符串值
     * @param key 缓存键名
     * @returns 对应的缓存值，不存在时返回 null
     */
    get(key) {
      if (key == null) {
        return null
      }
      return storage.getItem(key)
    },
    /**
     * 存储 JSON 对象（自动序列化为 JSON 字符串）
     * @param key       缓存键名
     * @param jsonValue 需要缓存的 JSON 对象
     */
    setJSON(key, jsonValue) {
      if (jsonValue != null) {
        this.set(key, JSON.stringify(jsonValue))
      }
    },
    /**
     * 读取并反序列化 JSON 对象
     * @param key 缓存键名
     * @returns 反序列化后的 JSON 对象，不存在时返回 null
     */
    getJSON<T = unknown>(key: string): T | null {
      const value = this.get(key)
      if (value != null) {
        return JSON.parse(value) as T
      }
      return null
    },
    /**
     * 删除指定缓存项
     * @param key 缓存键名
     */
    remove(key) {
      storage.removeItem(key)
    }
  }
}

/**
 * 导出缓存插件对象
 *
 * 结构：
 * - session：会话级缓存（sessionStorage 封装）
 * - local：本地持久化缓存（localStorage 封装）
 */
export default {
  session: createCache(window.sessionStorage),
  local: createCache(window.localStorage)
}
