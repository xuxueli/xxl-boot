package com.xxl.boot.admin.util;

import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Ip2regionUtilTest {
    private static final Logger logger = LoggerFactory.getLogger(Ip2regionUtilTest.class);

    @Test
    public void test() {
        Ip2regionUtil.initIp2Region();

        logger.info("{}", Ip2regionUtil.getRegionInfo("115.192.145.222"));
    }

}
