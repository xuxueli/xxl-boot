$(function() {

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	// init date tables
	$.dataTableSelect.init();
	var mainDataTable = $("#data_list").dataTable({
		"deferRender": true,
		"processing" : true,
		"serverSide": true,
		"ajax": {
			url: base_url + "/system/message/pageList",
			type:"post",
			// request data
			data : function ( d ) {
				var obj = {};
				obj.title = $('#data_filter .title').val();
				obj.status = $('#data_filter .status').val();
				obj.start = d.start;
				obj.length = d.length;
				return obj;
			},
			// response data filter
			dataFilter: function (originData) {
				var originJson = $.parseJSON(originData);
				return JSON.stringify({
					recordsTotal: originJson.data.totalCount,
					recordsFiltered: originJson.data.totalCount,
					data: originJson.data.pageData
				});
			}
		},
		"searching": false,
		"ordering": false,
		//"scrollX": true,																		// scroll x，close self-adaption
		//"dom": '<"top" t><"bottom" <"col-sm-3" i><"col-sm-3 right" l><"col-sm-6" p> >',		// dataTable "DOM layout"：https://datatables.club/example/diy.html
		"drawCallback": function( settings ) {
			$.dataTableSelect.selectStatusInit();
		},
		"columns": [
			{
				"title": '<input align="center" type="checkbox" id="checkAll" >',
				"data": 'id',
				"visible" : true,
				"width":'5%',
				"render": function ( data, type, row ) {
					tableData['key'+row.id] = row;
					return '<input align="center" type="checkbox" class="checkItem" data-id="'+ row.id +'"  >';
				}
			},
			{
				"title": '通知分类',
				"data": 'category',
				"width":'10%',
				"render": function ( data, type, row ) {
					var result = "";
					$('#data_filter .category option').each(function(){
						if ( data.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			},
			{
				"title": '通知标题',
				"data": 'title',
				"width":'30%'
			},
			{
				"title": '状态',
				"data": 'status',
				"width":'15%',
				"render": function ( data, type, row ) {
					var result = "";
					$('#data_filter .status option').each(function(){
						if ( data.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			},
			{
				"title": '发送人',
				"data": 'sender',
				"width":'15%'
			},
			{
				"title": '发送时间',
				"data": 'addTime',
				"width":'20%'
			},
		],
		"language" : {
			"sProcessing" : I18n.dataTable_sProcessing ,
			"sLengthMenu" : I18n.dataTable_sLengthMenu ,
			"sZeroRecords" : I18n.dataTable_sZeroRecords ,
			"sInfo" : I18n.dataTable_sInfo ,
			"sInfoEmpty" : I18n.dataTable_sInfoEmpty ,
			"sInfoFiltered" : I18n.dataTable_sInfoFiltered ,
			"sInfoPostFix" : "",
			"sSearch" : I18n.dataTable_sSearch ,
			"sUrl" : "",
			"sEmptyTable" : I18n.dataTable_sEmptyTable ,
			"sLoadingRecords" : I18n.dataTable_sLoadingRecords ,
			"sInfoThousands" : ",",
			"oPaginate" : {
				"sFirst" : I18n.dataTable_sFirst ,
				"sPrevious" : I18n.dataTable_sPrevious ,
				"sNext" : I18n.dataTable_sNext ,
				"sLast" : I18n.dataTable_sLast
			},
			"oAria" : {
				"sSortAscending" : I18n.dataTable_sSortAscending ,
				"sSortDescending" : I18n.dataTable_sSortDescending
			}
		}
	});

	// table data
	var tableData = {};

	// search btn
	$('#data_filter .searchBtn').on('click', function(){
		mainDataTable.fnDraw();
	});

	// ---------- ---------- ---------- delete operation ---------- ---------- ----------
	// delete
	$("#data_operation").on('click', '.delete',function() {

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length <= 0) {
			layer.msg(I18n.system_please_choose + I18n.system_data);
			return;
		}

		// do delete
		layer.confirm( I18n.system_ok + I18n.system_opt_del + '?', {
			icon: 3,
			title: I18n.system_tips ,
			btn: [ I18n.system_ok, I18n.system_cancel ]
		}, function(index){
			layer.close(index);

			$.ajax({
				type : 'POST',
				url : base_url + "/system/message/delete",
				data : {
					"ids" : selectIds
				},
				dataType : "json",
				success : function(data){
					if (data.code == 200) {
						layer.msg( I18n.system_opt_del + I18n.system_success );
						mainDataTable.fnDraw(false);	// false，refresh current page；true，all refresh
					} else {
						layer.msg( data.msg || I18n.system_opt_del + I18n.system_fail );
					}
				},
				error: function(xhr, status, error) {
					// Handle error
					console.log("Error: " + error);
					layer.open({
						icon: '2',
						content: (I18n.system_opt_del + I18n.system_fail)
					});
				}
			});
		});
	});

	// ---------- ---------- ---------- add operation ---------- ---------- ----------

	// init add editor
	CKEDITOR.replace('add_content');		// todo, 图片弹框宽高编辑与 bootstrap 冲突问题
	/*$('#addModal').on('shown.bs.modal', function () {
		if (!CKEDITOR.instances.add_content) {
			CKEDITOR.replace('add_content');
		}
	});*/
	// add
	$("#data_operation .add").click(function(){
		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
		rules : {
			title : {
				required : true,
				rangelength:[4, 50]
			}
		},
		messages : {
			title : {
				required : "请输入通知标题",
				rangelength: I18n.system_lengh_limit + "[4-20]"
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

			// add_content
			const addEditorInstance = CKEDITOR.instances.add_content;
			const contentWithHTML = addEditorInstance.getData();
			if (!contentWithHTML) {
				layer.open({title: I18n.system_tips ,
					btn: [ I18n.system_ok ],
					content: "请输入通知正文",
					icon: '2'
				});
				return;
			}

			// request
			var paramData = {
				"category": $("#addModal .form select[name=category]").val(),
				"status": $("#addModal .form select[name=status]").val(),
				"title": $("#addModal .form input[name=title]").val(),
				"content": contentWithHTML
			};

			// post
			$.post(base_url + "/system/message/insert", paramData, function(data, status) {
				if (data.code == "200") {
					$('#addModal').modal('hide');

					layer.msg( I18n.system_opt_add + I18n.system_success );
					mainDataTable.fnDraw();
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_opt_add + I18n.system_fail ),
						icon: '2'
					});
				}
			});
		}
	});
	$("#addModal").on('hide.bs.modal', function () {
		addModalValidate.resetForm();

		$("#addModal .form")[0].reset();
		$("#addModal .form .form-group").removeClass("has-error");
	});

	// ---------- ---------- ---------- update operation ---------- ---------- ----------

	// init update editor
	CKEDITOR.replace('update_content');
	// modal
	$("#data_operation .update").click(function(){

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length != 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = tableData[ 'key' + selectIds[0] ];
		console.log(row);

		// base data
		$("#updateModal .form input[name='id']").val( row.id );
		$("#updateModal .form select[name='category']").val( row.category );
		$("#updateModal .form select[name='status']").val( row.status );
		$("#updateModal .form input[name='title']").val( row.title );
		$("#updateModal .form input[name='status']").val( row.status );

		// add_content
		const updateEditorInstance = CKEDITOR.instances.update_content;
		updateEditorInstance.setData( row.content );

		// show
		$('#updateModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var updateModalValidate = $("#updateModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
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
		rules : {
			title : {
				required : true,
				rangelength:[4, 50]
			}
		},
		messages : {
			title : {
				required : "请输入通知标题",
				rangelength: I18n.system_lengh_limit + "[4-20]"
			}
		},
		submitHandler : function(form) {

			// add_content
			const updateEditorInstance = CKEDITOR.instances.update_content;
			const contentWithHTML = updateEditorInstance.getData();
			if (!contentWithHTML) {
				layer.open({title: I18n.system_tips ,
					btn: [ I18n.system_ok ],
					content: "请输入通知正文",
					icon: '2'
				});
				return;
			}

			// request
			var paramData = {
				"id": $("#updateModal .form input[name=id]").val(),
				"category": $("#updateModal .form select[name=category]").val(),
				"status": $("#updateModal .form select[name=status]").val(),
				"title": $("#updateModal .form input[name=title]").val(),
				"content":contentWithHTML
			};

			$.post(base_url + "/system/message/update", paramData, function(data, status) {
				if (data.code == "200") {
					$('#updateModal').modal('hide');

					layer.msg( I18n.system_opt_edit + I18n.system_success );
					mainDataTable.fnDraw(false);
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || I18n.system_opt_edit + I18n.system_fail ),
						icon: '2'
					});
				}
			});
		}
	});
	$("#updateModal").on('hide.bs.modal', function () {

		// reset
		updateModalValidate.resetForm();

		$("#updateModal .form")[0].reset();
		$("#updateModal .form .form-group").removeClass("has-error");
	});

});
