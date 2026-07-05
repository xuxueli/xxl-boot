package com.xxl.boot.api.framework.util.codegen;

import com.xxl.boot.api.framework.util.codegen.FieldInfo;

import java.util.List;

/**
 * class info
 *
 * @author xuxueli 2018-05-02 20:02:34
 */
public class ClassInfo {

	/**
	 * table name, 'user_info'
	 */
    private String tableName;

	/**
	 * class name, 'userInfo'
	 */
    private String className;

	/**
	 * class comment, "user info table"
	 */
	private String classComment;

	/**
	 * author for java class comment
	 */
	private String author;

	/**
	 * package name for java class
	 */
	private String packageName;

	/**
	 * business name, override className
	 */
	private String businessName;

	private List<FieldInfo> fieldList;

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