<!DOCTYPE html>
<html>
<head>
    <#-- import macro -->
    <#import "../common/common.macro.ftl" as netCommon>

    <!-- 1-style start -->
    <@netCommon.commonStyle />
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.css">
    <link rel="stylesheet" href="${request.contextPath}/static/plugins/editor.md-1.5.0/main/editormd.min.css">
    <style>
        .editormd-html-preview,.editormd-preview-container {
            padding: 5px 10px
        }
    </style>
    <!-- 1-style end -->

</head>
<body class="hold-transition" style="background-color: #ecf0f5;">
<div class="wrapper">
    <section class="content">

        <!-- 2-content start -->

        <!-- 对话 -->
        <div class="box direct-chat direct-chat-info" style="margin-bottom:9px;" >
            <div class="box-header with-border">
                <h3 class="box-title">对话记录</h3>
            </div>
            <!-- 消息明细 -->
            <div class="box-body">
                <div class="direct-chat-messages" id="messageList" style="height: 100%;padding: 20px;" >
                    <#-- 消息列表 -->
                </div>
            </div>
            <!-- 发送消息 -->
            <div class="box-footer">
                <form method="post" id="sendMessage" onsubmit="return false;" >
                    <div class="input-group">
                        <input type="text" name="content" placeholder="请输入 ..." class="form-control">
                        <span class="input-group-btn">
                            <button type="button" class="btn btn-info btn-flat send" style="width: 100px;">发送消息</button>
                            <button type="button" class="btn btn-default btn-flat sending" style="display: none;width: 100px;background-color: #ccc;color: #666;cursor: not-allowed;" disabled>发送中...</button>
                        </span>
                    </div>
                </form>
            </div>
        </div>

        <!-- 滚动按钮 -->
        <div id="scrollButtons" >
            <button id="scrollTop" class="btn btn-primary" >↑</button>
            <button id="scrollBottom" class="btn btn-primary">↓</button>
        </div>
        <style>
            #scrollButtons {
                position: fixed;
                right: 20px;
                bottom: 90px;
                z-index: 1000;
            }

            #scrollButtons button {
                display: block;
                width: 40px; /* 缩小宽度 */
                height: 40px; /* 缩小高度 */
                border-radius: 50%; /* 圆形按钮 */
                background-color: rgba(128, 128, 128, 0.5); /* 默认半透明灰色 */
                color: white;
                border: none;
                font-size: 14px; /* 字体稍小 */
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                outline: none; /* 移除点击后的焦点边框 */
                transition: background-color 0.3s ease; /* 添加过渡效果 */
            }

            #scrollButtons button:hover {
                background-color: rgba(128, 128, 128, 1); /* 悬停时颜色加深 */
            }

            #scrollButtons button:focus {
                outline: none; /* 移除默认焦点边框 */
                box-shadow: 0 0 0 2px rgba(128, 128, 128, 0.8); /* 自定义焦点高亮 */
            }

            #scrollTop {
                display: none; /* 默认隐藏顶部按钮 */
                margin-bottom: 10px;
            }
        </style>
        <!-- 2-content end -->

    </section>
</div>

