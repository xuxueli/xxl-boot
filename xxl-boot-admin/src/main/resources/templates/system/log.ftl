<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

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

            <!-- 2-content end -->

    </section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>
<script>
$(function() {

    // ---------- ---------- ---------- main table  ---------- ---------- ----------

    var mainDataTable = $("#data_list").bootstrapTable({
        url: base_url + "/system/log/pageList",
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        queryParams: function (params) {
            var obj = {};
            obj.type = $('#data_filter .type').val();
            obj.module = $('#data_filter .module').val();
            obj.title = $('#data_filter .title').val();
            obj.start = params.offset;
            obj.length = params.limit;
            return obj;
        },
        sidePagination: "server",		// server side page
        responseHandler: function (result) {
            return {
                "total": result.data.totalCount,
                "rows": result.data.pageData
            };
        },
        columns: [
            {
                checkbox: true,
                field: 'state',
                width: '5%'
            }, {
                title: '日志类型',
                field: 'type',
                width: '10%',
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
                width: '10%',
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
                width: '10%'
            }, {
                title: '操作人',
                field: 'operator',
                width: '10%'
            }, {
                title: '操作IP',
                field: 'ip',
                width: '15%'
            }, {
                title: '操作地址',
                field: 'ipAddress',
                width: '15%'
            }, {
                title: '操作时间',
                field: 'addTime',
                width: '15%'
            }
        ],
        clickToSelect: true, 			// 是否启用点击选中行
        sortable: false, 				// 是否启用排序
        pagination: true, 				// 是否显示分页
        pageNumber: 1, 					// 默认第一页
        pageList: [10, 25, 50, 100] , 	// 可供选择的每页的行数（*）
        smartDisplay: false,			// 当总记录数小于分页数，是否显示可选项
        paginationPreText: '<<',		// 跳转页面的 上一页按钮
        paginationNextText: '>>',		// 跳转页面的 下一页按钮
        showRefresh: true,				// 显示刷新按钮
        showColumns: true,				// 显示/隐藏列
        minimumCountColumns: 2,			// 最少允许的列数
        onAll: function(name, args) {
            // filter
            if (!(['check.bs.table', "uncheck.bs.table", "check-all.bs.table", "uncheck-all.bs.table"].indexOf(name) > -1)) {
                return false;
            }
            var rows = mainDataTable.bootstrapTable('getSelections');
            var selectLen = rows.length;
            if (selectLen > 0) {
                $("#data_operation .selectAny").removeClass('disabled');
            } else {
                $("#data_operation .selectAny").addClass('disabled');
            }
            if (selectLen === 1) {
                $("#data_operation .selectOnlyOne").removeClass('disabled');
            } else {
                $("#data_operation .selectOnlyOne").addClass('disabled');
            }
        }
    });
    document.querySelector('.fixed-table-toolbar').classList.remove('fixed-table-toolbar');


    // search btn
    $('#data_filter .searchBtn').on('click', function(){
        mainDataTable.bootstrapTable('refresh');
    });

    // ---------- ---------- ---------- delete operation ---------- ---------- ----------
    // delete
    $("#data_operation").on('click', '.delete',function() {
        // get select rows
        var rows = mainDataTable.bootstrapTable('getSelections');

        // find select ids
        const selectIds = (rows && rows.length > 0) ? rows.map(row => row.id) : [];
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
                url : base_url + "/system/log/delete",
                data : {
                    "ids" : selectIds
                },
                dataType : "json",
                success : function(data){
                    if (data.code == 200) {
                        layer.msg( I18n.system_opt_del + I18n.system_success );
                        // refresh table
                        $('#data_filter .searchBtn').click();
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

    // ---------- ---------- ---------- showModal operation ---------- ---------- ----------
    $("#data_operation").on('click', '.showdetail',function() {
        // get select rows
        var rows = mainDataTable.bootstrapTable('getSelections');

        // find select row
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];

        // fill
        $('#showModal .title').text(row.title);
        $('#showModal .content2').text(row.content);
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