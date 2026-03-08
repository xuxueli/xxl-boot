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
                        <button class="btn btn-sm btn-primary doEmbedding" type="button">向量处理</button>
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
                        <h4 class="modal-title" >新增知识库</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">知识库<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" value="${kbInfo.kbName}" readonly >
                                    <input type="hidden" name="kbId" value="${kbInfo.id}" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="docName" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档类型<font color="red">*</font></label>
                                <div class="col-sm-4">
                                    <select class="form-control" name="docType" >
                                        <option value="txt" >文本</option>
                                        <option value="md" >Markdown</option>
                                        <option value="pdf" >PDF</option>
                                        <option value="md" >Word</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档内容<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="content" placeholder="" maxlength="100000" rows="10" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文件存储地址<font color="black">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="fileUrl" placeholder="" maxlength="100" ></div>
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
                        <h4 class="modal-title" >更新知识库</h4>
                    </div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >

                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">知识库<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <input type="text" class="form-control" value="${kbInfo.kbName}" readonly >
                                    <input type="hidden" name="kbId" value="${kbInfo.id}" >
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="docName" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档类型<font color="red">*</font></label>
                                <div class="col-sm-4">
                                    <select class="form-control" name="docType" >
                                        <option value="txt" >文本</option>
                                        <option value="md" >Markdown</option>
                                        <option value="pdf" >PDF</option>
                                        <option value="md" >Word</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文档内容<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="content" placeholder="" maxlength="100000" rows="10" ></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">文件存储地址<font color="black">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="fileUrl" placeholder="" maxlength="100" ></div>
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

        const KbDucumentStatusEnum = {
            <#list KbDucumentStatusEnum as item>
            ${item.value}: "${item.desc}"<#if item?has_next>,</#if>
            </#list>
        };

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/ai/kb/document/pageList",
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
                    title: '文档ID',
                    field: 'id',
                    width: '5',
                    widthUnit: '%'
                }
                ,{
                    title: '文档名称',
                    field: 'docName',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: '文档类型',
                    field: 'docType',
                    width: '5',
                    widthUnit: '%'
                }
                ,{
                    title: '原文内容',
                    field: 'content',
                    width: '15',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return (value && value.length>10) ? value.substring(0, 10) + '...' : value;
                    }
                }
                ,{
                    title: '文件存储地址',
                    field: 'fileUrl',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: '状态',
                    field: 'status',
                    width: '10',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return KbDucumentStatusEnum[value];
                    }
                }
                ,{
                    title: '新增时间',
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
            url: base_url + "/ai/kb/document/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/ai/kb/document/insert",
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "kbId": $("#addModal [name=kbId]").val(),
                    "docName": $("#addModal [name=docName]").val(),
                    "docType": $("#addModal [name=docType]").val(),
                    "content": $("#addModal [name=content]").val(),
                    "fileUrl": $("#addModal [name=fileUrl]").val(),
                    "status": $("#addModal [name=status]").val(),
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/ai/kb/document/update",
            writeFormData: function(row) {
                // base data

                $("#updateModal [name='id']").val( row.id );
                $("#updateModal [name='kbId']").val( row.kbId );
                $("#updateModal [name='docName']").val( row.docName );
                $("#updateModal [name='docType']").val( row.docType );
                $("#updateModal [name='content']").val( row.content );
                $("#updateModal [name='fileUrl']").val( row.fileUrl );
                $("#updateModal [name='status']").val( row.status );
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal [name=id]").val(),
                    "kbId": $("#updateModal [name=kbId]").val(),
                    "docName": $("#updateModal [name=docName]").val(),
                    "docType": $("#updateModal [name=docType]").val(),
                    "content": $("#updateModal [name=content]").val(),
                    "fileUrl": $("#updateModal [name=fileUrl]").val(),
                    "status": $("#updateModal [name=status]").val(),
                    "addTime": $("#updateModal [name=addTime]").val(),
                    "updateTime": $("#updateModal [name=updateTime]").val()
                };
            }
        });

        // ---------- ---------- ---------- do embedding ---------- ---------- ----------

        $("#data_operation .doEmbedding").click(function(){
            $.ajax({
                type : 'POST',
                url : base_url + "/ai/kb/embedding/embed",
                data : {
                    "kbId" : ${kbInfo.id}
                },
                dataType : "json",
                success : function(data){
                    if (data.code === 200) {
                        layer.msg( I18n.system_opt + I18n.system_success );
                        // refresh table
                        $('#data_filter .searchBtn').click();
                    } else {
                        layer.msg( data.msg || I18n.system_opt + I18n.system_fail );
                    }
                },
                error: function(xhr, status, error) {
                    // Handle error
                    console.log("Error: " + error);
                    layer.open({
                        icon: '2',
                        content: (I18n.system_opt + I18n.system_fail)
                    });
                }
            });
        });

    });

</script>
<!-- 3-script end -->

</body>
</html>