<!-- 3-script start -->
<@netCommon.commonScript />
<script src="${request.contextPath}/static/plugins/bootstrap-table/bootstrap-table.min.js"></script>
<script src="${request.contextPath}/static/plugins/bootstrap-table/locale/bootstrap-table-zh-CN.min.js"></script>
<script src="${request.contextPath}/static/plugins/editor.md-1.5.0/main/editormd.min.js"></script>
<script src="${request.contextPath}/static/plugins/editor.md-1.5.0/lib/marked.min.js"></script>
<script src="${request.contextPath}/static/plugins/editor.md-1.5.0/lib/prettify.min.js"></script>
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
                    <div class="direct-chat-text" style="margin-left: 0px;float: left;background:#ffffff;" id="{messageId}" >
                        <textarea style="display:none;">{content}</textarea>
                    </div>
                </div>
            `;
        const userMessageTemplate = `
                <div class="direct-chat-msg right">
                    <div class="direct-chat-info clearfix">
                        <span class="direct-chat-timestamp pull-right">{sendTime}</span>
                        <span class="direct-chat-name pull-right">{userName}：</span>
                    </div>
                    <div class="direct-chat-text" style="margin-right: 0px;float: right;" id="{messageId}" >
                        {content}
                    </div>
                </div>
            `;
        var messageNo = 1;

        /**
         * init message list
         */
        function initMessageList(){
            <#if messageList?exists >
                <#list messageList as message>
                    appendLocalMessage("${message.content?js_string}", <#if message.senderType == 1 >true<#else>false</#if> );
                </#list>
            </#if>
        }
        initMessageList();
        scrollTo(0, document.body.scrollHeight);

        /**
         * append message
         *
         * @param {string} newMessge        new message
         * @param {boolean} agentOrUser     true:agent, false:user
         */
        function appendLocalMessage(newMessge, agentOrUser){

            // process data
            let userNameTmp = agentOrUser?'Agent':userName;
            let sendTime = new Date().toLocaleString().replace(/\//g, '-');
            let messageId = 'messageId_' + messageNo++;

            // build show-message
            let localMessage = agentOrUser?agentMessageTemplate:userMessageTemplate;
            localMessage = localMessage.replace("{userName}", userNameTmp);
            localMessage = localMessage.replace("{sendTime}", sendTime);
            localMessage = localMessage.replace("{content}", newMessge );
            localMessage = localMessage.replace("{messageId}", messageId );

            // append show-message
            $("#messageList").append(localMessage);

            // agent message format
            if (agentOrUser) {

                console.log("" + $("#"+messageId).length);

                editormd.markdownToHTML(messageId, {
                    htmlDecode      : "style,script,iframe",  // you can filter tags decode
                    emoji           : false,
                    taskList        : false,
                    tex             : false,  // 默认不解析
                    flowChart       : false,  // 默认不解析
                    sequenceDiagram : false,  // 默认不解析
                });
            }

            // clear user send-message
            if (!agentOrUser) {
                $("#sendMessage input[name='content']").val('');
            }

            // scroll to bottom
            scrollTo(0, document.body.scrollHeight);
        }

        // ---------- ---------- ---------- send message  ---------- ---------- ----------

        // sendMessage
        $("#sendMessage .send").click(function(){
            // valid repeat message
            if ($(".send").is(":hidden")) {
                layer.msg("消息发送中，请稍候...");
                return;
            }

            // load message
            var newMessge = $("#sendMessage input[name='content']").val();
            // valid message
            if (!(newMessge && newMessge.trim() !== '')) {
                layer.msg("请输入消息内容");
                return;
            }
            newMessge = newMessge.trim();

            // 切换按钮状态 + 启动省略号动画
            $(".send").hide();
            $(".sending").show();
            // sending btn
            let dotCount = 0;
            const maxDots = 3;
            const intervalId = setInterval(() => {
                dotCount = (dotCount % maxDots) + 1;
                $(".sending").text("发送中" + ".".repeat(dotCount));
            }, 500); // 每500ms更新一次

            // send message
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
                    if (data.code === 200) {
                        // append agent message
                        appendLocalMessage(data.data, true);
                    } else {
                        layer.msg( data.msg || "发送失败" );
                    }

                    // 停止动画并恢复按钮状态
                    clearInterval(intervalId);
                    $(".send").show();
                    $(".sending").hide();
                },
                error: function(xhr, status, error) {
                    // Handle error
                    console.log("Error: " + error);
                    layer.open({
                        icon: '2',
                        content: '消息发送失败[2]'
                    });

                    // 停止动画并恢复按钮状态
                    clearInterval(intervalId);
                    $(".send").show();
                    $(".sending").hide();
                }
            });

        });

        // listen enter
        $("#sendMessage input[name='content']").keydown(function(event) {
            // Enter: keyCode = 13
            if (event.keyCode === 13) {
                event.preventDefault(); // 阻止表单默认提交行为
                $("#sendMessage .send").click();
            }
        });

        // ---------- ---------- ---------- scrollTop scrollBottom  ---------- ---------- ----------

        // 监听滚动事件，控制顶部按钮的显示/隐藏
        let isScrolling = false;
        $(window).scroll(function () {
            if (!isScrolling) {
                window.requestAnimationFrame(function () {
                    if ($(this).scrollTop() > 100) {
                        $('#scrollTop').fadeIn();
                    } else {
                        $('#scrollTop').fadeOut();
                    }
                    isScrolling = false;
                });
                isScrolling = true;
            }
        });

        // 点击顶部按钮，滚动到页面顶部
        $('#scrollTop').click(function () {
            $('html, body').animate({ scrollTop: 0 }, 500);
        });

        // 点击底部按钮，滚动到页面底部
        $('#scrollBottom').click(function () {
            $('html, body').animate({ scrollTop: $(document).height() }, 500);
        });

    });

</script>
<!-- 3-script end -->

</body>
</html>