package com.xxl.boot.admin.service;

import com.xxl.boot.admin.controller.AbstractSpringMvcTest;
import com.xxl.boot.admin.mapper.ResourceMapper;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootResource;
import com.xxl.tool.gson.GsonTool;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.test.mock.mockito.MockBean;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;

public class ResourceServiceImplTest extends AbstractSpringMvcTest {
    private static Logger logger = LoggerFactory.getLogger(ResourceServiceImplTest.class);

    @Resource
    private ResourceService resourceService;

    //@SpyBean
    @MockBean
    private ResourceMapper resourceMapper;

    @Test
    public void treeListTest(){
        // mock data
        List<XxlBootResource> mockData = new ArrayList<>();
        mockData.add(new XxlBootResource(0,1,"1"));
        mockData.add(new XxlBootResource(0,2,"2"));
        mockData.add(new XxlBootResource(2,21,"21"));
        mockData.add(new XxlBootResource(21,211,"211"));
        mockData.add(new XxlBootResource(21,212,"212"));
        mockData.add(new XxlBootResource(2,22,"22"));
        mockData.add(new XxlBootResource(0,3,"3"));

        // mock
        Mockito.when(resourceMapper.queryResource(null, -1)).thenReturn(mockData);

        List<XxlBootResourceDTO> result = resourceService.treeList(null, -1);
        logger.info(GsonTool.toJson(result));

        Assertions.assertNotNull(result);
    }


}
