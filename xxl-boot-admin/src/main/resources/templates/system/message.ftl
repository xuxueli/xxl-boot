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

            <#-- 查询区域 -->
            <div class="box" style="margin-bottom:9px;">
                <div class="box-body">
                    <div class="row" id="data_filter" >
                        <div class="col-xs-3 hide">
                            <div class="input-group">
                                <span class="input-group-addon">分类</span>
                                <select class="form-control category" >
                                    <option value="-1" >${I18n.system_all}</option>
                                    <#list MessageCategoryEnum as item>
                                        <option value="${item.value}" >${item.desc}</option>
                                    </#list>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">状态</span>
                                <select class="form-control status" >
                                    <option value="-1" >${I18n.system_all}</option>
                                    <#list MessageStatusEnum as item>
                                        <option value="${item.value}" >${item.desc}</option>
                                    </#list>
                                </select>
                            </div>
                        </div>
                        <div class="col-xs-3">
                            <div class="input-group">
                                <span class="input-group-addon">标题</span>
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
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h4 class="modal-title" >新增通知</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知分类<font color="red">*</font></label>
                                    <div class="col-sm-4">
                                        <select class="form-control" name="category" >
                                            <#list MessageCategoryEnum as item>
                                                <option value="${item.value}" >${item.desc}</option>
                                            </#list>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知状态<font color="red">*</font></label>
                                    <div class="col-sm-4">
                                        <select class="form-control" name="status" >
                                            <#list MessageStatusEnum as item>
                                                <option value="${item.value}" >${item.desc}</option>
                                            </#list>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知标题<font color="red">*</font></label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="title" placeholder="" maxlength="50" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知正文<font color="red">*</font></label>
                                    <div class="col-sm-10">
                                        <textarea id="add_content" name="content" rows="10" cols="80"></textarea>
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
                            <h4 class="modal-title" >更新通知</h4>
                        </div>
                        <div class="modal-body">
                            <form class="form-horizontal form" role="form" >
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知分类<font color="red">*</font></label>
                                    <div class="col-sm-4">
                                        <select class="form-control" name="category" >
                                            <#list MessageCategoryEnum as item>
                                                <option value="${item.value}" >${item.desc}</option>
                                            </#list>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知状态<font color="red">*</font></label>
                                    <div class="col-sm-4">
                                        <select class="form-control" name="status" >
                                            <#list MessageStatusEnum as item>
                                                <option value="${item.value}" >${item.desc}</option>
                                            </#list>
                                        </select>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知标题<font color="red">*</font></label>
                                    <div class="col-sm-10"><input type="text" class="form-control" name="title" placeholder="" maxlength="50" ></div>
                                </div>
                                <div class="form-group">
                                    <label for="lastname" class="col-sm-2 control-label">通知正文<font color="red">*</font></label>
                                    <div class="col-sm-10">
                                        <textarea id="update_content" name="content" rows="10" cols="80"></textarea>
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
<script src="${request.contextPath}/static/adminlte/bower_components/ckeditor/ckeditor.js"></script>
<#-- admin table -->
<script src="${request.contextPath}/static/biz/common/admin.table.js"></script>
<script>
$(function() {

    // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

    /**
     * init table
     */
    $.adminTable.initTable({
        table: '#data_list',
        url: base_url + "/system/message/pageList",
        queryParams: function (params) {
            var obj = {};
            obj.title = $('#data_filter .title').val();
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
                title: '通知分类',
                field: 'category',
                width: '15',
                widthUnit: '%',
                formatter: function(value, row, index) {
                    var result = "";
                    $('#data_filter .category option').each(function(){
                        if ( value.toString() === $(this).val() ) {
                            result = $(this).text();
                        }
                    });
                    return result;
                }
            }, {
                title: '通知标题',
                field: 'title',
                width: '35',
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
                title: '发送人',
                field: 'sender',
                width: '15',
                widthUnit: '%'
            }, {
                title: '发送时间',
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
        url: base_url + "/system/message/delete"
    });


    /**
     * init add
     */
    // init add editor
    CKEDITOR.replace('add_content');    // todo, 图片弹框宽高编辑与 bootstrap 冲突问题
    $.adminTable.initAdd( {
        url: base_url + "/system/message/insert",
        rules : {
            title : {
                required : true,
                rangelength:[4, 50]
            }
        },
        messages : {
            title : {
                required : "请输入通知标题",
                rangelength: I18n.system_lengh_limit + "[4-20]"
            }
        },
        writeFormData: function(row) {
            // add_content
            const updateEditorInstance = CKEDITOR.instances.add_content;
            updateEditorInstance.setData('');
        },
        readFormData: function() {
            // add_content
            const addEditorInstance = CKEDITOR.instances.add_content;
            const contentWithHTML = addEditorInstance.getData();

            // request
            return {
                "category": $("#addModal .form select[name=category]").val(),
                "status": $("#addModal .form select[name=status]").val(),
                "title": $("#addModal .form input[name=title]").val(),
                "content": contentWithHTML
            };
        }
    });

    /**
     * init update
     */
    // init update editor
    CKEDITOR.replace('update_content');
    $.adminTable.initUpdate( {
        url: base_url + "/system/message/update",
        writeFormData: function(row) {
            // base data
            $("#updateModal .form input[name='id']").val( row.id );
            $("#updateModal .form select[name='category']").val( row.category );
            $("#updateModal .form select[name='status']").val( row.status );
            $("#updateModal .form input[name='title']").val( row.title );
            $("#updateModal .form input[name='status']").val( row.status );

            // add_content
            const updateEditorInstance = CKEDITOR.instances.update_content;
            updateEditorInstance.setData( row.content );
        },
        rules : {
            title : {
                required : true,
                rangelength:[4, 50]
            }
        },
        messages : {
            title : {
                required : "请输入通知标题",
                rangelength: I18n.system_lengh_limit + "[4-20]"
            }
        },
        readFormData: function() {
            // add_content
            const updateEditorInstance = CKEDITOR.instances.update_content;
            const contentWithHTML = updateEditorInstance.getData();
            if (!contentWithHTML) {
                layer.open({title: I18n.system_tips ,
                    btn: [ I18n.system_ok ],
                    content: "请输入通知正文",
                    icon: '2'
                });
                return;
            }

            // request
            return {
                "id": $("#updateModal .form input[name=id]").val(),
                "category": $("#updateModal .form select[name=category]").val(),
                "status": $("#updateModal .form select[name=status]").val(),
                "title": $("#updateModal .form input[name=title]").val(),
                "content": contentWithHTML
            };
        }
    });

});

</script>
<!-- 3-script end -->

</body>
</html>