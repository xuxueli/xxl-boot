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

	public List<FieldInfo> getFieldList() {
		return fieldList;
	}

	public void setFieldList(List<FieldInfo> fieldList) {
		this.fieldList = fieldList;
	}

}