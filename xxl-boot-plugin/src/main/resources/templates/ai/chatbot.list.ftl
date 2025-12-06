<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
    <!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

        <!-- 2-content start -->

        <!-- 查询区域 -->
        <div class="box" style="margin-bottom:9px;">
            <div class="box-body">
                <div class="row" id="data_filter" >
                    <div class="col-xs-3">
                        <!--query param-->
                        <div class="input-group">
                            <span class="input-group-addon">查询参数</span>
                            <input type="text" class="form-control param" autocomplete="on" >
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

        <!-- 数据表格区域 -->
        <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-header pull-left" id="data_operation" >
                        <button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}</button>
                        <button class="btn btn-sm btn-warning selectOnlyOne update" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
                        <button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
                        ｜
                        <button class="btn btn-sm btn-primary selectOnlyOne chat" type="button">开启对话</button>
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
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" >新增</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">ChatBot<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="20" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="cueWord" placeholder="" maxlength="200" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="model" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Ollama URL<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="ollamaUrl" placeholder="" maxlength="200" ></div>
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
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" >更新</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">ChatBot<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="20" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="cueWord" placeholder="" maxlength="200" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="model" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Ollama URL<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="ollamaUrl" placeholder="" maxlength="200" ></div>
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
<!-- admin table -->
<script src="${request.contextPath}/static/biz/common/admin.table.js"></script>
<script>
    $(function() {

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/ai/chatbot/pageList",
            queryParams: function (params) {
                var obj = {};
                obj.param = $('#data_filter .param').val();
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
                }
                ,{
                    title: 'ID',
                    field: 'id',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: 'ChatBot名称',
                    field: 'username',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '提示词',
                    field: 'cueWord',
                    width: '20',
                    widthUnit: '%',
                    formatter: function(value, row, index) {
                        return value.length > 10
                            ? (value = value.substring(0, 10) + "...")
                            : value ;
                    }
                }
                ,{
                    title: '模型',
                    field: 'model',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: '新增时间',
                    field: 'addTime',
                    width: '15',
                    widthUnit: '%',
                    formatter: function(value, row, index) {
                        // JS 语法，时间格式化

                    }
                }
                ,{
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
            url: base_url + "/ai/chatbot/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/ai/chatbot/insert",
            rules : {
                name: {
                    required: true,
                    minlength: 2,
                    maxlength: 20
                },
                cueWord: {
                    required: false,
                    maxlength: 200
                },
                model: {
                    required: true,
                    maxlength: 100
                },
                ollamaUrl: {
                    required: true,
                    maxlength: 200
                }
            },
            messages : {
                name: {
                    required: "请输入",
                    minlength: "长度不能少于2",
                    maxlength: "长度不能超过20"
                },
                cueWord: {
                    maxlength: "长度不能超过100"
                },
                model: {
                    required: "请输入",
                    maxlength: "长度不能超过200"
                },
                ollamaUrl: {
                    required: "请输入",
                    maxlength: "长度不能超过200"
                }
            },
            readFormData: function() {
                // request
                return {
                    "name": $("#addModal .form input[name=name]").val(),
                    "cueWord": $("#addModal .form textarea[name=cueWord]").val(),
                    "model": $("#addModal .form input[name=model]").val(),
                    "ollamaUrl": $("#addModal .form input[name=ollamaUrl]").val(),
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/ai/chatbot/update",
            writeFormData: function(row) {
                // base data

                $("#updateModal .form input[name='id']").val( row.id );
                $("#updateModal .form input[name='name']").val( row.name );
                $("#updateModal .form textarea[name='cueWord']").val( row.cueWord );
                $("#updateModal .form input[name='model']").val( row.model );
                $("#updateModal .form input[name='ollamaUrl']").val( row.ollamaUrl );
            },
            rules : {
                name: {
                    required: true,
                    minlength: 2,
                    maxlength: 20
                },
                cueWord: {
                    required: false,
                    maxlength: 100
                },
                model: {
                    required: true,
                    maxlength: 100
                },
                ollamaUrl: {
                    required: true,
                    maxlength: 200
                }
            },
            messages : {
                name: {
                    required: "请输入",
                    minlength: "长度不能少于2",
                    maxlength: "长度不能超过20"
                },
                cueWord: {
                    maxlength: "长度不能超过100"
                },
                model: {
                    required: "请输入",
                    maxlength: "长度不能超过200"
                },
                ollamaUrl: {
                    required: "请输入",
                    maxlength: "长度不能超过200"
                }
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal .form input[name=id]").val(),
                    "name": $("#updateModal .form input[name=name]").val(),
                    "cueWord": $("#updateModal .form textarea[name=cueWord]").val(),
                    "model": $("#updateModal .form input[name=model]").val(),
                    "ollamaUrl": $("#updateModal .form input[name=ollamaUrl]").val(),
                };
            }
        });

        // ---------- ---------- ---------- chat ---------- ---------- ----------

        /**
         * job registryinfo
         */
        $("#data_operation").on('click', '.chat',function() {
            // get select rows
            var rows = $.adminTable.table.bootstrapTable('getSelections');

            // find select row
            if (rows.length !== 1) {
                layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
                return;
            }
            var row = rows[0];

            // open chat
            window.open('https://www.baidu.com/s?wd=' + row.cueWord);

        });

    });

</script>
<!-- 3-script end -->

</body>
</html>