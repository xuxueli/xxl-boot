$(function(){

    // ---------------------- logout ----------------------

    /**
     * logout
     */
	$("#logoutBtn").click(function(){
		layer.confirm( I18n.logout_confirm , {
			icon: 3,
			title: I18n.system_tips ,
            btn: [ I18n.system_ok, I18n.system_cancel ]
		}, function(index){
			layer.close(index);

			$.post(base_url + "/auth/logout", function(data, status) {
				if (data.code == "200") {
                    layer.msg( I18n.logout_success );
                    setTimeout(function(){
                        window.location.href = base_url + "/";
                    }, 500);
				} else {
					layer.open({
						title: I18n.system_tips ,
                        btn: [ I18n.system_ok ],
						content: (data.msg || I18n.logout_fail),
						icon: '2'
					});
				}
			});
		});

	});


    // ---------------------- update pwd ----------------------

    /**
     * updatePwd Modal
     */
    let updatePwd = $('' +
        '<div class="modal fade" id="updatePwdModal" tabindex="-1" role="dialog"  aria-hidden="true"> \n'+
        '    <div class="modal-dialog "> \n'+
        '        <div class="modal-content"> \n'+
        '            <div class="modal-header"> \n'+
        '                <h4 class="modal-title" >'+ I18n.change_pwd +'</h4> \n'+
        '            </div> \n'+
        '            <div class="modal-body"> \n'+
        '                <form class="form-horizontal form" role="form" > \n'+
        '                    <div class="form-group"> \n'+
        '                        <label for="lastname" class="col-sm-2 control-label">'+ I18n.change_pwd_field_newpwd +'<font color="red">*</font></label> \n'+
        '                        <div class="col-sm-10"><input type="text" class="form-control" name="password" placeholder="'+ I18n.system_please_input + I18n.change_pwd_field_newpwd +'" maxlength="18" ></div> \n'+
        '                    </div> \n'+
        '                    <hr> \n'+
        '                        <div class="form-group"> \n'+
        '                            <div class="col-sm-offset-3 col-sm-6"> \n'+
        '                                <button type="submit" class="btn btn-primary"  >'+ I18n.system_save +'</button> \n'+
        '                                <button type="button" class="btn btn-default" data-dismiss="modal">' + I18n.system_cancel + '</button> \n'+
        '                            </div> \n'+
        '                        </div> \n'+
        '                </form> \n'+
        '            </div> \n'+
        '        </div> \n'+
        '    </div> \n'+
        '</div>');
    $('.wrapper').append(updatePwd);

    /**
     * updatePwd
     */
    $('#updatePwd').on('click', function(){
        $('#updatePwdModal').modal({backdrop: false, keyboard: false}).modal('show');
    });
    var updatePwdModalValidate = $("#updatePwdModal .form").validate({
        errorElement : 'span',
        errorClass : 'help-block',
        focusInvalid : true,
        rules : {
            password : {
                required : true ,
                rangelength:[4,50]
            }
        },
        messages : {
            password : {
                required : '请输入密码'  ,
                rangelength : "密码长度限制为4~50"
            }
        },
        highlight : function(element) {
            $(element).closest('.form-group').addClass('has-error');
        },
        success : function(label) {
            label.closest('.form-group').removeClass('has-error');
            label.remove();
        },
        errorPlacement : function(error, element) {
            element.parent('div').append(error);
        },
        submitHandler : function(form) {
            $.post(base_url + "/org/user/updatePwd",  $("#updatePwdModal .form").serialize(), function(data, status) {
                if (data.code == 200) {
                    $('#updatePwdModal').modal('hide');

                    layer.msg( I18n.change_pwd_suc_to_logout );
                    setTimeout(function(){
                        $.post(base_url + "/auth/logout", function(data, status) {
                            if (data.code == 200) {
                                window.location.href = base_url + "/";
                            } else {
                                layer.open({
                                    icon: '2',
                                    content: (data.msg|| I18n.logout_fail)
                                });
                            }
                        });
                    }, 500);
                } else {
                    layer.open({
                        icon: '2',
                        content: (data.msg|| I18n.change_pwd + I18n.system_fail )
                    });
                }
            });
        }
    });
    $("#updatePwdModal").on('hide.bs.modal', function () {
        $("#updatePwdModal .form")[0].reset();
        updatePwdModalValidate.resetForm();
        $("#updatePwdModal .form .form-group").removeClass("has-error");
    });


    // ---------------------- slideToTop ----------------------

    /**
     * slideToTop Html
     */
	var slideToTop = $("<div />");
	slideToTop.html('<i class="fa fa-chevron-up"></i>');
	slideToTop.css({
		position: 'fixed',
		bottom: '20px',
		right: '25px',
		width: '40px',
		height: '40px',
		color: '#eee',
		'font-size': '',
		'line-height': '40px',
		'text-align': 'center',
		'background-color': '#222d32',
		cursor: 'pointer',
		'border-radius': '5px',
		'z-index': '99999',
		opacity: '.7',
		'display': 'none'
	});
	slideToTop.on('mouseenter', function () {
		$(this).css('opacity', '1');
	});
	slideToTop.on('mouseout', function () {
		$(this).css('opacity', '.7');
	});
	$('.wrapper').append(slideToTop);
	$(window).scroll(function () {
		if ($(window).scrollTop() >= 150) {
			if (!$(slideToTop).is(':visible')) {
				$(slideToTop).fadeIn(500);
			}
		} else {
			$(slideToTop).fadeOut(500);
		}
	});

    /**
     * slideToTop click
     */
    $(slideToTop).click(function () {
		$("html,body").animate({		// firefox ie not support body, chrome support body. but found that new version chrome not support body too.
			scrollTop: 0
		}, 100);
	});


    // ---------------------- body fixed ----------------------

    // init body fixed
    $('body').addClass('fixed');


    // ---------------------- menu, sidebar-toggle ----------------------

    // init menu speed
    $('.sidebar-menu').attr('data-animation-speed', 1);

    // init menu status
    if ( 'close' === $.cookie('sidebar_status') ) {
        $('body').addClass('sidebar-collapse');
    } else {
        $('body').removeClass('sidebar-collapse');
    }

    // change menu status
    $('.sidebar-toggle').click(function(){
        if ( 'close' === $.cookie('sidebar_status') ) {
            $.cookie('sidebar_status', 'open', { expires: 7 });
        } else {
            $.cookie('sidebar_status', 'close', { expires: 7 });	//$.cookie('the_cookie', '', { expires: -1 });
        }
    });
	
});
