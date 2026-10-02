package com.xxl.boot.api.framework.util;

import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.tool.core.PropTool;
import com.xxl.tool.freemarker.FtlTool;
import com.xxl.tool.json.GsonTool;
import freemarker.template.Configuration;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

/**
 * i18n util
 *
 * @author xuxueli 2018-01-17 20:39:06
 */
@Component
public class I18nUtil implements InitializingBean {

    /** i18n 配置Key（系统配置-界面语言，取值 zh/en） */
    private static final String I18N_CONFIG_KEY = "system.i18n.language";

    /** 配置服务 */
    @Resource
    private ConfigService configService;

    /** freemarker config */
    @Autowired
    private Configuration configuration;

    /** 单例引用：供静态方法获取 Spring Bean */
    private static I18nUtil single;

    @Override
    public void afterPropertiesSet() {
        // init freemarker shared variable
        configuration.setSharedVariable("I18nUtil", FtlTool.generateStaticModel(I18nUtil.class.getName()));
        // init single
        single = this;
    }

    /** 当前语言：读取系统配置（60s 缓存）；白名单 zh/en，非法值回退 zh */
    public static String getI18n() {
        Config config = single.configService.loadByKeyWithCache(I18N_CONFIG_KEY).getData();
        String value = config != null ? config.getValue() : null;
        return Arrays.asList("zh", "en").contains(value) ? value : "zh";
    }

    /** 文案缓存及其对应语言，语言变化时重新加载 */
    private static Properties prop;
    private static String propI18n;

    /** 加载当前语言文案 */
    public static Properties loadI18nProp() {
        String i18n = getI18n();
        if (prop == null || !i18n.equals(propI18n)) {
            prop = PropTool.loadProp(MessageFormat.format("i18n/message_{0}.properties", i18n));
            propI18n = i18n;
        }
        return prop;
    }

    /**
     * get val of i18n key
     */
    public static String getString(String key) {
        return loadI18nProp().getProperty(key);
    }

    /**
     *  get mult val of i18n mult key, as json
     */
    public static String getMultString(String... keys) {
        Map<String, String> map = new HashMap<>();
        Properties prop = loadI18nProp();
        if (keys != null && keys.length > 0) {
            for (String key : keys) {
                map.put(key, prop.getProperty(key));
            }
        } else {
            for (String key : prop.stringPropertyNames()) {
                map.put(key, prop.getProperty(key));
            }
        }
        return GsonTool.toJson(map);
    }

}
