<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

        <#-- 2-biz start -->

        <!-- 顶部公告 start -->
        <div class="box box-default">
            <div class="box-body">
                <div class="row">
                    <!-- left -->
                    <div class="col-md-6">
                        <div class="pull-left image">
                            <img src="${request.contextPath}/static/favicon.ico" style="height: 80px;" >
                        </div>
                        <div class="pull-left info" style="padding-left: 10px;padding-top: 5px;" >
                            <h4>你好，${xxl_sso_user.realName!}，祝你开心每一天！</h4>
                            <span style="color: #999;">登录时间：${.now?string('yyyy年MM月dd日 HH:mm:ss')}</span>
                        </div>
                    </div>
                    <!-- right -->
                    <div class="col-md-6">
                        <div class="pull-right info" style="margin-top: 10px;margin-right: 30px;">
                            <span style="color: #999;">用户浏览</span><br><span style="font-size: 30px;font-weight: 300;">900000</span>
                        </div>
                        <div class="pull-right info" style="margin-top: 10px;margin-right: 15px;padding-right: 15px;border-right: 1px solid #E5E5E5;">
                            <span style="color: #999;">注册用户</span><br><span style="font-size: 30px;font-weight: 300;">5000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 顶部公告 end --->

        <!-- 个人信息区域 start -->
        <div class="row">
            <div class="col-md-8">
                <!-- 常用功能 -->
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">常用功能</h3>
                    </div>
                    <!-- /.box-header -->
                    <div class="box-body">
                        <strong><i class="fa fa-users margin-r-5"></i>组织管理</strong>
                        <p class="text-muted">
                            针对组织、用户、角色及资源等进行管理，支持灵活的人员角色、菜单权限、人员授权等操作管理。
                        </p>

                        <hr>
                        <strong><i class="fa fa-cogs margin-r-5"></i>系统管理</strong>
                        <p class="text-muted">
                            提供通知触达、审计日志、系统监控……等相关能力，支持高校灵活进行系统监控及管理。
                        </p>

                        <hr>
                        <strong><i class="fa fa-wrench margin-r-5"></i>系统工具</strong>
                        <p class="text-muted">
                            提供Entity、业务代码、SQL、页面交互等……前后端一站式代码生成工具，辅助快速进行敏捷迭代开发。
                        </p>

                        <hr>
                        <strong><i class="fa fa-book margin-r-5"></i> 帮助中心</strong>
                        <p>提供内容丰富、干练易懂的操作文档，辅助快速上手项目。</p>

                    </div>
                    <!-- /.box-body -->
                </div>
            </div>

            <#-- 通知消息 -->
            <div class="col-md-4">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">通知消息</h3>
                    </div>
                    <div class="box-body" id="messageList">
                        <ul class="products-list product-list-in-box">
                            <#if messageList?exists && messageList?size gt 0>
                            <#list messageList as item>
                                <li class="item">
                                    <div class="product-info" style="margin-left: 10px;">
                                            <a href="javascript:void(0)" class="product-title showdetail" data-title="${item.title}" data-content="${item.content?html}" data-addTime="${item.addTime}" >
                                                ${item.title}
                                                <span class="label label-info pull-right">${item.sender}</span></a>
                                            </a>
                                            <span class="product-description">${item.addTime}</span>
                                    </div>
                                </li>
                            </#list>
                            </#if>
                        </ul>
                    </div>
                    <#--<div class="box-footer text-center">
                        <a href="javascript:void(0)" class="uppercase">查看全部消息</a>
                    </div>-->
                </div>
            </div>
        </div>
        <!-- 个人信息区域 end -->

        <!-- 查看通知.模态框 start -->
        <div class="modal fade" id="showMessageModal" tabindex="-1" role="dialog"  aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" >查看通知</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">通知标题：</label>
                                <div class="col-sm-10 title" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">发布时间：</label>
                                <div class="col-sm-8 addTime" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">通知正文：</label>
                                <div class="col-sm-8 content" style="overflow: hidden;" ></div>
                            </div>

                            <div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
                                <div style="margin-top: 10px;" >
                                    <button type="button" class="btn btn-primary" data-dismiss="modal" >关闭</button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看通知.模态框 end -->

        <#-- 2-biz end -->

    </section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script>
$(function () {

    $("#messageList").on('click', '.showdetail',function() {

        // data
        let title = $(this).attr('data-title');
        let content = $(this).attr('data-content');
        let addTime = $(this).attr('data-addTime');

        // fill
        $('#showMessageModal .title').text( title );
        $('#showMessageModal .content').html( content );
        $('#showMessageModal .addTime').text( addTime );

        // show
        $('#showMessageModal').modal({backdrop: false, keyboard: false}).modal('show');
    });

});
</script>
<!-- 3-script end -->

</body>
</html>