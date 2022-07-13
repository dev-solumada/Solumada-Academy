getGroupeList()

var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);

var currentGroupName = "";
var firstShow = true;

console.log("cours", arg);

var parcoursDataTable = $('#parcoursDatatable').DataTable(
    {
        "ajax": { "url": `/teacherParcours/${arg}`, "dataSrc": "" },
        "columns": [
            {'data': 'date'},
            {'data': 'start_time'},
            {'data': 'end_time'},
            {'data': 'group_name'},
            {'data': 'present', 'render': function(present){
                        var presenceOptionData = '';
                        present.forEach(element => {
                            presenceOptionData = presenceOptionData + `<option class="presentMember" value="${element}">${element}</option>`;
                        });
                        presentOptions = `<select data-placeholder="Choose One" class="standartselect form-control" tabindex="1">${presenceOptionData}</select>`;
                        return presentOptions;
                    }
        },
            {'data': 'absent', 'render': function(absent)
            {
                var absentOptionData = '';
                absent.forEach(element => {
                    absentOptionData = absentOptionData + `<option value="${element}">${element}</option>`
                });
                absentOptions = `<select data-placeholder="" class="standartselect form-control" tabindex="1">${absentOptionData}</select>`;
                return absentOptions;
            }
        },
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcoursDataT' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ]
    }
);


$("#addParcours").on('click', function(){
    $("#dateParcours").val("");
    (".standardSelect").val("");
});

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


$(document).ready(function () {
    $(".standardSelect").chosen({
        disable_search_threshold: 10,
        no_results_text: "Oops, nothing found!",
        width: "100%"
    });
})


$("#select-group").on("change", function()
{
        $("#addmbre").css("display", "block");
        var newGgroupeName = $("#select-group").val();
        console.log("newGgroupeName ", newGgroupeName);
        if (newGgroupeName != currentGroupName && firstShow == true)
        {
            $("#table-container").empty();
            var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
            $("#table-container").append(tableData);
            var url = `/groupemember/${arg}/${newGgroupeName}`;
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
            var url = `/groupemember/${arg}/${newGgroupeName}`;
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




// $('#select-group').change(function(){
//     $.ajax({
//         url: "/",
//         dataType:"html",
//         type: "post",
//         success: function(data){
//            $('#artist').append(data);
//         }
//     });
// });
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



function searchOnDatatable(datatable, value)
{
    currentPage = datatable.page();
    datatable.search(value).draw();
}
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


// Update Time Table
$(document).on('click','.UpdateTeacherTimeTable', function()
{
    var column = $(this).closest('tr');
    var id = column.find('td:eq(0)').text();
    var updateTimeTableDataId = { id:id };
    $.ajax(
        {
            url: "/gettime",
            method: 'post',
            data: updateTimeTableDataId,
            success: function(res) {
                $("#id-timetable-update").val(res._id);
                $("#select-jour-update").val(res.jours);
                $("#timetablegroupupdate").val(res.groupe);
                $("#timeStart-update").val(res.heureStart);
                $("#timeEnd-update").val(res.heureFin);
            },
            error: function(res) { 
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Error occured!',
                    showConfirmButton: false,
                    timer: 1700
                });
            }
    });
});


// Save Update Time Table
$("#saveTeacherUpdateTimeTable").on('click', function()
{

    var updateTimetableData = {
        id: $("#id-timetable-update").val(),
        jours:  $("#select-jour-update").val(),
        group: $('#select-groupe-update').val(),
        heurdebut: $('#timeStart-update').val(),
        heurfin: $('#timeEnd-update').val()
    }

    $.ajax({
        url: "/update_time",
        method: "post",
        data: updateTimetableData,
        success: function(res)
        {
            if(res === "success")
            {
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Time table updated successfuly!',
                    showConfirmButton: false,
                    timer: 1700
                });
                $("#teachertimeTable").DataTable().ajax.reload(null, false);
                searchOnDatatable(teacherTimeTableDataTable, $("#id-timetable-update").val());
                resetTimeTableForm('update');
            }else{
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Error occured!',
                    showConfirmButton: false,
                    timer: 1700
                });
            }
        }
    });
});


