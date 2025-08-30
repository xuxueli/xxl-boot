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

            <#-- biz start（4/5 content） -->

            <#-- 查询区域 -->
            <div class="box" style="margin-bottom:9px;">
                <div class="box-body">
                    <div class="row" id="data_filter" >
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">日志类型</span>
                                <select class="form-control type" >
                                    <option value="-1" >${I18n.system_all}</option>
                                    <#list LogTypeEnum as item>
                                        <option value="${item.code}" >${item.desc}</option>
                                    </#list>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">系统模块</span>
                                <select class="form-control module" >
                                    <option value="" >${I18n.system_all}</option>
                                    <#list LogModuleEnum as item>
                                        <option value="${item}" >${item.desc}</option>
                                    </#list>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">日志标题</span>
                                <input type="text" class="form-control title" autocomplete="on" >
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
                            <button class="btn btn-sm btn-primary selectOnlyOne showdetail" type="button"><i class="fa fa-edit"></i>查看日志详情</button>
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


            <!-- 展示.模态框 -->
            <div class="modal fade" id="showModal" tabindex="-1" role="dialog"  aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" >日志详情</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">日志标题</label>
                                    <div class="col-sm-8 title" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">日志正文</label>
                                    <div class="col-sm-8" >
                                        <pre class="content2" style="width: 120%;"></pre>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">操作人</label>
                                    <div class="col-sm-8 operator" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">操作IP</label>
                                    <div class="col-sm-8 ip" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">操作地址</label>
                                    <div class="col-sm-8 ipAddress" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label2">操作时间</label>
                                    <div class="col-sm-8 addTime" ></div>
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

            <#-- biz end（4/5 content） -->

    </section>
</div>

<#-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>

<script src="${request.contextPath}/static/biz/common/datatables.select.js"></script>
<script src="${request.contextPath}/static/biz/system/log.js"></script>
<#-- 3-script end -->

</body>
</html>