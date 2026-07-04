<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "/framework/common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/zTree/css/metroStyle/metroStyle.css">
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/plugins/iCheck/square/blue.css">
	<!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">

		<!-- 2-content start -->

		<#-- 查询区域 -->
		<div class="box" style="margin-bottom:9px;">
			<div class="box-body">
				<div class="row" id="data_filter" >
					<div class="col-xs-3">
						<div class="input-group">
							<span class="input-group-addon">归属组织</span>
							<input type="text" class="form-control orgName" readonly placeholder="${I18n.system_all}" >
							<input type="hidden" class="form-control orgId" name="orgId" value="0" >
							<span class="input-group-btn">
								<button type="button" class="btn btn-default selectOrg" ><i class="fa fa-search"></i></button>
							</span>
						</div>
					</div>
					<div class="col-xs-3">
						<div class="input-group">
							<span class="input-group-addon">${I18n.user_tips}${I18n.system_status}</span>
							<select class="form-control status" >
								<option value="-1" >${I18n.system_all}</option>
								<#list userStatuEnum as item>
									<option value="${item.status}" >${item.desc}</option>
								</#list>
							</select>
						</div>
					</div>
					<div class="col-xs-3">
						<div class="input-group">
							<span class="input-group-addon">${I18n.user_username}</span>
							<input type="text" class="form-control username" autocomplete="on" >
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
						<h4 class="modal-title" >${I18n.system_opt_add}${I18n.user_tips}</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<label class="col-sm-2 control-label">归属组织</label>
								<div class="col-sm-4">
									<div class="input-group">
										<input type="text" class="form-control orgName" name="orgName" readonly placeholder="${I18n.system_please_input}选择组织" >
										<input type="hidden" class="form-control" name="orgId" value="0" >
										<span class="input-group-btn">
											<button type="button" class="btn btn-default selectOrg" ><i class="fa fa-search"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_username}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_password}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.system_please_input}${I18n.user_password}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_real_name}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="realName" placeholder="${I18n.system_please_input}${I18n.user_real_name}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.system_status}</label>
								<div class="col-sm-8">
									<#list userStatuEnum as item>
										<span class="col-sm-4" style="padding-left: 0px;" >
											<input type="radio" name="status" value="${item.status}" > ${item.desc}
										</span>
									</#list>
								</div>
							</div>

							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>分配角色</label>
								<div class="col-sm-8">
									<#if roleList?? && roleList?size gt 0>
									<#list roleList as role>
										<span class="col-sm-4" style="padding-left: 0px;" >
											<input type="checkbox"  name="roleId" value="${role.id}"> ${role.name}
										</span>
									</#list>
									</#if>
								</div>
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
						<h4 class="modal-title" >${I18n.system_opt_edit}${I18n.user_tips}</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<label class="col-sm-2 control-label">归属组织</label>
								<div class="col-sm-4">
									<div class="input-group">
										<input type="text" class="form-control orgName" name="orgName" readonly placeholder="${I18n.system_please_input}选择组织" >
										<input type="hidden" class="form-control" name="orgId" value="0" >
										<span class="input-group-btn">
											<button type="button" class="btn btn-default selectOrg" ><i class="fa fa-search"></i></button>
										</span>
									</div>
								</div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_username}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" readonly ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_password}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.user_password_update_placeholder}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.user_real_name}</label>
								<div class="col-sm-8"><input type="text" class="form-control" name="realName" placeholder="${I18n.system_please_input}${I18n.user_real_name}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>${I18n.system_status}</label>
								<div class="col-sm-8">
									<#list userStatuEnum as item>
										<span class="col-sm-4" style="padding-left: 0px;" >
											<input type="radio" name="status" value="${item.status}" > ${item.desc}
										</span>
									</#list>
								</div>
							</div>

							<div class="form-group">
								<label class="col-sm-2 control-label"><font color="red">*</font>分配角色</label>
								<div class="col-sm-8">
									<#if roleList?? && roleList?size gt 0>
										<#list roleList as role>
											<span class="col-sm-4" style="padding-left: 0px;" >
												<input type="checkbox"  name="roleId" value="${role.id}"> ${role.name}
											</span>
										</#list>
									</#if>
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

		<!-- 弹框.组织树选择 -->
		<div class="modal fade" id="orgTreeModal" tabindex="-1" role="dialog"  aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<h4 class="modal-title" >选择组织</h4>
					</div>
					<div class="modal-body">
						<form class="form-horizontal form" role="form" >
							<div class="form-group">
								<div class="col-sm-12">
									<ul id="orgTree" class="ztree" style="width:260px; overflow:auto;"></ul>
								</div>
							</div>

							<div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
								<div style="margin-top: 10px;" >
									<button type="button" class="btn btn-primary orgTreeChoose"  >${I18n.system_ok}</button>
									<button type="button" class="btn btn-default orgTreeClear"  >清除</button>
									<button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
								</div>
							</div>

						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- 2-content end -->

	</section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/plugins/zTree/js/jquery.ztree.core.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>
