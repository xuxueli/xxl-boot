<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<#-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/zTree/css/metroStyle/metroStyle.css">
	<#-- 1-style end -->

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
						<div class="box-header" style="float: right" id="data_operation" >
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

<#-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/plugins/treeGrid/dataTables.treeGrid.js"></script>
<script src="${request.contextPath}/static/plugins/zTree/js/jquery.ztree.core.js"></script>
<script src="${request.contextPath}/static/biz/common/datatables.select.js"></script>
<script src="${request.contextPath}/static/biz/org/org.js"></script>
<#-- 3-script end -->

</body>
</html>