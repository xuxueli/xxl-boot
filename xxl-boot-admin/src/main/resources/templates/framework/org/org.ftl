<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "/framework/common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/jquery-treegrid/jquery.treegrid.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/zTree/css/metroStyle/metroStyle.css">
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/plugins/iCheck/square/blue.css">
	<!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">

			<#-- biz start（4/5 content） -->

			<#-- 查询区域 -->
			<div class="box" style="margin-bottom:9px;">
				<div class="box-body">
					<div class="row" id="data_filter" >
						<div class="col-xs-3">
							<div class="input-group">
								<span class="input-group-addon">组织状态</span>
								<select class="form-control status" >
									<option value="-1" >${I18n.system_all}</option>
									<#list orgStatuEnum as item>
										<option value="${item.value}" >${item.desc}</option>
									</#list>
								</select>
							</div>
						</div>
						<div class="col-xs-3">
							<div class="input-group">
								<span class="input-group-addon">组织名称</span>
								<input type="text" class="form-control name" autocomplete="on" >
							</div>
						</div>
						<div class="col-xs-1">
							<button class="btn btn-block btn-primary searchBtn" >${I18n.system_search}</button>
						</div>
						<div class="col-xs-1">
							<button class="btn btn-block btn-default resetBtn" >${I18n.system_reset}</button>
						</div>
					</div>
				</div>
			</div>

			<#-- 数据表格区域 -->
			<div class="row">
				<div class="col-xs-12">
					<div class="box">
						<div class="box-header pull-left" id="data_operation" >
							<button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}</button>
							<button class="btn btn-sm btn-warning selectOnlyOne update" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
							<button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
							<button class="btn btn-sm btn-primary expandAndCollapse" type="button"><i class="fa fa-chevron-down"></i>展开/折叠</button>
						</div>
						<div class="box-body" >
							<table id="data_list" class="table table-bordered table-striped" width="100%" >
								<thead></thead>
								<tbody></tbody>
								<tfoot></tfoot>
							</table>
						</div>
					</div>
				</div>
			</div>

			<!-- 新增.模态框 -->
			<div class="modal fade" id="addModal" tabindex="-1" role="dialog"  aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title" >新增组织</h4>
						</div>
						<div class="modal-body">
							<form class="form-horizontal form" role="form" >
								<div class="form-group">
									<label class="col-sm-2 control-label"><font color="red">*</font>父组织</label>
									<div class="col-sm-8">
										<div class="input-group">
											<input type="text" class="form-control parentName" name="parentName" readonly value="根组织" >
											<input type="hidden" class="form-control" name="parentId" value="0" >
											<span class="input-group-btn">
												<button type="button" class="btn btn-default selectParent" ><i class="fa fa-search"></i></button>
											</span>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label"><font color="red">*</font>组织名称</label>
									<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}资源名称" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label"><font color="red">*</font>展示顺序</label>
									<div class="col-sm-8"><input type="number" class="form-control" name="order" placeholder="${I18n.system_please_input}展示顺序" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">负责人</label>
									<div class="col-sm-8"><input type="text" class="form-control" name="manager" placeholder="${I18n.system_please_input}负责人" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label"><font color="red">*</font>生效状态</label>
									<div class="col-sm-8">
										<#list orgStatuEnum as item>
											<label class="radio-inline">
												<input type="radio" name="status" value="${item.value}" > ${item.desc}
											</label>
										</#list>
									</div>
								</div>

								<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
									<div style="margin-top: 10px;" >
										<button type="submit" class="btn btn-primary" >${I18n.system_save}</button>
										<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
									</div>
								</div>

							</form>
						</div>
					</div>
				</div>
			</div>

			<!-- 更新.模态框 -->
			<div class="modal fade" id="updateModal" tabindex="-1" role="dialog"  aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title" >${I18n.system_opt_edit}${I18n.resource_tips}</h4>
						</div>
						<div class="modal-body">
							<form class="form-horizontal form" role="form" >
								<div class="form-group">
									<label class="col-sm-2 control-label"><font color="red">*</font>父组织</label>
									<div class="col-sm-8">
										<div class="input-group">
											<input type="text" class="form-control parentName" name="parentName" readonly value="根组织" >
											<input type="hidden" class="form-control" name="parentId" value="0" >
											<span class="input-group-btn">
												<button type="button" class="btn btn-default selectParent" ><i class="fa fa-search"></i></button>
											</span>
										</div>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label"><font color="red">*</font>组织名称</label>
									<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}资源名称" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label"><font color="red">*</font>展示顺序</label>
									<div class="col-sm-8"><input type="number" class="form-control" name="order" placeholder="${I18n.system_please_input}展示顺序" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">负责人</label>
									<div class="col-sm-8"><input type="text" class="form-control" name="manager" placeholder="${I18n.system_please_input}负责人" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label"><font color="red">*</font>生效状态</label>
									<div class="col-sm-8">
										<#list orgStatuEnum as item>
											<label class="radio-inline">
												<input type="radio" name="status" value="${item.value}" > ${item.desc}
											</label>
										</#list>
									</div>
								</div>

								<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
									<div style="margin-top: 10px;" >
										<button type="submit" class="btn btn-primary"  >${I18n.system_save}</button>
										<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
										<input type="hidden" name="id" >
									</div>
								</div>

							</form>
						</div>
					</div>
				</div>
			</div>

			<!-- 弹框.菜单树选择 -->
			<div class="modal fade" id="treeModal" tabindex="-1" role="dialog"  aria-hidden="true">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<h4 class="modal-title" >父资源选择</h4>
						</div>
						<div class="modal-body">
							<form class="form-horizontal form" role="form" >
								<div class="form-group">
									<div class="col-sm-12">
										<#-- demo tree -->
										<ul id="tree" class="ztree" style="width:260px; overflow:auto;"></ul>
									</div>
								</div>

								<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
									<div style="margin-top: 10px;" >
										<button type="button" class="btn btn-primary choose"  >${I18n.system_ok}</button>
										<button type="button" class="btn btn-default treeClear"  >清除</button>
										<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
									</div>
								</div>

							</form>
						</div>
					</div>
				</div>
			</div>

			<#-- biz end（4/5 content） -->

	</section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/extensions/treegrid/bootstrap-table-treegrid.min.js"></script>
