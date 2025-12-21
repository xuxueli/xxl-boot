package com.xxl.boot.admin.util;

import com.xxl.tool.core.StringTool;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.lionsoul.ip2region.service.Config;
import org.lionsoul.ip2region.service.Ip2Region;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class Ip2regionUtil {
    private static final Logger logger = LoggerFactory.getLogger(Ip2regionUtil.class);

    /**
     * Ip2region
     */
    private static volatile Ip2Region ip2Region;

    /**
     * init when start, load ip2region.db to mem
     */
    @PostConstruct
    public static void initIp2Region() {
        try {
            // build v4 config
            Config v4Config = Config.custom()
                    .setCachePolicy(Config.BufferCache)             // 指定缓存策略:  NoCache / VIndexCache / BufferCache
                    .setSearchers(15)                           // 设置初始化的查询器数量
                    .setXdbInputStream(new ClassPathResource("/other/ip2region/ip2region_v4.xdb").getInputStream())
                    //.setXdbPath("ip2region v4 xdb path")      // 设置 v4 xdb 文件的路径
                    .asV4();

            // build ip2region
            ip2Region = Ip2Region.create(v4Config, null);
        } catch (Exception e) {
            logger.info("Ip2regionUtil(ip2Region) init error:", e);
        }
    }

    /**
     * get ip whth request
     *
     * 1、使用Nginx等反向代理软件， 则不能通过request.getRemoteAddr()获取IP地址
     * 2、如果使用了多级反向代理的话，X-Forwarded-For的值并不止一个，而是一串IP地址，X-Forwarded-For中第一个非unknown的有效IP字符串，则为真实IP地址
     */
    public static String getIp(HttpServletRequest request) {
        String ip = null;
        try {
            ip = request.getHeader("x-forwarded-for");
            if (StringTool.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("Proxy-Client-IP");
            }
            if (StringTool.isEmpty(ip) || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("WL-Proxy-Client-IP");
            }
            if (StringTool.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_CLIENT_IP");
            }
            if (StringTool.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getHeader("HTTP_X_FORWARDED_FOR");
            }
            if (StringTool.isEmpty(ip) || "unknown".equalsIgnoreCase(ip)) {
                ip = request.getRemoteAddr();
                if ("127.0.0.1".equals(ip) || "0:0:0:0:0:0:0:1".equals(ip)) {
                    // 根据网卡取本机配置的IP
                    try {
                        InetAddress inet = InetAddress.getLocalHost();
                        ip = inet.getHostAddress();
                    } catch (UnknownHostException e) {
                        logger.error("getIpAddress exception:", e);
                    }
                }
            }
        } catch (Exception e) {
            logger.error("IPUtils ERROR ", e);
        }
        return ip;
    }

    /**
     * get region info by ip
     *
     * @param ip ip
     * @return region info
     */
    public static RegionInfo getRegionInfo(String ip) {
        // base valid
        if (StringTool.isEmpty(ip)) {
            return null;
        }
        if (ip.split("\\.").length != 4) {
            logger.info("Ip2regionUtil getCityInfo fail, ip = {}", ip);
            return null;    // invalid ip address, not support
        }

        /**
         * 数据格式：            国家|区域|省份|城市|ISP
         * 115.192.145.222   中国|浙江省|杭州市|电信
         */
        try {
            String searchIpInfo = ip2Region.search(ip);
            String[] splitIpInfo = searchIpInfo.split("\\|");

            RegionInfo cityInfo = new RegionInfo();
            cityInfo.setIp(ip);
            cityInfo.setSearchIpInfo(searchIpInfo);
            cityInfo.setCountry(splitIpInfo[0]);
            cityInfo.setProvince(splitIpInfo[1]);
            cityInfo.setCity(splitIpInfo[2]);
            cityInfo.setIsp(splitIpInfo[3]);

            return cityInfo;
        } catch (Exception e) {
            logger.error("Ip2regionUtil getCityInfo error, ip = {}: ", ip, e);
        }
        return null;
    }

    /**
     * region info
     *
     *  数据格式：
     *      IP：             115.192.145.222
     *      searchIpInfo：   国家|区域|省份|城市|ISP
     *      result：         country|province|city|ISP
     */
    public static class RegionInfo {
        /**
         * ip
         */
        private String ip;

        /**
         * origin search ip info
         */
        private String searchIpInfo;

        /**
         * country, like "中国"
         */
        private String country;

        /**
         * province, like "浙江省"
         */
        private String province;

        /**
         * city, like "杭州市"
         */
        private String city;

        /**
         * Internet Service Provider, like "电信"
         */
        private String isp;

        public String getIp() {
            return ip;
        }

        public void setIp(String ip) {
            this.ip = ip;
        }

        public String getSearchIpInfo() {
            return searchIpInfo;
        }

        public void setSearchIpInfo(String searchIpInfo) {
            this.searchIpInfo = searchIpInfo;
        }

        public String getCountry() {
            return country;
        }

        public void setCountry(String country) {
            this.country = country;
        }

        public String getProvince() {
            return province;
        }

        public void setProvince(String province) {
            this.province = province;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getIsp() {
            return isp;
        }

        public void setIsp(String isp) {
            this.isp = isp;
        }

        @Override
        public String toString() {
            return "RegionInfo{" +
                    "ip='" + ip + '\'' +
                    ", searchIpInfo='" + searchIpInfo + '\'' +
                    ", country='" + country + '\'' +
                    ", province='" + province + '\'' +
                    ", city='" + city + '\'' +
                    ", isp='" + isp + '\'' +
                    '}';
        }
    }

}
