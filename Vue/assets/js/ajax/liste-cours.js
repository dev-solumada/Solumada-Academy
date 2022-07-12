getGroupeList()

var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);

var currentGroupName = "";
var firstShow = true;
$("#saveGroupe").on("click", function()
{
    GroupData = { newgroupe: $('#groupeNew').val(), cours: $('#cours').val()}

    console.log("save goupre");
            $("#select-gpe").append(new Option("Hello", "1"));
    $.ajax({
        url: '/addgroupe',
        method: 'post',
        data: GroupData,
        success: function(response){
          if(response == "error")
          {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'this groupe is already exist!',
            });
          }else{
            Swal.fire({
              icon: 'success',
              title: 'New Point Saved',
              text: `Point ${GroupData.newgroupe} saved successfully`,
            });
            clearForm();
            getGroupeList()
          }
        }
    });
}
);

$("#select-group").on("change", function()
{
        var newGgroupeName = $("#select-group").val();
        console.log("newGgroupeName ", newGgroupeName);
        if (newGgroupeName != currentGroupName && firstShow == true)
        {
            var url = `/groupemember/${coursName}/${newGgroupeName}`;
            $("#tableGroupAdmin").DataTable({
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
            var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
            $("#table-container").append(tableData);
            var url = `/groupemember/${coursName}/${newGgroupeName}`;
            $("#tableGroupAdmin").DataTable({
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
            $("#tableGroupAdmin").DataTable().ajax.reload(null, false);
        }
        
    });




$('#select-group').change(function(){
    $.ajax({
        url: "/",
        dataType:"html",
        type: "post",
        success: function(data){
           $('#artist').append(data);
        }
    });
});
function clearForm()
{
    $('#groupeNew').val('');
    $('#cancelGroupe').click();
}


// Get all cours List from the Database and diplay asyncronously on menu
function getGroupeList()
{
    CoursData = { cours: $('#cours').val()}
    $.ajax(
        {

            url: '/allGroupe',
            method: 'post',
            dataType: 'json',
            data: CoursData,
            success: function(data1)
                {
                    $('#select-group').empty();
                    $("#select-group").append(`<option value="">
                    Choose groupe
                    </option>`);
                    $.each(data1, function(key, value)
                    {
                        $("#select-group").append(`<option value="${data1[key].name_Groupe}">
                        ${data1[key].name_Groupe}
                   </option>`);
                    });
                },
            error: function(error)
                {
                    console.log("error", error);
                }
        }
    );
}



var teacherTimeTableDataTable = $("#teachertimeTable").DataTable(
    {
        "ajax": { "url": `/teacherTimeTable/${arg}`, "dataSrc": "" },
        "columns": [
            {'data': "_id"},
            {'data': 'jours'},
            {'data': 'groupe'},
            {'data': 'heureStart'},
            {'data': 'heureFin'},
            {"defaultContent": `
                                <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic mixed styles example">
                                    <button class="btn px-2 btn-sm btn-warning rounded UpdateTeacherTimeTable" type="button"data-toggle="modal" data-target="#UpdatetimeTableModal"><i class="fa fa-edit"></i></button>
                                    <button type="button"  class="btn px-2 btn-sm btn-danger deleteTimeTable"><i class="fa fa-trash"></i></button>
                                </div>
                                `
            }
        ],
    }
);


$("#saveTimeTable").on('click', function(){
    var newTimeTableData = {
        jours: $('#select-jour').val(),
        groupe: $('#select-gpe').val(),
        timeStart: $('#timeStart').val(),
        timeEnd: $('#timeEnd').val(),
        cours: arg,
        date_time : $('#date_time').val(),
    }
    //alert(JSON.stringify(newTimeTableData));
    $.ajax({
        url: "/EmplTemp",
        method: "post",
        data: newTimeTableData,
        success: function(response)
            {
                if(response == 'success')
                {
                    responsetxt = 'Time Table Saved successfully';
                    Swal.fire(
                        'Success',
                        responsetxt,
                        'success',
                        {
                        confirmButtonText: 'Ok',
                    });
                    $("#teachertimeTable").DataTable().ajax.reload(null, false);
                    searchOnDatatable(teacherTimeTableDataTable, $('#select-gpe').val());
                    resetTimeTableForm(action='add');
                }else{
                    Swal.fire(
                        'Error',
                        'Failed to save Time Table',
                        'error',
                        {
                        confirmButtonText: 'Ok',
                    })
                }
            },
        error: function(response)
            {
                alert(response);
            }
    });
});



// Reset the Time table Modal Form
function resetTimeTableForm(action)
{
    switch(action){
        case 'add':
            $('#formAddTimeTable').each(function(){ this.reset(); });
            $('#closetimeTableModal').click();
            break;
        case 'update':
            $('#formUpdateTimeTable').each(function(){ this.reset(); });
            $('#closetimeUpdateTableModal').click();
            break;
    }
}