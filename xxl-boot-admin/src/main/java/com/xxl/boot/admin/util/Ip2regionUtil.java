package com.xxl.boot.admin.util;

import com.xxl.tool.core.StringTool;
import com.xxl.tool.io.IOTool;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import org.lionsoul.ip2region.xdb.Searcher;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
public class Ip2regionUtil {
    private static Logger logger = LoggerFactory.getLogger(Ip2regionUtil.class);

    /**
     * Ip2region searcher
     */
    private static Searcher searcher;

    /**
     * init when start, load ip2region.db to mem
     */
    @PostConstruct
    private static void initIp2regionSearcher() {
        try {
            InputStream inputStream = new ClassPathResource("/other/ip2region/ip2region.xdb").getInputStream();
            byte[] dbBinStr = IOTool.readBytes(inputStream);

            // new with buffer
            searcher = Searcher.newWithBuffer(dbBinStr);
        } catch (Exception e) {
            logger.info("Ip2regionUtil initIp2regionSearcher error:", e);
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
            if (StringTool.isEmpty(ip) || ip.length() == 0 || "unknown".equalsIgnoreCase(ip)) {
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
                    InetAddress inet = null;
                    try {
                        inet = InetAddress.getLocalHost();
                    } catch (UnknownHostException e) {
                        logger.error("getIpAddress exception:", e);
                    }
                    ip = inet.getHostAddress();
                }
            }
        } catch (Exception e) {
            logger.error("IPUtils ERROR ", e);
        }
        return ip;
    }

    /**
     * get address by ip (with ip2region.db）
     *
     * @param ip
     * @return 地理位置
     */
    public static CityInfo getCityInfo(String ip) {
        // base valid
        if (StringTool.isEmpty(ip)) {
            return null;
        }
        if (ip.split("\\.").length != 4) {
            logger.info("Ip2regionUtil getCityInfo fail, ip = {}", ip);
            return null;    // invalid ip address, not support
        }

        /**
         * 数据格式： 国家|区域|省份|城市|ISP
         * 192.168.31.160 0|0|0|内网IP|内网IP
         * 47.52.236.180 中国|0|香港|0|阿里云
         * 220.248.12.158 中国|0|上海|上海市|联通
         * 164.114.53.60 美国|0|华盛顿|0|0
         */

        try {
            String searchIpInfo = searcher.search(ip);
            String[] splitIpInfo = searchIpInfo.split("\\|");

            CityInfo cityInfo = new CityInfo();
            cityInfo.setIp(ip);
            cityInfo.setSearchIpInfo(searchIpInfo);
            cityInfo.setCountry(splitIpInfo[0]);
            cityInfo.setRegion(splitIpInfo[1]);
            cityInfo.setProvince(splitIpInfo[2]);
            cityInfo.setCity(splitIpInfo[3]);
            cityInfo.setISP(splitIpInfo[3]);

            return cityInfo;
        } catch (Exception e) {
            logger.error("Ip2regionUtil getCityInfo error, ip = {}: ", ip, e);
        }
        return null;
    }

    public static class CityInfo{
        /**
         * cityInfo.put("searchInfo", searchIpInfo);
         *             cityInfo.put("country",splitIpInfo[0]);
         *             cityInfo.put("region",splitIpInfo[1]);
         *             cityInfo.put("province",splitIpInfo[2]);
         *             cityInfo.put("city",splitIpInfo[3]);
         *             cityInfo.put("ISP",splitIpInfo[3]);
         */

        private String ip;
        private String searchIpInfo;
        private String country;
        private String region;
        private String province;
        private String city;
        private String ISP;

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

        public String getRegion() {
            return region;
        }

        public void setRegion(String region) {
            this.region = region;
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

        public String getISP() {
            return ISP;
        }

        public void setISP(String ISP) {
            this.ISP = ISP;
        }

    }

}
