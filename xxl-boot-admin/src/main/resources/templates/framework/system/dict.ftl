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
                                <span class="input-group-addon">${I18n.dict_name}</span>
                                <input type="text" class="form-control name" autocomplete="on" >
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">${I18n.dict_code}</span>
                                <input type="text" class="form-control code" autocomplete="on" >
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">${I18n.system_status}</span>
                                <select class="form-control status" >
                                    <option value="-1" >${I18n.system_all}</option>
                                    <#list DictStatusEnum as item>
                                        <option value="${item.value}" >${item.desc}</option>
                                    </#list>
                                </select>
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
                            <button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}</button>
                            <button class="btn btn-sm btn-warning selectOnlyOne update" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
                            <button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
                            <button class="btn btn-sm btn-primary selectOnlyOne itemBtn" type="button"><i class="fa fa-list"></i>${I18n.dict_item}</button>
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
                            <h4 class="modal-title" >${I18n.system_opt_add}</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.dict_name}</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.dict_code}</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="code" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.system_status}</label>
                                    <div class="col-sm-8">
                                        <#list DictStatusEnum as item>
                                            <span class="col-sm-4" style="padding-left: 0px;">
                                                <input type="radio" name="status" value="${item.value}" <#if item.value==0>checked</#if> > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">${I18n.dict_remark}</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" name="remark" placeholder="" maxlength="500" rows="3"></textarea>
                                    </div>
                                </div>

                                <br>
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
                            <h4 class="modal-title" >${I18n.system_opt_edit}</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.dict_name}</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.dict_code}</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="code" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>${I18n.system_status}</label>
                                    <div class="col-sm-8">
                                        <#list DictStatusEnum as item>
                                            <span class="col-sm-4" style="padding-left: 0px;">
                                                <input type="radio" name="status" value="${item.value}" > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">${I18n.dict_remark}</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" name="remark" placeholder="" maxlength="500" rows="3"></textarea>
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

            <!-- 字典项.模态框 -->
            <div class="modal fade" id="itemModal" tabindex="-1" role="dialog"  aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" >${I18n.dict_item} - <span id="itemModalDictName"></span></h4>
                        </div>
                        <div class="modal-body">

                            <div id="item_operation" style="margin-bottom: 9px;">
                                <button class="btn btn-sm btn-info itemAdd" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}</button>
                                <button class="btn btn-sm btn-warning selectOnlyOne itemUpdate" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
                                <button class="btn btn-sm btn-danger selectAny itemDeleteBtn" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
                            </div>

                            <select id="item_status_options" class="hide">
                                <#list DictStatusEnum as item>
                                    <option value="${item.value}" >${item.desc}</option>
                                </#list>
                            </select>

                            <table id="item_list" class="table table-bordered table-striped" width="100%" >
                                <thead></thead>
                                <tbody></tbody>
                                <tfoot></tfoot>
                            </table>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 字典项新增.模态框 -->
            <div class="modal fade" id="itemAddModal" tabindex="-1" role="dialog"  aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" >${I18n.system_opt_add}</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.dict_item_name}</label>
                                    <div class="col-sm-9"><input type="text" class="form-control" name="itemName" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.dict_item_code}</label>
                                    <div class="col-sm-9"><input type="text" class="form-control" name="itemCode" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.system_status}</label>
                                    <div class="col-sm-8">
                                        <#list DictStatusEnum as item>
                                            <span class="col-sm-4" style="padding-left: 0px;">
                                                <input type="radio" name="status" value="${item.value}" <#if item.value==0>checked</#if> > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label">${I18n.system_order}</label>
                                    <div class="col-sm-4"><input type="number" class="form-control" name="order" placeholder="" value="0" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label">${I18n.dict_remark}</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control" name="remark" placeholder="" maxlength="500" rows="3"></textarea>
                                    </div>
                                </div>
                                <input type="hidden" name="dictId" >

                                <br>
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

            <!-- 字典项更新.模态框 -->
            <div class="modal fade" id="itemUpdateModal" tabindex="-1" role="dialog"  aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" >${I18n.system_opt_edit}</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.dict_item_name}</label>
                                    <div class="col-sm-9"><input type="text" class="form-control" name="itemName" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.dict_item_code}</label>
                                    <div class="col-sm-9"><input type="text" class="form-control" name="itemCode" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label"><font color="red">*</font>${I18n.system_status}</label>
                                    <div class="col-sm-8">
                                        <#list DictStatusEnum as item>
                                            <span class="col-sm-4" style="padding-left: 0px;">
                                                <input type="radio" name="status" value="${item.value}" > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label">${I18n.system_order}</label>
                                    <div class="col-sm-9"><input type="number" class="form-control" name="order" placeholder="" value="0" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-3 control-label">${I18n.dict_remark}</label>
                                    <div class="col-sm-9">
                                        <textarea class="form-control" name="remark" placeholder="" maxlength="500" rows="3"></textarea>
                                    </div>
                                </div>

                                <div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
                                    <div style="margin-top: 10px;" >
                                        <button type="submit" class="btn btn-primary"  >${I18n.system_save}</button>
                                        <button type="button" class="btn btn-default" data-dismiss="modal">${I18n.system_cancel}</button>
                                        <input type="hidden" name="id" >
                                        <input type="hidden" name="dictId" >
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
<#-- admin table -->
<script src="${request.contextPath}/static/framework/admin.table.js"></script>
<script>
$(function() {

    // valid: dict
    $.validator.addMethod("dictCodeRule", function(value, element) {
        return this.optional(element) || /^[a-zA-Z0-9_]+$/.test(value);
    }, "只允许字母、数字和下划线");

    // ---------- ---------- ---------- dict table + curd  ---------- ---------- ----------

    var currentDictId = 0;
    var currentDictName = '';

    /**
     * init table
     */
    $.adminTable.initTable({
        table: '#data_list',
        url: base_url + "/system/dict/pageList",
        queryParams: function (params) {
            var obj = {};
            obj.name = $('#data_filter .name').val();
            obj.code = $('#data_filter .code').val();
            obj.status = $('#data_filter .status').val();
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
                title: '${I18n.dict_name}',
                field: 'name',
                width: '20',
                widthUnit: '%'
            }, {
                title: '${I18n.dict_code}',
                field: 'code',
                width: '20',
                widthUnit: '%'
            }, {
                title: '${I18n.system_status}',
                field: 'status',
                width: '10',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var text = "";
                    $('#data_filter .status option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            text = $(this).text();
                        }
                    });
                    var labelClass = value === 0 ? 'label-success' : 'label-warning';
                    return '<span class="label ' + labelClass + '">' + text + '</span>';
                }
            }, {
                title: '${I18n.dict_remark}',
                field: 'remark',
                width: '25',
                widthUnit: '%'
            }, {
                title: '${I18n.system_add_time}',
                field: 'addTime',
                width: '20',
                widthUnit: '%'
            }
        ]
    });

    /**
     * init delete
     */
    $.adminTable.initDelete({
        url: base_url + "/system/dict/delete"
    });

    /**
     * init add
     */
    $.adminTable.initAdd( {
        url: base_url + "/system/dict/insert",
        rules : {
            name : {
                required : true,
                rangelength:[1, 100]
            },
            code : {
                required : true,
                rangelength:[1, 100],
                dictCodeRule: true
            }
        },
        messages : {
            name : {
                required : "${I18n.system_please_input}${I18n.dict_name}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            },
            code : {
                required : "${I18n.system_please_input}${I18n.dict_code}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            }
        },
        writeFormData: function(row) {
            $('#addModal .form input[name="status"][value="0"]').iCheck('check');
        },
        readFormData: function() {
            return {
                "name": $("#addModal .form input[name=name]").val(),
                "code": $("#addModal .form input[name=code]").val(),
                "status": $("#addModal .form input[name='status']:checked").val(),
                "remark": $("#addModal .form textarea[name=remark]").val()
            };
        }
    });

    /**
     * init update
     */
    $.adminTable.initUpdate( {
        url: base_url + "/system/dict/update",
        writeFormData: function(row) {
            $("#updateModal .form input[name='id']").val( row.id );
            $("#updateModal .form input[name='name']").val( row.name );
            $("#updateModal .form input[name='code']").val( row.code );
            $("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
            $("#updateModal .form textarea[name='remark']").val( row.remark );
        },
        rules : {
            name : {
                required : true,
                rangelength:[1, 100]
            },
            code : {
                required : true,
                rangelength:[1, 100],
                dictCodeRule: true
            }
        },
        messages : {
            name : {
                required : "${I18n.system_please_input}${I18n.dict_name}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            },
            code : {
                required : "${I18n.system_please_input}${I18n.dict_code}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            }
        },
        readFormData: function() {
            return {
                "id": $("#updateModal .form input[name=id]").val(),
                "name": $("#updateModal .form input[name=name]").val(),
                "code": $("#updateModal .form input[name=code]").val(),
                "status": $("#updateModal .form input[name='status']:checked").val(),
                "remark": $("#updateModal .form textarea[name=remark]").val()
            };
        }
    });

    // ---------- ---------- ---------- item open table  ---------- ---------- ----------

    // itemBtn - toolbar button
    $('#data_operation').on('click', '.itemBtn', function() {
        var rows = $('#data_list').bootstrapTable('getSelections');
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];
        currentDictId = row.id;
        currentDictName = row.name;
        $('#itemModalDictName').text(row.name);

        $('#item_list').bootstrapTable('refresh');
        $('#itemModal').modal({backdrop: false, keyboard: false}).modal('show');
    });

    // ---------- ---------- ---------- item table  ---------- ---------- ----------

    var itemTable = $('#item_list');

    itemTable.bootstrapTable({
        url: base_url + "/system/dict/itemPageList",
        method: "post",
        contentType: "application/x-www-form-urlencoded",
        queryParamsType: "limit",
        queryParams: function (params) {
            return {
                dictId: currentDictId,
                offset: params.offset,
                pagesize: params.limit
            };
        },
        sidePagination: "server",
        responseHandler: function (result) {
            if (result.code !== 200) {
                layer.msg(result.msg || (I18n.system_opt+I18n.system_fail));
                return { total: 0, rows: [] };
            }
            return { "total": result.data.total, "rows": result.data.data };
        },
        columns: [
            {
                checkbox: true,
                field: 'state',
                width: '5',
                widthUnit: '%'
            }, {
                title: '${I18n.dict_item_name}',
                field: 'itemName',
                width: '15',
                widthUnit: '%'
            }, {
                title: '${I18n.dict_item_code}',
                field: 'itemCode',
                width: '15',
                widthUnit: '%'
            }, {
                title: '${I18n.system_status}',
                field: 'status',
                width: '10',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var text = "";
                    $('#item_status_options option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            text = $(this).text();
                        }
                    });
                    var labelClass = value === 0 ? 'label-success' : 'label-warning';
                    return '<span class="label ' + labelClass + '">' + text + '</span>';
                }
            }, {
                title: '${I18n.system_order}',
                field: 'order',
                width: '10',
                widthUnit: '%'
            }, {
                title: '${I18n.dict_remark}',
                field: 'remark',
                width: '20',
                widthUnit: '%',
                formatter: function (value, row, index) {
                    return (value && value.length>10) ? value.substring(0, 10) + '...' : value;
                }
            }, {
                title: '${I18n.system_add_time}',
                field: 'addTime',
                width: '20',
                widthUnit: '%'
            }
        ],
        clickToSelect: true,
        multipleSelectRow: true,
        pagination: true,
        pageNumber: 1,
        pageList: [10, 25, 50, 100],
        smartDisplay: false,
        paginationParts: ['pageInfoShort', 'pageSize', 'pageList'],
        paginationPreText: '<<',
        paginationNextText: '>>',
        paginationLoop: false,
        showRefresh: true,
        showColumns: true,
        minimumCountColumns: 2,
        onAll: function(name, args) {
            if (!(['check.bs.table', "uncheck.bs.table", "check-all.bs.table", "uncheck-all.bs.table", 'post-body.bs.table'].indexOf(name) > -1)) {
                return false;
            }
            var rows = itemTable.bootstrapTable('getSelections');
            var selectLen = rows.length;
            if (selectLen > 0) {
                $("#item_operation .selectAny").removeClass('disabled');
            } else {
                $("#item_operation .selectAny").addClass('disabled');
            }
            if (selectLen === 1) {
                $("#item_operation .selectOnlyOne").removeClass('disabled');
            } else {
                $("#item_operation .selectOnlyOne").addClass('disabled');
            }
        }
    });

    // ---------- ---------- ---------- item curd  ---------- ---------- ----------

    // itemAdd
    $('#item_operation').on('click', '.itemAdd', function() {
        itemAddModalValidate.resetForm();
        $("#itemAddModal .form")[0].reset();
        $("#itemAddModal .form .form-group").removeClass("has-error");
        $("#itemAddModal .form input[name='dictId']").val(currentDictId);
        $("#itemAddModal .form input[name='status'][value='0']").iCheck('check');
        $('#itemAddModal').modal({backdrop: false, keyboard: false}).modal('show');
    });
    var itemAddModalValidate = $("#itemAddModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            itemName : {
                required : true,
                rangelength:[1, 100]
            },
            itemCode : {
                required : true,
                rangelength:[1, 100],
                dictCodeRule: true
            }
        },
        messages : {
            itemName : {
                required : "${I18n.system_please_input}${I18n.dict_item_name}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            },
            itemCode : {
                required : "${I18n.system_please_input}${I18n.dict_item_code}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            }
        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {
            var data = {
                "dictId": $("#itemAddModal .form input[name=dictId]").val(),
                "itemName": $("#itemAddModal .form input[name=itemName]").val(),
                "itemCode": $("#itemAddModal .form input[name=itemCode]").val(),
                "status": $("#itemAddModal .form input[name='status']:checked").val(),
                "order": $("#itemAddModal .form input[name=order]").val(),
                "remark": $("#itemAddModal .form textarea[name=remark]").val()
            };
            $.post(base_url + "/system/dict/itemInsert", data, function(data, status) {
                if (data.code === 200) {
                    $('#itemAddModal').modal('hide');
                    layer.msg(I18n.system_opt_add + I18n.system_success);
                    itemTable.bootstrapTable('refresh');
                } else {
                    layer.open({
                        title: I18n.system_tips,
                        btn: [ I18n.system_ok ],
                        content: (data.msg || I18n.system_opt_add + I18n.system_fail),
                        icon: '2'
                    });
                }
            });
        }
    });

    // itemDelete
    $('#item_operation').on('click', '.itemDeleteBtn', function() {
        var rows = itemTable.bootstrapTable('getSelections');
        const selectIds = (rows && rows.length > 0) ? rows.map(row => row.id) : [];
        if (selectIds.length <= 0) {
            layer.msg(I18n.system_please_choose + I18n.system_data);
            return;
        }
        layer.confirm(I18n.system_ok + I18n.system_opt_del + '?', {
            icon: 3,
            title: I18n.system_tips,
            btn: [ I18n.system_ok, I18n.system_cancel ]
        }, function(index){
            layer.close(index);
            $.ajax({
                type : 'POST',
                url : base_url + "/system/dict/itemDelete",
                data : { "ids" : selectIds },
                dataType : "json",
                success : function(data){
                    if (data.code === 200) {
                        layer.msg(I18n.system_opt_del + I18n.system_success);
                        itemTable.bootstrapTable('refresh');
                    } else {
                        layer.msg(data.msg || I18n.system_opt_del + I18n.system_fail);
                    }
                },
                error: function(xhr, status, error) {
                    layer.open({ icon: '2', content: (I18n.system_opt_del + I18n.system_fail) });
                }
            });
        });
    });

    // itemUpdate
    $('#item_operation').on('click', '.itemUpdate', function() {
        var rows = itemTable.bootstrapTable('getSelections');
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];
        $("#itemUpdateModal .form")[0].reset();
        $("#itemUpdateModal .form .form-group").removeClass("has-error");
        itemUpdateModalValidate.resetForm();
        $("#itemUpdateModal .form input[name='id']").val(row.id);
        $("#itemUpdateModal .form input[name='dictId']").val(row.dictId);
        $("#itemUpdateModal .form input[name='itemName']").val(row.itemName);
        $("#itemUpdateModal .form input[name='itemCode']").val(row.itemCode);
        $("#itemUpdateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
        $("#itemUpdateModal .form input[name='order']").val(row.order);
        $("#itemUpdateModal .form textarea[name='remark']").val(row.remark);
        $('#itemUpdateModal').modal({backdrop: false, keyboard: false}).modal('show');
    });
    var itemUpdateModalValidate = $("#itemUpdateModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            itemName : {
                required : true,
                rangelength:[1, 100]
            },
            itemCode : {
                required : true,
                rangelength:[1, 100],
                dictCodeRule: true
            }
        },
        messages : {
            itemName : {
                required : "${I18n.system_please_input}${I18n.dict_item_name}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            },
            itemCode : {
                required : "${I18n.system_please_input}${I18n.dict_item_code}",
                rangelength: I18n.system_lengh_limit + "[1-100]"
            }
        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {
            var data = {
                "id": $("#itemUpdateModal .form input[name=id]").val(),
                "dictId": $("#itemUpdateModal .form input[name=dictId]").val(),
                "itemName": $("#itemUpdateModal .form input[name=itemName]").val(),
                "itemCode": $("#itemUpdateModal .form input[name=itemCode]").val(),
                "status": $("#itemUpdateModal .form input[name='status']:checked").val(),
                "order": $("#itemUpdateModal .form input[name=order]").val(),
                "remark": $("#itemUpdateModal .form textarea[name=remark]").val()
            };
            $.post(base_url + "/system/dict/itemUpdate", data, function(data, status) {
                if (data.code === 200) {
                    $('#itemUpdateModal').modal('hide');
                    layer.msg(I18n.system_opt_edit + I18n.system_success);
                    itemTable.bootstrapTable('refresh');
                } else {
                    layer.open({
                        title: I18n.system_tips,
                        btn: [ I18n.system_ok ],
                        content: (data.msg || I18n.system_opt_edit + I18n.system_fail),
                        icon: '2'
                    });
                }
            });
        }
    });

    // ---------- ---------- ---------- iCheck ---------- ---------- ----------

    $('#addModal, #updateModal, #itemAddModal, #itemUpdateModal').find('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    });

});
</script>
<!-- 3-script end -->

</body>
</html>
