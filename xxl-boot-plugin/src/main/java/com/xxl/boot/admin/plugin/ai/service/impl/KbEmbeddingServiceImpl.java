package com.xxl.boot.admin.plugin.ai.service.impl;

import com.google.gson.JsonObject;
import com.xxl.boot.admin.plugin.ai.constant.enums.KbChunkStatusEnum;
import com.xxl.boot.admin.plugin.ai.constant.enums.KbDucumentStatusEnum;
import com.xxl.boot.admin.plugin.ai.mapper.KbChunkMapper;
import com.xxl.boot.admin.plugin.ai.mapper.KbDocumentMapper;
import com.xxl.boot.admin.plugin.ai.mapper.KbInfoMapper;
import com.xxl.boot.admin.plugin.ai.model.KbChunk;
import com.xxl.boot.admin.plugin.ai.model.KbDocument;
import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import com.xxl.boot.admin.plugin.ai.model.dto.KbChunkDTO;
import com.xxl.boot.admin.plugin.ai.service.KbEmbeddingService;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.MapTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.json.GsonTool;
import com.xxl.tool.response.Response;
import io.milvus.v2.client.ConnectConfig;
import io.milvus.v2.client.MilvusClientV2;
import io.milvus.v2.common.DataType;
import io.milvus.v2.common.IndexParam;
import io.milvus.v2.service.collection.request.AddFieldReq;
import io.milvus.v2.service.collection.request.CreateCollectionReq;
import io.milvus.v2.service.collection.request.DropCollectionReq;
import io.milvus.v2.service.collection.request.HasCollectionReq;
import io.milvus.v2.service.database.request.CreateDatabaseReq;
import io.milvus.v2.service.database.response.ListDatabasesResp;
import io.milvus.v2.service.vector.request.SearchReq;
import io.milvus.v2.service.vector.request.UpsertReq;
import io.milvus.v2.service.vector.request.data.FloatVec;
import io.milvus.v2.service.vector.response.SearchResp;
import io.milvus.v2.service.vector.response.UpsertResp;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.embedding.EmbeddingModel;
import org.springframework.ai.ollama.OllamaEmbeddingModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaEmbeddingOptions;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * KbEmbedding Service
 *
 * Created by xuxueli on '2026-03-08'.
 */
@Service
public class KbEmbeddingServiceImpl implements KbEmbeddingService {
    private static final Logger logger = LoggerFactory.getLogger(KbEmbeddingServiceImpl.class);

    @Resource
    private KbChunkMapper kbChunkMapper;
    @Resource
    private KbDocumentMapper kbDocumentMapper;
    @Resource
    private KbInfoMapper kbInfoMapper;

    // --------------------------------- Milvus ----------------------
    /**
     * Milvus 参数
     *  1、DB            ：xxl_boot_ai
     *  2、Collection    ：kb_{kbId}；知识库维度；
     *  3、数据 Field      ：Chunk 维度；
     *  4、         ：
     *    - id              ：主键，同 chunkId；
     *    - chunkId         ：分块 ID；
     *    - contentVector   ：正文向量数据；
     */
    private static final String KB_EMBEDDING_DB = "xxl_boot_ai";
    private static final String MILVUS_URI = "http://localhost:19530";
    private static final int VECTOR_DIMENSION = 1024;

    /**
     * 分块参数
     */
    private static final int CHUNK_SIZE = 1000;             // 每块最大字符数
    private static final int MIN_CHUNK_SIZE = 100;          // 最小分块长度
    private static final int OVERLAP_SIZE = 50;             // 重叠区域大小
    /**
     * 查询相似度阈值
     */
    private static final Float SIMILARITY_THRESHOLD = 0.4f; // 默认相似度阈值
    private static final int TOP_K_COUNT = 3;               // 默认查询数量

    // build collection name
    private String buildCollectionName(Long kbId) {
        return "kb_" + kbId;
    }

    // build Milvus Client
    private MilvusClientV2 buildMilvusClient() throws InterruptedException {
        // build client
        ConnectConfig config = ConnectConfig.builder()
                .uri(MILVUS_URI)
                .build();
        MilvusClientV2 client = new MilvusClientV2(config);

        // init database
        ListDatabasesResp listDatabasesResp = client.listDatabases();           // valid
        if (!listDatabasesResp.getDatabaseNames().contains(KB_EMBEDDING_DB)) {
            CreateDatabaseReq createDatabaseReq = CreateDatabaseReq.builder()   // create
                    .databaseName(KB_EMBEDDING_DB)
                    .build();
            client.createDatabase(createDatabaseReq);
        }

        // use database
        client.useDatabase(KB_EMBEDDING_DB);
        return client;
    }


