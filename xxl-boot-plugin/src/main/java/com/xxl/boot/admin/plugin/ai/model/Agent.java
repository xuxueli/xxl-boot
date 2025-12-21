package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
 *  Agent Entity
 *
 *  Created by xuxueli on '2025-12-21 16:30:24'.
 */
public class Agent implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
     * agent id
     */
    private int id;

    /**
     * agent名称
     */
    private String name;

    /**
     * agent类型：1-chatagent
     */
    private int agentType;

    /**
     * 供应商类型：1-ollama
     */
    private int supplierType;

    /**
     * 提示词
     */
    private String prompt;

    /**
     * 模型，如 qwen3:0.6b
     */
    private String model;

    /**
     * ollama url
     */
    private String ollamaUrl;

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

    public int getAgentType() {
        return agentType;
    }

    public void setAgentType(int agentType) {
        this.agentType = agentType;
    }

    public int getSupplierType() {
        return supplierType;
    }

    public void setSupplierType(int supplierType) {
        this.supplierType = supplierType;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getOllamaUrl() {
        return ollamaUrl;
    }

    public void setOllamaUrl(String ollamaUrl) {
        this.ollamaUrl = ollamaUrl;
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