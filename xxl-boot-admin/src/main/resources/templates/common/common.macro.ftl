<#-- page import (style + script) -->
<#macro commonStyle>

	<#-- i18n -->
	<#global I18n = I18nUtil.getMultString()?eval />

	<#-- favicon、logo -->
	<title>${I18n.admin_name_full}</title>
	<link rel="icon" href="${request.contextPath}/static/favicon.ico" />

	<#-- meta -->
	<meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Tell the browser to be responsive to screen width -->
    <meta content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" name="viewport">

	<#-- link style -->
    <!-- Bootstrap -->
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/bootstrap/css/bootstrap.min.css">
    <!-- Font Awesome -->
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/font-awesome/css/font-awesome.min.css">
    <!-- Ionicons -->
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/Ionicons/css/ionicons.min.css">
    <!-- Theme style -->
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/dist/css/AdminLTE.min.css">
    <!-- AdminLTE Skins. Choose a skin from the css/skins folder instead of downloading all of them to reduce the load. -->
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/dist/css/skins/_all-skins.min.css">
      
	<!-- HTML5 Shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->

	<!-- pace -->
	<link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/PACE/themes/blue/pace-theme-flash.css">

</#macro>

<#macro commonScript>
	<!-- jQuery -->
	<script src="${request.contextPath}/static/adminlte/bower_components/jquery/jquery.min.js"></script>
	<!-- Bootstrap -->
	<script src="${request.contextPath}/static/adminlte/bower_components/bootstrap/js/bootstrap.min.js"></script>
	<!-- PACE -->
	<script src="${request.contextPath}/static/adminlte/bower_components/PACE/pace.min.js"></script>
	<!-- SlimScroll -->
	<script src="${request.contextPath}/static/adminlte/bower_components/jquery-slimscroll/jquery.slimscroll.min.js"></script>
	<!-- FastClick -->
	<script src="${request.contextPath}/static/adminlte/bower_components/fastclick/fastclick.js"></script>

	<#-- jquery cookie -->
	<script src="${request.contextPath}/static/plugins/jquery/jquery.cookie.js"></script>
	<#-- jquery.validate -->
	<script src="${request.contextPath}/static/plugins/jquery/jquery.validate.min.js"></script>
	<#-- layer -->
	<script src="${request.contextPath}/static/plugins/layer/layer.js"></script>

	<!-- base config -->
	<script>
		// init page param
		var base_url = '${request.contextPath}';
		var I18n = ${I18nUtil.getMultString()};

		// init menu status
		if ( 'close' == $.cookie('sidebar_status') ) {
			$('body').addClass('sidebar-collapse');
		} else {
			$('body').removeClass('sidebar-collapse');
		}
		// init body fixed
		$('body').addClass('fixed');
		// init menu speed
		$('.sidebar-menu').attr('data-animation-speed', 1);

	</script>

	<!-- AdminLTE App -->
	<script src="${request.contextPath}/static/adminlte/dist/js/adminlte.min.js"></script>

	<#-- common js -->
    <script src="${request.contextPath}/static/js/common/common.js"></script>

</#macro>

