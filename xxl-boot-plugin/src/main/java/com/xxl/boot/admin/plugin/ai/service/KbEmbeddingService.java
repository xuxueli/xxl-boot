package com.xxl.boot.admin.plugin.ai.service;

import com.xxl.boot.admin.plugin.ai.model.KbChunk;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * KbEmbedding Service
 *
 * Created by xuxueli on '2026-03-08'.
 */
public interface KbEmbeddingService {

    Response<String> embed(Long kbId);

    Response<List<KbChunk>> query(Long kbId, String keywoard);

}
