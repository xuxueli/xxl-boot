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
                        <div class="input-group">
                            <span class="input-group-addon">Model</span>
                            <select class="form-control" name="modelId" >
                                <option value="-1" >${I18n.system_please_choose}</option>
                                <#list modelList as item>
                                    <option value="${item.id}" >${item.name}</option>
                                </#list>
                            </select>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div class="input-group">
                            <span class="input-group-addon">对话标题</span>
                            <input type="text" class="form-control" name="title" placeholder="" maxlength="100" >
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
                        <button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i>${I18n.system_opt_add}对话</button>
                        <button class="btn btn-sm btn-warning selectOnlyOne update" type="button"><i class="fa fa-edit"></i>${I18n.system_opt_edit}</button>
                        <button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i>${I18n.system_opt_del}</button>
                        <button class="btn btn-sm btn-primary selectOnlyOne toChat" type="button">进入对话</button>
                        <button class="btn btn-sm btn-primary selectOnlyOne deleteMessage" type="button">清空消息</button>
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
                        <h4 class="modal-title" >新增记录</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">对话标题<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="title" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea name="prompt" rows="5" cols="90" maxlength="500" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Model<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="modelId" >
                                        <option value="-1" >${I18n.system_please_choose}</option>
                                        <#list modelList as item>
                                            <option value="${item.id}" >${item.name}</option>
                                        </#list>
                                    </select>
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
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" >更新记录</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">对话标题<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="title" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea name="prompt" rows="5" cols="90" maxlength="500" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Model<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="modelId" >
                                        <option value="-1" >${I18n.system_please_choose}</option>
                                        <#if modelList?? >
                                            <#list modelList as item>
                                                <option value="${item.id}" >${item.name}</option>
                                            </#list>
                                        </#if>
                                    </select>
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
<!-- admin table -->
<script src="${request.contextPath}/static/biz/common/admin.table.js"></script>
<script src="${request.contextPath}/static/biz/common/admin.util.js"></script>
<script>
    $(function() {

        // ---------- ---------- ---------- convert date 2 js  ---------- ---------- ----------
        const modelMap = {
            <#if modelList?? >
            <#list modelList as item>
            ${item.id}: "${item.name}"<#if item?has_next>,</#if>
            </#list>
            </#if>
        };

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/ai/chat/pageList",
            queryParams: function (params) {
                var obj = {};
                obj.modelId = $('#data_filter [name=modelId]').val();
                obj.title = $('#data_filter [name=title]').val();
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
                },{
                    title: '对话标题',
                    field: 'title',
                    width: '20',
                    widthUnit: '%'
                },{
                    title: 'Model',
                    field: 'modelId',
                    width: '20',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return modelMap[value];
                    }
                },{
                    title: '新增时间',
                    field: 'addTime',
                    width: '20',
                    widthUnit: '%'
                },{
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
            url: base_url + "/ai/chat/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/ai/chat/insert",
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "modelId": $("#addModal [name=modelId]").val(),
                    "title": $("#addModal [name=title]").val(),
                    "prompt": $("#addModal [name=prompt]").val()
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/ai/chat/update",
            writeFormData: function(row) {
                // base data

                $("#updateModal [name='id']").val( row.id );
                $("#updateModal [name='modelId']").val( row.modelId );
                $("#updateModal [name='title']").val( row.title );
                $("#updateModal [name='prompt']").val( row.prompt );
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal [name=id]").val(),
                    "modelId": $("#updateModal [name=modelId]").val(),
                    "title": $("#updateModal [name=title]").val(),
                    "prompt": $("#updateModal [name=prompt]").val()
                };
            }
        });

    });

    // ---------- ---------- ---------- deleteMessage  ---------- ---------- ----------

    $("#data_operation .deleteMessage").click(function(){
        // get select rows
        var rows = $.adminTable.selectRows();
        // find select row
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];

        // do delete
        layer.confirm('确认清空消息?', {
            icon: 3,
            title: I18n.system_tips ,
            btn: [ I18n.system_ok, I18n.system_cancel ]
        }, function(index){
            layer.close(index);

            // send message
            $.ajax({
                type : 'POST',
                url : base_url + "/ai/chat/deleteMessage",
                data : {
                    "id" : row.id
                },
                dataType : "json",
                success : function(data){
                    if (data.code === 200) {
                        layer.msg( I18n.system_opt + I18n.system_success );
                    } else {
                        layer.msg( data.msg || "发送失败" );
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

    // ---------- ---------- ---------- chat detail  ---------- ---------- ----------

    $("#data_operation .toChat").click(function(){
        // get select rows
        var rows = $.adminTable.selectRows();
        // find select row
        if (rows.length !== 1) {
            layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
            return;
        }
        var row = rows[0];

        // open chat detail
        let title = row.title.size>10?row.title.substring(0,10) + "...":row.title;
        let url = base_url + '/ai/chat/detail?chatId=' + row.id;
        openTab(url, title, false);
    });


</script>
<!-- 3-script end -->

</body>
</html>