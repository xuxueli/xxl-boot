<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/plugins/iCheck/square/blue.css">
	<!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">

		<!-- 3-script start -->

		<#-- 查询区域 -->
		<div class="box" style="margin-bottom:9px;">
			<div class="box-body">
				<div class="row" id="data_filter" >
					<div class="col-xs-3">
						<div class="input-group">
							<span class="input-group-addon">${I18n.user_tips}${I18n.user_staus}</span>
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
				</div>
			</div>
		</div>

		<#-- 数据表格区域 -->
		<div class="row">
			<div class="col-xs-12">
				<div class="box">
					<div class="box-header" style="float: right" id="data_operation" >
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
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_username}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_password}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.system_please_input}${I18n.user_password}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_staus}<font color="red">*</font></label>
								<div class="col-sm-4">
									<select class="form-control" name="status" >
										<#list userStatuEnum as item>
											<option value="${item.status}" >${item.desc}</option>
										</#list>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_real_name}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="realName" placeholder="${I18n.system_please_input}${I18n.user_real_name}" maxlength="20" ></div>
							</div>

							<br>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">用户角色<font color="red">*</font></label>
								<div class="col-sm-8">
									<#if roleList?? && roleList?size gt 0>
									<#list roleList as role>
										<span class="col-sm-4" style="padding-left: 0px;" ><input type="checkbox"  name="roleId" value="${role.id}"> ${role.name}</span>
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
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_username}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" readonly ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_password}<font color="black">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.user_password_update_placeholder}" maxlength="20" ></div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_tips}${I18n.user_staus}<font color="red">*</font></label>
								<div class="col-sm-4">
									<select class="form-control" name="status" >
										<#list userStatuEnum as item>
											<option value="${item.status}" >${item.desc}</option>
										</#list>
									</select>
								</div>
							</div>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">${I18n.user_real_name}<font color="red">*</font></label>
								<div class="col-sm-8"><input type="text" class="form-control" name="realName" placeholder="${I18n.system_please_input}${I18n.user_real_name}" maxlength="20" ></div>
							</div>

							<br>
							<div class="form-group">
								<label for="lastname" class="col-sm-2 control-label">用户角色<font color="red">*</font></label>
								<div class="col-sm-8">
									<#if roleList?? && roleList?size gt 0>
										<#list roleList as role>
											<span class="col-sm-4" style="padding-left: 0px;" ><input type="checkbox"  name="roleId" value="${role.id}"> ${role.name}</span>
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

		<!-- 3-script end -->

	</section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>

