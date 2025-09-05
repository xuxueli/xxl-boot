$(function () {


    // -------------------- open/close menu-tab --------------------
    /**
     * 1、menu：
     *      - J_menuItem
     * 2、tab：
     *      - J_tabLeft
     *      - J_menuTabs
     *          - J_menuTab
     *      - J_tabRight
     *      - J_tabCloseOther
     *      - J_tabCloseAll
     * 3、contont
     *      - J_mainContent
     *          - J_iframe
     */

    /**
     * 点击菜单：打开Tab，展示Menu页面
     */
    $('.J_menuItem').on('click', function (){
        // 获取Tab属性
        let dataUrl = $(this).attr('href');              // data url
        let menuName = $.trim($(this).text());    // menu mane

        // open tab
        return openTab(dataUrl, menuName);
    });

    /**
     * 打开Tab：根据 url + 名称
     *
     * @param tabSrc
     * @param tabName
     * @returns {boolean}
     */
    function openTab(tabSrc, tabName) {
        // valid dateurl
        if (tabSrc === undefined || $.trim(tabSrc).length === 0){
            return false;
        }

        // 1、菜单Menu联动
        $(".sidebar-menu ul li, .sidebar-menu li").removeClass("active");
        $('.J_menuItem').each(function () {
            if ($(this).attr('href') === tabSrc) {
                $(this).parents("li").addClass("active");
            }
        })
        //$(this).parents("li").addClass("active");

        // 2、匹配已存在Tab，切换/active展示
        let tabExist = false;
        $('.J_menuTab').each(function () {
            // 匹配成功
            if ($(this).data('id') === tabSrc) {
                // Tab是否展示，若否则切换展示
                if (!$(this).hasClass('active')) {
                    $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
                    scrollToTab(this);
                    // 显示Tab对应的内容区
                    $('.J_mainContent .J_iframe').each(function () {
                        if ($(this).data('id') == tabSrc) {
                            $(this).show().siblings('.J_iframe').hide();
                            return false;
                        }
                    });
                }
                tabExist = true;
                return false;
            }
        });
        if (tabExist) {
            return false;
        }

        // 3、Tab不存在，创新新Tab
        // build Tab (other tab no-active)
        $('.J_menuTab').removeClass('active');
        var tabStr = '<a href="javascript:;" class="active J_menuTab" data-id="' + tabSrc + '">' + tabName + ' <i class="fa fa-times-circle"></i></a>';

        // build IFrame (other ifame hide)
        var iframeStr = '<iframe class="J_iframe" width="100%" height="100%" src="' + tabSrc + '" frameborder="0" data-id="' + tabSrc + '" seamless></iframe>';
        $('.J_mainContent').find('iframe.J_iframe').hide().parents('.J_mainContent').append(iframeStr);

        // 添加遮罩层
        NProgress.inc(0.2);
        NProgress.configure({
            easing: 'ease',         // 动画缓动函数 (默认: 'ease')
            speed: 500,             // 动画速度（毫秒）(默认: 200)
            showSpinner: true      // 是否显示旋转图标 (默认: true)
        });
        NProgress.start();

        // load iframe
        let $iframe = $('.J_mainContent iframe:visible');
        $iframe.on('load', function () {
            NProgress.done();
        }).on('error', function () {
            NProgress.done();
            // 处理加载失败情况，防止跳转
            console.error('iframe load error, src = ' + $(this).attr('src'));
        });

        // 添加Tab，切换Tab
        $('.J_menuTabs .page-tabs-content').append(tabStr);
        scrollToTab($('.J_menuTab.active'));

        // 添加页面锚点参数（hash参数）
        window.location.hash = tabSrc;
        return false;
    }

    /**
     * Tab关闭（x按钮）：关闭菜单页面
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

    // -------------------- tab: scroll、2left、2rifht、 --------------------

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

    // -------------------- refresh-tab/menu； change-tab;  colse-other/current/all --------------------

    /**
     * Tab-刷新按钮：刷新active的 Tab 页面
     */
    $('.tabReload').on('click', refreshTab);
    function refreshTab() {
        NProgress.inc(0.2);
        NProgress.configure({
            easing: 'ease',         // 动画缓动函数 (默认: 'ease')
            speed: 500,             // 动画速度（毫秒）(默认: 200)
            showSpinner: true       // 是否显示旋转图标 (默认: true)
        });
        NProgress.start();
        var currentId = $('.page-tabs-content').find('.active').attr('data-id');
        var target = $('.J_iframe[data-id="' + currentId + '"]');
        var url = target.attr('src');
        // target.attr('src', url).ready();
        target.attr('src', url).on('load', function () {
            NProgress.done();
        }).on('error', function () {
            NProgress.done();
            // 处理加载失败情况，防止跳转
            console.error('iframe load error, src = ' + $(this).attr('src'));
        });
    }

    /**
     * 选项卡-Tab双击：刷新菜单页面
     */
    /*$('.J_menuTabs').on('dblclick', '.J_menuTab', refreshTab);*/

    /**
     * 滚动到已激活的选项卡
     */
    /*$('.J_tabShowActive').on('click', showActiveTab);
    function showActiveTab(){
        scrollToTab($('.J_menuTab.active'));
    }*/

    /**
     * Tab-单击切换：展示菜单页面 + 左侧菜单active更新
     */
    $('.J_menuTabs').on('click', '.J_menuTab', activeTab);
    function activeTab() {
        // 是否已激活 active，避免重复处理
        if (!$(this).hasClass('active')) {

            // Ifame 切换展示
            $('.J_mainContent .J_iframe').each(function () {
                if ($(this).data('id') == currentId) {
                    $(this).show().siblings('.J_iframe').hide();
                    return false;
                }
            });

            // Tab 激活
            $(this).addClass('active').siblings('.J_menuTab').removeClass('active');
            scrollToTab(this);

            // Menu 点击/激活
            var currentId = $(this).data('id');
            syncMenuTab(currentId);
        }
    }

    /**
     * 左侧菜单active更新
     */
    function syncMenuTab(dataId) {
        // 激活菜单，模拟Menu点击
        var $dataObj = $('.J_menuItem').filter('a[href$="' + decodeURI(dataId) + '"]');
        if ($dataObj.length > 0) {
            $dataObj.click();
            return true;
        }
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
        // 保留第一个 Tab，其他删除
        $('.page-tabs-content').children("[data-id]").not(":first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').remove();
            $(this).remove();
        });
        // 第一个 Tab 激活/展示
        $('.page-tabs-content').children("[data-id]:first").each(function () {
            $('.J_iframe[data-id="' + $(this).data('id') + '"]').show();
            $(this).addClass("active");
        });
        $('.page-tabs-content').css("margin-left", "0");

        // 左侧菜单active更新
        syncMenuTab($('.page-tabs-content').find('.active').attr('data-id'));
    });

    // -------------------- open default tab --------------------

    // 默认打开菜单Tab：优先尝试打开url路径TAB，兜底打开首个菜单
    let hashPath = window.location.hash.slice(1);
    setTimeout(1000);
    if (!syncMenuTab(hashPath)) {
        var $firstMenuItem = $(".J_menuItem:first");
        if ($firstMenuItem.length > 0) {
            $firstMenuItem.click();
        }
    }

    // -------------------- fullScreen --------------------

    /**
     * 全屏显示
     */
    $('#fullScreen').on('click', function () {
        $(document).toggleFullScreen();
    });

});
