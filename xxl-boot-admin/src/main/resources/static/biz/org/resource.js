$(function() {

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	// treeGrid：https://github.com/lhmyy521125/dataTables.treeGrid
	// init dataTableSelect
	$.dataTableSelect.init();
	// table data
	var tableData = {};
	// init date tables
	var mainDataTable = $("#data_list").dataTable({
		"deferRender": false,
		"processing" : true,
		"serverSide": true,
		"ajax": {
			url: base_url + "/org/resource/treeList",
			type:"post",
			// request data
			data : function ( d ) {
				var obj = {};
				obj.name = $('#data_filter .name').val();
				obj.status = $('#data_filter .status').val();
				obj.start = d.start;
				obj.length = d.length;
				return obj;
			},
			// response data filter
			dataFilter: function (originData) {
				var originJson = $.parseJSON(originData);
				return JSON.stringify({
					data: originJson.data?originJson.data: {}
				});
			}
		},
		"searching": false,
		"ordering": false,
		//"scrollX": true,																		// scroll x，close self-adaption
		/**
		 l - Length changing 改变每页显示多少条数据的控件
		 f - Filtering input 即时搜索框控件
		 t - The Table 表格本身
		 i - Information 表格相关信息控件
		 p - Pagination 分页控件
		 r - pRocessing 加载等待显示信息
		 **/
		"dom": "tr",
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
				"title": '层级',
				"className": 'treegrid-control',
				"data": function (row) {
					if (row.children != null && row.children.length > 0) {
						return '<span><i class="fa fa-fw fa-plus-square-o" ></span>';
					}
					return '';
				},
				"width":'5%'
			},
			{
				"title": I18n.resource_tips + I18n.resource_name,
				"render": function ( data, type, row ) {
					var iconAndName = '<i class="fa _icon_"></i> ' + row.name;
					var icon = row.icon?row.icon:'';		// fa-circle-o

					return iconAndName.replace("_icon_", icon);
				},
				"width":'25%'
			},
			{
				"title": I18n.resource_tips + I18n.resource_type,
				"data": 'type',
				"width":'10%',
				"render": function ( data, type, row ) {
					var result = "";
					$('#addModal select[name="type"] option').each(function(){
						if ( data.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			},
			{
				"title": I18n.resource_permission,
				"data": 'permission',
				"width":'20%'
			},
			{
				"title": I18n.resource_tips + I18n.resource_url,
				"data": 'url',
				"width":'20%'
			},
			{
				"title": I18n.resource_tips + I18n.resource_order,
				"data": 'order',
				"width":'10%'
			},
			{
				"title": I18n.resource_status,
				"data": 'status',
				"visible" : true,
				"width":'5%',
				"render": function ( data, type, row ) {
					var result = "";
					$('#addModal select[name="status"] option').each(function(){
						if ( data.toString() === $(this).val() ) {
							result = $(this).text();
						}
					});
					return result;
				}
			}
		],
		"columnDefs": [
			{
				"defaultContent": "",
				"targets": "_all"
			}
		],
		"language" : {
			"sProcessing" : I18n.dataTable_sProcessing ,
			"sZeroRecords" : I18n.dataTable_sZeroRecords ,
			"sEmptyTable" : I18n.dataTable_sEmptyTable ,
			"sLoadingRecords" : I18n.dataTable_sLoadingRecords ,
			"sInfoThousands" : ","
		}
	});
	// tree grid : expandAll / collapseAll
	tree = new $.fn.dataTable.TreeGrid(mainDataTable,{
		left: 20,
		expandAll: false,
		expandIcon: '<span><i class="fa fa-fw  fa-plus-square-o" ></i></span>',
		collapseIcon: '<span><i class="fa fa-fw  fa-minus-square-o" ></i></span>'
	});

	// search btn
	$('#data_filter .searchBtn').on('click', function(){
		mainDataTable.fnDraw(false);
		//mainDataTable.draw(false);
	});

	// ---------- ---------- ---------- tree operation ---------- ---------- ----------
	var expandOrCollapse_val = 0;
	$("#data_operation").on('click', '.expandAndCollapse',function() {
		if ((expandOrCollapse_val++)%2 === 0) {
			tree.collapseAll();
		} else {
			tree.expandAll();
		}
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
				url : base_url + "/org/resource/delete",
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
					layer.open({
						icon: '2',
						content: (I18n.system_opt_del + I18n.system_fail)
					});
				}
			});
		});
	});

	// ---------- ---------- ---------- ztree ---------- ---------- ----------
	var zTreeObj;
	function initTree(){
		var setting = {
			view: {
				dblClickExpand: false,
				showLine: true,
				selectedMulti: false
			},
			data: {
				simpleData: {
					enable: true,
					idKey: "id",
					pIdKey: "parentId",
					rootPId: "0"
				}
			}
		};
		/*var zNodes = [
			{id: 1, pId: 0, name: "资源A", open: true},
			{id: 5, pId: 1, name: "资源A1"},
			{id: 2, pId: 0, name: "资源B", open: false},
			{id: 11, pId: 2, name: "资源B2"}
		];*/

		// post
		$.ajax({
			type : 'POST',
			url : base_url + "/org/resource/simpleTreeList",
			dataType : "json",
			async: false,
			success : function(data){
				if (data.code == "200") {
					var zNodes = data.data;

					zTreeObj = $.fn.zTree.init($("#tree"), setting, zNodes); //初始化树
					zTreeObj.expandAll(true);    //true 节点全部展开、false节点收缩

				} else {
					layer.msg( data.msg || '系统异常' );
				}
			}
		});
	}

	// open
	$(".selectParent").click(function(){
		$('#treeModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	// choose
	$('#treeModal .choose').click(function(){

		// valid choose
		if (zTreeObj.getSelectedNodes().length < 1) {
			layer.msg( I18n.system_please_choose + I18n.resource_parent );
			return;
		}

		// fill choose data, todo-
		$("#addModal .form input[name=parentId]").val( zTreeObj.getSelectedNodes()[0].id );
		$("#addModal .form input[name=parentName]").val( zTreeObj.getSelectedNodes()[0].name );

		$("#updateModal .form input[name=parentId]").val( zTreeObj.getSelectedNodes()[0].id );
		$("#updateModal .form input[name=parentName]").val( zTreeObj.getSelectedNodes()[0].name );

		$('#treeModal').modal('hide');
	});

	// ---------- ---------- ---------- add operation ---------- ---------- ----------
	// add modal
	$("#data_operation .add").click(function(){

		// todo，reset not work
		initTree();
		$("#addModal .form input[name=parentId]").val( 0 );

		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',
		errorClass : 'help-block',
		focusInvalid : true,
		rules : {
			name : {
				required : true,
				rangelength:[2, 50]
			},
			permission : {
				required : true,
				rangelength:[2, 50]
			},
			order : {
				required : true,
				range:[1, 99999999]
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.resource_name,
				rangelength: I18n.system_lengh_limit + "[2-50]"
			},
			permission : {
				required : I18n.system_please_input + I18n.resource_permission,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
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

			// request
			var paramData = {
				"parentId": $("#addModal .form input[name=parentId]").val(),
				"name": $("#addModal .form input[name=name]").val(),
				"type": $("#addModal .form select[name=type]").val(),
				"permission": $("#addModal .form input[name=permission]").val(),
				"url": $("#addModal .form input[name=url]").val(),
				"icon": $("#addModal .form input[name=icon]").val(),
				"order": $("#addModal .form input[name=order]").val(),
				"status": $("#addModal .form select[name=status]").val()
			};

			// post
			$.post(base_url + "/org/resource/insert", paramData, function(data, status) {
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
	$("#data_operation .update").click(function(){

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length != 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = tableData[ 'key' + selectIds[0] ];

		// base data
		$("#updateModal .form input[name=id]").val( row.id );
		$("#updateModal .form input[name=parentId]").val( row.parentId );
		$("#updateModal .form input[name=name]").val( row.name );
		$("#updateModal .form select[name=type]").val( row.type );
		$("#updateModal .form input[name=permission]").val( row.permission );
		$("#updateModal .form input[name=url]").val( row.url );
		$("#updateModal .form input[name=icon]").val( row.icon );
		$("#updateModal .form input[name=order]").val( row.order );
		$("#updateModal .form select[name=status]").val( row.status );

		// 设置 tree 选中
		initTree();
		if (row.id > 0) {
			var chooseNode = zTreeObj.getNodeByParam("id", row.parentId, null);
			if (chooseNode) {
				zTreeObj.selectNode(chooseNode);
				$("#updateModal .form input[name=parentName]").val( chooseNode.name );
			}

		}

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
			name : {
				required : true,
				rangelength:[2, 50]
			},
			permission : {
				required : true,
				rangelength:[2, 50]
			},
			order : {
				required : true,
				range:[1, 99999999]
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.user_password,
				rangelength: I18n.system_lengh_limit + "[2-50]"
			},
			permission : {
				required : I18n.system_please_input + I18n.user_real_name,
				rangelength: I18n.system_lengh_limit + "[2-20]"
			},
			order : {
				required : I18n.system_please_input,
				range: I18n.system_num_range + " 1~99999999"
			}
		},
		submitHandler : function(form) {

			// request
			var paramData = {
				"id": $("#updateModal .form input[name=id]").val(),
				"parentId": $("#updateModal .form input[name=parentId]").val(),
				"name": $("#updateModal .form input[name=name]").val(),
				"type": $("#updateModal .form select[name=type]").val(),
				"permission": $("#updateModal .form input[name=permission]").val(),
				"url": $("#updateModal .form input[name=url]").val(),
				"icon": $("#updateModal .form input[name=icon]").val(),
				"order": $("#updateModal .form input[name=order]").val(),
				"status": $("#updateModal .form select[name=status]").val()
			};

			$.post(base_url + "/org/resource/update", paramData, function(data, status) {
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
		updateModalValidate.resetForm();

		$("#updateModal .form")[0].reset();
		$("#updateModal .form .form-group").removeClass("has-error");
	});

	// ---------- ---------- ---------- iconModal ---------- ---------- ----------
	$('.showIcon').click(function (){
		// show
		$('#iconModal').modal({backdrop: true, keyboard: false}).modal('show');
	});

});