    /**
     * 文档分块：简单按固定长度分块
     */
    private List<String> splitDocument(String content) {
        List<String> chunks = new ArrayList<>();

        if (StringTool.isBlank(content)) {
            return chunks;
        }

        int start = 0;
        while (start < content.length()) {
            // 1、计算理论结束位置
            int end = Math.min(start + CHUNK_SIZE, content.length());

            // 2、如果不是最后一块，尝试在语义边界处切分
            if (end < content.length()) {
                // 2.1 优先查找段落边界（双换行符）
                int breakPos = findBestBreakPosition(content, start, end,
                        new String[]{"\n\n", "\r\n\r\n"});

                // 2.2 如果没有段落边界，查找句子边界
                if (breakPos == -1) {
                    breakPos = findBestBreakPosition(content, start, end,
                            new String[]{"\n", ".", "!", "?", ";", "。", "！", "？"});
                }

                // 2.3 如果找到合适的边界点，调整 end 位置
                if (breakPos != -1 && breakPos > start + MIN_CHUNK_SIZE) {
                    end = breakPos + 1; // +1 是为了包含标点符号
                }
            }

            // 3、提取分块内容（不去除首尾空格，保留格式）
            String chunk = content.substring(start, end);

            // 4、过滤无效分块
            String trimmedChunk = chunk.trim();
            if (trimmedChunk.length() >= MIN_CHUNK_SIZE) {
                chunks.add(trimmedChunk);
            } else if (!trimmedChunk.isEmpty()) {
                // 如果分块太短，合并到上一个分块（如果有）
                if (!chunks.isEmpty()) {
                    int lastIndex = chunks.size() - 1;
                    String lastChunk = chunks.get(lastIndex);
                    chunks.set(lastIndex, lastChunk + " " + trimmedChunk);
                } else {
                    // 如果是第一个分块就太短，也加入（避免丢失内容）
                    chunks.add(trimmedChunk);
                }
            }

            // 5、计算下一个分块的起始位置
            // 关键修复：确保 start 一定前进
            int nextStart = end - OVERLAP_SIZE;
            if (nextStart <= start) {
                // 如果回退后没有前进，直接跳到 end
                start = end;
            } else {
                start = nextStart;
            }
        }

        return chunks;
    }

    /**
     * 在指定范围内查找最佳切分位置
     */
    private int findBestBreakPosition(String content, int start, int end, String[] separators) {
        int bestPos = -1;

        // 从 end 往前找，找到最后一个分隔符位置
        for (String separator : separators) {
            int pos = content.lastIndexOf(separator, end - 1);
            if (pos >= start && pos > bestPos) {
                bestPos = pos;
            }
        }

        // 只在合理范围内返回（避免切分点太靠前）
        if (bestPos > start + (end - start) * 0.3) {
            return bestPos;
        }

        return -1;
    }

    // --------------------------------- Embedding ----------------------

    private static final String EMBEDDING_MODEL_NAME = "qwen3-embedding:0.6b";
    private static final String OLLAMA_API_URL = "http://localhost:11434";

    /**
     * 获取 Embedding 模型
     */
    public static EmbeddingModel getEmbeddingModel() {
        // build Ollama API
        OllamaApi ollamaApi = OllamaApi.builder().baseUrl(OLLAMA_API_URL).build();

        // build embedding model
        return OllamaEmbeddingModel
                .builder()
                .defaultOptions(OllamaEmbeddingOptions
                        .builder()
                        .model(EMBEDDING_MODEL_NAME)
                        .dimensions(VECTOR_DIMENSION)
                        .build())
                .ollamaApi(ollamaApi)
                .build();
    }

    /**
     * 文本 Embedding
     */
    private static List<float[]> embed(List<String> texts) {
        EmbeddingModel embeddingModel = getEmbeddingModel();
        return embeddingModel.embed(texts);
    }

    // --------------------------------- embed ----------------------

