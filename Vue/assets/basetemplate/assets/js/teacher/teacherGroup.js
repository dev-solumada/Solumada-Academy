
var currentUrl = window.location.href;
var arg = currentUrl.split('/');
var coursName = $(arg).get(-1);
var currentGroupName = "";
var firstShow = true;
$("#teacherSelectGroup").on('change', function(){
    var newGgroupeName = $("#teacherSelectGroup").val();
    if (newGgroupeName != currentGroupName && firstShow == true)
    {
        var url = `/groupemember/${coursName}/${newGgroupeName}`;
        $("#GroupTeacherDatatable").DataTable({
            "ajax": {"url": `${url}`, "dataSrc":"" },
            "columns": [
                {'data': 'username'},
                {'data': 'mcode'},
                {'data': 'num_agent'},
                {'data': 'niveau', 'render': function(niveau){ if(!niveau){ return "None" } }},
                {'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
        firstShow = false;
    }else if(newGgroupeName != currentGroupName && firstShow == false){
        $("#table-container").empty();
        var tableData = `<table id="GroupTeacherDatatable" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${coursName}/${newGgroupeName}`;
        $("#GroupTeacherDatatable").DataTable({
            "ajax": {"url": `${url}`, "dataSrc":"" },
            "columns": [
                {'data': 'username'},
                {'data': 'mcode'},
                {'data': 'num_agent'},
                {'data': 'niveau', 'render': function(niveau){ if(!niveau){ return "None" } }},
                {'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
    }else{
        $("#GroupTeacherDatatable").DataTable().ajax.reload(null, false);
    }
    
});