<script src="${request.contextPath}/static/plugins/jquery-treegrid/jquery.treegrid.min.js"></script>
<script src="${request.contextPath}/static/plugins/zTree/js/jquery.ztree.core.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>
<#-- admin table -->
<script src="${request.contextPath}/static/framework/admin.table.js"></script>
<script>
$(function() {

	// iCheck
	$('#updateModal, #addModal').find('input').iCheck({
		radioClass: 'iradio_square-blue',
	});

	// ---------- ---------- ---------- table + curd  ---------- ---------- ----------
	// status map for table formatter
	var statusMap = {};
	<#list orgStatuEnum as item>
	statusMap['${item.value}'] = '${item.desc}';
	</#list>

	/**
	 * init table
	 */
	$.adminTable.initTreeTable({
		table: '#data_list',
		url: base_url + "/org/org/treeList",
		queryParams: function (params) {
			var obj = {};
			obj.name = $('#data_filter .name').val();
			obj.status = $('#data_filter .status').val();
			obj.offset = params.offset;
			obj.pagesize = params.limit;
			return obj;
		},
		columns: [
			{
				checkbox: true,
				field: 'state',
				width: '5',
				widthUnit: '%'
			},{
				title: I18n.resource_name,
				field: 'name',
				width: '40',
				widthUnit: '%',
				formatter: function(value, row, index) {
					var iconAndName = '&nbsp;&nbsp;<i class="fa _icon_"></i> ' + row.name;
					var icon = row.icon?row.icon:'';		// fa-circle-o

					return iconAndName.replace("_icon_", icon);
				}
			},{
				title: I18n.system_order,
				field: 'order',
				width: '15',
				widthUnit: '%'
			},{
				title: I18n.system_status,
				field: 'status',
				width: '15',
				widthUnit: '%',
				formatter: function(value) {
					var text = statusMap[value] || value;
					var labelClass = value === 0 ? 'label-success' : 'label-warning';
					return '<span class="label ' + labelClass + '">' + text + '</span>';
				}
			}
		]
	});

	/**
	 * init delete
	 */
	$.adminTable.initDelete({
		url: base_url + "/org/org/delete"
	});

	/**
	 * init add
	 */
	$.adminTable.initAdd( {
		url: base_url + "/org/org/insert",
		rules : {
			name : {
				required : true,
				rangelength:[2, 50]
			},
			order : {
				required : true,
				range:[1, 99999999]
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.resource_name,
				rangelength: I18n.system_lengh_limit + "[2-50]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
			}
		},
		writeFormData:function (){
			// reset origin parent
			initTree();
			$("#addModal .form input[name=parentId]").val( 0 );
			//$("#addModal .form input[name='status']").iCheck('uncheck');
			$("#addModal .form input[name='status'][value='0']").iCheck('check');
		},
		readFormData: function() {
			// request
			return {
				"parentId": $("#addModal .form input[name=parentId]").val(),
				"name": $("#addModal .form input[name=name]").val(),
				"order": $("#addModal .form input[name=order]").val(),
				"manager": $("#addModal .form input[name=manager]").val(),
				"status": $("#addModal .form input[name='status']:checked").val()
			};
		}
	});


	/**
	 * init update
	 */
	$.adminTable.initUpdate( {
		url: base_url + "/org/org/update",
		writeFormData: function(row) {
			// base data
			$("#updateModal .form input[name=id]").val( row.id );
			$("#updateModal .form input[name=parentId]").val( row.parentId );
			$("#updateModal .form input[name=name]").val( row.name );
			$("#updateModal .form input[name=order]").val( row.order );
			$("#updateModal .form input[name=manager]").val( row.manager );
			//$("#updateModal .form input[name='status']").iCheck('uncheck');
			$("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');

			// 设置 tree 选中
			initTree();
			if (row.id > 0) {
				var chooseNode = zTreeObj.getNodeByParam("id", row.parentId, null);
				if (chooseNode) {
					zTreeObj.selectNode(chooseNode);
					$("#updateModal .form input[name=parentName]").val( chooseNode.name );
				}

			}
		},
		rules : {
			name : {
				required : true,
				rangelength:[2, 50]
			},
			order : {
				required : true,
				range:[1, 99999999]
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.user_password,
				rangelength: I18n.system_lengh_limit + "[2-50]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
			}
		},
		readFormData: function() {
			// request
			return {
				"id": $("#updateModal .form input[name=id]").val(),
				"parentId": $("#updateModal .form input[name=parentId]").val(),
				"name": $("#updateModal .form input[name=name]").val(),
				"order": $("#updateModal .form input[name=order]").val(),
				"manager": $("#updateModal .form input[name=manager]").val(),
				"status": $("#updateModal .form input[name='status']:checked").val()
			};
		}
	});


	// ---------- ---------- ---------- tree operation ---------- ---------- ----------
	var expandOrCollapse_val = 0;
	$("#data_operation").on('click', '.expandAndCollapse',function() {
		if ((expandOrCollapse_val++)%2 === 0) {
			$("#data_list").treegrid('collapseAll');
		} else {
			$("#data_list").treegrid('expandAll');
		}
	});


	// ---------- ---------- ---------- parent resource choose ---------- ---------- ----------

	/**
	 * open parent tree modal
	 */
	$(document).on('click', '.selectParent, .parentName', function(){
		openParentTree();
	});

	/** init tree and open modal */
	function openParentTree() {
		initTree();
		$('#treeModal').modal({backdrop: false, keyboard: false}).modal('show');
	}

	/** set parent data for both modals */
	function setParentData(id, name) {
		$("#addModal .form input[name=parentId]").val(id);
		$("#addModal .form input[name=parentName]").val(name);
		$("#updateModal .form input[name=parentId]").val(id);
		$("#updateModal .form input[name=parentName]").val(name);
	}

	$('#treeModal .treeClear').click(function(){
		setParentData(0, '根组织');
		$('#treeModal').modal('hide');
	});

	$('#treeModal .choose').click(function(){
		if (zTreeObj.getSelectedNodes().length < 1) {
			layer.msg( I18n.system_please_choose + I18n.resource_parent );
			return;
		}
		var selNode = zTreeObj.getSelectedNodes()[0];
		setParentData(selNode.id, selNode.name);
		$('#treeModal').modal('hide');
	});

	/**
	 * parent resource tree
	 */
	var zTreeObj;
	function initTree(){
		var setting = {
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "parentId",
					rootPId: "0"
				}
			}
		};

		// post
		$.ajax({
			type : 'POST',
			url : base_url + "/org/org/treeList",
			dataType : "json",
			async: false,
			success : function(data){
				if (data.code === 200) {
					var zNodes = data.data;

					zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes); //初始化树
					zTreeObj.expandAll(true);    //true 节点全部展开、false节点收缩

				} else {
					layer.msg( data.msg || '系统异常' );
				}
			}
		});
	}

});

</script>
<!-- 3-script end -->

</body>
</html>