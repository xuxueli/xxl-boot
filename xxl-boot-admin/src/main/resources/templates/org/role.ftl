<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/zTree/css/metroStyle/metroStyle.css">
	<!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">

		<#-- 2-biz start -->

		<#-- 查询区域 -->
		<div class="box" style="margin-bottom:9px;">
			<div class="box-body">
				<div class="row" id="data_filter" >
					<div class="col-xs-3">
						<div class="input-group">
							<span class="input-group-addon">${I18n.role_tips}${I18n.role_name}</span>
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
						<button class="btn btn-sm btn-primary selectOnlyOne allocateResource" type="button">分配资源</button>
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

		<!-- 分配资源.模态框 -->
		<div class="modal fade" id="roleResourceModal" tabindex="-1" role="dialog"  aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" >分配资源</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<div class="col-sm-12">
									<#-- demo tree -->
									<ul id="tree" class="ztree" style="width:260px; "></ul>
								</div>
							</div>

							<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
								<div style="margin-top: 10px;" >
									<button type="button" class="btn btn-primary save"  >${I18n.system_save}</button>
									<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
								</div>
							</div>

						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 新增.模态框 -->
		<div class="modal fade" id="addModal" tabindex="-1" role="dialog"  aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" >${I18n.system_opt_add}${I18n.role_tips}</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.role_tips}${I18n.role_name}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}${I18n.role_name}" maxlength="10" ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.role_tips}${I18n.role_order}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="order" placeholder="${I18n.system_please_input}${I18n.role_name}" maxlength="10" ></div>
							</div>

							<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
								<div style="margin-top: 10px;" >
									<button type="submit" class="btn btn-primary"  >${I18n.system_save}</button>
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
						<h4 class="modal-title" >${I18n.system_opt_edit}${I18n.role_tips}</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.role_tips}${I18n.role_name}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="name" placeholder="${I18n.system_please_input}${I18n.role_name}" maxlength="10" ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.role_tips}${I18n.role_order}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="order" placeholder="${I18n.system_please_input}${I18n.role_name}" maxlength="10" ></div>
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

		<#-- 2-biz end -->

	</section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/plugins/zTree/js/jquery.ztree.core.js"></script>
<script src="${request.contextPath}/static/plugins/zTree/js/jquery.ztree.excheck.js"></script>
<#-- admin table -->
<script src="${request.contextPath}/static/biz/common/admin.table.js"></script>
<script>
$(function() {

	// ---------- ---------- ---------- table + curd  ---------- ---------- ----------

	/**
	 * init table
	 */
	$.adminTable.initTable({
		table: '#data_list',
		url: base_url + "/org/role/pageList",
		queryParams: function (params) {
			var obj = {};
			obj.name = $('#data_filter .name').val();
			obj.offset = params.offset;
			obj.pagesize = params.limit;
			return obj;
		},
		columns: [
			{
				checkbox: true,
				field: 'state',
				width: '5%',
				widthUnit: '%',
				align: 'center',
				valign: 'middle'
			}, {
				title: I18n.role_tips + I18n.role_name,
				field: 'name',
				width: '40',
				widthUnit: '%',
				align: 'left'
			},{
				title: I18n.role_tips + I18n.role_order,
				field: 'order',
				width: '30',
				widthUnit: '%',
				align: 'left'
			}
		]
	});


	/**
	 * init delete
	 */
	$.adminTable.initDelete({
		url: base_url + "/org/role/delete"
	});

	/**
	 * init add
	 */
	$.adminTable.initAdd( {
		url: base_url + "/org/role/insert",
		rules : {
			name : {
				required : true,
				rangelength:[2, 20]
			},
			order : {
				required : true,
				digits : true
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.role_name,
				rangelength: I18n.system_lengh_limit + "[2-10]"
			},
			order : {
				required : I18n.system_please_input + I18n.role_order,
				digits: I18n.role_order_valid
			}
		},
		readFormData: function() {
			// request
			return {
				"name": $("#addModal .form input[name=name]").val(),
				"order": $("#addModal .form input[name=order]").val()
			};
		}
	})

	/**
	 * init update
	 */
	$.adminTable.initUpdate( {
		url: base_url + "/org/role/update",
		writeFormData: function(row) {
			// base data
			$("#updateModal .form input[name='id']").val( row.id );
			$("#updateModal .form input[name='name']").val( row.name );
			$("#updateModal .form input[name='order']").val( row.order );
		},
		rules : {
			name : {
				required : true,
				rangelength:[2, 20]
			},
			order : {
				required : true,
				digits : true
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.role_name,
				rangelength: I18n.system_lengh_limit + "[2-10]"
			},
			order : {
				required : I18n.system_please_input + I18n.role_order,
				digits: I18n.role_order_valid
			}
		},
		readFormData: function() {
			// request
			return {
				"id": $("#updateModal .form input[name=id]").val(),
				"name": $("#updateModal .form input[name=name]").val(),
				"order": $("#updateModal .form input[name=order]").val()
			};
		}
	});

	// ---------- ---------- ---------- allocate resource ---------- ---------- ----------
	var mainDataTable = $.adminTable.table;
	$("#data_operation .allocateResource").click(function(){
		// get select rows
		var rows = mainDataTable.bootstrapTable('getSelections');

		// find select row
		if (rows.length !== 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = rows[0];
		var roleId = row.id;

		// base data
		initTree();

		// 设置 tree 选中
		currentRoleId = roleId;
		$.ajax({
			type : 'POST',
			url : base_url + "/org/role/loadRoleRes",
			data: {
				"roleId":roleId
			},
			dataType : "json",
			async: false,
			success : function(data){
				if (data.code == "200") {
					var checkedIds = data.data;
					if (checkedIds && checkedIds.length >0) {
						checkedIds.forEach(function(nodeId) {
							var nodes = zTreeObj.getNodesByParam("id", nodeId, null);
							if (nodes && nodes.length > 0) {
								var node = nodes[0];
								zTreeObj.checkNode(node, true, false);	// checkTypeFlag: 是否父子节点联动
							}
						});
						//console.log("checked: "+ zTreeObj.getCheckedNodes(true).map(item => item.id));
					}
				} else {
					layer.msg( data.msg || '系统异常' );
				}
			}
		});

		// show
		$('#roleResourceModal').modal({backdrop: false, keyboard: false}).modal('show');
	});

	// ———————————— save
	$("#roleResourceModal .save").click(function(){
		var checkedIds = zTreeObj.getCheckedNodes(true).map(item => item.id);

		$.ajax({
			type : 'POST',
			url : base_url + "/org/role/updateRoleRes",
			data : {
				"roleId":currentRoleId,
				"resourceIds":checkedIds
			},
			dataType : "json",
			success : function(data){
				if (data.code == "200") {
					$('#updateModal').modal('hide');
					layer.msg( '操作成功' );

					// refresh table
					$('#data_filter .searchBtn').click();
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || '操作失败' ),
						icon: '2'
					});
				}

				// hide
				$('#roleResourceModal').modal('hide');
			}
		});

	});

	// ———————————— ztree
	var zTreeObj;
	var currentRoleId;
	function initTree(){
		var setting = {
			check: {
				enable: true,
				chkboxType : {
					"Y" : "ps",	// ps
					"N" : "ps"	// ps
				}
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
			url : base_url + "/org/resource/simpleTreeList",
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

});
</script>
<!-- 3-script end -->

</body>
</html>