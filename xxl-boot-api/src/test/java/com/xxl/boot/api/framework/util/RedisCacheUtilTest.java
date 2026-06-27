package com.xxl.boot.api.framework.util;

import com.xxl.boot.api.XxlBootApiApplication;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration test for RedisCacheUtil, requires Redis running on localhost:6379
 */
@SpringBootTest(classes = XxlBootApiApplication.class)
public class RedisCacheUtilTest {

    @Resource
    private RedisCacheUtil redisCacheUtil;

    private static final String PREFIX = "test:ut:";
    private final List<String> keysToClean = new ArrayList<>();

    @AfterEach
    void tearDown() {
        if (!keysToClean.isEmpty()) {
            redisCacheUtil.delete(keysToClean);
            keysToClean.clear();
        }
    }

    private String key(String name) {
        String k = PREFIX + name;
        keysToClean.add(k);
        return k;
    }

    // ---- cache object ----

    @Test
    void setAndGetObject() {
        String k = key("obj");
        redisCacheUtil.setObject(k, "hello");
        assertEquals("hello", redisCacheUtil.getObject(k));
    }

    @Test
    void setObjectWithExpiry() {
        String k = key("obj_exp");
        redisCacheUtil.setObject(k, "value", 10, TimeUnit.SECONDS);
        assertEquals("value", redisCacheUtil.getObject(k));
        assertTrue(redisCacheUtil.getExpire(k) > 0);
    }

    @Test
    void getObjectWhenNotExist() {
        assertNull(redisCacheUtil.getObject(PREFIX + "noexist"));
    }

    // ---- expire ----

    @Test
    void expireAndGetExpire() {
        String k = key("exp");
        redisCacheUtil.setObject(k, "v");
        assertTrue(redisCacheUtil.expire(k, 60));
        long ttl = redisCacheUtil.getExpire(k);
        assertTrue(ttl > 0 && ttl <= 60);
    }

    @Test
    void expireWithCustomUnit() {
        String k = key("exp_min");
        redisCacheUtil.setObject(k, "v");
        assertTrue(redisCacheUtil.expire(k, 1, TimeUnit.MINUTES));
        long ttl = redisCacheUtil.getExpire(k);
        assertTrue(ttl > 0 && ttl <= 60);
    }

    // ---- hasKey、delete ----

    @Test
    void hasKey() {
        String k = key("hk");
        assertFalse(redisCacheUtil.hasKey(k));
        redisCacheUtil.setObject(k, "v");
        assertTrue(redisCacheUtil.hasKey(k));
    }

    @Test
    void deleteSingle() {
        String k = key("del");
        redisCacheUtil.setObject(k, "v");
        assertTrue(redisCacheUtil.delete(k));
        assertFalse(redisCacheUtil.hasKey(k));
    }

    @Test
    void deleteCollection() {
        String k1 = key("delc1");
        String k2 = key("delc2");
        redisCacheUtil.setObject(k1, "v1");
        redisCacheUtil.setObject(k2, "v2");
        assertTrue(redisCacheUtil.delete(Arrays.asList(k1, k2)));
    }

    // ---- cache list ----

    @Test
    void setAndGetList() {
        String k = key("list");
        List<String> list = Arrays.asList("a", "b", "c");
        assertEquals(3, redisCacheUtil.setList(k, list));
        assertEquals(list, redisCacheUtil.getList(k));
    }

    // ---- cache set ----

    @Test
    void setAndGetSet() {
        String k = key("set");
        Set<String> set = new HashSet<>(Arrays.asList("a", "b", "c"));
        redisCacheUtil.setSet(k, set);
        assertEquals(set, redisCacheUtil.getSet(k));
    }

    // ---- cache map ----

    @Test
    void setAndGetMap() {
        String k = key("map");
        Map<String, String> map = new HashMap<>();
        map.put("hk1", "v1");
        map.put("hk2", "v2");
        redisCacheUtil.setMap(k, map);
        assertEquals(map, redisCacheUtil.getMap(k));
    }

    @Test
    void setMapValue() {
        String k = key("mapv");
        redisCacheUtil.setMapValue(k, "hk1", "v1");
        assertEquals("v1", redisCacheUtil.getMapValue(k, "hk1"));
    }

    @Test
    void getMultiMapValue() {
        String k = key("mapm");
        Map<String, String> map = new HashMap<>();
        map.put("hk1", "v1");
        map.put("hk2", "v2");
        redisCacheUtil.setMap(k, map);
        List<String> result = redisCacheUtil.getMultiMapValue(k, Arrays.asList("hk1", "hk2", "hk3"));
        assertEquals(Arrays.asList("v1", "v2", null), result);
    }

    @Test
    void deleteMapValue() {
        String k = key("mapd");
        redisCacheUtil.setMapValue(k, "hk1", "v1");
        assertTrue(redisCacheUtil.deleteMapValue(k, "hk1"));
        assertFalse(redisCacheUtil.deleteMapValue(k, "hk1"));
    }

}
