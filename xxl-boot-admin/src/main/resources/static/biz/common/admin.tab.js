$(function () {

    /**
     * 初始化：通过遍历给菜单项加上data-index属性
     */
    $(".J_menuItem").each(function (index) {
        if (!$(this).attr('data-index')) {
            $(this).attr('data-index', index);
        }
    });

    /**
     * 滚动到指定选项卡
     */
    function scrollToTab(element) {
        var marginLeftVal = calSumWidth($(element).prevAll()), marginRightVal = calSumWidth($(element).nextAll());
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").outerWidth() < visibleWidth) {
            scrollVal = 0;
        } else if (marginRightVal <= (visibleWidth - $(element).outerWidth(true) - $(element).next().outerWidth(true))) {
            if ((visibleWidth - $(element).next().outerWidth(true)) > marginRightVal) {
                scrollVal = marginLeftVal;
                var tabElement = element;
                while ((scrollVal - $(tabElement).outerWidth()) > ($(".page-tabs-content").outerWidth() - visibleWidth)) {
                    scrollVal -= $(tabElement).prev().outerWidth();
                    tabElement = $(tabElement).prev();
                }
            }
        } else if (marginLeftVal > (visibleWidth - $(element).outerWidth(true) - $(element).prev().outerWidth(true))) {
            scrollVal = marginLeftVal - $(element).prev().outerWidth(true);
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    }

    /**
     * 计算元素集合的总宽度
     */
    function calSumWidth(elements) {
        var width = 0;
        $(elements).each(function () {
            width += $(this).outerWidth(true);
        });
        return width;
    }

    /**
     * 选项卡-左移按扭：查看左侧隐藏的选项卡
     */
    $('.J_tabLeft').on('click', scrollTabLeft);
    function scrollTabLeft() {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".J_menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            if (calSumWidth($(tabElement).prevAll()) > visibleWidth) {
                while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                    offsetVal += $(tabElement).outerWidth(true);
                    tabElement = $(tabElement).prev();
                }
                scrollVal = calSumWidth($(tabElement).prevAll());
            }
        }
        $('.page-tabs-content').animate({
            marginLeft: 0 - scrollVal + 'px'
        }, "fast");
    }

    /**
     * 选项卡-右移按扭：查看右侧隐藏的选项卡
     */
    $('.J_tabRight').on('click', scrollTabRight);
    function scrollTabRight() {
        var marginLeftVal = Math.abs(parseInt($('.page-tabs-content').css('margin-left')));
        // 可视区域非tab宽度
        var tabOuterWidth = calSumWidth($(".content-tabs").children().not(".J_menuTabs"));
        //可视区域tab宽度
        var visibleWidth = $(".content-tabs").outerWidth(true) - tabOuterWidth;
        //实际滚动宽度
        var scrollVal = 0;
        if ($(".page-tabs-content").width() < visibleWidth) {
            return false;
        } else {
            var tabElement = $(".J_menuTab:first");
            var offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) <= marginLeftVal) {//找到离当前tab最近的元素
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            offsetVal = 0;
            while ((offsetVal + $(tabElement).outerWidth(true)) < (visibleWidth) && tabElement.length > 0) {
                offsetVal += $(tabElement).outerWidth(true);
                tabElement = $(tabElement).next();
            }
            scrollVal = calSumWidth($(tabElement).prevAll());
            if (scrollVal > 0) {
                $('.page-tabs-content').animate({
                    marginLeft: 0 - scrollVal + 'px'
                }, "fast");
            }
        }
    }


    /**
     * 点击菜单：打开页面
     */
    $('.J_menuItem').on('click', menuItem);
    function menuItem() {
        // 获取标识数据
        var dataUrl = $(this).attr('href'),
            dataIndex = $(this).data('index'),
            menuName = $.trim($(this).text()),
            flag = true;

        // 菜单联动
        $(".sidebar-menu ul li, .sidebar-menu li").removeClass("active");
        $(this).parents("li").addClass("active");
        /*if (!$('a[href$="' + dataUrl + '"]').hasClass("noactive")) {
            $(".sidebar-menu ul li, .sidebar-menu li").removeClass("active");
            $(this).parent("li").addClass("active");
        }else{
            $(this).parent().siblings().removeClass("menu-open");
            $(this).parents("ul").find(".treeview-menu").css("display", "none");
            $(this).parent("li").addClass("active");
        }*/

        // check dateurl
        if (dataUrl == undefined || $.trim(dataUrl).length == 0){
            return false;
        }

        // 选项卡菜单已存在
        $('.J_menuTab').each(function () {
            if ($(this).data('id') == dataUrl) {
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                    scrollToTab(this);
                    // 显示tab对应的内容区
                    $('.J_mainContent .J_iframe').each(function () {
                        if ($(this).data('id') == dataUrl) {
                            $(this).show().siblings('.J_iframe').hide();
                            return false;
                        }
                    });
                }
                flag = false;
                return false;
            }
        });

        // 选项卡菜单不存在
        if (flag) {
            var str = '<a href="javascript:;" class="active J_menuTab" data-id="' + dataUrl + '">' + menuName + ' <i class="fa fa-times-circle"></i></a>';
            $('.J_menuTab').removeClass('active');

            // 添加选项卡对应的iframe
            var str1 = '<iframe class="J_iframe" name="iframe' + dataIndex + '" width="100%" height="100%" src="' + dataUrl + '" frameborder="0" data-id="' + dataUrl + '" seamless></iframe>';
            $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(str1);
            // 添加遮罩层
            NProgress.inc(0.2);
            NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });
			NProgress.start();

            let $iframe = $('.J_mainContent iframe:visible');
            $iframe.on('load', function () {
                NProgress.done();
            }).on('error', function () {
                NProgress.done();
                // 处理加载失败情况，防止跳转
                console.error('iframe load error, src = ' + $(this).attr('src'));
                // 可以显示错误信息或重试机制
            });
            // 添加选项卡
            $('.J_menuTabs .page-tabs-content').append(str);
            scrollToTab($('.J_menuTab.active'));
        }

        // 添加页面锚点参数（hash参数）
        window.location.hash = dataUrl;
        return false;
    }

    // 默认打开第一个菜单
    var $firstMenuItem = $(".J_menuItem:first");
    if ($firstMenuItem.length > 0) {
        $firstMenuItem.click();
    }

    /**
     * 选项卡-关闭x按钮：关闭菜单页面
     */
    $('.J_menuTabs').on('click', '.J_menuTab i', closeTab);
    function closeTab() {
        var closeTabId = $(this).parents('.J_menuTab').data('id');
        var currentWidth = $(this).parents('.J_menuTab').width();

        // 当前元素处于活动状态
        if ($(this).parents('.J_menuTab').hasClass('active')) {

            // 当前元素后面有同辈元素，使后面的一个元素处于活动状态
            if ($(this).parents('.J_menuTab').next('.J_menuTab').length > 0) {

                var activeId = $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').data('id');
                $(this).parents('.J_menuTab').next('.J_menuTab:eq(0)').addClass('active');

                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

                var marginLeftVal = parseInt($('.page-tabs-content').css('margin-left'));
                if (marginLeftVal < 0) {
                    $('.page-tabs-content').animate({
                        marginLeft: (marginLeftVal + currentWidth) + 'px'
                    }, "fast");
                }

                //  移除当前选项卡
                $(this).parents('.J_menuTab').remove();

                // 移除tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }

            // 当前元素后面没有同辈元素，使当前元素的上一个元素处于活动状态
            if ($(this).parents('.J_menuTab').prev('.J_menuTab').length > 0) {
                var activeId = $(this).parents('.J_menuTab').prev('.J_menuTab:last').data('id');
                $(this).parents('.J_menuTab').prev('.J_menuTab:last').addClass('active');
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == activeId) {
                        $(this).show().siblings('.J_iframe').hide();
                        return false;
                    }
                });

                //  移除当前选项卡
                $(this).parents('.J_menuTab').remove();

                // 移除tab对应的内容区
                $('.J_mainContent .J_iframe').each(function () {
                    if ($(this).data('id') == closeTabId) {
                        $(this).remove();
                        return false;
                    }
                });
            }
        } else {
            // 当前元素不处于活动状态

            //  移除当前选项卡
            $(this).parents('.J_menuTab').remove();

            // 移除相应tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == closeTabId) {
                    $(this).remove();
                    return false;
                }
            });
            scrollToTab($('.J_menuTab.active'));
        }
        syncMenuTab($('.page-tabs-content').find('.active').attr('data-id'));
        return false;
    }


    /**
     * 关闭其他选项卡
     */
    $('.J_tabCloseOther').on('click', closeOtherTabs);
    function closeOtherTabs(){
        $('.page-tabs-content').children("[data-id]").not(":first").not(".active").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        $('.page-tabs-content').css("margin-left", "0");
    }


    /**
     * 滚动到已激活的选项卡
     */
    $('.J_tabShowActive').on('click', showActiveTab);
    function showActiveTab(){
        scrollToTab($('.J_menuTab.active'));
    }

    /**
     * 选项卡-Tab单击：展示菜单页面 + 左侧菜单active更新
      */
    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);
    function activeTab() {
        if (!$(this).hasClass('active')) {
            var currentId = $(this).data('id');
            syncMenuTab(currentId);
            // 显示tab对应的内容区
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });
            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
            scrollToTab(this);
        }
    }
    function syncMenuTab(dataId) {
        var $dataObj = $('a[href$="' + decodeURI(dataId) + '"]');
        $dataObj.click();

        /*$(".sidebar-menu ul li, .sidebar-menu li").removeClass("active");
        $($dataObj).parents("li").addClass("active");*/

        /*if (!$dataObj.hasClass("noactive")) {
            $dataObj.parent().parent().parent().siblings().removeClass("menu-open");
            $dataObj.parent().parent().parent().addClass("menu-open")
            $dataObj.parents("ul").find(".treeview-menu").css("display", "none");
            $dataObj.parents("ul").css("display", "block");
            $dataObj.click();
        }else{
            $dataObj.parent().siblings().removeClass("menu-open");
            $dataObj.parents("ul").find(".treeview-menu").css("display", "none");
            $dataObj.click();
        }*/
    }

    /**
     * 选项卡-Tab双击：刷新菜单页面
      */
    $('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);

    /**
     * 选项卡-整体刷新按钮：刷新菜单页面
     */
    $('.tabReload').on('click', refreshTab);
    function refreshTab() {
		NProgress.inc(0.2);
		NProgress.configure({ easing: 'ease', speed: 500, showSpinner: false });
		NProgress.start();
        var currentId = $('.page-tabs-content').find('.active').attr('data-id');
    	var target = $('.J_iframe[data-id="' + currentId + '"]');
        var url = target.attr('src');
        target.attr('src', url).ready();
		NProgress.done();
    }

    /**
     * 关闭当前选项卡
      */
	$('.tabCloseCurrent').on('click', tabCloseCurrent);
    function tabCloseCurrent() {
        $('.page-tabs-content').find('.active i').trigger("click");
    }

    /**
     * 关闭全部选项卡
      */
    $('.J_tabCloseAll').on('click', function () {
        // 保留first，其他删除
        $('.page-tabs-content').children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        // 显示first
        $('.page-tabs-content').children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
            $(this).addClass("active");
        });
        $('.page-tabs-content').css("margin-left", "0");
        syncMenuTab($('.page-tabs-content').find('.active').attr('data-id'));
    });

    /**
     * 全屏显示
      */
    $('#fullScreen').on('click', function () {
    	$(document).toggleFullScreen();
    });

});
