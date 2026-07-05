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
            <div class="col-sm-5">
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
                                <label class="col-sm-3 control-label">下拉框：</label>
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
            <div class="col-sm-7">
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
/**
 * xxl-boot 表单构建器 (pagegen)
 *
 * 功能：
 *   1. 左侧调色板元素可拖拽（jQuery UI draggable）
 *   2. 右侧设计区可放置（jQuery UI droppable），内部可排序（sortable）
 *   3. 列数切换（1列 / 2列），元素在列之间重新分配
 *   4. checkbox / radio 使用 iCheck 美化
 *   5. 生成的 HTML 代码自动格式化并弹窗展示
 *   6. 每个已拖入元素支持"编辑HTML"（弹窗修改源码）和"移除"
 */

$(function () {
    // =========================================
    // 1. 初始化：启用拖拽 + 排序
    // =========================================
    setup_draggable();

    // =========================================
    // 2. 列数切换（1列 / 2列）
    // =========================================
    $("#n-columns").on("change", function () {
        var $formBody = $('.form-body');
        var $col12 = $formBody.find('.col-md-12');
        var $col6  = $formBody.find('.col-md-6');
        var v = $(this).val();

        if (v === "1") {
            $col12.show();
            $col6.each(function () {
                $(this).find('.draggable').remove().appendTo($col12);
            });
            $col6.hide();
        } else {
            $col6.show();
            $col12.find('.draggable').each(function (i) {
                $(this).remove().appendTo(i % 2 ? $col6[1] : $col6[0]);
            });
            $col12.hide();
        }
    });

    // =========================================
    // 3. 生成并复制代码
    // =========================================
    $("#copy-to-clipboard").on("click", function () {
        if ($('.form-body .droppable').children().length === 0) {
            layer.msg('请先拖拽表单元素到右侧区域');
            return;
        }

        // 3-1. 克隆设计区 DOM
        var $copy = $(".form-body").clone().appendTo(document.body);

        // 3-2. 销毁 iCheck，恢复原生 input 标记
        $copy.find('input[type="checkbox"], input[type="radio"]').each(function () {
            if ($(this).parent().is('.icheckbox_square-blue, .iradio_square-blue')) {
                $(this).iCheck('destroy');
            }
        });

        // 3-3. 移除工具链接、辅助 class 和内联样式
        $copy.find(".tools, :hidden").remove();
        $.each(
            ["draggable", "droppable", "sortable", "dropped",
             "ui-sortable", "ui-draggable", "ui-droppable", "form-body"],
            function (i, c) {
                $copy.find("." + c).removeClass(c).removeAttr("style");
            }
        );

        // 3-4. 格式化 + 清理
        var html = html_beautify($copy.html());
        $copy.remove();

        // 3-5. 弹窗展示
        var $modal = get_modal(html).modal("show");
        $modal.find(".btn").remove();
        $modal.find(".modal-title").html("复制HTML代码");
        $modal.find("textarea").select().focus();

        return false;
    });

});

// =============================================
// 4. jQuery UI 拖拽 + 放置 + 排序
// =============================================
var setup_draggable = function () {
    // 4-1. 左侧调色板元素可拖拽（clone 模式保留原模板）
    $(".draggable").draggable({
        appendTo: "body",
        helper: "clone"
    });

    // 4-2. 右侧设计区可放置 + 内部排序
    $(".droppable").droppable({
        accept: ".draggable",
        helper: "clone",
        hoverClass: "droppable-active",

        // 4-3. 放置事件
        drop: function (event, ui) {
            $(".empty-form").remove();
            var $orig = $(ui.draggable);

            if (!$orig.hasClass("dropped")) {
                // ==== 首次拖入（从左侧调色板） ====
                var $el = $orig
                    .clone()
                    .addClass("dropped")
                    .css({ "position": "static", "left": null, "right": null })
                    .appendTo(this);

                // 递增 id 避免设计区内重复
                var id = $orig.find(":input").attr("id");
                if (id) {
                    var parts = id.split("-");
                    var base  = parts.slice(0, -1).join("-");
                    var num   = parseInt(parts.slice(-1)) + 1;
                    $orig.find(":input").attr("id", base + "-" + num);
                    $orig.find("label").attr("for", base + "-" + num);
                }

                // iCheck 美化
                $el.find('input[type="checkbox"], input[type="radio"]').iCheck({
                    checkboxClass: 'icheckbox_square-blue',
                    radioClass:    'iradio_square-blue'
                });

                // 附加编辑 / 移除工具
                $('<p class="tools col-sm-12 col-sm-offset-3">' +
                  '<a class="edit-link">编辑HTML</a> | ' +
                  '<a class="remove-link">移除</a></p>').appendTo($el);

            } else {
                // ==== 在设计区之间移动已有元素 ====
                if ($(this)[0] !== $orig.parent()[0]) {
                    $orig.clone()
                         .css({ "position": "static", "left": null, "right": null })
                         .appendTo(this);
                    $orig.remove();
                }
            }
        }
    }).sortable();
};

// =============================================
// 5. 创建编辑弹窗
// =============================================
var get_modal = function (content) {
    return $(
        '<div class="modal" style="overflow: auto;" tabindex="-1">' +
          '<div class="modal-dialog">' +
            '<div class="modal-content">' +
              '<div class="modal-header">' +
                '<a type="button" class="close" data-dismiss="modal">&times;</a>' +
                '<h4 class="modal-title">编辑HTML</h4>' +
              '</div>' +
              '<div class="modal-body ui-front">' +
                '<textarea class="form-control" style="min-height:300px;margin-bottom:10px;font-family:Monaco,Fixed;">' +
                  content +
                '</textarea>' +
                '<button class="btn btn-success">更新HTML</button>' +
              '</div>' +
            '</div>' +
          '</div>' +
        '</div>'
    ).appendTo(document.body);
};

// =============================================
// 6. 编辑链接 → 弹窗修改元素 HTML 源码
// =============================================
$(document).on("click", ".edit-link", function () {
    var $el    = $(this).parent().parent();       // div.form-group
    var $clone = $el.clone();
    var $tools = $clone.find(".edit-link").parent().remove();  // 剥离工具条

    var $modal = get_modal(html_beautify($clone.html())).modal("show");
    $modal.find("textarea").focus();

    $modal.find(".btn-success").click(function () {
        var html = $modal.find("textarea").val();
        if (!html) {
            $el.remove();                         // 清空内容 → 删除元素
        } else {
            $el.html(html);
            $tools.appendTo($el);                 // 重新挂载工具条
        }
        $modal.modal("hide");
        return false;
    });
});

// =============================================
// 7. 移除链接 → 删除该表单元素
// =============================================
$(document).on("click", ".remove-link", function () {
    $(this).parent().parent().remove();
});
</script>
<!-- 3-script end -->

</body>
</html>
