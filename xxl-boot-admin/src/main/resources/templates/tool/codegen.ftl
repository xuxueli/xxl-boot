<!DOCTYPE html>
<html>
<head>
	<#-- import macro -->
	<#import "../common/common.macro.ftl" as netCommon>

	<#-- 1-style start -->
	<@netCommon.commonStyle />
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/lib/codemirror.css">
	<link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.css">
	<#-- 1-style end -->

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
				</div>
			</div>

			<#-- biz end（4/5 content） -->

	</section>
</div>

<#-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/codemirror/lib/codemirror.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/anyword-hint.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/display/placeholder.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/clike/clike.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/sql/sql.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/xml/xml.js"></script>
<script src="${request.contextPath}/static/biz/tool/codegen.js"></script>
<#-- 3-script end -->

</body>
</html>