<script src="${request.contextPath}/static/biz/common/datatables.select.js"></script>
<script>
$(function() {

	// input iCheck
	$('input').iCheck({
		checkboxClass: 'icheckbox_square-blue',
		radioClass: 'iradio_square-blue',
	});

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	// init date tables
	$.dataTableSelect.init();
	var mainDataTable = $("#data_list").dataTable({
		"deferRender": true,
		"processing" : true,
		"serverSide": true,
		"ajax": {
			url: base_url + "/org/user/pageList",
			type:"post",
			// request data
			data : function ( d ) {
				var obj = {};
				obj.username = $('#data_filter .username').val();
				obj.status = $('#data_filter .status').val();
				obj.start = d.start;
				obj.length = d.length;
				return obj;
			},
			// response data filter
			dataFilter: function (originData) {
				var originJson = $.parseJSON(originData);
				return JSON.stringify({
					recordsTotal: originJson.data.totalCount,
					recordsFiltered: originJson.data.totalCount,
					data: originJson.data.pageData
				});
			}
		},
		"searching": false,
		"ordering": false,
		//"scrollX": true,																		// scroll x，close self-adaption
		//"dom": '<"top" t><"bottom" <"col-sm-3" i><"col-sm-3 right" l><"col-sm-6" p> >',		// dataTable "DOM layout"：https://datatables.club/example/diy.html
		"drawCallback": function( settings ) {
			$.dataTableSelect.selectStatusInit();
		},
		"columns": [
			{
				"title": '<input align="center" type="checkbox" id="checkAll" >',
				"data": 'id',
				"visible" : true,
				"width":'5%',
				"render": function ( data, type, row ) {
					tableData['key'+row.id] = row;
					return '<input align="center" type="checkbox" class="checkItem" data-id="'+ row.id +'"  >';
				}
			},
			{
				"title": I18n.user_username,
				"data": 'username',
				"width":'30%'
			},
			{
				"title": I18n.user_password,
				"data": 'password',
				"width":'20%',
				"render": function ( data, type, row ) {
					return '*********';
				}
			},
			{
				"title": '真实姓名',
				"data": 'realName',
				"width":'25%'
			},
			{
				"title": '启用状态',
				"data": 'status',
				"visible" : true,
				"width":'20%',
				"render": function ( data, type, row ) {
					var result = "";
					$('#data_filter .status option').each(function(){
						if ( data.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			}
		],
		"language" : {
			"sProcessing" : I18n.dataTable_sProcessing ,
			"sLengthMenu" : I18n.dataTable_sLengthMenu ,
			"sZeroRecords" : I18n.dataTable_sZeroRecords ,
			"sInfo" : I18n.dataTable_sInfo ,
			"sInfoEmpty" : I18n.dataTable_sInfoEmpty ,
			"sInfoFiltered" : I18n.dataTable_sInfoFiltered ,
			"sInfoPostFix" : "",
			"sSearch" : I18n.dataTable_sSearch ,
			"sUrl" : "",
			"sEmptyTable" : I18n.dataTable_sEmptyTable ,
			"sLoadingRecords" : I18n.dataTable_sLoadingRecords ,
			"sInfoThousands" : ",",
			"oPaginate" : {
				"sFirst" : I18n.dataTable_sFirst ,
				"sPrevious" : I18n.dataTable_sPrevious ,
				"sNext" : I18n.dataTable_sNext ,
				"sLast" : I18n.dataTable_sLast
			},
			"oAria" : {
				"sSortAscending" : I18n.dataTable_sSortAscending ,
				"sSortDescending" : I18n.dataTable_sSortDescending
			}
		}
	});

	// table data
	var tableData = {};

	// search btn
	$('#data_filter .searchBtn').on('click', function(){
		mainDataTable.fnDraw();
	});

	// ---------- ---------- ---------- delete operation ---------- ---------- ----------
	// delete
	$("#data_operation").on('click', '.delete',function() {

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
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
				url : base_url + "/org/user/delete",
				data : {
					"ids" : selectIds
				},
				dataType : "json",
				success : function(data){
					if (data.code == 200) {
						layer.msg( I18n.system_opt_del + I18n.system_success );
						mainDataTable.fnDraw(false);	// false，refresh current page；true，all refresh
					} else {
						layer.msg( data.msg || I18n.system_opt_del + I18n.system_fail );
					}
				},
				error: function(xhr, status, error) {
					// Handle error
					console.log("Error: " + error);
					layer.open({
						icon: '2',
						content: (I18n.system_opt_del + I18n.system_fail)
					});
				}
			});
		});
	});

	// ---------- ---------- ---------- add operation ---------- ---------- ----------
	// add validator method
	jQuery.validator.addMethod("usernameValid", function(value, element) {
		var length = value.length;
		var valid = /^[a-z][a-z0-9]*$/;
		return this.optional(element) || valid.test(value);
	}, I18n.user_username_valid );
	// add
	$("#data_operation .add").click(function(){
		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
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

			// get roleids
			var roleIds = $('#addModal .form input[name="roleId"]:checked').map(function() {
				return this.value;
			}).get();

			// request
			var paramData = {
				"username": $("#addModal .form input[name=username]").val(),
				"password": $("#addModal .form input[name=password]").val(),
				"status": $("#addModal .form select[name=status]").val(),
				"realName": $("#addModal .form input[name=realName]").val(),
				"roleIds": roleIds
			};

			// post
			$.post(base_url + "/org/user/add", paramData, function(data, status) {
				if (data.code == "200") {
					$('#addModal').modal('hide');

					layer.msg( I18n.system_opt_add + I18n.system_success );
					mainDataTable.fnDraw();
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
		addModalValidate.resetForm();

		$("#addModal .form")[0].reset();
		$("#addModal .form .form-group").removeClass("has-error");
	});

	// ---------- ---------- ---------- update operation ---------- ---------- ----------
	$("#data_operation .update").click(function(){

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length != 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = tableData[ 'key' + selectIds[0] ];

		// base data
		$("#updateModal .form input[name='id']").val( row.id );
		$("#updateModal .form input[name='username']").val( row.username );
		$("#updateModal .form input[name='password']").val( '' );
		$("#updateModal .form select[name='status']").val( row.status );
		$("#updateModal .form input[name='realName']").val( row.realName );

		// set roleid
		if (row.roleIds && row.roleIds.length > 0) {
			row.roleIds.forEach(function (item){
				$('#updateModal .form input[name="roleId"][value="'+ item +'"]').prop('checked', true).iCheck('update');
			});
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
		submitHandler : function(form) {

			// get roleids
			var roleIds = $('#updateModal .form input[name="roleId"]:checked').map(function() {
				return this.value;
			}).get();

			// request
			var paramData = {
				"id": $("#updateModal .form input[name=id]").val(),
				"username": $("#updateModal .form input[name=username]").val(),
				"password": $("#updateModal .form input[name=password]").val(),
				"status": $("#updateModal .form select[name=status]").val(),
				"realName": $("#updateModal .form input[name=realName]").val(),
				"roleIds":roleIds
			};

			$.post(base_url + "/org/user/update", paramData, function(data, status) {
				if (data.code == "200") {
					$('#updateModal').modal('hide');

					layer.msg( I18n.system_opt_edit + I18n.system_success );
					mainDataTable.fnDraw(false);
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
		// reset checkbox
		$('#updateModal .form input[name="roleId"]').prop('checked', false).iCheck('update');

		// reset
		updateModalValidate.resetForm();

		$("#updateModal .form")[0].reset();
		$("#updateModal .form .form-group").removeClass("has-error");
	});

});

</script>
<!-- 3-script end -->

</body>
</html>