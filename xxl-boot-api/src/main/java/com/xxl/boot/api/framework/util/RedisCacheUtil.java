package com.xxl.boot.api.framework.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * redis cache tool, with redis-template
 *
 * @author xuxueli 2020-01-01
 */
@Component
public class RedisCacheUtil {

    @Autowired
    public RedisTemplate redisTemplate;


    /* ---------------------- cache object ---------------------- */

    /**
     * 缓存基本的对象
     *  1、数据类型：Integer、String、实体类等
     *
     * @param key   cache key
     * @param value cache value
     */
    public <T> void setObject(final String key, final T value) {
        redisTemplate.opsForValue().set(key, value);
    }

    /**
     * 缓存基本的对象
     *
     * @param key      cache key
     * @param value    cache value
     * @param timeout  timeout
     * @param unit     unit
     */
    public <T> void setObject(final String key, final T value, final long timeout, final TimeUnit unit) {
        redisTemplate.opsForValue().set(key, value, timeout, unit);
    }

    /**
     * 获得缓存的基本对象。
     *
     * @param key cache key
     * @return cache value
     */
    public <T> T getObject(final String key) {
        ValueOperations<String, T> operation = redisTemplate.opsForValue();
        return operation.get(key);
    }


    /* ---------------------- expire ---------------------- */

    /**
     * 设置有效时间
     *
     * @param key     cache key
     * @param timeout timeout
     * @return true means success; false means failure
     */
    public boolean expire(final String key, final long timeout) {
        return expire(key, timeout, TimeUnit.SECONDS);
    }

    /**
     * 设置有效时间
     *
     * @param key     cache key
     * @param timeout timeout
     * @param unit    unit
     * @return true means success; false means failure
     */
    public boolean expire(final String key, final long timeout, final TimeUnit unit) {
        return redisTemplate.expire(key, timeout, unit);
    }

    /**
     * 获取有效时间
     *
     * @param key cache key
     * @return TTL in seconds
     *      returns -1 if the key exists but has no associated expiration time.
     *      returns -2 if the key does not exist.
     */
    public long getExpire(final String key) {
        return redisTemplate.getExpire(key);
    }


    /* ---------------------- hasKey、delete ---------------------- */

    /**
     * 判断 key是否存在
     *
     * @param key cache key
     * @return true means exist; false means not exist
     */
    public boolean hasKey(String key) {
        return redisTemplate.hasKey(key);
    }

    /**
     * 删除单个对象
     *
     * @param key cache key
     */
    public boolean delete(final String key) {
        return redisTemplate.delete(key);
    }

    /**
     * 删除集合对象
     *
     * @param collection 多个对象
     */
    public boolean delete(final Collection<String> collection) {
        return redisTemplate.delete(collection) > 0;
    }


    /* ---------------------- cache list ---------------------- */

    /**
     * 缓存List数据
     *
     * @param key      cache key
     * @param dataList cache data
     * @return cache data size
     */
    public <T> long setList(final String key, final List<T> dataList) {
        Long count = redisTemplate.opsForList().rightPushAll(key, dataList);
        return count == null ? 0 : count;
    }

    /**
     * 获得缓存的list对象
     *
     * @param key cache key
     * @return cache data
     */
    public <T> List<T> getList(final String key) {
        return redisTemplate.opsForList().range(key, 0, -1);
    }


    /* ---------------------- cache set ---------------------- */

    /**
     * 缓存Set
     *
     * @param key     cache key
     * @param dataSet cache data
     * @return cache data
     */
    @SuppressWarnings("unchecked")
    public <T> BoundSetOperations<String, T> setSet(final String key, final Set<T> dataSet) {
        BoundSetOperations<String, T> setOperation = redisTemplate.boundSetOps(key);
        Object[] array = dataSet.toArray();
        setOperation.add((T[]) array);
        return setOperation;
    }

    /**
     * 获得缓存的set
     *
     * @param key cache key
     * @return cache data
     */
    public <T> Set<T> getSet(final String key) {
        return redisTemplate.opsForSet().members(key);
    }


    /* ---------------------- cache map ---------------------- */

    /**
     * 缓存Map
     *
     * @param key       cache key
     * @param dataMap   cache data
     */
    public <T> void setMap(final String key, final Map<String, T> dataMap) {
        if (dataMap == null) {
            return;
        }
        redisTemplate.opsForHash().putAll(key, dataMap);
    }

    /**
     * 获得缓存的Map
     *
     * @param key cache key
     * @return cache data
     */
    public <T> Map<String, T> getMap(final String key) {
        return redisTemplate.opsForHash().entries(key);
    }

    /**
     * 往Hash中存入数据
     *
     * @param key       cache key
     * @param hashKey   Hash key
     * @param value     value
     */
    public <T> void setMapValue(final String key, final String hashKey, final T value) {
        redisTemplate.opsForHash().put(key, hashKey, value);
    }

    /**
     * 获取Hash中的数据
     *
     * @param key  cache key
     * @param hashKey Hash key
     * @return value
     */
    public <T> T getMapValue(final String key, final String hashKey) {
        HashOperations<String, String, T> opsForHash = redisTemplate.opsForHash();
        return opsForHash.get(key, hashKey);
    }

    /**
     * 获取多个Hash中的数据
     *
     * @param key   cache key
     * @param hashKeys Hash key collection
     * @return Hash value collection
     */
    public <T> List<T> getMultiMapValue(final String key, final Collection<String> hashKeys) {
        return redisTemplate.opsForHash().multiGet(key, hashKeys);
    }

    /**
     * 删除Hash中的某条数据
     *
     * @param key       cache key
     * @param hashKey   Hash key
     * @return whether successful
     */
    public boolean deleteMapValue(final String key, final String hashKey) {
        return redisTemplate.opsForHash().delete(key, hashKey) > 0;
    }

    /*public Collection<String> keys(final String pattern) {
        // 获得缓存的基本对象列表
        return redisTemplate.keys(pattern);
    }*/

}
