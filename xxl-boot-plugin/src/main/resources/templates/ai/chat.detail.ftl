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

        <#-- 对话 -->
        <div class="box direct-chat direct-chat-info" style="margin-bottom:9px;" >
            <div class="box-header with-border">
                <h3 class="box-title">对话记录</h3>
            </div>
            <!-- 消息明细 -->
            <div class="box-body">
                <div class="direct-chat-messages" id="messageList" style="height: 100%;padding: 20px;" >
                    <!-- Message1：左侧 -->
                    <div class="direct-chat-msg" >
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-name pull-left">Agent：</span>
                            <span class="direct-chat-timestamp pull-left">2025-12-12 15:30</span>
                        </div>
                        <div class="direct-chat-text" style="margin-left: 0px;float: left;" >
                            你好，欢迎来到聊天室！
                        </div>
                    </div>
                    <!-- Message1：右侧 -->
                    <div class="direct-chat-msg right">
                        <div class="direct-chat-info clearfix">
                            <span class="direct-chat-timestamp pull-right">2025-12-12 15:30</span>
                            <span class="direct-chat-name pull-right">用户：</span>
                        </div>
                        <div class="direct-chat-text" style="margin-right: 0px;float: right;" >
                            你好，很高兴认识你！
                        </div>
                    </div>
                </div>
            </div>
            <!-- 发送消息 -->
            <div class="box-footer">
                <form method="post" id="sendMessage">
                    <div class="input-group">
                        <input type="text" name="content" placeholder="请输入 ..." class="form-control">
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-info btn-flat send">发送消息</button>
                        </span>
                    </div>
                </form>
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

        // ---------- ---------- ---------- init data  ---------- ---------- ----------
        const chat = {
            'id': ${chat.id}
        }

        // ---------- ---------- ---------- init message list  ---------- ---------- ----------
        // todo

        // ---------- ---------- ---------- listen new message  ---------- ---------- ----------
        // todo


        // ---------- ---------- ---------- send message  ---------- ---------- ----------

        const messageTemplate = `
                <div class="direct-chat-msg right">
                    <div class="direct-chat-info clearfix">
                        <span class="direct-chat-name pull-right">{userName}：</span>
                        <span class="direct-chat-timestamp pull-left">{sendTime}</span>
                    </div>
                    <div class="direct-chat-text" style="margin-right: 0px;float: right;" >
                        {content}
                    </div>
                </div>
            `;

        // sendMessage
        $("#sendMessage .send").click(function(){
            var newMessge = $("#sendMessage input[name='content']").val();
            // valid message
            if (!(newMessge && newMessge.trim() !== '')) {
                layer.msg("请输入消息内容");
                return;
            }
            newMessge = newMessge.trim();

            // send message : todo，发送后端借口，SSE获取相应结果；
            let mockMessage = messageTemplate;
            mockMessage = mockMessage.replace("{userName}", '用户');
            mockMessage = mockMessage.replace("{sendTime}", new Date().toLocaleString());
            mockMessage = mockMessage.replace("{content}", newMessge);

            // refresh message list
            $("#messageList").append(mockMessage);
            $("#sendMessage input[name='content']").val('');
            scrollTo(0, document.body.scrollHeight);
        });



    });

</script>
<!-- 3-script end -->

</body>
</html>