package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
*  Chat Bot
*
*  Created by xuxueli on '2025-11-30 20:41:37'.
*/
public class ChatBot implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * ChatBot ID
    */
    private int id;

    /**
    * ChatBot 名称
    */
    private String name;

    /**
     * 提示词
     */
    private String cueWord;

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

    public String getCueWord() {
        return cueWord;
    }

    public void setCueWord(String cueWord) {
        this.cueWord = cueWord;
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