<#-- admin table -->
<script src="${request.contextPath}/static/framework/admin.table.js"></script>
<script>
$(function() {

	// org tree data from model
	var orgZNodes = [
		<#list orgTree as org>
		{id: ${org.id}, parentId: ${org.parentId}, name: '${org.name?js_string}', open: true}<#sep>,</#sep>
		</#list>
	];

	// ---------- ---------- ---------- table + curd  ---------- ---------- ----------

	/**
	 * init table
	 */
	$.adminTable.initTable({
		table: '#data_list',
		url: base_url + "/org/user/pageList",
		resetHandler: function () {
			$('#data_filter input[type="text"]').val('');
			$('#data_filter select').each(function() {
				$(this).prop('selectedIndex', 0);
			});
			$('#data_filter input[type="checkbox"]').prop('checked', false);
			$('#data_filter input[type="radio"]').prop('checked', false);
			$('#data_filter .orgId').val(0);
		},
		queryParams: function (params) {
			var obj = {};
			obj.username = $('#data_filter .username').val();
			obj.status = $('#data_filter .status').val();
			obj.orgId = $('#data_filter .orgId').val();
			obj.offset = params.offset;
			obj.pagesize = params.limit;
			return obj;
		},
		columns:[
			{
				checkbox: true,
				field: 'state',
				width: '5',
				widthUnit: '%',
				align: 'center',
				valign: 'middle'
			}, {
				title: I18n.user_username,
				field: 'username',
				width: '20',
				widthUnit: '%',
				align: 'left'
			}, {
				title: '归属组织',
				field: 'orgName',
				width: '20',
				widthUnit: '%',
				align: 'left'
			},{
				title: I18n.user_password,
				field: 'password',
				width: '20',
				widthUnit: '%',
				align: 'left',
				formatter: function(value) {
					return '*********';
				}
			}, {
				title: '真实姓名',
				field: 'realName',
				width: '25',
				widthUnit: '%',
				align: 'left'
			}, {
				title: '启用状态',
				field: 'status',
				width: '20',
				widthUnit: '%',
				align: 'left',
				formatter: function(value) {
					// status text
					var text = "";
					$('#data_filter .status option').each(function(){
						if ( value.toString() === $(this).val() ) {
							text = $(this).text();
						}
					});
					// status label class
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
		url: base_url + "/org/user/delete"
	});

	/**
	 * init add
	 */
	jQuery.validator.addMethod("usernameValid", function(value, element) {
		var length = value.length;
		var valid = /^[a-z][a-z0-9]*$/;
		return this.optional(element) || valid.test(value);
	}, I18n.user_username_valid );
	$.adminTable.initAdd( {
		url: base_url + "/org/user/add",
		rules : {
			username : {
				required : true,
				rangelength:[4, 20],
				usernameValid: true
			},
			password : {
				required : true,
				rangelength:[4, 20]
			},
			realName : {
				required : true,
				rangelength:[2, 20]
			}
		},
		messages : {
			username : {
				required : I18n.system_please_input + I18n.user_username,
				rangelength: I18n.system_lengh_limit + "[4-20]"
			},
			password : {
				required : I18n.system_please_input + I18n.user_password,
				rangelength: I18n.system_lengh_limit + "[4-20]"
			},
			realName : {
				required : I18n.system_please_input + I18n.user_real_name,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			}
		},
		writeFormData: function() {
			// write default data
			$('#addModal .form input[name="roleId"]').prop('checked', false).iCheck('update');
			$('#addModal .form input[name="orgId"]').val(0);
			$('#addModal .form input[name="orgName"]').val('');
			$('#addModal .form input[name="status"][value="0"]').iCheck('check');
		},
		readFormData: function() {
			// get roleids
			var roleIds = $('#addModal .form input[name="roleId"]:checked').map(function() {
				return this.value;
			}).get();

			// request
			return {
				"username": $("#addModal .form input[name=username]").val(),
				"password": $("#addModal .form input[name=password]").val(),
				"status": $("#addModal .form input[name='status']:checked").val(),
				"realName": $("#addModal .form input[name=realName]").val(),
				"orgId": $("#addModal .form input[name=orgId]").val(),
				"roleIds": roleIds
			};
		}
	});

	/**
	 * init update
	 */
	$.adminTable.initUpdate( {
		url: base_url + "/org/user/update",
		writeFormData: function(row) {
			// write origin data
			$("#updateModal .form input[name='id']").val( row.id );
			$("#updateModal .form input[name='username']").val( row.username );
			$("#updateModal .form input[name='password']").val( '' );
			$("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
			$("#updateModal .form input[name='realName']").val( row.realName );
			$("#updateModal .form input[name='orgId']").val( row.orgId );
			$("#updateModal .form input[name='orgName']").val( row.orgName );

			// write roleid
			$('#updateModal .form input[name="roleId"]').prop('checked', false).iCheck('update');
			if (row.roleIds && row.roleIds.length > 0) {
				row.roleIds.forEach(function (item){
					$('#updateModal .form input[name="roleId"][value="'+ item +'"]').prop('checked', true).iCheck('update');
				});
			}
		},
		rules : {
			realName : {
				required : true,
				rangelength:[2, 20]
			}
		},
		messages : {
			realName : {
				required : I18n.system_please_input + I18n.user_real_name,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			}
		},
		readFormData: function() {
			// get roleids
			var roleIds = $('#updateModal .form input[name="roleId"]:checked').map(function() {
				return this.value;
			}).get();

			// request
			return {
				"id": $("#updateModal .form input[name=id]").val(),
				"username": $("#updateModal .form input[name=username]").val(),
				"password": $("#updateModal .form input[name=password]").val(),
				"status": $("#updateModal .form input[name='status']:checked").val(),
				"realName": $("#updateModal .form input[name=realName]").val(),
				"orgId": $("#updateModal .form input[name=orgId]").val(),
				"roleIds": roleIds
			};
		}
	});

	// ---------- ---------- ---------- iCheck ---------- ---------- ----------

	// input iCheck
	$('#updateModal, #addModal').find('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-blue',
	});

	// ---------- ---------- ---------- org tree ---------- ---------- ----------

	var orgSelectSource = 'filter';		// current source of org select, 'filter' | 'addModal' | 'updateModal'
	var orgZTreeObj;					// zTree object

	/**
	 * open org tree modal
	 */
	$(document).on('click', '.selectOrg, .orgName', function(){
		var $el = $(this);
		var $modal = $el.closest('.modal');
		openOrgTree($modal.length > 0 ? $modal.attr('id') : 'filter');
	});

	/** init tree and open modal */
	function openOrgTree(source) {
		orgSelectSource = source;
		var setting = {
			view: { dblClickExpand: false, showLine: true, selectedMulti: false },
			data: { simpleData: { enable: true, idKey: "id", pIdKey: "parentId", rootPId: "0" } }
		};
		orgZTreeObj = $.fn.zTree.init($("#orgTree"), setting, orgZNodes);
		orgZTreeObj.expandAll(true);
		$('#orgTreeModal').modal({backdrop: false, keyboard: false}).modal('show');
	}

	/**
	 * clear choose org data
	 */
	$('#orgTreeModal .orgTreeClear').click(function(){
		setOrgData('', 0);
		$('#orgTreeModal').modal('hide');
	});

	/**
	 * choose org
	 */
	$('#orgTreeModal .orgTreeChoose').click(function(){
		if (!orgZTreeObj || orgZTreeObj.getSelectedNodes().length < 1) {
			layer.msg( I18n.system_please_choose + '组织' );
			return;
		}
		var selNode = orgZTreeObj.getSelectedNodes()[0];
		setOrgData(selNode.name, selNode.id);
		$('#orgTreeModal').modal('hide');
	});

	/** fill org data by current source */
	function setOrgData(orgName, orgId) {
		var selector = orgSelectSource === 'addModal'
				? '#addModal'
				: orgSelectSource === 'updateModal'
						? '#updateModal'
						: '#data_filter';
		$(selector).find('.orgName').val(orgName);
		$(selector).find('[name="orgId"]').val(orgId);
	}

});

</script>
<!-- 3-script end -->

</body>
</html>