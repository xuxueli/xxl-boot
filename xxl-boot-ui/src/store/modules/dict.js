import {defineStore} from "pinia";

/**
 * 名称：数据字典缓存 Store
 * 描述：负责维护前端运行期的数据字典缓存，统一提供“读取、写入、删除、清空”能力。
 */
const useDictStore = defineStore(
    'dict',
    {
        /**
         * 状态定义
         *
         * 数据结构：数组对象（不是 Map，保持与现有调用方式完全兼容。）
         * <pre>
         *      {
         *          key: 字典标识,
         *          value: 字典内容
         *      }
         * </pre>
         *
         */
        state: () => ({
            dict: []
        }),
        /**
         * 动作方法定义
         */
        actions: {
            /**
             * 获取字典：针对 key 合法性校验
             */
            getDict(_key) {
                if (_key === null || _key === "") {
                    return null
                }
                try {
                    for (let i = 0; i < this.dict.length; i++) {
                        if (this.dict[i].key === _key) {
                            return this.dict[i].value
                        }
                    }
                } catch (e) {
                    return null
                }
            },
            /**
             * 设置字典：仅在 key 有效时写入缓存，保持缓存项结构统一。
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
             * 删除字典：按 key 定位后直接移除首个匹配项，并返回是否删除成功。
             */
            removeDict(_key) {
                let bln = false;
                try {
                    for (let i = 0; i < this.dict.length; i++) {
                        if (this.dict[i].key === _key) {
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
             * 清空字典：通过重新赋值新数组的方式清空全部缓存项。
             */
            cleanDict() {
                this.dict = []
            },
            /**
             * 初始字典：预留初始化入口，当前版本暂无默认初始化逻辑。
             */
            initDict() {
            }
        }
    })

export default useDictStore
