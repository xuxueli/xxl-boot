<!DOCTYPE html>
<html>
<head>
<#noparse>
    <#import "/framework/common/common.macro.ftl" as netCommon>
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
</#noparse>
<#assign cnLower = codegen.businessName?uncap_first />
</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">
        <div class="box" style="margin-bottom:9px;">
            <div class="box-body">
                <div class="row" id="data_filter" >
                    <div class="col-xs-3">
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

        <div class="modal fade" id="addModal" tabindex="-1" role="dialog"  aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header"><h4 class="modal-title" >新增记录</h4></div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >
                            <#if fields?? && fields?size gt 0>
                                <#list fields as fieldItem >
                                    <#if fieldItem.javaField != "id" && fieldItem.javaField != "addTime" && fieldItem.javaField != "updateTime">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">${fieldItem.columnComment}<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="${fieldItem.javaField}" placeholder="" maxlength="100" ></div>
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

        <div class="modal fade" id="updateModal" tabindex="-1" role="dialog"  aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header"><h4 class="modal-title" >更新记录</h4></div>
                    <div class="modal-body">
                        <form class="form-horizontal form" role="form" >
                            <#if fields?? && fields?size gt 0>
                                <#list fields as fieldItem >
                                    <#if fieldItem.javaField != "id" && fieldItem.javaField != "addTime" && fieldItem.javaField != "updateTime">
                            <div class="form-group">
                                <label class="col-sm-2 control-label">${fieldItem.columnComment}<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="${fieldItem.javaField}" placeholder="" maxlength="100" ></div>
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
    </section>
</div>

<#noparse>
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/framework/admin.table.js"></script>
</#noparse>
<script>
    $(function() {
        $.adminTable.initTable({
            table: '#data_list',
            url: base_url + "/${cnLower}/pageList",
            queryParams: function (params) {
                var obj = {};
                obj.param = $('#data_filter .param').val();
                obj.offset = params.offset;
                obj.pagesize = params.limit;
                return obj;
            },
            columns: [
                { checkbox: true, field: 'state', width: '5', widthUnit: '%' }
                <#if fields?? && fields?size gt 0>
                    <#list fields as fieldItem >
                ,{ title: '${fieldItem.columnComment}', field: '${fieldItem.javaField}', width: '20', widthUnit: '%' }
                    </#list>
                </#if>
            ]
        });
        $.adminTable.initDelete({ url: base_url + "/${cnLower}/delete" });
        $.adminTable.initAdd({
            url: base_url + "/${cnLower}/insert",
            rules : {}, messages : {},
            readFormData: function() {
                return {
                    <#if fields?? && fields?size gt 0>
                        <#list fields as fieldItem >
                            <#if fieldItem.javaField != "id" && fieldItem.javaField != "addTime" && fieldItem.javaField != "updateTime">
                    "${fieldItem.javaField}": $("#addModal [name=${fieldItem.javaField}]").val()<#if fieldItem?has_next>,</#if>
                            </#if>
                        </#list>
                    </#if>
                };
            }
        });
        $.adminTable.initUpdate({
            url: base_url + "/${cnLower}/update",
            writeFormData: function(row) {
                <#if fields?? && fields?size gt 0>
                    <#list fields as fieldItem >
                        <#if fieldItem.javaField != "addTime" && fieldItem.javaField != "updateTime">
                $("#updateModal [name='${fieldItem.javaField}']").val( row.${fieldItem.javaField} );
                        </#if>
                    </#list>
                </#if>
            },
            rules : {}, messages : {},
            readFormData: function() {
                return {
                    <#if fields?? && fields?size gt 0>
                    <#list fields as fieldItem >
                    "${fieldItem.javaField}": $("#updateModal [name=${fieldItem.javaField}]").val()<#if fieldItem?has_next>,</#if>
                    </#list>
                    </#if>
                };
            }
        });
    });
</script>
</body>
</html>
