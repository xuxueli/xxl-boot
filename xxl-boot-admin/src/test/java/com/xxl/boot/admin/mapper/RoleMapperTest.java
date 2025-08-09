package com.xxl.boot.admin.mapper;

import com.xxl.boot.admin.model.entity.XxlBootRole;
import com.xxl.boot.admin.service.RoleService;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;

import jakarta.annotation.Resource;
import java.util.Arrays;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class RoleMapperTest {
    private static Logger logger = LoggerFactory.getLogger(RoleMapperTest.class);

    @Resource
    private RoleService roleService;

    @Test
    public void loadTest() throws Exception {
        Response<XxlBootRole> role = roleService.load(1);
        Assertions.assertNotNull(role);
    }

    @Test
    public void pageTest() throws Exception {
        PageModel<XxlBootRole> result = roleService.pageList(0, 100, null);
        Assertions.assertNotNull(result);
    }

    @Test
    public void insertTest() throws Exception {
        XxlBootRole role = new XxlBootRole();
        role.setName("admin22");
        role.setOrder(22);

        Response<String> result = roleService.insert(role);
        Assertions.assertNotNull(result);
    }

    @Test
    public void updateTest() throws Exception {
        XxlBootRole role = roleService.load(2).getData();
        if (role == null) {
            return;
        }

        role.setName("admin33");
        role.setOrder(33);

        Response<String> result = roleService.update(role);
        Assertions.assertNotNull(result);
    }

    @Test
    public void deleteTest() throws Exception {
        Response<String> result = roleService.deleteByIds(Arrays.asList(2));
        Assertions.assertNotNull(result);
    }

}
