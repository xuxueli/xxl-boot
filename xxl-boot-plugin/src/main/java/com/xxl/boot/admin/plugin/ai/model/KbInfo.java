package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
*  KbInfo Entity
*
*  Created by xuxueli on '2026-03-08 09:39:11'.
*/
public class KbInfo implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 知识库id
    */
    private long id;

    /**
    * 知识库名称
    */
    private String kbName;

    /**
    * 描述
    */
    private String kbDesc;

    /**
    * 嵌入模型，如qwen3-embedding:0.6b
    */
    private String embeddingModel;

    /**
    * 向量库类型，默认milvus
    */
    private String vectorDbType;

    /**
    * milvus集合名，默认xxl_ai数据库下新建：kb_{主键id}
    */
    private String collectionName;

    /**
    * 新增时间
    */
    private Date addTime;

    /**
    * 更新时间
    */
    private Date updateTime;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getKbName() {
        return kbName;
    }

    public void setKbName(String kbName) {
        this.kbName = kbName;
    }

    public String getKbDesc() {
        return kbDesc;
    }

    public void setKbDesc(String kbDesc) {
        this.kbDesc = kbDesc;
    }

    public String getEmbeddingModel() {
        return embeddingModel;
    }

    public void setEmbeddingModel(String embeddingModel) {
        this.embeddingModel = embeddingModel;
    }

    public String getVectorDbType() {
        return vectorDbType;
    }

    public void setVectorDbType(String vectorDbType) {
        this.vectorDbType = vectorDbType;
    }

    public String getCollectionName() {
        return collectionName;
    }

    public void setCollectionName(String collectionName) {
        this.collectionName = collectionName;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}