package com.xxl.boot.admin.framework.util.codegen;

import java.util.List;

/**
 * 代码生成-类信息，封装解析建表 SQL 后得到的 Java 类元数据
 *
 * @author xuxueli 2018-05-02
 */
public class ClassInfo {

    private String tableName;          /* 数据库表名，如 user_info */
    private String className;           /* 类名，如 UserInfo */
    private String classComment;        /* 类注释，如表注释 */
    private String author;              /* 代码作者 */
    private String packageName;         /* 包名 */
    private String businessName;        /* 业务名，可覆盖 className */
    private List<FieldInfo> fieldList;  /* 字段列表 */

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public String getClassName() {
		return className;
	}

	public void setClassName(String className) {
		this.className = className;
	}

	public String getClassComment() {
		return classComment;
	}

	public void setClassComment(String classComment) {
		this.classComment = classComment;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public String getPackageName() {
		return packageName;
	}

	public void setPackageName(String packageName) {
		this.packageName = packageName;
	}

	public String getBusinessName() {
		return businessName;
	}

	public void setBusinessName(String businessName) {
		this.businessName = businessName;
	}

	public List<FieldInfo> getFieldList() {
		return fieldList;
	}

	public void setFieldList(List<FieldInfo> fieldList) {
		this.fieldList = fieldList;
	}

}