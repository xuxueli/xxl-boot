<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "/framework/common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

        <#-- 2-biz start -->

        <!-- 第一排：指标卡片 -->
        <div class="row">

            <#-- 用户数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon icon-user"><i class="ion ion-ios-people-outline"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">用户数量</span>
                        <span class="info-box-number">${userTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 角色数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon icon-role"><i class="ion ion-ios-contact-outline"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">角色数量</span>
                        <span class="info-box-number">${roleTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 日志数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon icon-log"><i class="ion ion-ios-paper-outline"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">日志数量</span>
                        <span class="info-box-number">${logTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 消息数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon icon-message"><i class="ion ion-ios-chatboxes-outline"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">消息数量</span>
                        <span class="info-box-number">${messageTotal}</span>
                    </div>
                </div>
            </div>

        </div>

        <#-- 指标卡片样式：压缩高度 + 浅色底彩色图标，参考 UI dashboard -->
        <style>
            /* 指标卡片：压缩 AdminLTE 默认 90px 的高度，控制在 70px */
            .info-box { min-height: 70px; margin-bottom: 15px; }
            .info-box .info-box-icon { height: 70px; width: 70px; font-size: 30px; line-height: 70px; }
            .info-box .info-box-content { margin-left: 70px; padding: 10px; }
            .info-box .info-box-text { font-size: 13px; }
            .info-box .info-box-number { font-size: 20px; font-weight: 600; }
            /* 图标配色 */
            .info-box-icon.icon-user { background-color: #36a3f7; }
            .info-box-icon.icon-role { background-color: #6ab8a8; }
            .info-box-icon.icon-log { background-color: #e0b06b; }
            .info-box-icon.icon-message { background-color: #d38a9a; }
            .icon-user i { color: #fff; }
            .icon-role i { color: #fff; }
            .icon-log i { color: #fff; }
            .icon-message i { color: #fff; }
        </style>

        <!-- 第二排：折线图 + 消息列表 -->
        <div class="row">

            <#-- 审计日志趋势 -->
            <div class="col-md-8">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">审计日志</h3>
                        <!-- 天数切换 -->
                        <div class="pull-right box-tools">
                            <div class="btn-group">
                                <button type="button" class="btn btn-default btn-sm chart-days" data-days="7">7天</button>
                                <button type="button" class="btn btn-default btn-sm chart-days" data-days="14">14天</button>
                                <button type="button" class="btn btn-default btn-sm chart-days active" data-days="30">30天</button>
                            </div>
                        </div>
                    </div>
                    <div class="box-body">
                        <div id="lineChart" style="height: 320px;"></div>
                    </div>
                </div>
            </div>

            <#-- 站内消息 -->
            <div class="col-md-4">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">站内消息</h3>
                    </div>
                    <div class="box-body" id="messageList">
                        <ul class="products-list product-list-in-box">
                            <#if messageList?exists && messageList?size gt 0>
                            <#list messageList as item>
                                <li class="item">
                                    <div class="product-info" style="margin-left: 10px;">
                                        <a href="javascript:void(0)" class="product-title showdetail"
                                           data-title="${item.title}"
                                           data-content="${item.content?html}"
                                           data-sender="${item.sender}"
                                           data-addTime="${item.addTime}" >
                                            ${item.title}
                                            <span class="label label-info pull-right">${item.sender}</span></a>
                                        <span class="product-description">${item.addTime}</span>
                                    </div>
                                </li>
                            </#list>
                            <#else>
                                <li class="item" style="text-align: center;color: #999;">暂无消息</li>
                            </#if>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

        <!-- 查看 站内消息.模态框 start -->
        <div class="modal fade" id="showMessageModal" tabindex="-1" role="dialog"  aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title title">查看站内消息</h4>
                    </div>
                    <div class="modal-body">
                        <style>
                            .msg-section { padding: 10px 0; }
                            .msg-field { margin-bottom: 6px; font-size: 13px; }
                            .msg-field .msg-label { color: #999; margin-right: 4px; }
                            .msg-field .msg-value { color: #333; }
                        </style>

                        <div class="msg-section">
                            <div class="row">
                                <div class="col-sm-4 msg-field"><span class="msg-label">发送人：</span><span class="msg-value sender"></span></div>
                                <div class="col-sm-8 msg-field"><span class="msg-label">时间：</span><span class="msg-value addTime"></span></div>
                            </div>
                            <div class="row" style="margin-top: 6px;">
                                <div class="col-sm-12 msg-content" style="margin-top: 4px; padding: 8px 12px; background: #f9f9f9; border-radius: 4px; min-height: 60px;"></div>
                            </div>
                        </div>

                        <div style="text-align:center;border-top: 1px solid #e4e4e4;padding-top: 10px;">
                            <button type="button" class="btn btn-primary" data-dismiss="modal" >关闭</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看 站内消息.模态框 end -->

        <#-- 2-biz end -->

    </section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<!-- echarts -->
<script src="${request.contextPath}/static/plugins/echarts/echarts.common.min.js"></script>
<script>
$(function () {

    /* --- 审计日志：折线图 --- */

    var lineChart = null;   // ECharts 实例，复用避免重复创建

    // 按天数加载审计日志趋势并渲染
    function loadLogTrend(days) {
        $.ajax({
            type: 'POST',
            url: base_url + '/dashboard/logTrend',
            data: { days: days },
            dataType: 'json',
            success: function (data) {
                if (data.code == 200) {
                    lineChartRender(data.data, days);
                } else {
                    layer.open({
                        title: I18n.system_tips,
                        btn: [I18n.system_ok],
                        content: (data.msg || '图表数据加载失败'),
                        icon: '2'
                    });
                }
            }
        });
    }

    // 渲染折线图：首次创建实例并监听尺寸变化，之后仅更新数据
    function lineChartRender(data, days) {
        if (!lineChart) {
            var el = document.getElementById('lineChart');
            lineChart = echarts.init(el);
            // 容器宽度变化时自适应重绘：仪表盘运行在 iframe 中，window.resize 不可靠，故监听容器自身
            if (window.ResizeObserver) {
                new ResizeObserver(function () { lineChart.resize(); }).observe(el);
            } else {
                $(window).on('resize', function () { lineChart.resize(); });
            }
        }
        lineChart.setOption(lineChartOption(data, days));
    }

    // 构建折线图配置：按天补全日期序列，无数据日期补 0
    function lineChartOption(data, days) {

        // 转为 Map：date → count，方便按日期查找
        var countMap = {};
        $.each(data || [], function (i, item) {
            countMap[item.date] = item.count;
        });

        // 生成连续日期序列，每天对应一个数据点
        var dates = [];
        var counts = [];
        var today = new Date();
        for (var i = days - 1; i >= 0; i--) {
            var date = new Date(today);
            date.setDate(date.getDate() - i);
            var key = formatDate(date);
            dates.push(key);
            counts.push(countMap[key] || 0);
        }

        // 渲染折线图（渐变面积 + 平滑曲线）
        return {
            animation: false,
            tooltip: { trigger: 'axis' },
            grid: { left: 40, right: 20, bottom: 30, top: 20 },
            // X轴：日期
            xAxis: { type: 'category', data: dates, axisLabel: { fontSize: 11, color: '#909399' } },
            // Y轴：数量
            yAxis: { type: 'value', minInterval: 1, axisLabel: { fontSize: 11, color: '#909399' } },
            // 数据：折线
            series: [{
                type: 'line',
                data: counts,
                smooth: true,
                itemStyle: { color: '#3c8dbc' },                            // 数据点颜色
                lineStyle: { width: 2, color: '#3c8dbc' },                  // 折线样式
                areaStyle: {                                                // 渐变面积填充
                    color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(60,141,188,0.3)' },   // 顶部：30% 透明度
                            { offset: 1, color: 'rgba(60,141,188,0.02)' }   // 底部：2% 透明度
                        ]
                    }
                }
            }]
        };
    }

    // 日期格式化：yyyy-MM-dd
    function formatDate(date) {
        var m = date.getMonth() + 1;
        var d = date.getDate();
        return date.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    }

    /* --- 站内消息：点击查看详情 --- */

    $("#messageList").on('click', '.showdetail', function () {
        $('#showMessageModal .title').text($(this).attr('data-title'));
        $('#showMessageModal .msg-content').html($(this).attr('data-content'));
        $('#showMessageModal .sender').text($(this).attr('data-sender'));
        $('#showMessageModal .addTime').text($(this).attr('data-addTime'));
        $('#showMessageModal').modal({ backdrop: false, keyboard: false }).modal('show');
    });

    /* --- 页面初始化 --- */

    loadLogTrend(30);

    // 天数切换：重新加载图表
    $('.chart-days').on('click', function () {
        $('.chart-days').removeClass('active');
        $(this).addClass('active');
        loadLogTrend($(this).attr('data-days'));
    });

});
</script>
<!-- 3-script end -->

</body>
</html>