    /**
     * 1、向量化入库：「文档分块 → 向量化 → Milvus 入库」
     *
     *  流程：
     *      - 1、历史清理：
     *          - Collection 清理：历史 向量存储清理
     *          - Chunk 分块表删除：历史 数据存储清理
     *      - 2、向量入库：
     *          - Collection 初始化：by 知识库，字段初始化
     *          - Chunk 分块处理：by 文档
     *              - 内容分块：固定长度拆分，未来可支持多策略 todo
     *              - 向量化：Embedding 模型
     *              - 入库：
     *                  - DB存储：Chunk表
     *                  - 向量存储：选中 Collection，ChunkId 为主键；
     *
     * @param kbId
     * @return
     */
    @Override
    public Response<String> embed(Long kbId) {
        // valid
        if (kbId == null) {
            return Response.ofFail("知识库 ID 非法");
        }
        KbInfo kbInfo = kbInfoMapper.load(kbId);
        if (kbInfo == null) {
            return Response.ofFail("知识库 ID 非法 [2]");
        }

        try {
            // 0、初始化 Milvus 客户端
            MilvusClientV2 client = buildMilvusClient();
            String collectionName = buildCollectionName(kbId);

            // 1、历史清理
            // 1.1、清理 Collection
            deleteCollection(client, collectionName);
            // 1.2、Chunk 分块表删除
            kbChunkMapper.deleteByKbId(kbId);

            // 2、向量入库
            // 2.1、Collection 初始化
            initCollection(client, collectionName);

            // 2.2、Chunk 分块表数据写入
            List<KbDocument> documents = kbDocumentMapper.queryByKbId(kbId);
            int chunkCount = 0;
            if (CollectionTool.isNotEmpty(documents)) {
                // 处理每个文档：分块 -> 向量化 -> 入库
                for (KbDocument doc : documents) {
                    /*if (KbDucumentStatusEnum.getByValue(doc.getStatus(), null) == KbDucumentStatusEnum.SUCCESS) {
                        continue;
                    }*/
                    // chunk document
                    chunkCount = chunkDocument(client, collectionName, doc);
                }
            }
            // update status
            kbDocumentMapper.updateStatusByKbId(kbId, KbDucumentStatusEnum.SUCCESS.getValue());

            logger.info("知识库嵌入完成，kbId: {}, collection: {}, 本次处理文档数：{}", kbId, collectionName, chunkCount);
            return Response.ofSuccess("知识库嵌入完成");

        } catch (Exception e) {
            logger.error("知识库嵌入失败，kbId: {}", kbId, e);
            return Response.ofFail("知识库嵌入失败：" + e.getMessage());
        }
    }

    private void deleteCollection(MilvusClientV2 client, String collectionName) {
        Boolean exists = client.hasCollection(HasCollectionReq.builder()
                .collectionName(collectionName)
                .build());
        if (exists) {
            client.dropCollection(DropCollectionReq.builder()
                    .collectionName(collectionName)
                    .build());
            logger.info("Collection 删除成功: {}", collectionName);
        }
    }

    /**
     * 初始化 Collection
     */
    private void initCollection(MilvusClientV2 client, String collectionName) {
        // 1、创建 Schema
        CreateCollectionReq.CollectionSchema schema = client.createSchema();

        // 2、添加字段
        // 主键 ID（同 chunkId）
        schema.addField(AddFieldReq.builder()
                .fieldName("id")
                .dataType(DataType.Int64)
                .isPrimaryKey(true)
                .autoID(false)
                .build());

        // chunkId 字段
        schema.addField(AddFieldReq.builder()
                .fieldName("chunkId")
                .dataType(DataType.Int64)
                .build());

        // 内容向量字段
        schema.addField(AddFieldReq.builder()
                .fieldName("contentVector")
                .dataType(DataType.FloatVector)
                .dimension(VECTOR_DIMENSION)
                .build());

        // 3、设置索引参数
        IndexParam indexParamForIdField = IndexParam.builder()
                .fieldName("id")
                .indexType(IndexParam.IndexType.AUTOINDEX)      // 使用 AUTOINDEX 自动索引类型
                .build();
        IndexParam indexParamForVectorField = IndexParam.builder()
                .fieldName("contentVector")
                .indexType(IndexParam.IndexType.AUTOINDEX)      // AUTOINDEX 自动索引类型
                .metricType(IndexParam.MetricType.COSINE)       // COSINE 余弦相似度度量方式
                .build();

        List<IndexParam> indexParams = new ArrayList<>();
        indexParams.add(indexParamForIdField);
        indexParams.add(indexParamForVectorField);

        // 4、创建 Collection
        CreateCollectionReq createCollectionReq = CreateCollectionReq.builder()
                .collectionName(collectionName)
                .collectionSchema(schema)
                .indexParams(indexParams)
                .build();

        client.createCollection(createCollectionReq);
        logger.info("Collection 创建成功：{}", collectionName);
    }

