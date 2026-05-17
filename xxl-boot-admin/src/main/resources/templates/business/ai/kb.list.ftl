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
                            <span class="input-group-addon">知识库名称</span>
                            <input type="text" class="form-control kbName" autocomplete="on" >
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
                        <button class="btn btn-sm btn-primary selectAny toManageDoc" type="button">知识管理</button>
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
                                <label for="lastname" class="col-sm-2 control-label">知识库名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="kbName" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">知识库描述<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="kbDesc" placeholder="" maxlength="100" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">嵌入模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="embeddingModel" placeholder="" maxlength="100" value="qwen3-embedding:0.6b" readonly ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">向量库类型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="vectorDbType" placeholder="" maxlength="100" value="milvus" readonly ></div>
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
                                <label for="lastname" class="col-sm-2 control-label">知识库名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="kbName" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">知识库描述<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <textarea class="form-control" name="kbDesc" placeholder="" maxlength="100" rows="3"></textarea>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">嵌入模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="embeddingModel" placeholder="" maxlength="100" value="qwen3-embedding:0.6b" readonly ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">向量库类型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="vectorDbType" placeholder="" maxlength="100" value="milvus" readonly ></div>
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

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/ai/kb/pageList",
            queryParams: function (params) {
                var obj = {};
                obj.kbName = $('#data_filter .kbName').val();
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
                    width: '5',
                    widthUnit: '%'
                }
                ,{
                    title: '知识库名称',
                    field: 'kbName',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: '知识库描述',
                    field: 'kbDesc',
                    width: '20',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return (value && value.length>10) ? value.substring(0, 10) + '...' : value;
                    }
                }
                ,{
                    title: '嵌入模型',
                    field: 'embeddingModel',
                    width: '13',
                    widthUnit: '%'
                }
                ,{
                    title: '向量库类型',
                    field: 'vectorDbType',
                    width: '5',
                    widthUnit: '%'
                }
                ,{
                    title: '向量集合名',
                    field: 'collectionName',
                    width: '10',
                    widthUnit: '%'
                }
                ,{
                    title: '新增时间',
                    field: 'addTime',
                    width: '12',
                    widthUnit: '%'
                }
            ]
        });

        /**
         * init delete
         */
        $.adminTable.initDelete({
            url: base_url + "/ai/kb/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/ai/kb/insert",
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "kbName": $("#addModal [name=kbName]").val(),
                    "kbDesc": $("#addModal [name=kbDesc]").val(),
                    "embeddingModel": $("#addModal [name=embeddingModel]").val(),
                    "vectorDbType": $("#addModal [name=vectorDbType]").val(),
                    /*"collectionName": $("#addModal [name=collectionName]").val(),*/
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/ai/kb/update",
            writeFormData: function(row) {
                // base data

                $("#updateModal [name='id']").val( row.id );
                $("#updateModal [name='kbName']").val( row.kbName );
                $("#updateModal [name='kbDesc']").val( row.kbDesc );
                $("#updateModal [name='embeddingModel']").val( row.embeddingModel );
                $("#updateModal [name='vectorDbType']").val( row.vectorDbType );
                /*$("#updateModal [name='collectionName']").val( row.collectionName );*/
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal [name=id]").val(),
                    "kbName": $("#updateModal [name=kbName]").val(),
                    "kbDesc": $("#updateModal [name=kbDesc]").val(),
                    "embeddingModel": $("#updateModal [name=embeddingModel]").val(),
                    "vectorDbType": $("#updateModal [name=vectorDbType]").val(),
                    "collectionName": $("#updateModal [name=collectionName]").val(),
                    "addTime": $("#updateModal [name=addTime]").val(),
                    "updateTime": $("#updateModal [name=updateTime]").val()
                };
            }
        });


        // ---------- ---------- ---------- document manage ---------- ---------- ----------

        $("#data_operation .toManageDoc").click(function(){
            // get select rows
            var rows = $.adminTable.selectRows();
            // find select row
            if (rows.length !== 1) {
                layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
                return;
            }
            var row = rows[0];

            // open chat detail
            let title = row.kbName.size>10?row.kbName.substring(0,10) + "...":row.kbName;
            let url = base_url + '/ai/kb/document?kbId=' + row.id;
            openTab(url, title, false);
        });

    });

</script>
<!-- 3-script end -->

</body>
</html>