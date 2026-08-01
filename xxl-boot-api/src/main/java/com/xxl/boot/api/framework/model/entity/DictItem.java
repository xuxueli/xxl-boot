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
    private String itemName;    /* 字典项名称 */
    private String itemCode;    /* 字典项标识 */
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

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getItemCode() {
        return itemCode;
    }

    public void setItemCode(String itemCode) {
        this.itemCode = itemCode;
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
