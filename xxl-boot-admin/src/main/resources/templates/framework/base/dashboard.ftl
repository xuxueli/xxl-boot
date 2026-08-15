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
                    <span class="info-box-icon bg-blue"><i class="fa fa-user"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">用户数量</span>
                        <span class="info-box-number">${userTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 角色数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-teal"><i class="fa fa-users"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">角色数量</span>
                        <span class="info-box-number">${roleTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 日志数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-orange"><i class="fa fa-list-alt"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">日志数量</span>
                        <span class="info-box-number">${logTotal}</span>
                    </div>
                </div>
            </div>

            <#-- 消息数量 -->
            <div class="col-md-3 col-sm-6 col-xs-12">
                <div class="info-box">
                    <span class="info-box-icon bg-red"><i class="fa fa-envelope-o"></i></span>
                    <div class="info-box-content">
                        <span class="info-box-text">消息数量</span>
                        <span class="info-box-number">${messageTotal}</span>
                    </div>
                </div>
            </div>

        </div>

        <!-- 第二排：折线图 + 消息列表 -->
        <div class="row">

            <#-- 审计日志趋势 -->
            <div class="col-md-8">
                <div class="box box-primary">
                    <div class="box-header with-border">
                        <h3 class="box-title">审计日志趋势</h3>
                        <!-- 天数切换 -->
                        <div class="pull-right box-tools">
                            <div class="btn-group">
                                <button type="button" class="btn btn-default btn-sm chart-days active" data-days="7">7天</button>
                                <button type="button" class="btn btn-default btn-sm chart-days" data-days="14">14天</button>
                                <button type="button" class="btn btn-default btn-sm chart-days" data-days="30">30天</button>
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

    /**
     * 站内消息：点击查看详情
     */
    $("#messageList").on('click', '.showdetail',function() {

        // fill
        $('#showMessageModal .title').text( $(this).attr('data-title') );
        $('#showMessageModal .msg-content').html( $(this).attr('data-content') );
        $('#showMessageModal .sender').text( $(this).attr('data-sender') );
        $('#showMessageModal .addTime').text( $(this).attr('data-addTime') );

        // show
        $('#showMessageModal').modal({backdrop: false, keyboard: false}).modal('show');
    });

    /**
     * 审计日志趋势：折线图
     *
     * @param days 统计天数
     */
    function loadChart(days) {
        $.ajax({
            type : 'POST',
            url : base_url + '/dashboard/logTrend',
            data : { 'days': days },
            dataType : "json",
            success : function(data){
                if (data.code == 200) {
                    lineChartInit(data.data, days)
                } else {
                    layer.open({
                        title: I18n.system_tips,
                        btn: [ I18n.system_ok ],
                        content: (data.msg || '图表数据加载失败'),
                        icon: '2'
                    });
                }
            }
        });
    }

    /**
     * 折线图初始化：按天补全日期序列，无数据日期补 0
     *
     * @param data 后端返回 [{date, count}, ...]
     * @param days 统计天数
     */
    function lineChartInit(data, days) {

        // 1、转为 Map：date → count，方便按日期查找
        var dateMap = {};
        $.each(data || [], function (i, item) {
            dateMap[item.date] = item.count;
        });

        // 2、生成连续日期序列，每天对应一个数据点
        var dates = [];
        var counts = [];
        var now = new Date();
        for (var i = days - 1; i >= 0; i--) {
            var d = new Date(now);
            d.setDate(d.getDate() - i);
            var key = formatDate(d);
            dates.push(key);
            counts.push(dateMap[key] || 0); // 无数据日期补 0
        }

        // 3、渲染折线图（渐变面积 + 平滑曲线）
        var option = {
            tooltip: { trigger: 'axis' },                      // 悬浮提示：轴触发
            grid: { left: 40, right: 20, bottom: 30, top: 20 }, // 图表边距
            // X轴：日期
            xAxis: {
                type: 'category',
                data: dates,
                axisLabel: { fontSize: 11, color: '#909399' }  // X 轴标签样式
            },
            // Y轴：数量
            yAxis: {
                type: 'value',
                minInterval: 1,                                // Y 轴最小间隔为 1
                axisLabel: { fontSize: 11, color: '#909399' }
            },
            // 数据：折线
            series: [{
                data: counts,
                type: 'line',
                smooth: true,                                  // 平滑曲线
                lineStyle: { width: 2, color: '#3c8dbc' },     // 折线样式
                areaStyle: {                                   // 渐变面积填充
                    color: {
                        type: 'linear',
                        x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                            { offset: 0, color: 'rgba(60,141,188,0.3)' }, // 顶部：30% 透明度
                            { offset: 1, color: 'rgba(60,141,188,0.02)' } // 底部：2% 透明度
                        ]
                    }
                },
                itemStyle: { color: '#3c8dbc' }                // 数据点颜色
            }]
        };

        var chart = echarts.init(document.getElementById('lineChart'));
        chart.setOption(option);
    }

    /**
     * 日期格式化：yyyy-MM-dd
     */
    function formatDate(date) {
        var y = date.getFullYear();
        var m = (date.getMonth() + 1);
        var d = date.getDate();
        m = m < 10 ? ('0' + m) : m;
        d = d < 10 ? ('0' + d) : d;
        return y + '-' + m + '-' + d;
    }

    // 初始化：默认加载 7 天数据
    loadChart(7);

    // 天数切换：重新加载图表
    $('.chart-days').on('click', function () {
        $('.chart-days').removeClass('active');
        $(this).addClass('active');
        loadChart($(this).attr('data-days'));
    });

});
</script>
<!-- 3-script end -->

</body>
</html>