<#-- page module: Header-->
<#macro commonHeader>
	<header class="main-header">
		<!-- header-logo -->
		<a href="${request.contextPath}/" class="logo">
			<span class="logo-mini"><b>XXL</b></span>
			<span class="logo-lg"><b>${I18n.admin_name}</b></span>
		</a>
		<nav class="navbar navbar-static-top" role="navigation">
			<!--header left -->
			<a href="#" class="sidebar-toggle" data-toggle="push-menu" role="button">
                <span class="sr-only">Toggle navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </a>
			<!--header right -->
          	<div class="navbar-custom-menu">
				<ul class="nav navbar-nav">

					<#-- message -->
					<#--<li class="dropdown notifications-menu">
						<a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
							<i class="fa fa-bell-o"></i>
							&lt;#&ndash;<span class="label label-warning">10</span>&ndash;&gt;
						</a>
						<ul class="dropdown-menu">
							<li class="header">你有 X 条通知消息</li>
							<li>
								<ul class="menu">
									<li>
										<a href="#">
											<i class="fa fa-users text-aqua"></i> 5 new members joined today
										</a>
									</li>
								</ul>
							</li>
							<li class="footer"><a href="#">View all</a></li>
						</ul>
					</li>-->

					<#-- login user -->
                    <li class="dropdown">
                        <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                            ${I18n.system_welcome}：${_loginUser.username}
                            <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li id="updatePwd" >
								<a href="javascript:" style="height: 30px;padding: 3px 25px;" ><i class="fa fa-key"></i> ${I18n.change_pwd}</a>
							</li>
                            <li id="logoutBtn" >
								<a href="javascript:" style="height: 30px;padding: 3px 25px;" ><i class="fa fa-sign-out"></i> ${I18n.logout_btn}</a>
							</li>
                        </ul>

                    </li>
				</ul>
			</div>

		</nav>
	</header>

	<!-- 修改密码.模态框 -->
	<div class="modal fade" id="updatePwdModal" tabindex="-1" role="dialog"  aria-hidden="true">
		<div class="modal-dialog ">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title" >${I18n.change_pwd}</h4>
				</div>
				<div class="modal-body">
					<form class="form-horizontal form" role="form" >
						<div class="form-group">
							<label for="lastname" class="col-sm-2 control-label">${I18n.change_pwd_field_newpwd}<font color="red">*</font></label>
							<div class="col-sm-10"><input type="text" class="form-control" name="password" placeholder="${I18n.system_please_input} ${I18n.change_pwd_field_newpwd}" maxlength="18" ></div>
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

</#macro>

<#-- page module: Footer-->
<#macro commonFooter >
	<footer class="main-footer">
		Powered by <b>XXL-BOOT</b> ${I18n.admin_version}
		<div class="pull-right hidden-xs">
			<strong>Copyright &copy; 2015-${.now?string('yyyy')} &nbsp;
				<a href="https://www.xuxueli.com/" target="_blank" >xuxueli</a>
				&nbsp;
				<a href="https://github.com/xuxueli/xxl-boot" target="_blank" >github</a>
			</strong><!-- All rights reserved. -->
		</div>
	</footer>
</#macro>

<#-- page module: Left-->
<#macro renderMenu pagePath resourceList >
	<#list resourceList as resource>
		<#if resource.type ==0>
			<#-- catalog -->
			<#assign actived = "false" />
			<#if resource.children?? && resource.children?size gt 0>
				<#list resource.children as child>
					<#if pagePath == child.url >
						<#assign actived = "true" />
					</#if>
				</#list>
			</#if>

			<li class="treeview <#if actived == "true" >active</#if>" style="height: auto;"  >
				<a href="javascript:void(0);"><i class="fa ${resource.icon}"></i><span>${resource.name}</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span></a>
				<ul class="treeview-menu" >
					<#if resource.children?? && resource.children?size gt 0>
						<@renderMenu pagePath resource.children />
					</#if>
					<#--<#list resource.children as child>
						<li class="<#if pagePath == child.url >active</#if>" ><a href="${request.contextPath}${child.url}" style="padding-top: 10px;"  ><i class="fa ${child.icon}"></i>${child.name}</a></li>
					</#list>-->
				</ul>
			</li>
		<#elseif resource.type ==1>
			<#-- menu -->
			<li class="nav-click <#if pagePath == resource.url >active</#if>" >
				<a href="${request.contextPath}${resource.url}"><i class="fa ${resource.icon}"></i><span>${resource.name}</span></a>
			</li>
		</#if>
	</#list>
</#macro>

