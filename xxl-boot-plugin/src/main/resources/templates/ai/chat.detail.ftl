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
                    <#-- 消息列表 -->
                    <#if messageList?exists >
                        <#list messageList as message>
                            <#if message.senderType == 1 >
                                <!-- Message1：左侧 -->
                                <div class="direct-chat-msg" >
                                    <div class="direct-chat-info clearfix">
                                        <span class="direct-chat-name pull-left">Agent：</span>
                                        <span class="direct-chat-timestamp pull-left">${message.addTime?string("yyyy-MM-dd HH:mm:ss")}</span>
                                    </div>
                                    <div class="direct-chat-text" style="margin-left: 0px;float: left;" >
                                        ${message.content}
                                    </div>
                                </div>
                            <#else>
                                <!-- Message1：右侧 -->
                                <div class="direct-chat-msg right">
                                    <div class="direct-chat-info clearfix">
                                        <span class="direct-chat-timestamp pull-right">${message.addTime?string("yyyy-MM-dd HH:mm:ss")}</span>
                                        <span class="direct-chat-name pull-right">${message.senderUsername}：</span>
                                    </div>
                                    <div class="direct-chat-text" style="margin-right: 0px;float: right;" >
                                        ${message.content}
                                    </div>
                                </div>
                            </#if>
                        </#list>
                    </#if>
                </div>
            </div>
            <!-- 发送消息 -->
            <div class="box-footer">
                <form method="post" id="sendMessage" onsubmit="return false;" >
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
        const userName = '${xxl_sso_user.userName!}';

        // ---------- ---------- ---------- message template  ---------- ---------- ----------

        const agentMessageTemplate = `
                <div class="direct-chat-msg">
                    <div class="direct-chat-info clearfix">
                        <span class="direct-chat-name pull-left">{userName}：</span>
                        <span class="direct-chat-timestamp pull-left">{sendTime}</span>
                    </div>
                    <div class="direct-chat-text" style="margin-left: 0px;float: left;" >
                        {content}
                    </div>
                </div>
            `;
        const userMessageTemplate = `
                <div class="direct-chat-msg right">
                    <div class="direct-chat-info clearfix">
                        <span class="direct-chat-timestamp pull-right">{sendTime}</span>
                        <span class="direct-chat-name pull-right">{userName}：</span>
                    </div>
                    <div class="direct-chat-text" style="margin-right: 0px;float: right;" >
                        {content}
                    </div>
                </div>
            `;

        /**
         * append message
         *
         * @param {string} newMessge        new message
         * @param {boolean} agentOrUser     true:agent, false:user
         */
        function appendLocalMessage(newMessge, agentOrUser){

            let userNameTmp = agentOrUser?'Agent':userName;

            // build show-message
            let localMessage = agentOrUser?agentMessageTemplate:userMessageTemplate;
            localMessage = localMessage.replace("{userName}", userNameTmp);
            localMessage = localMessage.replace("{sendTime}", new Date().toLocaleString().replace(/\//g, '-') );
            localMessage = localMessage.replace("{content}", newMessge );

            // append show-message
            $("#messageList").append(localMessage);

            // clear send-message
            if (!agentOrUser) {
                $("#sendMessage input[name='content']").val('');
            }

            // scroll to bottom
            scrollTo(0, document.body.scrollHeight);
        }

        // ---------- ---------- ---------- send message  ---------- ---------- ----------

        // sendMessage
        $("#sendMessage .send").click(function(){
            var newMessge = $("#sendMessage input[name='content']").val();
            // valid message
            if (!(newMessge && newMessge.trim() !== '')) {
                layer.msg("请输入消息内容");
                return;
            }
            newMessge = newMessge.trim();

            // send message
            var index = layer.load(1, { shade: [0.1,'#fff'] });
            // append user message
            appendLocalMessage(newMessge, false);
            $.ajax({
                type : 'POST',
                url : base_url + "/ai/chat/detail/send",
                data : {
                    "chatId" : chat.id,
                    "content" : newMessge
                },
                dataType : "json",
                success : function(data){
                    layer.close(index);
                    if (data.code === 200) {
                        // append agent message
                        appendLocalMessage(data.data, true);
                    } else {
                        layer.msg( data.msg || "发送失败" );
                    }
                },
                error: function(xhr, status, error) {
                    layer.close(index);
                    // Handle error
                    console.log("Error: " + error);
                    layer.open({
                        icon: '2',
                        content: '消息发送失败[2]'
                    });
                }
            });

        });

    });

</script>
<!-- 3-script end -->

</body>
</html>