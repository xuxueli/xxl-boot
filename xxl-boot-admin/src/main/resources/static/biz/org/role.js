$(function() {

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	// init date tables
	$.dataTableSelect.init();
	var mainDataTable = $("#data_list").dataTable({
		"deferRender": true,
		"processing" : true, 
	    "serverSide": true,
		"ajax": {
			url: base_url + "/org/role/pageList",
			type:"post",
			// request data
	        data : function ( d ) {
	        	var obj = {};
                obj.name = $('#data_filter .name').val();
	        	obj.offset = d.start;
	        	obj.pagesize = d.length;
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
						"title": I18n.role_tips + I18n.role_name,
	                	"data": 'name',
						"width":'40%'
					},
	                {
						"title": I18n.role_tips + I18n.role_order,
						"data": 'order',
                        "width":'30%'
					}
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
				url : base_url + "/org/role/delete",
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
	// add
	$("#data_operation .add").click(function(){
		$('#addModal').modal({backdrop: false, keyboard: false}).modal('show');
	});
	var addModalValidate = $("#addModal .form").validate({
		errorElement : 'span',  
        errorClass : 'help-block',
        focusInvalid : true,  
        rules : {
            name : {
				required : true,
                rangelength:[2, 20]
			},
			order : {
				required : true,
				digits : true
			}
        }, 
        messages : {
			name : {
            	required : I18n.system_please_input + I18n.role_name,
                rangelength: I18n.system_lengh_limit + "[2-10]"
            },
			order : {
				required : I18n.system_please_input + I18n.role_order,
				digits: I18n.role_order_valid
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
				"name": $("#addModal .form input[name=name]").val(),
				"order": $("#addModal .form input[name=order]").val()
			};

			// invoke
			$.ajax({
				type : 'POST',
				url : base_url + "/org/role/insert",
				data : paramData,
				dataType : "json",
				success : function(data){
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
				},
				error: function(xhr, status, error) {
					// Handle error
					console.log("Error: " + error);
					layer.open({
						icon: '2',
						content: (I18n.system_opt_add + I18n.system_fail)
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
		$("#updateModal .form input[name='id']").val( row.id );
		$("#updateModal .form input[name='name']").val( row.name );
		$("#updateModal .form input[name='order']").val( row.order );

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
				rangelength:[2, 20]
			},
			order : {
				required : true,
				digits : true
			}
		},
		messages : {
			name : {
				required : I18n.system_please_input + I18n.role_name,
				rangelength: I18n.system_lengh_limit + "[2-10]"
			},
			order : {
				required : I18n.system_please_input + I18n.role_order,
				digits: I18n.role_order_valid
			}
		},
        submitHandler : function(form) {

			// request
            var paramData = {
                "id": $("#updateModal .form input[name=id]").val(),
                "name": $("#updateModal .form input[name=name]").val(),
                "order": $("#updateModal .form input[name=order]").val()
            };

			// invoke
			$.ajax({
				type : 'POST',
				url : base_url + "/org/role/update",
				data : paramData,
				dataType : "json",
				success : function(data){
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
				},
				error: function(xhr, status, error) {
					// Handle error
					console.log("Error: " + error);
					layer.open({
						icon: '2',
						content: (I18n.system_opt_edit + I18n.system_fail)
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

	// ---------- ---------- ---------- allocate resource ---------- ---------- ----------
	$("#data_operation .allocateResource").click(function(){

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length != 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = tableData[ 'key' + selectIds[0] ];
		var roleId = row.id;

		// base data
		initTree();

		// 设置 tree 选中
		currentRoleId = roleId;
		$.ajax({
			type : 'POST',
			url : base_url + "/org/role/loadRoleRes",
			data: {
				"roleId":roleId
			},
			dataType : "json",
			async: false,
			success : function(data){
				if (data.code == "200") {
					var checkedIds = data.data;
					if (checkedIds && checkedIds.length >0) {
						checkedIds.forEach(function(nodeId) {
							var nodes = zTreeObj.getNodesByParam("id", nodeId, null);
							if (nodes && nodes.length > 0) {
								var node = nodes[0];
								zTreeObj.checkNode(node, true, false);	// checkTypeFlag: 是否父子节点联动
							}
						});
						//console.log("checked: "+ zTreeObj.getCheckedNodes(true).map(item => item.id));
					}
				} else {
					layer.msg( data.msg || '系统异常' );
				}
			}
		});

		// show
		$('#roleResourceModal').modal({backdrop: false, keyboard: false}).modal('show');
	});

	// ———————————— save
	$("#roleResourceModal .save").click(function(){
		var checkedIds = zTreeObj.getCheckedNodes(true).map(item => item.id);

		$.ajax({
			type : 'POST',
			url : base_url + "/org/role/updateRoleRes",
			data : {
				"roleId":currentRoleId,
				"resourceIds":checkedIds
			},
			dataType : "json",
			success : function(data){
				if (data.code == "200") {
					$('#updateModal').modal('hide');

					layer.msg( '操作成功' );
					mainDataTable.fnDraw(false);
				} else {
					layer.open({
						title: I18n.system_tips ,
						btn: [ I18n.system_ok ],
						content: (data.msg || '操作失败' ),
						icon: '2'
					});
				}

				// hide
				$('#roleResourceModal').modal('hide');
			}
		});

	});

	// ———————————— ztree
	var zTreeObj;
	var currentRoleId;
	function initTree(){
		var setting = {
			check: {
				enable: true,
				chkboxType : {
					"Y" : "ps",	// ps
					"N" : "ps"	// ps
				}
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


});
