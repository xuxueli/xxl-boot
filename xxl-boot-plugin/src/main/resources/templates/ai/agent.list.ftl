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
                            <span class="input-group-addon">Agent类型</span>
                            <select class="form-control agentType" >
                                <option value="-1" >${I18n.system_all}</option>
                                <#list AgentTypeEnum as item>
                                    <option value="${item.value}" >${item.desc}</option>
                                </#list>
                            </select>
                        </div>
                    </div>
                    <div class="col-xs-3">
                        <div class="input-group">
                            <span class="input-group-addon">Agent名称</span>
                            <input type="text" class="form-control name" autocomplete="on" >
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

                            <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">Agent基础配置</p>
                            <!-- field -->
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Agent名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Agent类型<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="agentType" >
                                        <#list AgentTypeEnum as item>
                                            <option value="${item.value}" >${item.desc}</option>
                                        </#list>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea id="add_content" name="prompt" rows="5" cols="90" maxlength="500" ></textarea>
                                </div>
                            </div>

                            <br>
                            <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">供应商配置</p>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">供应商类型<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="supplierType" >
                                        <#list SupplierTypeEnum as item>
                                            <option value="${item.value}" >${item.desc}</option>
                                        </#list>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="model" placeholder="例如 qwen3:0.6b" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Ollama Url<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="ollamaUrl" placeholder="例如 http://127.0.0.1:11434" maxlength="100" ></div>
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

                            <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">Agent配置</p>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Agent名称<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="name" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Agent类型<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="agentType" >
                                        <#list AgentTypeEnum as item>
                                            <option value="${item.value}" >${item.desc}</option>
                                        </#list>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">提示词<font color="black">*</font></label>
                                <div class="col-sm-10">
                                    <textarea id="add_content" name="prompt" rows="5" cols="90" maxlength="500" ></textarea>
                                </div>
                            </div>

                            <br>
                            <p style="margin: 0 0 10px;text-align: left;border-bottom: 1px solid #e5e5e5;color: gray;">供应商配置</p>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">供应商类型<font color="red">*</font></label>
                                <div class="col-sm-10">
                                    <select class="form-control" name="supplierType" >
                                        <#list SupplierTypeEnum as item>
                                            <option value="${item.value}" >${item.desc}</option>
                                        </#list>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">模型<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="model" placeholder="例如 qwen3:0.6b" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">Ollama Url<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="ollamaUrl" placeholder="例如 http://127.0.0.1:11434" maxlength="100" ></div>
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

        // ---------- ---------- ---------- convert date 2 js  ---------- ---------- ----------
        const agentTypeMap = {
            <#list AgentTypeEnum as item>
            ${item.value}: "${item.desc}"<#if item?has_next>,</#if>
            </#list>
        };
        const supplierTypeMap = {
            <#list SupplierTypeEnum as item>
            ${item.value}: "${item.desc}"<#if item?has_next>,</#if>
            </#list>
        };

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/ai/agent/pageList",
            queryParams: function (params) {
                var obj = {};
                obj.agentType = $('#data_filter .agentType').val();
                obj.name = $('#data_filter .name').val();
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
                    title: 'AgentID',
                    field: 'id',
                    width: '10',
                    widthUnit: '%'
                }
                ,{
                    title: 'Agent名称',
                    field: 'name',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: 'Agent类型',
                    field: 'agentType',
                    width: '10',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return agentTypeMap[value];
                    }
                }
                ,{
                    title: '供应商类型',
                    field: 'supplierType',
                    width: '10',
                    widthUnit: '%',
                    formatter: function (value, row, index) {
                        return supplierTypeMap[value];
                    }
                }
                ,{
                    title: '提示词',
                    field: 'prompt',
                    width: '20',
                    visible: false,
                    widthUnit: '%'
                }
                ,{
                    title: '模型',
                    field: 'model',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: 'Ollama Url',
                    field: 'ollamaUrl',
                    width: '15',
                    widthUnit: '%'
                }
                ,{
                    title: '新增时间',
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
            url: base_url + "/ai/agent/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/ai/agent/insert",
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "name": $("#addModal .form input[name=name]").val(),
                    "agentType": $("#addModal .form select[name=agentType]").val(),
                    "supplierType": $("#addModal .form select[name=supplierType]").val(),
                    "prompt": $("#addModal .form textarea[name=prompt]").val(),
                    "model": $("#addModal .form input[name=model]").val(),
                    "ollamaUrl": $("#addModal .form input[name=ollamaUrl]").val(),
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/ai/agent/update",
            writeFormData: function(row) {
                // base data

                $("#updateModal .form input[name='id']").val( row.id );
                $("#updateModal .form input[name='name']").val( row.name );
                $("#updateModal .form select[name='agentType']").val( row.agentType );
                $("#updateModal .form select[name='supplierType']").val( row.supplierType );
                $("#updateModal .form textarea[name='prompt']").val( row.prompt );
                $("#updateModal .form input[name='model']").val( row.model );
                $("#updateModal .form input[name='ollamaUrl']").val( row.ollamaUrl );
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal .form input[name=id]").val(),
                    "name": $("#updateModal .form input[name=name]").val(),
                    "agentType": $("#updateModal .form select[name=agentType]").val(),
                    "supplierType": $("#updateModal .form select[name=supplierType]").val(),
                    "prompt": $("#updateModal .form textarea[name=prompt]").val(),
                    "model": $("#updateModal .form input[name=model]").val(),
                    "ollamaUrl": $("#updateModal .form input[name=ollamaUrl]").val(),
                    "addTime": $("#updateModal .form input[name=addTime]").val(),
                    "updateTime": $("#updateModal .form input[name=updateTime]").val()
                };
            }
        });

    });

</script>
<!-- 3-script end -->

</body>
</html>