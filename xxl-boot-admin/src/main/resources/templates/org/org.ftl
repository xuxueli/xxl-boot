<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/jquery-treegrid/jquery.treegrid.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/zTree/css/metroStyle/metroStyle.css">
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
									<label class="col-sm-2 control-label">父组织<font color="red">*</font></label>
									<div class="col-sm-4">
										<input type="text" class="form-control"  name="parentName" readonly value="根组织" >
										<input type="hidden" class="form-control" name="parentId" value="0" >
									</div>
									<div class="col-sm-4">
										<button type="button" class="btn btn-sm btn-default selectParent" >请选择</button>
									</div>
								</div>
								<div class="form-group">
									<label class="col-sm-2 control-label">组织名称<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}资源名称" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">展示顺序<font color="red">*</font></label>
									<div class="col-sm-4"><input type="number" class="form-control" name="order" placeholder="${I18n.system_please_input}展示顺序" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">生效状态<font color="red">*</font></label>
									<div class="col-sm-4">
										<select class="form-control" name="status" >
											<#list orgStatuEnum as item>
												<option value="${item.value}" >${item.desc}</option>
											</#list>
										</select>
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
									<label  class="col-sm-2 control-label">父组织<font color="red">*</font></label>
									<div class="col-sm-4">
										<input type="text" class="form-control"  name="parentName" readonly value="根组织" >
										<input type="hidden" class="form-control" name="parentId" value="0" >
									</div>
									<div class="col-sm-4">
										<button type="button" class="btn btn-sm btn-default selectParent" >请选择</button>
									</div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">组织名称<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}资源名称" maxlength="50" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">展示顺序<font color="red">*</font></label>
									<div class="col-sm-4"><input type="number" class="form-control" name="order" placeholder="${I18n.system_please_input}展示顺序" ></div>
								</div>
								<div class="form-group">
									<label  class="col-sm-2 control-label">生效状态<font color="red">*</font></label>
									<div class="col-sm-4">
										<select class="form-control" name="status" >
											<#list orgStatuEnum as item>
												<option value="${item.value}" >${item.desc}</option>
											</#list>
										</select>
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
<script>
$(function() {

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	var mainDataTable = $("#data_list").bootstrapTable({
		url: base_url + "/org/org/treeList",
		method: "post",
		contentType: "application/x-www-form-urlencoded",
		queryParams: function (params) {
			var obj = {};
			obj.name = $('#data_filter .name').val();
			obj.status = $('#data_filter .status').val();
			obj.start = params.offset;
			obj.length = params.limit;
			return obj;
		},
		responseHandler: function(result) {
			if (result.code !== 200) {
				layer.open({
					icon: '2',
					content: result.msg
				});
				return ;
			}
			return result.data;
		},
		treeEnable:true,
		idField: 'id',					// 树形id
		parentIdField: 'parentId',		// 父级字段
		treeShowField: 'name',			// 树形字段
		onPostBody: function(data) {
			$("#data_list").treegrid({
				treeColumn: 1,												// 选择第几列作为树形字段
				initialState: 'expanded',									// 默认展开；expanded、collapsed
				expanderExpandedClass: 'fa fa-fw  fa-minus-square-o',		// 树形展开图标
				expanderCollapsedClass: 'fa fa-fw  fa-plus-square-o',		// 树形折叠图标
				onChange () {
					$("#data_list").bootstrapTable('resetView')				// 树形表格重绘
				}
			})
		},
		columns: [
			{
				checkbox: true,
				field: 'state',
				width: '5%'
			},{
				title: I18n.resource_name,
				field: 'name',
				width: '25%',
				formatter: function(value, row, index) {
					var iconAndName = '&nbsp;&nbsp;<i class="fa _icon_"></i> ' + row.name;
					var icon = row.icon?row.icon:'';		// fa-circle-o

					return iconAndName.replace("_icon_", icon);
				}
			},{
				title: I18n.resource_order,
				field: 'order',
				width: '10%'
			},{
				title: I18n.resource_status,
				field: 'status',
				width: '10%',
				formatter: function(value, row, index) {
					var result = "";
					$('#addModal select[name="status"] option').each(function(){
						if ( value.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			}
		],
		clickToSelect: true, 			// 是否启用点击选中行
		sortable: false, 				// 是否启用排序
		showRefresh: true,				// 显示刷新按钮
		showColumns: true,				// 显示/隐藏列
		minimumCountColumns: 2,			// 最少允许的列数
		onAll: function(name, args) {
			// filter
			if (!(['check.bs.table', "uncheck.bs.table", "check-all.bs.table", "uncheck-all.bs.table"].indexOf(name) > -1)) {
				return false;
			}
			var rows = mainDataTable.bootstrapTable('getSelections');
			var selectLen = rows.length;

			if (selectLen > 0) {
				$("#data_operation .selectAny").removeClass('disabled');
			} else {
				$("#data_operation .selectAny").addClass('disabled');
			}
			if (selectLen === 1) {
				$("#data_operation .selectOnlyOne").removeClass('disabled');
			} else {
				$("#data_operation .selectOnlyOne").addClass('disabled');
			}
		}
	});
	document.querySelector('.fixed-table-toolbar').classList.remove('fixed-table-toolbar');

	// search btn
	$('#data_filter .searchBtn').on('click', function(){
		mainDataTable.bootstrapTable('refresh');
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

	// ---------- ---------- ---------- delete operation ---------- ---------- ----------
	// delete
	$("#data_operation").on('click', '.delete',function() {
		// get select rows
		var rows = mainDataTable.bootstrapTable('getSelections');

		// find select ids
		const selectIds = (rows && rows.length > 0) ? rows.map(row => row.id) : [];
		if (selectIds.length <= 0) {
			layer.msg(I18n.system_please_choose + I18n.system_data);
			return;
		}

		// do delete
		layer.confirm( I18n.system_ok + I18n.system_opt_del + '?', {
			icon: 3,
			title: I18n.system_tips ,
			btn: [ I18n.system_ok, I18n.system_cancel ]
		}, function(index){
			layer.close(index);

			$.ajax({
				type : 'POST',
				url : base_url + "/org/org/delete",
				data : {
					"ids" : selectIds
				},
				dataType : "json",
				success : function(data){
					if (data.code == 200) {
						layer.msg( I18n.system_opt_del + I18n.system_success );
						// refresh table
						$('#data_filter .searchBtn').click();
					} else {
						layer.msg( data.msg || I18n.system_opt_del + I18n.system_fail );
					}
				},
				error: function(xhr, status, error) {
					layer.open({
						icon: '2',
						content: (I18n.system_opt_del + I18n.system_fail)
					});
				}
			});
		});
	});

	// ---------- ---------- ---------- ztree ---------- ---------- ----------
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
		/*var zNodes = [
			{id: 1, pId: 0, name: "资源A", open: true},
			{id: 5, pId: 1, name: "资源A1"},
			{id: 2, pId: 0, name: "资源B", open: false},
			{id: 11, pId: 2, name: "资源B2"}
		];*/

		// post
		$.ajax({
			type : 'POST',
			url : base_url + "/org/org/simpleTreeList",
			dataType : "json",
			async: false,
			success : function(data){
				if (data.code == "200") {
					var zNodes = data.data;

					zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes); //初始化树
					zTreeObj.expandAll(true);    //true 节点全部展开、false节点收缩

				} else {
					layer.msg( data.msg || '系统异常' );
				}
			}
		});
	}

	// open
	$(".selectParent").click(function(){
		$('#treeModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	// choose
	$('#treeModal .choose').click(function(){

		// valid choose
		if (zTreeObj.getSelectedNodes().length < 1) {
			layer.msg( I18n.system_please_choose + I18n.resource_parent );
			return;
		}

		// fill choose data, todo-
		$("#addModal .form input[name=parentId]").val( zTreeObj.getSelectedNodes()[0].id );
		$("#addModal .form input[name=parentName]").val( zTreeObj.getSelectedNodes()[0].name );

		$("#updateModal .form input[name=parentId]").val( zTreeObj.getSelectedNodes()[0].id );
		$("#updateModal .form input[name=parentName]").val( zTreeObj.getSelectedNodes()[0].name );

		$('#treeModal').modal('hide');
	});

	// ---------- ---------- ---------- add operation ---------- ---------- ----------
	// add modal
	$("#data_operation .add").click(function(){

		// todo，reset not work
		initTree();
		$("#addModal .form input[name=parentId]").val( 0 );

		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
		rules : {
			name : {
				required : true,
				rangelength:[2, 50]
			},
			permission : {
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
			permission : {
				required : I18n.system_please_input + I18n.resource_permission,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
			}
		},
		highlight : function(element) {
			$(element).closest('.form-group').addClass('has-error');
		},
		success : function(label) {
			label.closest('.form-group').removeClass('has-error');
			label.remove();
		},
		errorPlacement : function(error, element) {
			element.parent('div').append(error);
		},
		submitHandler : function(form) {

			// request
			var paramData = {
				"parentId": $("#addModal .form input[name=parentId]").val(),
				"name": $("#addModal .form input[name=name]").val(),
				"order": $("#addModal .form input[name=order]").val(),
				"status": $("#addModal .form select[name=status]").val()
			};

			// post
			$.post(base_url + "/org/org/insert", paramData, function(data, status) {
				if (data.code == "200") {
					$('#addModal').modal('hide');
					layer.msg( I18n.system_opt_add + I18n.system_success );

					// refresh table
					$('#data_filter .searchBtn').click();
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_opt_add + I18n.system_fail ),
						icon: '2'
					});
				}
			});
		}
	});
	$("#addModal").on('hide.bs.modal', function () {
		// reset
		$("#addModal .form")[0].reset();
		$("#addModal .form .form-group").removeClass("has-error");
		// reset
		addModalValidate.resetForm();
	});

	// ---------- ---------- ---------- update operation ---------- ---------- ----------
	$("#data_operation .update").click(function(){
		// get select rows
		var rows = mainDataTable.bootstrapTable('getSelections');

		// find select row
		if (rows.length !== 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = rows[0];

		// base data
		$("#updateModal .form input[name=id]").val( row.id );
		$("#updateModal .form input[name=parentId]").val( row.parentId );
		$("#updateModal .form input[name=name]").val( row.name );
		$("#updateModal .form input[name=order]").val( row.order );
		$("#updateModal .form select[name=status]").val( row.status );

		// 设置 tree 选中
		initTree();
		if (row.id > 0) {
			var chooseNode = zTreeObj.getNodeByParam("id", row.parentId, null);
			if (chooseNode) {
				zTreeObj.selectNode(chooseNode);
				$("#updateModal .form input[name=parentName]").val( chooseNode.name );
			}

		}

		// show
		$('#updateModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var updateModalValidate = $("#updateModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
		highlight : function(element) {
			$(element).closest('.form-group').addClass('has-error');
		},
		success : function(label) {
			label.closest('.form-group').removeClass('has-error');
			label.remove();
		},
		errorPlacement : function(error, element) {
			element.parent('div').append(error);
		},
		rules : {
			name : {
				required : true,
				rangelength:[2, 50]
			},
			permission : {
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
			permission : {
				required : I18n.system_please_input + I18n.user_real_name,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
			}
		},
		submitHandler : function(form) {

			// request
			var paramData = {
				"id": $("#updateModal .form input[name=id]").val(),
				"parentId": $("#updateModal .form input[name=parentId]").val(),
				"name": $("#updateModal .form input[name=name]").val(),
				"type": $("#updateModal .form select[name=type]").val(),
				"permission": $("#updateModal .form input[name=permission]").val(),
				"url": $("#updateModal .form input[name=url]").val(),
				"icon": $("#updateModal .form input[name=icon]").val(),
				"order": $("#updateModal .form input[name=order]").val(),
				"status": $("#updateModal .form select[name=status]").val()
			};

			$.post(base_url + "/org/org/update", paramData, function(data, status) {
				if (data.code == "200") {
					$('#updateModal').modal('hide');
					layer.msg( I18n.system_opt_edit + I18n.system_success );

					// refresh table
					$('#data_filter .searchBtn').click();
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_opt_edit + I18n.system_fail ),
						icon: '2'
					});
				}
			});
		}
	});
	$("#updateModal").on('hide.bs.modal', function () {
		// reset
		$("#updateModal .form")[0].reset();
		$("#updateModal .form .form-group").removeClass("has-error");
		// reset
		updateModalValidate.resetForm();
	});

});

</script>
<!-- 3-script end -->

</body>
</html>