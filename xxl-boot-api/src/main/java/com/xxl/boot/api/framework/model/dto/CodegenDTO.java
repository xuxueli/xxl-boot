package com.xxl.boot.api.framework.model.dto;

import java.io.Serializable;

/**
 * 代码生成 - 业务表 DTO
 */
public class CodegenDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;                private String tableName;
    private String tableComment;    private String className;
    private String tplCategory;     private String tplWebType;
    private String packageName;     private String moduleName;
    private String businessName;    private String functionName;
    private String functionAuthor;  private int formColNum;
    private String genType;         private String genPath;
    private String options;         private String addTime;
    private String updateTime;      private String remark;

    public long getId() { return id; } public void setId(long id) { this.id = id; }
    public String getTableName() { return tableName; } public void setTableName(String v) { this.tableName = v; }
    public String getTableComment() { return tableComment; } public void setTableComment(String v) { this.tableComment = v; }
    public String getClassName() { return className; } public void setClassName(String v) { this.className = v; }
    public String getTplCategory() { return tplCategory; } public void setTplCategory(String v) { this.tplCategory = v; }
    public String getTplWebType() { return tplWebType; } public void setTplWebType(String v) { this.tplWebType = v; }
    public String getPackageName() { return packageName; } public void setPackageName(String v) { this.packageName = v; }
    public String getModuleName() { return moduleName; } public void setModuleName(String v) { this.moduleName = v; }
    public String getBusinessName() { return businessName; } public void setBusinessName(String v) { this.businessName = v; }
    public String getFunctionName() { return functionName; } public void setFunctionName(String v) { this.functionName = v; }
    public String getFunctionAuthor() { return functionAuthor; } public void setFunctionAuthor(String v) { this.functionAuthor = v; }
    public int getFormColNum() { return formColNum; } public void setFormColNum(int v) { this.formColNum = v; }
    public String getGenType() { return genType; } public void setGenType(String v) { this.genType = v; }
    public String getGenPath() { return genPath; } public void setGenPath(String v) { this.genPath = v; }
    public String getOptions() { return options; } public void setOptions(String v) { this.options = v; }
    public String getAddTime() { return addTime; } public void setAddTime(String v) { this.addTime = v; }
    public String getUpdateTime() { return updateTime; } public void setUpdateTime(String v) { this.updateTime = v; }
    public String getRemark() { return remark; } public void setRemark(String v) { this.remark = v; }
}