<#macro commonLeft pagePath >
	<!-- left -->
	<aside class="main-sidebar">
		<!-- sidebar -->
		<section class="sidebar" style="height: auto;" >
			<!-- sidebar menu -->
			<ul class="sidebar-menu tree" data-widget="tree" >

				<#-- menu nav -->
                <li class="header">${I18n.system_nav}</li>

				<#-- menu list -->
				<#if resourceList?? && resourceList?size gt 0>
					<@renderMenu pagePath resourceList />
				</#if>

				<#--<#if resourceList?? && resourceList?size gt 0>
					<#list resourceList as resource>
						<#if resource.type ==0>
							&lt;#&ndash; catalog &ndash;&gt;
							<#assign actived = "false" />
							<#list resource.children as child>
								<#if pagePath == child.url >
									<#assign actived = "true" />
								</#if>
							</#list>
							<li class="treeview <#if actived == "true" >active</#if>" style="height: auto;"  >
								<a href="javascript:void(0);"><i class="fa ${resource.icon}"></i><span>${resource.name}</span><span class="pull-right-container"><i class="fa fa-angle-left pull-right"></i></span>
								</a>
								<ul class="treeview-menu" >
									<#list resource.children as child>
										<li class="<#if pagePath == child.url >active</#if>" ><a href="${request.contextPath}${child.url}" style="padding-top: 10px;"  ><i class="fa ${child.icon}"></i>${child.name}</a></li>
									</#list>
								</ul>
							</li>

						<#elseif resource.type ==1>
							&lt;#&ndash; menu &ndash;&gt;
							<li class="nav-click <#if pagePath == resource.url >active</#if>" >
								<a href="${request.contextPath}${resource.url}"><i class="fa ${resource.icon}"></i><span>${resource.name}</span></a>
							</li>
						</#if>
					</#list>
				</#if>-->

			</ul>
		</section>
		<!-- /.sidebar -->
	</aside>
</#macro>

<#--<#macro commonControl >
	<!-- Control Sidebar &ndash;&gt;
	<aside class="control-sidebar control-sidebar-dark">
		<!-- Create the tabs &ndash;&gt;
		<ul class="nav nav-tabs nav-justified control-sidebar-tabs">
			<li class="active"><a href="#control-sidebar-home-tab" data-toggle="tab"><i class="fa fa-home"></i></a></li>
			<li><a href="#control-sidebar-settings-tab" data-toggle="tab"><i class="fa fa-gears"></i></a></li>
		</ul>
		<!-- Tab panes &ndash;&gt;
		<div class="tab-content">
			<!-- Home tab content &ndash;&gt;
			<div class="tab-pane active" id="control-sidebar-home-tab">
				<h3 class="control-sidebar-heading">近期活动</h3>
				<ul class="control-sidebar-menu">
					<li>
						<a href="javascript::;">
							<i class="menu-icon fa fa-birthday-cake bg-red"></i>
							<div class="menu-info">
								<h4 class="control-sidebar-subheading">张三今天过生日</h4>
								<p>2015-09-10</p>
							</div>
						</a>
					</li>
					<li>
						<a href="javascript::;"> 
							<i class="menu-icon fa fa-user bg-yellow"></i>
							<div class="menu-info">
								<h4 class="control-sidebar-subheading">Frodo 更新了资料</h4>
								<p>更新手机号码 +1(800)555-1234</p>
							</div>
						</a>
					</li>
					<li>
						<a href="javascript::;"> 
							<i class="menu-icon fa fa-envelope-o bg-light-blue"></i>
							<div class="menu-info">
								<h4 class="control-sidebar-subheading">Nora 加入邮件列表</h4>
								<p>nora@example.com</p>
							</div>
						</a>
					</li>
					<li>
						<a href="javascript::;">
						<i class="menu-icon fa fa-file-code-o bg-green"></i>
						<div class="menu-info">
							<h4 class="control-sidebar-subheading">001号定时作业调度</h4>
							<p>5秒前执行</p>
						</div>
						</a>
					</li>
				</ul>
				<!-- /.control-sidebar-menu &ndash;&gt;
			</div>
			<!-- /.tab-pane &ndash;&gt;

			<!-- Settings tab content &ndash;&gt;
			<div class="tab-pane" id="control-sidebar-settings-tab">
				<form method="post">
					<h3 class="control-sidebar-heading">个人设置</h3>
					<div class="form-group">
						<label class="control-sidebar-subheading"> 左侧菜单自适应
							<input type="checkbox" class="pull-right" checked>
						</label>
						<p>左侧菜单栏样式自适应</p>
					</div>
					<!-- /.form-group &ndash;&gt;

				</form>
			</div>
			<!-- /.tab-pane &ndash;&gt;
		</div>
	</aside>
	<!-- /.control-sidebar &ndash;&gt;
	<!-- Add the sidebar's background. This div must be placed immediately after the control sidebar &ndash;&gt;
	<div class="control-sidebar-bg"></div>
</#macro>-->
