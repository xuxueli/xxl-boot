/**
 * 名称：数据字典缓存 Store
 * 描述：负责维护前端运行期的数据字典缓存，统一提供“读取、写入、删除、清空”能力。
 *
 * 职责划分：
 * 1. state：保存已缓存的字典项列表；
 * 2. actions：对字典缓存执行增删查改；
 * 3. getters：当前模块未定义 getters，所有访问入口都通过 actions 暴露。
 */
const useDictStore = defineStore(
  'dict',
  {
    /**
     * 状态定义
     *
     * dict 以数组形式保存字典缓存项，每一项结构为：
     * { key: 字典标识, value: 字典内容 }
     *
     * 这里沿用数组而不是 Map，保持与现有调用方式完全兼容。
     */
    state: () => ({
      dict: new Array()
    }),
    /**
     * 动作方法定义
     *
     * 该模块不包含异步请求逻辑，只负责对内存中的字典缓存做统一管理。
     */
    actions: {
      /**
       * 获取字典
       *
       * 实现细节：
       * - 先做空 key 保护，避免无效查询；
       * - 再通过线性遍历查找已缓存的字典项；
       * - 查询异常时统一返回 null，保证调用方拿到稳定结果。
       */
      getDict(_key) {
        if (_key == null && _key == "") {
          return null
        }
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              return this.dict[i].value
            }
          }
        } catch (e) {
          return null
        }
      },
      /**
       * 设置字典
       *
       * 仅在 key 有效时写入缓存，保持缓存项结构统一。
       */
      setDict(_key, value) {
        if (_key !== null && _key !== "") {
          this.dict.push({
            key: _key,
            value: value
          })
        }
      },
      /**
       * 删除字典
       *
       * 按 key 定位后直接移除首个匹配项，并返回是否删除成功。
       */
      removeDict(_key) {
        var bln = false
        try {
          for (let i = 0; i < this.dict.length; i++) {
            if (this.dict[i].key == _key) {
              this.dict.splice(i, 1)
              return true
            }
          }
        } catch (e) {
          bln = false
        }
        return bln
      },
      /**
       * 清空字典
       *
       * 通过重新赋值新数组的方式清空全部缓存项。
       */
      cleanDict() {
        this.dict = new Array()
      },
      /**
       * 初始字典
       *
       * 预留初始化入口，当前版本暂无默认初始化逻辑。
       */
      initDict() {
      }
    }
  })

export default useDictStore
