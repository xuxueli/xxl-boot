package com.xxl.boot.admin.plugin.ai.service;

import com.xxl.tool.response.Response;

/**
 * KbEmbedding Service
 *
 * Created by xuxueli on '2026-03-08'.
 */
public interface KbEmbeddingService {

    Response<String> embedding(Long kbId);

}
