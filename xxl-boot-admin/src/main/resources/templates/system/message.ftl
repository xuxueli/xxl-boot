<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

    <#-- 1-style start -->
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/css/dataTables.bootstrap.min.css">
    <#-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

            <#-- biz start（4/5 content） -->

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
                    </div>
                </div>
            </div>

            <#-- 数据表格区域 -->
            <div class="row">
                <div class="col-xs-12">
                    <div class="box">
                        <div class="box-header" style="float: right" id="data_operation" >
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

            <#-- biz end（4/5 content） -->

    </section>
</div>

<#-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net/js/jquery.dataTables.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/datatables.net-bs/js/dataTables.bootstrap.min.js"></script>
<script src="${request.contextPath}/static/adminlte/bower_components/ckeditor/ckeditor.js"></script>
<script src="${request.contextPath}/static/biz/common/datatables.select.js"></script>
<script src="${request.contextPath}/static/biz/system/message.js"></script>
<#-- 3-script end -->

</body>
</html>