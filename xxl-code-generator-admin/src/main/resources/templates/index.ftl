<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8"/>
    <title>代码生成平台</title>

    <#import "common/common.macro.ftl" as netCommon>
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/lib/codemirror.css">
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.css">

</head>
<body class="hold-transition skin-blue layout-top-nav ">
<div class="wrapper">

    <#-- header -->
    <@netCommon.commonHeader />


    <#-- content -->
    <div class="content-wrapper">
        <div class="container">
            <section class="content">
                <div class="row">
                    <div class="col-md-12">
                        <form role="form-inline">
                            <div class="form-group">
                                <label for="packageName">package</label>
                                <input name="packageName" type="text" class="form-control" id="packageName"
                                       placeholder="请输入package">
                            </div>

                            <button type="button" class="btn btn-default " id="codeGenerate">生成代码
                            </button>

                            <button type="button" class="btn btn-default " id="getParseTableSql">生成增删改查模板文件
                            </button>
                        </form>
                    </div>
                </div>
                <div class="row" style="margin-top: 20px">

                    <#-- left -->
                    <div class="col-md-12">
                        <#-- 表结构 -->
                        <div class="box box-default">
                            <div class="box-header with-border">
                                <h4 class="pull-left">表结构信息</h4>
                            </div>
                            <div class="box-body">
                                <ul class="chart-legend clearfix">
                                    <li>
                                        <small class="text-muted">
                                            <textarea id="tableSql" placeholder="请输入表结构信息...">
CREATE TABLE `userinfo` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(255) NOT NULL COMMENT '用户名',
  `addtime` datetime NOT NULL COMMENT '创建时间',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='用户信息'
                                            </textarea>
                                        </small>
                                    </li>
                                </ul>
                            </div>
                        </div>


                        <#-- 生成代码 -->
                        <div class="nav-tabs-custom">
                            <!-- Tabs within a box -->
                            <ul class="nav nav-tabs pull-right">
                                <li class="pull-left header">生成代码</li>

                                <li><a href="#model" data-toggle="tab">Model</a></li>
                                <li><a href="#mybatis" data-toggle="tab">Mybatis</a></li>
                                <li><a href="#dao" data-toggle="tab">Dao</a></li>
                                <li><a href="#service_impl" data-toggle="tab">ServiceImpl</a></li>
                                <li><a href="#service" data-toggle="tab">Service</a></li>
                                <li class="active"><a href="#controller" data-toggle="tab">Controller</a></li>

                            </ul>
                            <div class="tab-content no-padding">
                                <div class="chart tab-pane active" id="controller">
                                    <div class="box-body">
                                        Controller：<textarea id="controller_ide"></textarea>
                                    </div>
                                </div>
                                <div class="chart tab-pane active" id="service">
                                    <div class="box-body">
                                        Service：<textarea id="service_ide"></textarea>
                                    </div>
                                </div>
                                <div class="chart tab-pane active" id="service_impl">
                                    <div class="box-body">
                                        ServiceImpl：<textarea id="service_impl_ide"></textarea>
                                    </div>
                                </div>
                                <div class="chart tab-pane active" id="dao">
                                    <div class="box-body">
                                        Dao：<textarea id="dao_ide"></textarea>
                                    </div>
                                </div>
                                <div class="chart tab-pane active" id="mybatis">
                                    <div class="box-body">
                                        Mybatis：<textarea id="mybatis_ide"></textarea>
                                    </div>
                                </div>
                                <div class="chart tab-pane active" id="model">
                                    <div class="box-body ">
                                        Model：<textarea id="model_ide"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>

                    <#--&lt;#&ndash; right &ndash;&gt;
                    <div class="col-md-3">

                        <div class="box box-default">
                            <div class="box-header with-border">
                                <small class="text-muted" >表结构信息</small>
                                <button type="button" class="btn btn-default btn-xs pull-right" >生成代码</button>
                            </div>
                            <!-- /.box-header &ndash;&gt;
                            <div class="box-body">
                                <ul class="chart-legend clearfix">
                                    <li>
                                        <small class="text-muted" >
                                            <textarea id="tableSql" placeholder="请输入表结构信息..." ></textarea>
                                            &lt;#&ndash;<textarea rows="5" style="width: 100%;"></textarea>&ndash;&gt;
                                        </small>
                                    </li>
                                </ul>
                            </div>
                            <div class="box-footer no-padding">
                                <ul class="nav nav-pills nav-stacked">
                                    &lt;#&ndash;<li><a> 主题数：10 </a></li>&ndash;&gt;
                                </ul>
                            </div>
                        </div>

                    </div>-->


                </div>

            </section>


        </div>
    </div>

    <!-- footer -->
    <@netCommon.commonFooter />

