<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>
	<#-- commonStyle -->
	<@netCommon.commonStyle />

	<#-- biz start（1/5 style） -->
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
	<#-- biz end（1/5 end） -->

</head>
<body class="hold-transition skin-blue sidebar-mini" >
<div class="wrapper">

	<!-- header -->
	<@netCommon.commonHeader />

	<!-- left -->
	<#-- biz start（2/5 left） -->
	<@netCommon.commonLeft "/org/user" />
	<#-- biz end（2/5 left） -->

	<!-- right start -->
	<div class="content-wrapper">

		<!-- content-header -->
		<section class="content-header">
			<#-- biz start（3/5 name） -->
			<h1>${I18n.user_tips}${I18n.system_manage}</h1>
			<#-- biz end（3/5 name） -->
		</section>

		<!-- content-main -->
		<section class="content">

			<#-- biz start（4/5 content） -->

			<#-- filter -->
			<div class="box" style="margin-bottom:9px;">
				<div class="box-body">
					<div class="row" id="data_filter" >
						<div class="col-xs-3">
							<div class="input-group">
								<span class="input-group-addon">${I18n.user_role}</span>
								<select class="form-control role" >
									<option value="-1" >${I18n.system_all}</option>
									<#list roleList as role>
										<option value="${role.id}" >${role.name}</option>
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

			<#-- table -->
			<div class="row">
				<div class="col-xs-12">
					<div class="box">
						<div class="box-header" style="float: right" id="data_operation" >
							<button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}</button>
							<button class="btn btn-sm btn-warning disabled2 update" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
							<button class="btn btn-sm btn-danger delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
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
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_username}<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" ></div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_password}<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.system_please_input}${I18n.user_password}" maxlength="20" ></div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_role}<font color="red">*</font></label>
									<div class="col-sm-10">
										<input type="radio" name="role" value="0" checked />${I18n.user_role_normal}
										&nbsp;&nbsp;&nbsp;&nbsp;
										<input type="radio" name="role" value="1" />${I18n.user_role_admin}
									</div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_permission}<font color="black">*</font></label>
									<div class="col-sm-10">
										<#if groupList?exists && groupList?size gt 0>
											<#list groupList as item>
												<input type="checkbox" name="permission" value="${item.id}" />${item.title}(${item.appname})<br>
											</#list>
										</#if>
									</div>
								</div>

								<hr>
								<div class="form-group">
									<div class="col-sm-offset-3 col-sm-6">
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
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_username}<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="username" placeholder="${I18n.system_please_input}${I18n.user_username}" maxlength="20" readonly ></div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_password}<font color="red">*</font></label>
									<div class="col-sm-8"><input type="text" class="form-control" name="password" placeholder="${I18n.user_password_update_placeholder}" maxlength="20" ></div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_role}<font color="red">*</font></label>
									<div class="col-sm-10">
										<input type="radio" name="role" value="0" />${I18n.user_role_normal}
										&nbsp;&nbsp;&nbsp;&nbsp;
										<input type="radio" name="role" value="1" />${I18n.user_role_admin}
									</div>
								</div>
								<div class="form-group">
									<label for="lastname" class="col-sm-2 control-label">${I18n.user_permission}<font color="black">*</font></label>
									<div class="col-sm-10">
										<#if groupList?exists && groupList?size gt 0>
											<#list groupList as item>
												<input type="checkbox" name="permission" value="${item.id}" />${item.title}(${item.appname})<br>
											</#list>
										</#if>
									</div>
								</div>

								<hr>
								<div class="form-group">
									<div class="col-sm-offset-3 col-sm-6">
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

			<#-- biz end（4/5 content） -->

		</section>

	</div>
	<!-- right end -->

	<!-- footer -->
	<@netCommon.commonFooter />
</div>
<@netCommon.commonScript />

<#-- biz start（5/5 script） -->
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/js/org/user.js"></script>
<#-- biz end（5/5 script） -->

</body>
</html>