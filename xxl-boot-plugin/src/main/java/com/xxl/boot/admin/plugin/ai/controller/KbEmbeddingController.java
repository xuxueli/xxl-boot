package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.KbChunk;
import com.xxl.boot.admin.plugin.ai.service.KbEmbeddingService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

/**
* KbEmbedding Controller
*
* Created by xuxueli on '2026-03-08 10:57:39'.
*/
@Controller
@RequestMapping("/ai/kb/embedding")
public class KbEmbeddingController {

    @Resource
    private KbEmbeddingService kbEmbeddingService;

    /**
     * 1、向量化入库： 「文档分块 → 向量化 → Milvus 入库」
     *
     *  流程：
     *      - 1、历史清理：
     *          - Collection：历史 向量存储清理
     *          - Chunk分块表：历史 数据存储清理
     *      - 2、初始化：
     *          - 新建Collection：by知识库，字段初始化
     *          - 新建Chunk分块：by文档，拆分分块；
     *          - Chunk向量入库：
     *              - 向量化： Embedding模型
     *              - 向量入库：选中 Collection，ChunkId为主键；
     *
     * @param kbId
     * @return
     */
    @RequestMapping("/embed")
    @ResponseBody
    @XxlSso
    public Response<String> embed(Long kbId) {
        return kbEmbeddingService.embed(kbId);
    }

    /**
     *
     * 1、问题向量化查询：「问题向量化 → Milvus 检索」
     *
     * 流程：
     *      - 问题向量化：向量化： Embedding模型
     *      - 向量查询：选中 Collection，向量参数 查询 Chunk分块 数据；
     */
    @RequestMapping("/query")
    @ResponseBody
    @XxlSso
    public Response<List<KbChunk>> query(Long kbId, String keywoard) {
        return kbEmbeddingService.query(kbId, keywoard);
    }

}
