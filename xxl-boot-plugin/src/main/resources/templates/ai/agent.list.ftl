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
                                <label for="lastname" class="col-sm-2 control-label">账号<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="username" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">密码<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="password" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">登录token<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="userToken" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">状态：0-正常、1-禁用<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="status" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">真实姓名<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="realName" placeholder="" maxlength="100" ></div>
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
                                <label for="lastname" class="col-sm-2 control-label">账号<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="username" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">密码<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="password" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">登录token<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="userToken" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">状态：0-正常、1-禁用<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="status" placeholder="" maxlength="100" ></div>
                            </div>
                            <div class="form-group">
                                <label for="lastname" class="col-sm-2 control-label">真实姓名<font color="red">*</font></label>
                                <div class="col-sm-10"><input type="text" class="form-control" name="realName" placeholder="" maxlength="100" ></div>
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
            url: base_url + "/ai/agent/pageList",
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
                    title: '用户ID',
                    field: 'id',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '账号',
                    field: 'username',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '密码',
                    field: 'password',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '登录token',
                    field: 'userToken',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '状态：0-正常、1-禁用',
                    field: 'status',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '真实姓名',
                    field: 'realName',
                    width: '20',
                    widthUnit: '%'
                }
                ,{
                    title: '新增时间',
                    field: 'addTime',
                    width: '20',
                    widthUnit: '%'
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
                    "username": $("#addModal .form input[name=username]").val(),
                    "password": $("#addModal .form input[name=password]").val(),
                    "userToken": $("#addModal .form input[name=userToken]").val(),
                    "status": $("#addModal .form input[name=status]").val(),
                    "realName": $("#addModal .form input[name=realName]").val(),
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
                $("#updateModal .form input[name='username']").val( row.username );
                $("#updateModal .form input[name='password']").val( row.password );
                $("#updateModal .form input[name='userToken']").val( row.userToken );
                $("#updateModal .form input[name='status']").val( row.status );
                $("#updateModal .form input[name='realName']").val( row.realName );
            },
            rules : {
            },
            messages : {
            },
            readFormData: function() {
                // request
                return {
                    "id": $("#updateModal .form input[name=id]").val(),
                    "username": $("#updateModal .form input[name=username]").val(),
                    "password": $("#updateModal .form input[name=password]").val(),
                    "userToken": $("#updateModal .form input[name=userToken]").val(),
                    "status": $("#updateModal .form input[name=status]").val(),
                    "realName": $("#updateModal .form input[name=realName]").val(),
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