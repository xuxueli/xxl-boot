package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
*  KbDocument Entity
*
*  Created by xuxueli on '2026-03-08 10:57:39'.
*/
public class KbDocument implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 文档id
    */
    private long id;

    /**
    * 所属知识库
    */
    private long kbId;

    /**
    * 文档名称
    */
    private String docName;

    /**
    * 文档类型：txt/pdf/word/md
    */
    private String docType;

    /**
    * 原文内容
    */
    private String content;

    /**
    * 文件存储地址
    */
    private String fileUrl;

    /**
    * 状态
    * KbDucumentStatusEnum
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

    public String getDocName() {
        return docName;
    }

    public void setDocName(String docName) {
        this.docName = docName;
    }

    public String getDocType() {
        return docType;
    }

    public void setDocType(String docType) {
        this.docType = docType;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
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