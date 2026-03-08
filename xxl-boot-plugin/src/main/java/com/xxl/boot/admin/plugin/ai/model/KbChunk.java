package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
*  KbChunk Entity
*
*  Created by xuxueli on '2026-03-08 13:02:07'.
*/
public class KbChunk implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 分片id
    */
    private long id;

    /**
    * 
    */
    private long kbId;

    /**
    * 
    */
    private long docId;

    /**
    * 分片序号
    */
    private int chunkIndex;

    /**
    * 分片文本
    */
    private String content;

    /**
    * 向量数据id(milvus集合数据主键id)
    */
    private String vectorId;

    /**
    * 状态
    * KbChunkStatusEnum
    */
    private int status;

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

    public long getKbId() {
        return kbId;
    }

    public void setKbId(long kbId) {
        this.kbId = kbId;
    }

    public long getDocId() {
        return docId;
    }

    public void setDocId(long docId) {
        this.docId = docId;
    }

    public int getChunkIndex() {
        return chunkIndex;
    }

    public void setChunkIndex(int chunkIndex) {
        this.chunkIndex = chunkIndex;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getVectorId() {
        return vectorId;
    }

    public void setVectorId(String vectorId) {
        this.vectorId = vectorId;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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