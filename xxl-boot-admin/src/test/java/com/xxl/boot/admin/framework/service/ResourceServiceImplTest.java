package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.controller.AbstractSpringMvcTest;
import com.xxl.boot.admin.framework.mapper.ResourceMapper;
import com.xxl.boot.admin.framework.model.dto.ResourceDTO;
import com.xxl.boot.admin.framework.model.entity.Resource;
import com.xxl.tool.json.GsonTool;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.test.context.bean.override.mockito.MockitoBean;

import java.util.ArrayList;
import java.util.List;

public class ResourceServiceImplTest extends AbstractSpringMvcTest {
    private static Logger logger = LoggerFactory.getLogger(ResourceServiceImplTest.class);

    @jakarta.annotation.Resource
    private ResourceService resourceService;

    //@SpyBean
    @MockitoBean
    private ResourceMapper resourceMapper;

    @Test
    public void treeListTest(){
        // mock data
        List<Resource> mockData = new ArrayList<>();
        mockData.add(new Resource(0,1,"1"));
        mockData.add(new Resource(0,2,"2"));
        mockData.add(new Resource(2,21,"21"));
        mockData.add(new Resource(21,211,"211"));
        mockData.add(new Resource(21,212,"212"));
        mockData.add(new Resource(2,22,"22"));
        mockData.add(new Resource(0,3,"3"));

        // mock
        Mockito.when(resourceMapper.queryResource(null, -1)).thenReturn(mockData);

        List<ResourceDTO> result = resourceService.treeList(null, -1);
        logger.info(GsonTool.toJson(result));

        Assertions.assertNotNull(result);
    }


}
