$(function() {

	// ---------- ---------- ---------- main table  ---------- ---------- ----------
	// init date tables
	$.dataTableSelect.init();
	var mainDataTable = $("#data_list").dataTable({
		"deferRender": true,
		"processing" : true, 
	    "serverSide": true,
		"ajax": {
			url: base_url + "/system/log/pageList",
			type:"post",
			// request data
	        data : function ( d ) {
	        	var obj = {};
                obj.type = $('#data_filter .type').val();
                obj.module = $('#data_filter .module').val();
				obj.title = $('#data_filter .title').val();
	        	obj.start = d.start;
	        	obj.length = d.length;
                return obj;
            },
			// response data filter
			dataFilter: function (originData) {
				var originJson = $.parseJSON(originData);
				if (originJson.code != 200) {
					layer.open({
						icon: '2',
						content: (originJson.msg)
					});
					return originData;
				}
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
						"title": "日志类型",
	                	"data": 'type',
						"width":'10%',
						"render": function ( data, type, row ) {
							var result = "";
							$('#data_filter .type option').each(function(){
								if ( data.toString() === $(this).val() ) {
									result = $(this).text();
								}
							});
							return result;
						}
					},
	                {
						"title": "系统模块",
						"data": 'module',
                        "width":'10%',
						"render": function ( data, type, row ) {
							var result = "";
							$('#data_filter .module option').each(function(){
								if ( data.toString() === $(this).val() ) {
									result = $(this).text();
								}
							});
							return result;
						}
					},
					{
						"title": '日志标题',
						"data": 'title',
						"width":'10%'
					}/*,
					{
						"title": '日志正文',
						"data": 'content',
						"width":'20%',
						"visible" : false,
                        "render": function ( data, type, row ) {
							return data;
                        }
					}*/,{
						"title": '操作人',
						"data": 'operator',
						"width":'10%'
					},{
						"title": '操作IP',
						"data": 'ip',
						"width":'15%'
					},{
						"title": '操作地址',
						"data": 'ipAddress',
						"width":'15%'
					},{
						"title": '操作时间',
						"data": 'addTime',
						"width":'15%'
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
				url : base_url + "/system/log/delete",
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

	// ---------- ---------- ---------- showModal operation ---------- ---------- ----------
	$("#data_operation").on('click', '.showdetail',function() {

		// find select ids
		var selectIds = $.dataTableSelect.selectIdsFind();
		if (selectIds.length != 1) {
			layer.msg(I18n.system_please_choose + I18n.system_one + I18n.system_data);
			return;
		}
		var row = tableData[ 'key' + selectIds[0] ];

		// fill
		$('#showModal .title').text(row.title);
		$('#showModal .content2').text(row.content);
		$('#showModal .operator').text(row.operator);
		$('#showModal .addTime').text(row.addTime);
		$('#showModal .ip').text(row.ip);
		$('#showModal .ipAddress').text(row.ipAddress);

		// show
		$('#showModal').modal({backdrop: false, keyboard: false}).modal('show');
	});

});
