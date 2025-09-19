<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<!-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/lib/codemirror.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.css">
	<!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
	<section class="content">
			<#-- biz start（4/5 content） -->

			<#-- 表结构 -->
			<div class="box box-default">
				<div class="box-header with-border">
					<h4 class="pull-left">${I18n.codegen_tablesql}</h4>
					<button type="button" class="btn btn-primary btn-xs pull-right" id="codeGenerate" >生成代码</button>
				</div>
				<div class="box-body">
					<ul class="chart-legend clearfix">
						<li>
							<small class="text-muted" >
									<textarea id="tableSql" placeholder="${I18n.system_please_input}${I18n.codegen_tablesql}..." >
CREATE TABLE `user` (
    `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
    `username` varchar(50) NOT NULL COMMENT '账号',
    `password` varchar(50) NOT NULL COMMENT '密码',
    `user_token` varchar(50) DEFAULT NULL COMMENT '登录token',
    `status` tinyint(4) NOT NULL COMMENT '状态：0-正常、1-禁用',
    `real_name` varchar(50) DEFAULT NULL COMMENT '真实姓名',
    `add_time` datetime NOT NULL COMMENT '新增时间',
    `update_time` datetime NOT NULL COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `i_username` (`username`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
									</textarea>
							</small>
						</li>
					</ul>
				</div>
			</div>

			<#-- 生成代码 -->
			<div class="nav-tabs-custom" >
				<!-- Tabs within a box -->
				<ul class="nav nav-tabs pull-right" >
					<h4 class="pull-left" style="padding-left: 10px;">${I18n.codegen_result}</h4>

					<li><a href="#page" data-toggle="tab">Page</a></li>
					<li><a href="#entity" data-toggle="tab">Entity</a></li>
					<li><a href="#mapper_xml" data-toggle="tab">Mapper(XML)</a></li>
					<li><a href="#mapper" data-toggle="tab">Mapper</a></li>
					<li><a href="#service_impl" data-toggle="tab">ServiceImpl</a></li>
					<li><a href="#service" data-toggle="tab">Service</a></li>
					<li class="active" id="controller_nav" ><a href="#controller" data-toggle="tab" >Controller</a></li>

				</ul>
				<div class="tab-content no-padding">
					<div class="chart tab-pane active" id="controller">
						<div class="box-body">
							Controller：<textarea id="controller_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="service">
						<div class="box-body">
							Service：<textarea id="service_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="service_impl">
						<div class="box-body">
							ServiceImpl：<textarea id="service_impl_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="mapper">
						<div class="box-body">
							Mapper：<textarea id="mapper_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="mapper_xml">
						<div class="box-body">
							Mapper(XML)：<textarea id="mapper_xml_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="entity" >
						<div class="box-body ">
							Entity：<textarea id="entity_ide" ></textarea>
						</div>
					</div>
					<div class="chart tab-pane active" id="page" >
						<div class="box-body ">
							Page：<textarea id="page_ide" ></textarea>
						</div>
					</div>
				</div>
			</div>

			<#-- biz end（4/5 content） -->

	</section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/codemirror/lib/codemirror.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/anyword-hint.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/display/placeholder.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/clike/clike.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/sql/sql.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/xml/xml.js"></script>
<script>
$(function () {

	/**
	 * init table sql ide
	 */
	var tableSqlIDE;
	function initTableSql() {
		tableSqlIDE = CodeMirror.fromTextArea(document.getElementById("tableSql"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-sql",
			lineWrapping:false,
			readOnly:false,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		tableSqlIDE.setSize('auto','auto');
	}
	initTableSql();

	/**
	 * init code area
	 */

	var controller_ide;
	var service_ide;
	var service_impl_ide;
	var mapper_ide;
	var mapper_xml_ide;
	var entity_ide;
	var page_ide;
	function initCodeArea(){

		// controller_ide
		controller_ide = CodeMirror.fromTextArea(document.getElementById("controller_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-java",
			lineWrapping:true,
			readOnly:true,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		controller_ide.setSize('auto','auto');

		// service_ide
		service_ide = CodeMirror.fromTextArea(document.getElementById("service_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-java",
			lineWrapping:true,
			readOnly:true,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		service_ide.setSize('auto','auto');

		// service_impl_ide
		service_impl_ide = CodeMirror.fromTextArea(document.getElementById("service_impl_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-java",
			lineWrapping:true,
			readOnly:true,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		service_impl_ide.setSize('auto','auto');

		// mapper_ide
		mapper_ide = CodeMirror.fromTextArea(document.getElementById("mapper_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-java",
			lineWrapping:true,
			readOnly:true,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		mapper_ide.setSize('auto','auto');

		// mapper_xml_ide
		mapper_xml_ide = CodeMirror.fromTextArea(document.getElementById("mapper_xml_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/html",
			lineWrapping:true,
			readOnly:true
		});
		mapper_xml_ide.setSize('auto','auto');

		// entity_ide
		entity_ide = CodeMirror.fromTextArea(document.getElementById("entity_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/x-java",
			lineWrapping:true,
			readOnly:true,
			foldGutter: true,
			gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
		});
		entity_ide.setSize('auto','auto');

		// page_ide
		page_ide = CodeMirror.fromTextArea(document.getElementById("page_ide"), {
			lineNumbers: true,
			matchBrackets: true,
			mode: "text/html",
			lineWrapping:true,
			readOnly:true
		});
		page_ide.setSize('auto','auto');
	}
	initCodeArea();

	/**
	 * gen Code
	 */
	$('#codeGenerate').click(function () {

		var tableSql = tableSqlIDE.getValue();

		$.ajax({
			type : 'POST',
			url : base_url + "/tool/codegen/genCode",
			data : {
				"tableSql" : tableSql
			},
			dataType : "json",
			success : function(data){
				if (data.code == 200) {

					// show all, for setvalue
					$('.chart.tab-pane').addClass('active');

					// set value
					controller_ide.setValue(data.data.controller_code);
					controller_ide.setSize('auto','auto');

					service_ide.setValue(data.data.service_code);
					service_ide.setSize('auto','auto');

					service_impl_ide.setValue(data.data.service_impl_code);
					service_impl_ide.setSize('auto','auto');

					mapper_ide.setValue(data.data.mapper_code);
					mapper_ide.setSize('auto','auto');

					mapper_xml_ide.setValue(data.data.mapper_xml_code);
					mapper_xml_ide.setSize('auto','auto');

					entity_ide.setValue(data.data.entity_code);
					entity_ide.setSize('auto','auto');

					page_ide.setValue(data.data.page_code);
					page_ide.setSize('auto','auto');

					// refresh
					controller_ide.refresh();
					service_ide.refresh();
					service_impl_ide.refresh();
					mapper_ide.refresh();
					mapper_xml_ide.refresh();
					entity_ide.refresh();
					page_ide.refresh();

					// hide nav + panel
					$('.nav-tabs > li').removeClass('active')
					$('.chart.tab-pane').removeClass('active');

					// msg
					layer.open({
						icon: '1',
						content: I18n.codegen_name+I18n.system_success ,
						end: function(layero, index){
							// hide nav + panel
							$('#controller_nav').addClass('active');
							$('#controller').addClass('active');
						}
					});
				} else {
					layer.open({
						icon: '2',
						content: (data.msg|| I18n.codegen_name+I18n.system_fail )
					});
				}
			},
			error: function(xhr, status, error) {
				// Handle error
				console.log("Error: " + error);
				layer.open({
					icon: '2',
					content: (I18n.codegen_name+I18n.system_fail)
				});
			}
		});

	});

});
</script>
<!-- 3-script end -->

</body>
</html>