package com.xxl.boot.api.framework.model.dto.request;

import java.io.Serializable;
import java.util.List;

/**
 * 批量排序请求（ids 与 orders 一一对应）
 *
 * @author xuxueli 2026-10-02
 */
public class SortRequest implements Serializable {
    private static final long serialVersionUID = 42L;

    private List<Integer> ids;      /* ID列表 */
    private List<Integer> orders;   /* 排序值列表（与 ids 一一对应） */


    public List<Integer> getIds() {
        return ids;
    }

    public void setIds(List<Integer> ids) {
        this.ids = ids;
    }

    public List<Integer> getOrders() {
        return orders;
    }

    public void setOrders(List<Integer> orders) {
        this.orders = orders;
    }

}