// Delete Time Table
$(document).on('click','.deleteTimeTable', function()
{
    var column = $(this).closest('tr');
    var id = column.find('td:eq(0)').text();
    var updateTimeTableDataId = { id:id };
    $.ajax(
        {
            url: "/gettime",
            method: 'post',
            data: updateTimeTableDataId,
            success: function(res) {
                Swal.fire({
                    title: 'Delete TimeTable',
                    text: 'Are you sure to delete this?',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: 'red',
                    cancelButtonColor: 'green',
                    confirmButtonText: 'Yes, delete it!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        $.ajax({
                            url: '/deleteEmploi',
                            method: 'post',
                            data: { id: res._id },
                            success: function(response){

                                if(response=="success")
                                {
                                    responsetxt = "TimeTable Deleted successfully";
                                    Swal.fire({
                                        position: 'center',
                                        icon: 'success',
                                        title: responsetxt,
                                        showConfirmButton: false,
                                        timer: 1700
                                    });
                                    $("#teachertimeTable").DataTable().ajax.reload(null, false);
                                    teacherTimeTableDataTable.search('').draw();

                                }else{
                                    Swal.fire({
                                        position: 'top-center',
                                        icon: 'error',
                                        title: 'Error occured when deleting TimeTable!',
                                        showConfirmButton: false,
                                        timer: 1700
                                    });
                                }

                            },
                            error: function(response){
                                Swal.fire({
                                    position: 'top-center',
                                    icon: 'error',
                                    title: response,
                                    showConfirmButton: false,
                                    timer: 1700
                                });
                            }
                        })
                    }
                })

            },
            error: function(res) { alert(JSON.stringify(res));}
    });
});




$("#saveParcours").on('click', function()
{
    var dateParcours = $("#dateParcours").val();
    var startAtParcours = $("#timeStartParcours").val();
    var endAtParcours = $("#timeEndParcours").val();
    var groupNameParcours = $("#groupParcours").val();
    var presentParcours = $("#presentParcours").val();
    var absentParcours = [];
    groupMemberList.forEach(member => {
        if (presentParcours.indexOf(member) === -1) {absentParcours.push(member);}
    });

    var parcoursData = {
        dateNewParcours: dateParcours,
        timestartAt: startAtParcours,
        timeEndAt: endAtParcours,
        cours: cour_name,
        groupParcoursName: groupNameParcours,
        present: presentParcours,
        absent: absentParcours
    }

    $.ajax({
        url: "/Teacheraddparcours",
        method: "post",
        data: parcoursData,
        success: function(res) 
        { 
            if(res === "exist"){
                Swal.fire(
                    'Error',
                    "this parcours already exist!",
                    'info',
                    {
                    confirmButtonText: 'Ok',
                });
                
            }else{
                $("#parcoursDatatable").DataTable().ajax.reload(null, false);
                Swal.fire(
                    'Parcours Saved',
                    'New parcours saved successfully!',
                    'success',
                    {
                    confirmButtonText: 'Ok',
                });
                clearParcoursForm('add');
            }
        },
        error: function(err) { 
            Swal.fire(
                'Error',
                `${err}`,
                'error',
                {
                confirmButtonText: 'Ok',
            })
         }
    });
});


// Update parcours
$(document).on('click', '.btnUpdateParcoursDataT', function(){

    var column = $(this).closest('tr');
    var date = column.find('td:eq(0)').text();
    var startTimeDelete = column.find('td:eq(1)').text();
    var endTimeDelete = column.find('td:eq(2)').text();
    var groupNameDelete = column.find('td:eq(3)').text();
    parcoursUpdateData = {
        cours: arg,
        date: date,
        heureStart: startTimeDelete,
        heureFin: endTimeDelete,
        groupe: groupNameDelete,
    }

    console.log("parcoursUpdateData", date);
    $.ajax({
        url: '/getParcours',
        method: 'post',
        data: parcoursUpdateData,
        dataType: 'json',
        success: function(res){
            var data = JSON.parse(JSON.stringify(res));
            $("#presentParcoursUpdate").find("option").remove().end();
            $("#groupUpdateParcours").val(data[0]._id.groupe);
            // alert(data[0]._id.date);
            $("#dateUpdateParcours").val(data[0]._id.date);
            $("#timeStartUpdateParcours").val(data[0]._id.heureStart);
            $("#timeEndUpdateParcours").val(data[0]._id.heureFin);
            var users = data[0].tabl;
            
            users.forEach(user =>{
                console.log("");
                    console.log("userrrr ", user);
                if(user.presence == true)
                {
                    var option = `<option value="${user.user}" selected>${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }else{
                    var option = `<option value="${user.user}">${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }
            });
            $("#presentParcoursUpdate").chosen({
                disable_search_threshold: 10,
                no_results_text: "Oops, nothing found!",
                width: "100%"
            });
            $("#presentParcoursUpdate").chosen({
                disable_search_threshold: 10,
                no_results_text: "Oops, nothing found!",
                width: "100%"
            });
        },
        error: function(response){
            Swal.fire({
                position: 'top-center',
                icon: 'error',
                title: response,
                showConfirmButton: false,
                timer: 1700
            });
        }
    });
});



// Add member to current selected group
$("#addmbre").on('click', function(){
    var gpn = $("#select-gpe").val();
    $(".teacherAddMemberLabel").html(gpn);

});


// Envent listener on select group
$("#select-gpe").on('change', function(){
    $("#addmbre").css("display", "block");
    refreshData();
});