    /**
     * 处理单个文档：分块 -> 向量化 -> 入库
     */
    private int chunkDocument(MilvusClientV2 client, String collectionName, KbDocument doc) {

        // valid
        if (StringTool.isBlank(doc.getContent())) {
            return 0;
        }

        // 1、文档分块（简单按固定长度分块，实际可优化为智能分块）
        List<String> chunks = splitDocument(doc.getContent());

        // 2、批量向量化
        List<float[]> vectors = embed(chunks);

        // 3、向量入库
        List<JsonObject> vectorData = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i++) {

            // 3.1、DB存储
            KbChunk chunk = new KbChunk();
            chunk.setKbId(doc.getKbId());
            chunk.setDocId(doc.getId());
            chunk.setChunkIndex(i);
            chunk.setContent(chunks.get(i));
            chunk.setStatus(KbChunkStatusEnum.PROCESSED.getValue());
            kbChunkMapper.insert(chunk);

            // 主键 ID（chunkId）
            long chunkId = chunk.getId();

            // 构建 Milvus 数据
            Map<String, Object> map = new HashMap<>();
            map.put("id", chunkId);
            map.put("chunkId", chunkId);
            map.put("contentVector", vectors.get(i));

            vectorData.add(GsonTool.toJsonElement(map).getAsJsonObject());
        }

        // 3.2、向量数据存储
        UpsertReq upsertReq = UpsertReq.builder()
                .collectionName(collectionName)
                .data(vectorData)
                .build();
        UpsertResp upsertResp = client.upsert(upsertReq);

        logger.info("文档向量化完成，docId: {}, 分块数：{}, UpsertCnt:{}", doc.getId(), chunks.size(), upsertResp.getUpsertCnt());
        return chunks.size();
    }

    @Override
    public Response<List<KbChunkDTO>> query(Long kbId, String keyword) {

        // valid
        if (kbId == null) {
            return Response.ofFail("知识库 ID 非法");
        }
        KbInfo kbInfo = kbInfoMapper.load(kbId);
        if (kbInfo == null) {
            return Response.ofFail("知识库 ID 非法 [2]");
        }
        if (StringTool.isBlank(keyword)) {
            return Response.ofFail("查询关键字不能为空");
        }

        // query
        try {
            // 1、问题向量化
            float[] keywordVector = embed(List.of(keyword)).get(0);

            // 2、向量查询
            MilvusClientV2 client = buildMilvusClient();
            // search
            SearchReq searchReq = SearchReq.builder()
                    .collectionName(buildCollectionName(kbId))                          // 选中知识库 kbid; Collection
                    .data(Collections.singletonList(new FloatVec(keywordVector)))       // 查询数据向量化
                    .annsField("contentVector")                                         // 查询向量字段
                    .outputFields(Arrays.asList("id", "chunkId", "contentVector"))      // 返回字段
                    .limit(TOP_K_COUNT)
                    .searchParams(Map.of("radius", SIMILARITY_THRESHOLD))           // 搜索参数, 相似度阈值
                    .build();
            SearchResp searchResp = client.search(searchReq);
            // parse KbChunkDTO
            Map<Long, Float> chunkResultMap = new HashMap<>();
            List<List<SearchResp.SearchResult>> searchResults = searchResp.getSearchResults();
            for (List<SearchResp.SearchResult> results : searchResults) {
                for (SearchResp.SearchResult result : results) {
                    /*if (result.getScore() < 0.45) {
                        // 相似度阈值: >0.8 高精度场景；>0.7 平衡场景；>0.3 ‌高召回场景
                        continue;
                    }*/
                    chunkResultMap.put((Long) result.getEntity().get("chunkId"), result.getScore());
                }
            }

            // load KbChunk
            if (MapTool.isEmpty(chunkResultMap)) {
                return Response.ofFail("没有匹配结果");
            }
            // chunkDTOS.add(new KbChunkDTO((Long) result.getEntity().get("chunkId"), result.getScore()));
            List<KbChunk> chunkData = kbChunkMapper.queryByIds(new ArrayList<>(chunkResultMap.keySet()));

            // parse resule
            List<KbChunkDTO> chunkDTOS = chunkData
                    .stream()
                    .map(chunk
                            -> new KbChunkDTO(chunk, chunkResultMap.get(chunk.getId())))
                    .sorted(Comparator.comparingDouble(KbChunkDTO::getScore).reversed())    // 降序
                    .toList();


            return Response.ofSuccess(chunkDTOS);
        } catch (InterruptedException e) {
            logger.error("知识库查询失败，kbId: {}", kbId, e);
            return Response.ofFail("知识库查询失败：" + e.getMessage());
        }
    }
}
