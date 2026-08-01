package com.xxl.boot.api.framework.model.dto;

import java.io.Serializable;

/**
 * 字典 DTO（用于列表展示）
 *
 * @author xuxueli 2024-11-03
 */
public class DictDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* 字典ID */
    private String name;        /* 字典名称 */
    private String code;        /* 字典标识 */
    private int status;         /* 状态（0-正常、1-停用） */
    private String addTime;     /* 新增时间（格式化字符串） */
    private String updateTime;  /* 更新时间（格式化字符串） */
    private String remark;      /* 备注 */

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getAddTime() {
        return addTime;
    }

    public void setAddTime(String addTime) {
        this.addTime = addTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
