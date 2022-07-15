var coursNameTeacher = $("#courNameTeacher").text();
var groupMemberList = [];
var groupMemberPresentList = [];
var groupMemberAbsentList = [];
var currentGroupName = "";
var firstShow = true;


// datatable variables
let teacherTimeTableDataTable;

// Add member to current selected group
$("#addMememberToGroupTeacher").on('click', function(){
    var gpn = $("#teacherSelectGroup").val();
    $(".teacherAddMemberLabel").html(gpn);

});

// Create Group
$("#saveNewGroup").on('click', function(){
    var gpn = $("#newgroupName").val();
    var newgroupData = { 
        newgroupe: gpn, 
        cours: coursNameTeacher,
    };
    $.ajax({
        url: "/addgroupe",
        method: 'post',
        data: newgroupData,
        success: function(res){
            Swal.fire(
                'Group created',
                `Group ${$("#newgroupName").val()} saved successfuly`,
                'success',
                {
                confirmButtonText: 'Ok',
            });
            $("#teacherSelectGroup").append(`<option value="${gpn}">${gpn}</option>`);
            $("#cancelGroup").click();
            $("#newgroupName").val("");
        },
        error: function(res){
            Swal.fire(
                'Error',
                `Error occured when creating group ${$("#newgroupName").val()}`,
                'error',
                {
                confirmButtonText: 'Ok',
            });
        }
    });
});

