package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 字典项实体
 *
 * @author xuxueli 2024-11-03
 */
public class DictItem implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* 字典项ID */
    private long dictId;        /* 字典ID */
    private String name;        /* 字典项名称 */
    private int code;           /* 字典项Code */
    private int status;         /* 状态（0-正常、1-停用） */
    private int order;          /* 顺序 */
    private Date addTime;       /* 新增时间 */
    private Date updateTime;    /* 更新时间 */
    private String remark;      /* 备注 */

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getDictId() {
        return dictId;
    }

    public void setDictId(long dictId) {
        this.dictId = dictId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }
}
