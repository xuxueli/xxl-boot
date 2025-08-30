<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<#-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/plugins/iCheck/square/blue.css">
	<#-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">

		<#-- 3-script start -->

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

		<#-- 3-script end -->

	</section>
</div>

<#-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>

<script src="${request.contextPath}/static/biz/common/datatables.select.js"></script>
<script src="${request.contextPath}/static/biz/org/user.js"></script>
<#-- 3-script end -->

</body>
</html>