// Refresh all data on group page 
function refreshData()
{
    setAddMemberList();
    var newGgroupeName = $("#teacherSelectGroup").val();
    if (newGgroupeName != currentGroupName && firstShow == true)
    {
        var url = `/groupemember/${coursNameTeacher}/${newGgroupeName}`;
        $("#GroupTeacherDatatable").DataTable({
            "ajax": {"url": `${url}`, "dataSrc":"" },
            "columns": [
                {'data': '_id'},
                {'data': 'username'},
                {'data': 'mcode'},
                {'data': 'num_agent'},
                {'data': 'niveau', 'render': function(niveau){ if(!niveau){ return ""; }else{ return niveau; }}},
                {'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-success addLevel' class='btn btn-sm btn-success' data-toggle='modal' data-target='#addLevel' data-bs-whatever='@getbootstrap'><i class='fa fa-plus'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
        firstShow = false;
    }else if(newGgroupeName != currentGroupName && firstShow == false){
        $("#table-container").empty();
        var tableData = `<table id="GroupTeacherDatatable" name="table" class="table table-striped table-bordered"><thead><tr><th>Id</th><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${coursNameTeacher}/${newGgroupeName}`;
        $("#GroupTeacherDatatable").DataTable({
            "ajax": {"url": `${url}`, "dataSrc":"" },
            "columns": [
                {'data': '_id'},
                {'data': 'username'},
                {'data': 'mcode'},
                {'data': 'num_agent'},
                {'data': 'niveau', 'render': function(niveau){ if(!niveau){ return "" }else{ return niveau; }}},
                {'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-success addLevel' class='btn btn-sm btn-success' data-toggle='modal' data-target='#addLevel' data-bs-whatever='@getbootstrap'><i class='fa fa-plus'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
    }else{
        $("#GroupTeacherDatatable").DataTable().ajax.reload(null, false);
    }
}

// Envent listener on select group
$("#teacherSelectGroup").on('change', function(){
    $("#addMememberToGroupTeacher").css("display", "block");
    $("#addLevelToGroupTeacher").css("display", "block");
    refreshData();
});


// Get list user and set exclude existing member and set it to select option list
function setAddMemberList()
{
    $("#listUserC").empty();
    var gpn = $("#teacherSelectGroup").val();
     dataToSend = {cours: coursNameTeacher, groupe: gpn};
     $.ajax({
        url: "/getMemberAndAllUserList",
        method: "post",
        dataType: 'json',
        data: dataToSend,
        success: function(res)
                    {
                        res.forEach(element => {
                            options = `<option value="${element}">${element}</option>`;
                            $("#listUserToAddMember").append(options);
                        });
                        $(".memberSelect").chosen({
                            disable_search_threshold: 10,
                            no_results_text: "Oops, nothing found!",
                            width: "100%"
                        });
                    },
        error: function(err){
            Swal.fire(
                'Error',
                `There is an error please try again later!`,
                'error',
                {
                confirmButtonText: 'Ok',
            });
        }
     });
}




// Save new member to group
$("#saveNewMemberList").on('click', function(){
    var newMbList = [];
    var userToAddList = $("#listUserToAddMember").val();
    userToAddList.forEach(user => newMbList.push(user));
    var newMemberData = { 
                            groupeName: $("#teacherSelectGroup").val(),
                            coursName: coursNameTeacher,
                            newMemberList: newMbList,
                        }
    $.ajax({
        url: "/newmembreajax",
        method: "post",
        data: newMemberData,
        success: function(res){
            Swal.fire(
                'Members Saved',
                `Members saved on group ${$("#teacherSelectGroup").val()}`,
                'success',
                {
                confirmButtonText: 'Ok',
            });
            refreshData();
            resetTeacherAddMemberForm();
        },
        error: function(err){
            Swal.fire(
                'Error',
                `Error occured when save member saved on group ${$("#teacherSelectGroup").val()}`,
                'error',
                {
                confirmButtonText: 'Ok',
            });
        }
    })
});

// Add level
$(document).on('click', ".addLevel", function(){
    var col = $(this).closest('tr');
    var memberMail = col.find('td:eq(1)').text();
    var idToAddLevel = col.find('td:eq(0)').text();
    $(".userNameLevel").text(`Add Level to ${memberMail}`);
    $("#labelCourLevel").text(`${coursNameTeacher} Level`);
    $("#idLevel").val(idToAddLevel);
});


$("#saveLevel").on('click', function(){
    var addLevelData = {
        id: $("#idLevel").val(),
        level: $("#coursLevel").val()
    }

    $.ajax({
        url: "/addLevelToMember",
        method: "post",
        data: addLevelData,
        success: function(res){
            Swal.fire(
                'Level Saved',
                `Level added successfuly!`,
                'success',
                {
                confirmButtonText: 'Ok',
            });
            $("#coursLevel").val("");
            $("#cancelLevel").click();
            $("#GroupTeacherDatatable").DataTable().ajax.reload(null, false);
        },
        error: function(err){
            Swal.fire(
                'Error',
                `Error occured when adding level!`,
                'error',
                {
                confirmButtonText: 'Ok',
            });
        }
    })
    
});



// Remove member group from current selected group on datatable
$(document).on('click', ".removeToGroup", function(){
    var col = $(this).closest('tr');
    var idToDelete = col.find('td:eq(0)').text();
    var memberMail = col.find('td:eq(1)').text();
    var groupName = $("#teacherSelectGroup").val();
    Swal.fire({
        title: 'Remove Group Member',
        text: `Are you sure to remove ${memberMail} from ${groupName} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: `Yes, I'm sure!`,
    }).then((result) => {
            var deletememberData = {id: idToDelete };
            if (result.isConfirmed)
            {
                $.ajax({
                    url: '/deleteMb',
                    method: 'post',
                    data: deletememberData,
                    success: function(res){
                        refreshData();
                        resetTeacherAddMemberForm();
                        responsetxt = `Member ${memberMail} removed from ${groupName} successfully`;
                        Swal.fire({
                            position: 'center',
                            icon: 'success',
                            title: responsetxt,
                            showConfirmButton: false,
                            timer: 1700
                        });
                    },
                    error: function(err){
                        Swal.fire({
                            position: 'top-center',
                            icon: 'error',
                            title: "Error occured when perform this action please try again later!",
                            showConfirmButton: false,
                            timer: 1700
                        });
                    }
                })
            }
    })
});


// Reset add Member Form
function resetTeacherAddMemberForm()
{
    $(".closeAddMember").click();
    $("#listUserToAddMember").prop("selected", false);
}

//Start Teacher Time Table
teacherTimeTableDataTable = $("#teachertimeTable").DataTable(
    {
        "ajax": { "url": `/teacherTimeTable/${coursNameTeacher}`, "dataSrc": "" },
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

// teacherTimeTableDataTable.column(0).visible(false);
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
        cours: coursNameTeacher,
    }
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
                Swal.fire(
                    'Error',
                    `Error please report this error!`,
                    'error',
                    {
                    confirmButtonText: 'Ok',
                });
            }
    });
});

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
            error: function(res) { 
                Swal.fire(
                    'Error',
                    `Error occured, please report this error!`,
                    'error',
                    {
                    confirmButtonText: 'Ok',
                });
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

// End Teacher Time Table JS


// Start Teacher Parcours JS
var parcoursDataTable = $('#parcoursDatatable').DataTable(
    {
        "ajax": { "url": `/teacherParcours/${coursNameTeacher}`, "dataSrc": "" },
        "columns": [
            {'data': 'date', 'render': function(date){ if(!date){ return ""; }else{ return date; } }},
            {'data': 'start_time', 'render': function(start_time){ if(!start_time){ return ""; }else{ return start_time; } }},
            {'data': 'end_time', 'render': function(end_time){ if(!end_time){ return ""; }else{ return end_time; } }},
            {'data': 'group_name', 'render': function(group_name){ if(!group_name){ return ""; }else{ return group_name; } }},
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
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours'  class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ]
    }
);

// Event Listener on button add Parcours
$("#addParcours").on('click', function(){
    $("#dateParcours").val("");
});

// Search on datatable Parcours
function searchOnDatatableParcours(datatable, value)
{
    datatable.search(value).draw();
}

// Event listener on parcours select add parcours form
$("#groupParcours").on('change', function(){
    var groupMemberList = [];
    var groupName = $("#groupParcours").val();
    var groupMemberData = { gpe: groupName, cours:coursNameTeacher };
    $.ajax({
        url: "/presence",
        data: groupMemberData,
        method: "post",
        success: function(response){ 
            $("#presentParcours").empty();
            
            response.forEach(element => {
                groupMemberList.push(element.username);
                $('#presentParcours').append(`<option value="${element.username}">${element.username}</option>`);
            });
            
        },
        error: function(error){ 
            Swal.fire(
                'Error',
                `Error has occured, please report this error!`,
                'error',
                {
                confirmButtonText: 'Ok',
            });
         }
    });

});

// reset Parcours forms
$("#resetAddParcourFrom").on('click', function(){
    $("#formAddPacours").trigger("reset");
    $("#presentParcours").empty();
});

// Save parcours event listener
$("#saveParcours").on('click', function()
{
    var dateParcours = $("#dateParcours").val();
    var startAtParcours = $("#timeStartParcours").val();
    var endAtParcours = $("#timeEndParcours").val();
    var groupNameParcours = $("#groupParcours").val();
    var presentParcours = $("#presentParcours").val();
    var absentParcours = [];
    var  groupMemberList = $("#presentParcours option").toArray().map(member => member.value);
    groupMemberList.forEach(member => {
        if (presentParcours.indexOf(member) === -1) {absentParcours.push(member);}
    });

    var parcoursData = {
        dateNewParcours: dateParcours,
        timestartAt: startAtParcours,
        timeEndAt: endAtParcours,
        cours: coursNameTeacher,
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

// Update parcours button event listener
$(document).on('click', '.btnUpdateParcours', function(){

    var column = $(this).closest('tr');
    var date = column.find('td:eq(0)').text();
    var startTimeDelete = column.find('td:eq(1)').text();
    var endTimeDelete = column.find('td:eq(2)').text();
    var groupNameDelete = column.find('td:eq(3)').text();
    parcoursUpdateData = {
        cours: coursNameTeacher,
        date: date,
        heureStart: startTimeDelete,
        heureFin: endTimeDelete,
        groupe: groupNameDelete,
    }

    $.ajax({
        url: '/getParcours',
        method: 'post',
        data: parcoursUpdateData,
        dataType: 'json',
        success: function(res){
            var data = JSON.parse(JSON.stringify(res));
            $("#presentParcoursUpdate").find("option").remove().end();
            $("#groupUpdateParcours").val(data[0]._id.groupe);
            var date = data[0]._id.date;
            date = date.split("/").reverse().join("-");
            $("#dateUpdateParcours").val(date);
            $("#timeStartUpdateParcours").val(data[0]._id.heureStart);
            $("#timeEndUpdateParcours").val(data[0]._id.heureFin);
            var users = data[0].tabl;
            
            users.forEach(user =>{
                if(user.presence === true)
                {
                    var option = `<option value="${user.id}" selected>${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }else{
                    var option = `<option value="${user.id}">${user.user}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }
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



// Save parcours button eventListener
$("#saveUpdateParcours").on('click', function(){
    var gpnmUpdate = $("#groupUpdateParcours").val();
    var dateUpdate = $("#dateUpdateParcours").val();
    var timeStartUpdate = $("#timeStartUpdateParcours").val();
    var timeEndUpdate = $("#timeEndUpdateParcours").val();
    var presentParcours = $("#presentParcoursUpdate").val();
    var absentParcours = [];
    let groupMemberListUpdate;
    var newAbslist = [];

    groupMemberListUpdate = $("#presentParcoursUpdate option").toArray().map(member => member.value);
    
    for(let i=0; i < groupMemberListUpdate.length; i++)
    {
        if(groupMemberListUpdate[i] != ''){ absentParcours.push(groupMemberListUpdate[i]) }
    }
    absentParcours.forEach(member => {
        if (presentParcours.indexOf(member) === -1) {newAbslist.push(member);}
    });

    var parcoursDataUpdate = {
        dateNewParcours: dateUpdate,
        timestartAt: timeStartUpdate,
        timeEndAt: timeEndUpdate,
        // cours: cour_name,
        groupParcoursName: gpnmUpdate,
        present: presentParcours,
        absent: newAbslist
    }

    $.ajax({
        url: "/update_parcoursajax",
        method: "post",
        data: parcoursDataUpdate,
        success: function(res){
            $("#parcoursDatatable").DataTable().ajax.reload(null, false);
            clearParcoursForm("update");
            Swal.fire(
                'Parcours Saved',
                'Parcours updated successfully!',
                'success',
                {
                confirmButtonText: 'Ok',
            });

        },
        error: function(err){
            Swal.fire(
                'Error',
                `Error occured when perform this action!`,
                'error',
                {
                confirmButtonText: 'Ok',
            })
        }
    });
});


// delete parcours button event Listener
$(document).on('click', '.btnDeleteParcours', function(){
    Swal.fire({
        title: 'Delete Parcours',
        text: "Are you sure do delete this parcours?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            var column = $(this).closest('tr');
            var date = column.find('td:eq(0)').text();
            var startTimeDelete = column.find('td:eq(1)').text();
            var endTimeDelete = column.find('td:eq(2)').text();
            var groupNameDelete = column.find('td:eq(3)').text();
            // var presentDelete = column.find('td:eq(4)').find("select").text();
            // var absentDelete = column.find('td:eq(5)').find("select").text();
            // var presentslistfiltered = [];
            // var absentslistfiltered = [];
            
            // if (presentDelete != "")
            // {
            //     presentDelete = presentDelete.split(".com");
            //     presentDelete.forEach(item =>{
            //         var newItem = '' + item + '.com';
            //         presentslistfiltered.push(newItem);
            //     });
            //     presentslistfiltered.splice(-1);
            // }

            // if (absentDelete != "")
            // {
            //     absentDelete = absentDelete.split(".com");
            //     absentDelete.forEach(item =>{
            //         var newItem = '' + item + '.com';
            //         absentslistfiltered.push(newItem);
            //     });
            //     absentslistfiltered.splice(-1);
            // }
            date = date = date.split('/').reverse().join('-');
            parcoursDeleteData = {
                cours: coursNameTeacher,
                date: date,
                heureStart: startTimeDelete,
                heureFin: endTimeDelete,
                groupe: groupNameDelete,
            }

            $.ajax({
                url: '/deleteParcours',
                method: 'post',
                data: parcoursDeleteData,
                success: function(res){
                    responsetxt = "Parcours deleted successfully!";
                    Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: responsetxt,
                        showConfirmButton: true,
                    });
                    $("#parcoursDatatable").DataTable().ajax.reload(null, false);
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
        }
    })
});

// Cancel  button event listener
$("#cancelAddParcours").on('click', function(){
    $("#formAddPacours").trigger("reset");
    $("#presentParcours").empty();
});

// function to clear form
function clearParcoursForm(action)
{
    switch(action)
    {
        case 'add':
            $("#formAddPacours").trigger("reset");
            $("#presentParcours").empty();
            $("#cancelAddParcours").click();
        case 'update':
            $("#formUpdatePacours").trigger("reset");
            $("#presentParcoursUpdate").empty();
            $("#cancelUpdateParcours").click();
    }
}


