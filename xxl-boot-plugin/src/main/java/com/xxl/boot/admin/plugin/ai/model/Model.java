package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
 *  Model Entity
 *
 *  Created by xuxueli on '2025-12-21 16:30:24'.
 */
public class Model implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
     * Model ID
     */
    private int id;

    /**
     * Model名称
     */
    private String name;

    /**
     * Model类型：1-基础模型，1-文本模型，2-视觉模型
     */
    private int modelType;

    /**
     * 供应商类型：1-Ollama
     */
    private int supplierType;

    /**
     * 模型，如 qwen3:0.6b
     */
    private String model;

    /**
     * base_url
     */
    private String baseUrl;

    /**
     * api_key
     */
    private String apiKey;

    /**
     * 新增时间
     */
    private Date addTime;

    /**
     * 更新时间
     */
    private Date updateTime;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getModelType() {
        return modelType;
    }

    public void setModelType(int modelType) {
        this.modelType = modelType;
    }

    public int getSupplierType() {
        return supplierType;
    }

    public void setSupplierType(int supplierType) {
        this.supplierType = supplierType;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public String getApiKey() {
        return apiKey;
    }

    public void setApiKey(String apiKey) {
        this.apiKey = apiKey;
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