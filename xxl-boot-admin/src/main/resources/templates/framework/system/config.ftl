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
                                <span class="input-group-addon">状态</span>
                                <select class="form-control status" >
                                    <option value="-1" >${I18n.system_all}</option>
                                    <#list ConfigStatusEnum as item>
                                        <option value="${item.value}" >${item.desc}</option>
                                    </#list>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">配置名称</span>
                                <input type="text" class="form-control name" autocomplete="on" >
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">配置Key</span>
                                <input type="text" class="form-control key" autocomplete="on" >
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
                            <h4 class="modal-title" >新增</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置名称</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置Key</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="key" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置Value</label>
                                    <div class="col-sm-10"><textarea class="form-control" name="value" rows="4" maxlength="500"></textarea></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">状态</label>
                                    <div class="col-sm-8">
                                        <#list ConfigStatusEnum as item>
                                            <span class="col-sm-4" >
                                                <input type="radio" name="status" value="${item.value}" > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">备注</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" name="remark" rows="2" maxlength="500"></textarea>
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
                            <h4 class="modal-title" >更新</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置名称</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置Key</label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="key" placeholder="" maxlength="100" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label"><font color="red">*</font>配置Value</label>
                                    <div class="col-sm-10"><textarea class="form-control" name="value" rows="4" maxlength="500"></textarea></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">状态</label>
                                    <div class="col-sm-8">
                                        <#list ConfigStatusEnum as item>
                                            <span class="col-sm-4" >
                                                <input type="radio" name="status" value="${item.value}" > ${item.desc}
                                            </span>
                                        </#list>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">备注</label>
                                    <div class="col-sm-10">
                                        <textarea class="form-control" name="remark" rows="2" maxlength="500"></textarea>
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

    // valid: config key
    $.validator.addMethod("configKeyRule", function(value, element) {
        return this.optional(element) || /^[a-z][a-z0-9_]*$/.test(value);
    }, "必须以小写字母开头，仅允许小写字母、数字和下划线");


    // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

    /**
     * init table
     */
    $.adminTable.initTable({
        table: '#data_list',
        url: base_url + "/system/config/pageList",
        queryParams: function (params) {
            var obj = {};
            obj.name = $('#data_filter .name').val();
            obj.key = $('#data_filter .key').val();
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
                title: '配置名称',
                field: 'name',
                width: '20',
                widthUnit: '%'
            }, {
                title: '配置Key',
                field: 'key',
                width: '15',
                widthUnit: '%'
            }, {
                title: '配置Value',
                field: 'value',
                width: '25',
                widthUnit: '%'
            }, {
                title: '状态',
                field: 'status',
                width: '10',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var result = "";
                    $('#data_filter .status option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            result = $(this).text();
                        }
                    });
                    return result;
                }
            }, {
                title: '更新时间',
                field: 'updateTime',
                width: '20',
                widthUnit: '%'
            }
        ]
    });

    /**
     * init delete
     */
    $.adminTable.initDelete({
        url: base_url + "/system/config/delete"
    });

    /**
     * init add
     */
    $.adminTable.initAdd( {
        url: base_url + "/system/config/insert",
        rules : {
            name : {
                required : true,
                rangelength:[2, 100]
            },
            key : {
                required : true,
                rangelength:[2, 100],
                configKeyRule: true
            },
            value : {
                required : true,
                rangelength:[1, 500]
            }
        },
        messages : {
            name : {
                required : "请输入配置名称",
                rangelength: I18n.system_lengh_limit + "[2-100]"
            },
            key : {
                required : "请输入配置Key",
                rangelength: I18n.system_lengh_limit + "[2-100]"
            },
            value : {
                required : "请输入配置Value",
                rangelength: I18n.system_lengh_limit + "[1-500]"
            }
        },
        writeFormData: function(row) {
            $('#addModal .form input[name="status"][value="0"]').iCheck('check');
        },
        readFormData: function() {
            return {
                "name": $("#addModal .form input[name=name]").val(),
                "key": $("#addModal .form input[name=key]").val(),
                "value": $("#addModal .form textarea[name=value]").val(),
                "status": $("#addModal .form input[name='status']:checked").val(),
                "remark": $("#addModal .form textarea[name=remark]").val()
            };
        }
    });

    /**
     * init update
     */
    $.adminTable.initUpdate( {
        url: base_url + "/system/config/update",
        writeFormData: function(row) {
            $("#updateModal .form input[name='id']").val( row.id );
            $("#updateModal .form input[name='name']").val( row.name );
            $("#updateModal .form input[name='key']").val( row.key );
            $("#updateModal .form textarea[name='value']").val( row.value );
            $("#updateModal .form input[name='status'][value='" + row.status + "']").iCheck('check');
            $("#updateModal .form textarea[name='remark']").val( row.remark );
        },
        rules : {
            name : {
                required : true,
                rangelength:[2, 100]
            },
            key : {
                required : true,
                rangelength:[2, 100],
                configKeyRule: true
            },
            value : {
                required : true,
                rangelength:[1, 500]
            }
        },
        messages : {
            name : {
                required : "请输入配置名称",
                rangelength: I18n.system_lengh_limit + "[2-100]"
            },
            key : {
                required : "请输入配置Key",
                rangelength: I18n.system_lengh_limit + "[2-100]"
            },
            value : {
                required : "请输入配置Value",
                rangelength: I18n.system_lengh_limit + "[1-500]"
            }
        },
        readFormData: function() {
            return {
                "id": $("#updateModal .form input[name=id]").val(),
                "name": $("#updateModal .form input[name=name]").val(),
                "key": $("#updateModal .form input[name=key]").val(),
                "value": $("#updateModal .form textarea[name=value]").val(),
                "status": $("#updateModal .form input[name='status']:checked").val(),
                "remark": $("#updateModal .form textarea[name=remark]").val()
            };
        }
    });

    // ---------- ---------- ---------- iCheck ---------- ---------- ----------

    // input iCheck
    $('#updateModal, #addModal').find('input').iCheck({
        checkboxClass: 'icheckbox_square-blue',
        radioClass: 'iradio_square-blue',
    });

});

</script>
<!-- 3-script end -->

</body>
</html>
