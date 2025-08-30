$(function () {

    /**
     * init table sql ide
     */
    var tableSqlIDE;
    function initTableSql() {
        tableSqlIDE = CodeMirror.fromTextArea(document.getElementById("tableSql"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-sql",
            lineWrapping:false,
            readOnly:false,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        tableSqlIDE.setSize('auto','auto');
    }
    initTableSql();

    /**
     * init code area
     */

    var controller_ide;
    var service_ide;
    var service_impl_ide;
    var mapper_ide;
    var mapper_xml_ide;
    var entity_ide;
    function initCodeArea(){

        // controller_ide
        controller_ide = CodeMirror.fromTextArea(document.getElementById("controller_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
            lineWrapping:true,
            readOnly:true,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        controller_ide.setSize('auto','auto');

        // service_ide
        service_ide = CodeMirror.fromTextArea(document.getElementById("service_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
            lineWrapping:true,
            readOnly:true,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        service_ide.setSize('auto','auto');

        // service_impl_ide
        service_impl_ide = CodeMirror.fromTextArea(document.getElementById("service_impl_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
            lineWrapping:true,
            readOnly:true,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        service_impl_ide.setSize('auto','auto');

        // mapper_ide
        mapper_ide = CodeMirror.fromTextArea(document.getElementById("mapper_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
            lineWrapping:true,
            readOnly:true,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        mapper_ide.setSize('auto','auto');

        // mapper_xml_ide
        mapper_xml_ide = CodeMirror.fromTextArea(document.getElementById("mapper_xml_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/html",
            lineWrapping:true,
            readOnly:true
        });
        mapper_xml_ide.setSize('auto','auto');

        // entity_ide
        entity_ide = CodeMirror.fromTextArea(document.getElementById("entity_ide"), {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
            lineWrapping:true,
            readOnly:true,
            foldGutter: true,
            gutters:["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
        });
        entity_ide.setSize('auto','auto');
    }
    initCodeArea();

    /**
     * gen Code
     */
    $('#codeGenerate').click(function () {

        var tableSql = tableSqlIDE.getValue();

        $.ajax({
            type : 'POST',
            url : base_url + "/tool/codegen/genCode",
            data : {
                "tableSql" : tableSql
            },
            dataType : "json",
            success : function(data){
                if (data.code == 200) {

                    // show all, for setvalue
                    $('.chart.tab-pane').addClass('active');

                    // set value
                    controller_ide.setValue(data.data.controller_code);
                    controller_ide.setSize('auto','auto');

                    service_ide.setValue(data.data.service_code);
                    service_ide.setSize('auto','auto');

                    service_impl_ide.setValue(data.data.service_impl_code);
                    service_impl_ide.setSize('auto','auto');

                    mapper_ide.setValue(data.data.mapper_code);
                    mapper_ide.setSize('auto','auto');

                    mapper_xml_ide.setValue(data.data.mapper_xml_code);
                    mapper_xml_ide.setSize('auto','auto');

                    entity_ide.setValue(data.data.entity_code);
                    entity_ide.setSize('auto','auto');

                    // refresh
                    controller_ide.refresh();
                    service_ide.refresh();
                    service_impl_ide.refresh();
                    mapper_ide.refresh();
                    mapper_xml_ide.refresh();
                    entity_ide.refresh();

                    // hide nav + panel
                    $('.nav-tabs > li').removeClass('active')
                    $('.chart.tab-pane').removeClass('active');

                    // msg
                    layer.open({
                        icon: '1',
                        content: I18n.codegen_name+I18n.system_success ,
                        end: function(layero, index){
                            // hide nav + panel
                            $('#controller_nav').addClass('active');
                            $('#controller').addClass('active');
                        }
                    });
                } else {
                    layer.open({
                        icon: '2',
                        content: (data.msg|| I18n.codegen_name+I18n.system_fail )
                    });
                }
            },
            error: function(xhr, status, error) {
                // Handle error
                console.log("Error: " + error);
                layer.open({
                    icon: '2',
                    content: (I18n.codegen_name+I18n.system_fail)
                });
            }
        });

    });

});