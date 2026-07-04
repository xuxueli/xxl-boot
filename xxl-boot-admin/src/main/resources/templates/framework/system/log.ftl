<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "/framework/common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
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
                            <button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
                            <button class="btn btn-sm btn-primary selectOnlyOne showdetail" type="button"><i class="fa fa-edit"></i>查看日志详情</button>
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
                            <style>
                                .log-section { padding: 10px 0; }
                                .log-section + .log-section { border-top: 1px solid #e4e4e4; margin-top: 8px; }
                                .log-section-header { margin-bottom: 10px; font-weight: 700; color: #3c8dbc; font-size: 14px; }
                                .field-item { margin-bottom: 6px; font-size: 13px; }
                                .field-item .field-label { color: #999; margin-right: 4px; }
                                .field-item .field-value { color: #333; }
                            </style>

                            <div class="log-section">
                                <div class="log-section-header">基本信息</div>
                                <div class="row">
                                    <div class="col-sm-4 field-item"><span class="field-label">日志类型：</span><span class="field-value type"></span></div>
                                    <div class="col-sm-4 field-item"><span class="field-label">系统模块：</span><span class="field-value module"></span></div>
                                    <div class="col-sm-4 field-item"><span class="field-label">操作时间：</span><span class="field-value addTime"></span></div>
                                </div>
                            </div>

                            <div class="log-section">
                                <div class="log-section-header">操作人</div>
                                <div class="row">
                                    <div class="col-sm-4 field-item"><span class="field-label">操作人：</span><span class="field-value operator"></span></div>
                                    <div class="col-sm-4 field-item"><span class="field-label">操作IP：</span><span class="field-value ip"></span></div>
                                    <div class="col-sm-4 field-item"><span class="field-label">操作地址：</span><span class="field-value ipAddress"></span></div>
                                </div>
                            </div>

                            <div class="log-section">
                                <div class="log-section-header">日志信息</div>
                                <div class="row">
                                    <div class="col-sm-12 field-item"><span class="field-label">日志标题：</span><span class="field-value title"></span></div>
                                </div>
                                <div class="row" style="margin-top: 6px;">
                                    <div class="col-sm-12 field-item"><span class="field-label">日志正文：</span></div>
                                    <div class="col-sm-12" style="margin-top: 4px;"><pre class="content" style="white-space: pre-wrap; word-break: break-all; margin: 0; font-size: 13px;"></pre></div>
                                </div>
                            </div>

                            <div style="text-align:center;border-top: 1px solid #e4e4e4;padding-top: 10px;">
                                <button type="button" class="btn btn-primary" data-dismiss="modal" >关闭</button>
                            </div>
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
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>
<#-- admin table -->
<script src="${request.contextPath}/static/framework/admin.table.js"></script>
<script>
$(function() {

    // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

    /**
     * init table
     */
    $.adminTable.initTable({
        table: '#data_list',
        url: base_url + "/system/log/pageList",
        queryParams: function (params) {
            var obj = {};
            obj.type = $('#data_filter .type').val();
            obj.module = $('#data_filter .module').val();
            obj.title = $('#data_filter .title').val();
            obj.offset = params.offset;
            obj.pagesize = params.limit;
            return obj;
        },
        columns: [
            {
                checkbox: true,
                field: 'state',
                width: '5',
                widthUnit: '%'
            }, {
                title: '日志类型',
                field: 'type',
                width: '10',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var result = "";
                    $('#data_filter .type option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            result = $(this).text();
                        }
                    });
                    return result;
                }
            }, {
                title: '系统模块',
                field: 'module',
                width: '10',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var result = "";
                    $('#data_filter .module option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            result = $(this).text();
                        }
                    });
                    return result;
                }
            }, {
                title: '日志标题',
                field: 'title',
                width: '10',
                widthUnit: '%'
            }, {
                title: '操作人',
                field: 'operator',
                width: '10',
                widthUnit: '%'
            }, {
                title: '操作IP',
                field: 'ip',
                width: '15',
                widthUnit: '%'
            }, {
                title: '操作地址',
                field: 'ipAddress',
                width: '15',
                widthUnit: '%'
            }, {
                title: '操作时间',
                field: 'addTime',
                width: '15',
                widthUnit: '%'
            }
        ]
    });

    /**
     * init delete
     */
    $.adminTable.initDelete({
        url: base_url + "/system/log/delete"
    });

    // ---------- ---------- ---------- showModal operation ---------- ---------- ----------
    var mainDataTable = $.adminTable.table;
    $("#data_operation").on('click', '.showdetail',function() {
        // get select rows
        var rows = mainDataTable.bootstrapTable('getSelections');

        // find select row
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];

        // fill type display
        var typeText = "";
        $('#data_filter .type option').each(function(){
            if ( row.type.toString() === $(this).val() ) {
                typeText = $(this).text();
            }
        });
        // fill module display
        var moduleText = "";
        $('#data_filter .module option').each(function(){
            if ( row.module === $(this).val() ) {
                moduleText = $(this).text();
            }
        });

        $('#showModal .type').text(typeText);
        $('#showModal .module').text(moduleText);
        $('#showModal .title').text(row.title);
        $('#showModal .content').text(row.content);
        $('#showModal .operator').text(row.operator);
        $('#showModal .addTime').text(row.addTime);
        $('#showModal .ip').text(row.ip);
        $('#showModal .ipAddress').text(row.ipAddress);

        // show
        $('#showModal').modal({backdrop: true, keyboard: false}).modal('show');
    });

});

</script>
<!-- 3-script end -->

</body>
</html>