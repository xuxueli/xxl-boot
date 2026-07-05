<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "/framework/common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <style>
        .droppable-active { background-color: #ffe !important; }
        .tools a { cursor: pointer; font-size: 80%; }
        .draggable { cursor: move; }
        .form-body .col-md-6, .form-body .col-md-12 { min-height: 400px; }
    </style>
    <link rel="stylesheet" href="${request.contextPath}/static/adminlte/plugins/iCheck/square/blue.css">
    <!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

        <#-- biz start（4/5 content） -->
        <div class="row">
            <!-- 操作区域 -->
            <div class="col-sm-4">
                <div class="box box-default">
                    <div class="box-header with-border">
                        <h5 class="pull-left">元素</h5>
                    </div>
                    <div class="box-body">
                        <div class="alert alert-info">
                            拖拽表单元素到右侧区域，即可生成HTML表单代码 ！
                        </div>
                        <form role="form" class="form-horizontal m-t">
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">输入框：</label>
                                <div class="col-sm-9">
                                    <input type="text" name="" class="form-control" placeholder="请输入文本">
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">文本框：</label>
                                <div class="col-sm-9">
                                    <textarea class="form-control" rows="3" placeholder="请输入多行文本"></textarea>
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">密码框：</label>
                                <div class="col-sm-9">
                                    <input type="password" class="form-control" name="password" placeholder="请输入密码">
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">下拉列表：</label>
                                <div class="col-sm-9">
                                    <select class="form-control" name="">
                                        <option>选项1</option>
                                        <option>选项2</option>
                                        <option>选项3</option>
                                        <option>选项4</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">纯文本：</label>
                                <div class="col-sm-9">
                                    <p class="form-control-static">这里是纯文字信息</p>
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">单选框：</label>
                                <div class="col-sm-9">
                                    <label class="radio-inline">
                                        <input type="radio" checked="" value="option1" id="optionsRadios1" name="optionsRadios">选项1
                                    </label>
                                    <label class="radio-inline">
                                        <input type="radio" value="option2" id="optionsRadios2" name="optionsRadios">选项2
                                    </label>
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">复选框：</label>
                                <div class="col-sm-9">
                                    <label class="checkbox-inline">
                                        <input type="checkbox" value="option1" id="inlineCheckbox1">选项1
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" value="option2" id="inlineCheckbox2">选项2
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" value="option3" id="inlineCheckbox3">选项3
                                    </label>
                                </div>
                            </div>
                            <div class="form-group draggable">
                                <label class="col-sm-3 control-label">日期：</label>
                                <div class="col-sm-9">
                                    <input type="date" class="form-control" name="">
                                </div>
                            </div>
                            <div class="hr-line-dashed"></div>
                            <div class="form-group draggable">
                                <div class="col-sm-12 col-sm-offset-3">
                                    <button class="btn btn-primary" type="button">保存内容</button>
                                    <button class="btn btn-default" type="button">取消</button>
                                </div>
                            </div>
                        </form>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div>

            <!-- 渲染区域 -->
            <div class="col-sm-8">
                <div class="box box-default">
                    <div class="box-header with-border">
                        <h5 class="pull-left">拖拽左侧表单元素到此区域</h5>
                        <div class="pull-right" style="line-height:30px;font-size:12px;">
                            请选择显示的列数：
                            <select id="n-columns" style="height:26px;font-size:12px;">
                                <option value="1">显示1列</option>
                                <option value="2">显示2列</option>
                            </select>
                        </div>
                    </div>
                    <div class="box-body">
                        <div class="row form-body form-horizontal m-t">
                            <div class="col-md-12 droppable sortable">
                            </div>
                            <div class="col-md-6 droppable sortable" style="display: none;">
                            </div>
                            <div class="col-md-6 droppable sortable" style="display: none;">
                            </div>
                        </div>
                        <button type="button" class="btn btn-warning" id="copy-to-clipboard">复制代码</button>
                    </div>
                </div>
            </div>
        </div>
        <#-- biz end（4/5 content） -->

    </section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/jquery-ui/jquery-ui.min.js"></script>
<script src="${request.contextPath}/static/plugins/jsbeautify/beautify-html.min.js"></script>
<script src="${request.contextPath}/static/adminlte/plugins/iCheck/icheck.min.js"></script>
<script>
$(function () {

    setup_draggable();

    $("#n-columns").on("change", function () {
        var v = $(this).val();
        if (v === "1") {
            var $col = $('.form-body .col-md-12').show();
            $('.form-body .col-md-6 .draggable').each(function (i, el) {
                $(this).remove().appendTo($col);
            });
            $('.form-body .col-md-6').hide();
        } else {
            var $col = $('.form-body .col-md-6').show();
            $(".form-body .col-md-12 .draggable").each(function (i, el) {
                $(this).remove().appendTo(i % 2 ? $col[1] : $col[0]);
            });
            $('.form-body .col-md-12').hide();
        }
    });

    $("#copy-to-clipboard").on("click", function () {
        if ($('.form-body .droppable').children().length === 0) {
            layer.msg('请先拖拽表单元素到右侧区域');
            return;
        }

        var $copy = $(".form-body").clone().appendTo(document.body);
        $copy.find(".tools, :hidden").remove();
        $.each(["draggable", "droppable", "sortable", "dropped", "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function (i, c) {
            $copy.find("." + c).removeClass(c).removeAttr("style");
        });
        var html = html_beautify($copy.html());
        $copy.remove();

        var $modal = get_modal(html).modal("show");
        $modal.find(".btn").remove();
        $modal.find(".modal-title").html("复制HTML代码");
        $modal.find("textarea").select().focus();

        return false;
    });

});

var setup_draggable = function () {
    $(".draggable").draggable({
        appendTo: "body",
        helper: "clone"
    });
    $(".droppable").droppable({
        accept: ".draggable",
        helper: "clone",
        hoverClass: "droppable-active",
        drop: function (event, ui) {
            $(".empty-form").remove();
            var $orig = $(ui.draggable);
            if (!$orig.hasClass("dropped")) {
                var $el = $orig
                    .clone()
                    .addClass("dropped")
                    .css({ "position": "static", "left": null, "right": null })
                    .appendTo(this);

                var id = $orig.find(":input").attr("id");
                if (id) {
                    id = id.split("-").slice(0, -1).join("-") + "-" + (parseInt(id.split("-").slice(-1)[0]) + 1);
                    $orig.find(":input").attr("id", id);
                    $orig.find("label").attr("for", id);
                }

                $('<p class="tools col-sm-12 col-sm-offset-3">' +
                    '<a class="edit-link">编辑HTML</a> | ' +
                    '<a class="remove-link">移除</a></p>').appendTo($el);
            } else {
                if ($(this)[0] !== $orig.parent()[0]) {
                    var $el = $orig
                        .clone()
                        .css({ "position": "static", "left": null, "right": null })
                        .appendTo(this);
                    $orig.remove();
                }
            }
        }
    }).sortable();
};

var get_modal = function (content) {
    var modal = $('<div class="modal" style="overflow: auto;" tabindex="-1">' +
        '<div class="modal-dialog">' +
            '<div class="modal-content">' +
                '<div class="modal-header">' +
                    '<a type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</a>' +
                    '<h4 class="modal-title">编辑HTML</h4>' +
                '</div>' +
                '<div class="modal-body ui-front">' +
                    '<textarea class="form-control" style="min-height: 300px; margin-bottom: 10px; font-family: Monaco, Fixed;">' + content + '</textarea>' +
                    '<button class="btn btn-success">更新HTML</button>' +
                '</div>' +
            '</div>' +
        '</div>' +
    '</div>').appendTo(document.body);

    return modal;
};

$(document).on("click", ".edit-link", function (ev) {
    var $el = $(this).parent().parent();
    var $el_copy = $el.clone();
    var $edit_btn = $el_copy.find(".edit-link").parent().remove();

    var $modal = get_modal(html_beautify($el_copy.html())).modal("show");
    $modal.find("textarea").focus();
    $modal.find(".btn-success").click(function (ev2) {
        var html = $modal.find("textarea").val();
        if (!html) {
            $el.remove();
        } else {
            $el.html(html);
            $edit_btn.appendTo($el);
        }
        $modal.modal("hide");
        return false;
    });
});

$(document).on("click", ".remove-link", function (ev) {
    $(this).parent().parent().remove();
});
</script>
<!-- 3-script end -->

</body>
</html>
