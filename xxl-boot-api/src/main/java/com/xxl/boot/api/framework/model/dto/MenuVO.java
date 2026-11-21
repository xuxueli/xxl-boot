package com.xxl.boot.api.framework.model.dto;

import com.xxl.boot.api.framework.model.entity.Resource;

import java.io.Serializable;
import java.util.List;

/**
 * 菜单 DTO
 *
 * 纯业务菜单数据，仅用于前端按自身 UI 库适配路由与菜单，不包含任何前端路由/组件语义。
 *
 * @author xuxueli 2026-11-21
 */
public class MenuVO implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
     * 资源ID
     */
    private int id;

    /**
     * 父节点ID
     */
    private int parentId;

    /**
     * 菜单名称
     */
    private String name;

    /**
     * 类型：0-目录、1-菜单
     */
    private int type;

    /**
     * 菜单地址
     */
    private String url;

    /**
     * 图标标识（由前端按自身图标库解析）
     */
    private String icon;

    /**
     * 顺序
     */
    private int order;

    /**
     * 显示状态：0-显示、1-隐藏
     */
    private int visible;

    /**
     * 子菜单
     */
    private List<MenuVO> children;

    public MenuVO() {
    }

    public MenuVO(Resource resource) {
        this.id = resource.getId();
        this.parentId = resource.getParentId();
        this.name = resource.getName();
        this.type = resource.getType();
        this.url = resource.getUrl();
        this.icon = resource.getIcon();
        this.order = resource.getOrder();
        this.visible = resource.getVisible();
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public int getVisible() {
        return visible;
    }

    public void setVisible(int visible) {
        this.visible = visible;
    }

    public List<MenuVO> getChildren() {
        return children;
    }

    public void setChildren(List<MenuVO> children) {
        this.children = children;
    }

}
