package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.KbChunkMapper;
import com.xxl.boot.admin.plugin.ai.mapper.KbDocumentMapper;
import com.xxl.boot.admin.plugin.ai.mapper.KbInfoMapper;
import com.xxl.boot.admin.plugin.ai.model.KbChunk;
import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import com.xxl.boot.admin.plugin.ai.service.KbEmbeddingService;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * KbEmbedding Service
 *
 * Created by xuxueli on '2026-03-08'.
 */
@Service
public class KbEmbeddingServiceImpl implements KbEmbeddingService {

    @Resource
    private KbChunkMapper kbChunkMapper;
    @Resource
    private KbDocumentMapper kbDocumentMapper;
    @Resource
    private KbInfoMapper kbInfoMapper;

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
    @Override
    public Response<String> embed(Long kbId) {

        // valid
        if (kbId == null) {
            return Response.ofFail("知识库ID非法");
        }
        KbInfo kbInfo = kbInfoMapper.load(kbId);
        if (kbInfo == null) {
            return Response.ofFail("知识库ID非法[2]");
        }



        return null;
    }


    /**
     * Milvus参数
     *  1、DB            ：xxl_boot_ai
     *  2、Collection    ：kb_{kbId}；知识库维度；
     *  3、数据Field      ：Chunk维度；
     *  4、         ：
     *    - id              ：主键，同 chunkId；
     *    - chunkId         ：分块ID；
     *    - contentVector   ：正文向量数据；
     */
    private static final String KB_EMBEDDING_DB = "xxl_boot_ai";
    private String buildCollectionName(Long kbId) {
        return "kb_" + kbId;
    }

    @Override
    public Response<List<KbChunk>> query(Long kbId, String keywoard) {
        return null;
    }

}
