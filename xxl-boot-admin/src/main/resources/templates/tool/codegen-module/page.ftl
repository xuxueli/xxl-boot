<!DOCTYPE html>
<html>
<head>
<#noparse>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
    <!-- 1-style end -->
</#noparse>

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
                        <button class="btn btn-block btn-primary searchBtn" ><#noparse>${I18n.system_search}</#noparse></button>
                    </div>
                    <div class="col-xs-1">
                        <button class="btn btn-block btn-default resetBtn" ><#noparse>${I18n.system_reset}</#noparse></button>
                    </div>
                </div>
            </div>
        </div>

        <!-- 数据表格区域 -->
        <div class="row">
            <div class="col-xs-12">
                <div class="box">
                    <div class="box-header pull-left" id="data_operation" >
                        <button class="btn btn-sm btn-info add" type="button"><i class="fa fa-plus" ></i><#noparse>${I18n.system_opt_add}</#noparse></button>
                        <button class="btn btn-sm btn-warning selectOnlyOne update" type="button"><i class="fa fa-edit"></i><#noparse>${I18n.system_opt_edit}</#noparse></button>
                        <button class="btn btn-sm btn-danger selectAny delete" type="button"><i class="fa fa-remove "></i><#noparse>${I18n.system_opt_del}</#noparse></button>
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
                            <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                                <#list classInfo.fieldList as fieldItem >
                                    <#if fieldItem.fieldName != "id" && fieldItem.fieldName != "addTime" && fieldItem.fieldName != "updateTime">
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">${fieldItem.fieldComment}<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="${fieldItem.fieldName}" placeholder="" maxlength="100" ></div>
                            </div>
                                    </#if>
                                </#list>
                            </#if>

                            <br>
                            <div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
                                <div style="margin-top: 10px;" >
                                    <button type="submit" class="btn btn-primary"  ><#noparse>${I18n.system_save}</#noparse></button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal"><#noparse>${I18n.system_cancel}</#noparse></button>
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
                            <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                                <#list classInfo.fieldList as fieldItem >
                                    <#if fieldItem.fieldName != "id" && fieldItem.fieldName != "addTime" && fieldItem.fieldName != "updateTime">
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">${fieldItem.fieldComment}<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="${fieldItem.fieldName}" placeholder="" maxlength="100" ></div>
                            </div>
                                    </#if>
                                </#list>
                            </#if>

                            <div class="form-group" style="text-align:center;border-top: 1px solid #e4e4e4;">
                                <div style="margin-top: 10px;" >
                                    <button type="submit" class="btn btn-primary"  ><#noparse>${I18n.system_save}</#noparse></button>
                                    <button type="button" class="btn btn-default" data-dismiss="modal"><#noparse>${I18n.system_cancel}</#noparse></button>
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
<#noparse>
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<!-- admin table -->
<script src="${request.contextPath}/static/biz/common/admin.table.js"></script>
</#noparse>
<script>
    $(function() {

        // ---------- ---------- ---------- table + curd  ---------- ---------- ----------

        /**
         * init table
         */
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/${classInfo.className?uncap_first}/pageList",
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
                <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                    <#list classInfo.fieldList as fieldItem >
                ,{
                    title: '${fieldItem.fieldComment}',
                    field: '${fieldItem.fieldName}',
                    width: '20',
                    widthUnit: '%'
                }
                    </#list>
                </#if>
            ]
        });

        /**
         * init delete
         */
        $.adminTable.initDelete({
            url: base_url + "/${classInfo.className?uncap_first}/delete"
        });


        /**
         * init add
         */
        // init add editor
        $.adminTable.initAdd( {
            url: base_url + "/${classInfo.className?uncap_first}/insert",
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                        <#list classInfo.fieldList as fieldItem >
                            <#if fieldItem.fieldName != "id" && fieldItem.fieldName != "addTime" && fieldItem.fieldName != "updateTime">
                    "${fieldItem.fieldName}": $("#addModal .form input[name=${fieldItem.fieldName}]").val()<#if fieldItem?has_next>,</#if>
                            </#if>
                        </#list>
                    </#if>
                };
            }
        });

        /**
         * init update
         */
        $.adminTable.initUpdate( {
            url: base_url + "/${classInfo.className?uncap_first}/update",
            writeFormData: function(row) {
                // base data

                <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                    <#list classInfo.fieldList as fieldItem >
                        <#if fieldItem.fieldName != "addTime" && fieldItem.fieldName != "updateTime">
                $("#updateModal .form input[name='${fieldItem.fieldName}']").val( row.${fieldItem.fieldName} );
                        </#if>
                    </#list>
                </#if>
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    <#if classInfo.fieldList?? && classInfo.fieldList?size gt 0>
                    <#list classInfo.fieldList as fieldItem >
                    "${fieldItem.fieldName}": $("#updateModal .form input[name=${fieldItem.fieldName}]").val()<#if fieldItem?has_next>,</#if>
                    </#list>
                    </#if>
                };
            }
        });

    });

</script>
<!-- 3-script end -->

</body>
</html>