</div>

<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/codemirror/lib/codemirror.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/show-hint.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/addon/hint/anyword-hint.js"></script>

<script src="${request.contextPath}/static/plugins/codemirror/addon/display/placeholder.js"></script>

<script src="${request.contextPath}/static/plugins/codemirror/mode/clike/clike.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/sql/sql.js"></script>
<script src="${request.contextPath}/static/plugins/codemirror/mode/xml/xml.js"></script>

<script src="${request.contextPath}/static/js/index.js"></script>

<script type="application/javascript">

    var ruleMap = {};

    function openVerificationPage(columnName, fieldName, fieldClass, fieldComment) {
        ruleMap.fieldName = fieldName;
        ruleMap.check = {};
        $.ajax({
            type: 'POST',
            url: base_url + "/getVerification",
            data: {
                "columnName": columnName,
                "fieldName": fieldName,
                "fieldClass": fieldClass,
                "fieldComment": fieldComment,
            },
            dataType: "json",
            success: function (data) {
                var title = "";
                title += "选择字段验证方式:";
                title += "columnName : " + columnName + "&nbsp;&nbsp;";
                title += "fieldName : " + fieldName + "&nbsp;&nbsp;";
                title += "fieldClass : " + fieldClass + "&nbsp;&nbsp;";
                title += "fieldComment : " + fieldComment + "&nbsp;&nbsp;";
                if (data.code == 200) {
                    layer.open({
                        id: columnName + "dialog",
                        type: 1,
                        maxmin: true,//允许全屏最小化
                        title: title,
                        area: '1000px',
                        btn: ["提交", '关闭'],
                        content: data.data.verification,
                        yes: function (index, layero) {
                            ruleMap.check = [];
                            var label = "";
                            var hasError = false;
                            $("input:checkbox[name='" + fieldName + "_checkbox']:checked").each(function () {
                                var checkItem = {};
                                var rule = $(this).attr("rule");
                                checkItem.rule = rule;
                                if (rule == "min") {
                                    checkItem.min = $("#" + fieldName + "_min_text_id").val();
                                    if (checkItem.min == "undefined" || checkItem.min == "") {
                                        layer.msg('您选择最小值验证，请填入最小值');
                                        hasError = true;
                                        return false;
                                    }
                                }
                                if (rule == "max") {
                                    checkItem.max = $("#" + fieldName + "_max_text_id").val();
                                    if (checkItem.max == "undefined" || checkItem.max == "") {
                                        layer.msg('您选择最大值验证，请填入最大值');
                                        hasError = true;
                                        return false;
                                    }
                                }
                                checkItem.errorInfo = $("#" + fieldName + "_" + rule + "_errorInfo").val();
                                ruleMap.check.push(checkItem);
                                label += "<span class=\"label label-default\">" + checkItem.errorInfo + "</span>&nbsp;&nbsp;";
                            });
                            $("#" + fieldName + "_check").html(label);
                            if (!hasError) {
                                layer.close(index);
                            }
                        },
                        success: function (content) {
                        }
                    });
                } else {
                    layer.open({
                        icon: '2',
                        content: (data.msg || '打开字段失败')
                    });
                }
            }
        });
    }
</script>
</body>
</html>
