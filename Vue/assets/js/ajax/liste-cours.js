getGroupeList()

var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);

var groupMemberList = [];
var currentGroupName = "";
var firstShow = true;


var parcoursDataTable = $('#parcoursDatatable').DataTable(
    {
        "ajax": { "url": `/adminParcours/${arg}`, "dataSrc": "" },
        "columns": [
            { 'data': 'date' },
            { 'data': 'start_time' },
            { 'data': 'end_time' },
            { 'data': 'group_name' },
            {
                'data': 'present', 'render': function (present) {
                    var presenceOptionData = '';
                    present.forEach(element => {
                        presenceOptionData = presenceOptionData + `<option class="presentMember" value="${element.email}">${element.name}</option>`;
                    });
                    presentOptions = `<select data-placeholder="Choose One" class="standartselect form-control" tabindex="1">${presenceOptionData}</select>`;
                    return presentOptions;
                }
            },
            {
                'data': 'absent', 'render': function (absent) {
                    var absentOptionData = '';
                    absent.forEach(element => {
                        absentOptionData = absentOptionData + `<option value="${element.email}">${element.name}</option>`
                    });
                    absentOptions = `<select data-placeholder="" class="standartselect form-control" tabindex="1">${absentOptionData}</select>`;
                    return absentOptions;
                }
            },
            {
                "defaultContent": `\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateUserDataT'  type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteParcours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                `
            }
        ]
    }
);


$("#addParcours").on('click', function () {
    $("#dateParcours").val("");
    clearParcoursForm()
    
});

$("#saveGroupe").on("click", function () {
    GroupData = { newgroupe: $('#groupeNew').val(), cours: $('#cours').val() }

    $("#select-gpe").append(new Option("Hello", "1"));
    $.ajax({
        url: '/addgroupe',
        method: 'post',
        data: GroupData,
        success: function (response) {
            if (response == "error") {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'this groupe is already exist!',
                });
            } else {
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


$("#select-group").on("change", function () {
    $("#addmbre").css("display", "block");
    var newGgroupeName = $("#select-group").val();
    if (newGgroupeName != currentGroupName && firstShow == true) {
        $("#table-container").empty();
        var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${arg}/${newGgroupeName}`;
        //var username = ''
        $("#tableGroupAdmin").DataTable({
            "ajax": { "url": `${url}`, "dataSrc": ""  },
            "columns": [
                { 'data': 'name' },
                { 'data': 'mcode' },
                { 'data': 'num_agent'},
                { 'data': 'niveau', 'render': function(niveau){ if(!niveau){ return ""; }else{ return niveau; }}},
                {
                    'defaultContent': `\
                                        <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                            <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours'  type='button'  class='btn btn-sm btn-warning' data-toggle='modal' data-target='#editmember' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                            <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                        </div>\
                                        `},

            //console.log("username ", username)
            ],
            "success":function(res) {
                console.log("JSON.stringify( d )", res);
            },
        });
        currentGroupName = newGgroupeName;
        firstShow = false;
    } else if (newGgroupeName != currentGroupName && firstShow == false) {
        $("#table-container").empty();
        var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${arg}/${newGgroupeName}`;
        $("#tableGroupAdmin").DataTable({
            "ajax": { "url": `${url}`, "dataSrc": "" },
            "columns": [
                { 'data': 'name' },
                { 'data': 'mcode' },
                { 'data': 'num_agent' },
                { 'data': 'niveau', 'render': function(niveau){ if(!niveau){ return ""; }else{ return niveau; }}},
                {
                    'defaultContent': `\
                                        <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                            <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#editmember' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                            <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                        </div>\
                                        `},

            ]
        });
        currentGroupName = newGgroupeName;
    } else {
        $("#tableGroupAdmin").DataTable().ajax.reload(null, false);
    }

});

// function getusername(nom){
//     console.log("nommm ", nom);
// }

function clearForm() {
    $('#groupeNew').val('');
    $('#cancelGroupe').click();
}


// Get all cours List from the Database and diplay asyncronously on menu
function getGroupeList() {
    CoursData = { cours: $('#cours').val() }
    $.ajax(
        {

            url: '/allGroupe',
            method: 'post',
            dataType: 'json',
            data: CoursData,
            success: function (data1) {
                $('#select-group').empty();
                $("#select-group").append(`<option value="">
                    Choose groupe
                    </option>`);
                $.each(data1, function (key, value) {
                    $("#select-group").append(`<option value="${data1[key].name_Groupe}">
                        ${data1[key].name_Groupe}
                   </option>`);
                });
            },
            error: function (error) {
                console.log("error", error);
            }
        }
    );
}



var teacherTimeTableDataTable = $("#teachertimeTable").DataTable(
    {
        "ajax": { "url": `/teacherTimeTable/${arg}`, "dataSrc": "" },
        "columns": [
            { 'data': 'date' , 'render': function(date){ if(!date){ return ""; }else{ return date; }}},
            { 'data': 'jours' },
            { 'data': 'groupe' },
            { 'data': 'heureStart' },
            { 'data': 'heureFin' },
            {
                "defaultContent": `
                                <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic mixed styles example">
                                    <button class="btn px-2 btn-sm btn-warning rounded UpdateTeacherTimeTable" type="button"data-toggle="modal" data-target="#UpdatetimeTableModal"><i class="fa fa-edit"></i></button>
                                    <button type="button"  class="btn px-2 btn-sm btn-danger deleteTimeTable"><i class="fa fa-trash"></i></button>
                                </div>
                                `
            }
        ],
    }
);



function searchOnDatatable(datatable, value) {
    currentPage = datatable.page();
    datatable.search(value).draw();
}
$("#saveTimeTable").on('click', function () {
    var newTimeTableData = {
        jours: $('#select-jour').val(),
        groupe: $('#select-gpe').val(),
        timeStart: $('#timeStart').val(),
        timeEnd: $('#timeEnd').val(),
        cours: arg,
        date_time: $('#date_time').val(),
    }
    //alert(JSON.stringify(newTimeTableData));
    $.ajax({
        url: "/EmplTemp",
        method: "post",
        data: newTimeTableData,
        success: function (response) {
            if (response == 'success') {
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
                resetTimeTableForm(action = 'add');
            } else {
                Swal.fire(
                    'Error',
                    'Failed to save Time Table',
                    'error',
                    {
                        confirmButtonText: 'Ok',
                    })
            }
        },
        error: function (response) {
            alert(response);
        }
    });
});



// Reset the Time table Modal Form
function resetTimeTableForm(action) {
    switch (action) {
        case 'add':
            $('#formAddTimeTable').each(function () { this.reset(); });
            $('#closetimeTableModal').click();
            break;
        case 'update':
            $('#formUpdateTimeTable').each(function () { this.reset(); });
            $('#closetimeUpdateTableModal').click();
            break;
    }
}


// Update Time Table
$(document).on('click', '.UpdateTeacherTimeTable', function () {
    var column = $(this).closest('tr');
    var date = column.find('td:eq(0)').text();
    var day = column.find('td:eq(1)').text();
    var group = column.find('td:eq(2)').text();
    var startTim = column.find('td:eq(3)').text();
    var endTim = column.find('td:eq(4)').text();
    var updateTimeTableDataId = { date: date, day: day, group: group, startTim: startTim, endTim: endTim, cours: arg };
    $.ajax(
        {
            url: "/gettimeadmin",
            method: 'post',
            data: updateTimeTableDataId,
            success: function (res) {
                $("#id-timetable-update").val(res._id);
                $("#select-jour-update").val(res.jours);
                $("#timetablegroupupdate").val(res.groupe);
                $("#timeStart-update").val(res.heureStart);
                $("#timeEnd-update").val(res.heureFin);
            },
            error: function (res) {
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
$("#saveTeacherUpdateTimeTable").on('click', function () {

    var updateTimetableData = {
        id: $("#id-timetable-update").val(),
        jours: $("#select-jour-update").val(),
        group: $('#timetablegroupupdate').val(),
        heurdebut: $('#timeStart-update').val(),
        heurfin: $('#timeEnd-update').val()
    }

    //console.log("updateTimetableData ", updateTimetableData);
    $.ajax({
        url: "/update_time",
        method: "post",
        data: updateTimetableData,
        success: function (res) {
            if (res === "success") {
                Swal.fire({
                    position: 'top-center',
                    icon: 'success',
                    title: 'Time table updated successfuly!',
                    showConfirmButton: false,
                    timer: 1700
                });
                $("#teachertimeTable").DataTable().ajax.reload(null, false);
                //searchOnDatatable(teacherTimeTableDataTable, $("#id-timetable-update").val());
                resetTimeTableForm('update');
            } else {
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
$(document).on('click', '.deleteTimeTable', function () {
    var column = $(this).closest('tr');
    var column = $(this).closest('tr');
    var date = column.find('td:eq(0)').text();
    var day = column.find('td:eq(1)').text();
    var group = column.find('td:eq(2)').text();
    var startTim = column.find('td:eq(3)').text();
    var endTim = column.find('td:eq(4)').text();
    var updateTimeTableDataId = { date: date, day: day, group: group, startTim: startTim, endTim: endTim, cours: arg };
    $.ajax(
        {
            url: "/gettimeadmin",
            method: 'post',
            data: updateTimeTableDataId,
            success: function (res) {
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
                            url: '/deleteEmploiAdmin',
                            method: 'post',
                            data: { day: res.jours, group: res.groupe, startTim: res.heureStart, endTim: res.heureFin, cours: res.cours, date: res.date },
                            success: function (response) {

                                if (response == "success") {
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

                                } else {
                                    Swal.fire({
                                        position: 'top-center',
                                        icon: 'error',
                                        title: 'Error occured when deleting TimeTable!',
                                        showConfirmButton: false,
                                        timer: 1700
                                    });
                                }

                            },
                            error: function (response) {
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
            error: function (res) { alert(JSON.stringify(res)); }
        });
});


//variable pour UDPATE Parcours
var date_Parc = ""
var startTimeUpdat = ""
var endTimeUpdat = ""
var groupNameUpdat = ""
var users = []
// Update parcours
$(document).on('click', '.btnUpdateUserDataT', function () {
    
    var column = $(this).closest('tr');
    date_Parc = column.find('td:eq(0)').text();
    startTimeUpdat = column.find('td:eq(1)').text();
    endTimeUpdat = column.find('td:eq(2)').text();
    groupNameUpdat = column.find('td:eq(3)').text();
    parcoursUpdateData = {
        cours: arg,
        date: date_Parc,
        heureStart: startTimeUpdat,
        heureFin: endTimeUpdat,
        groupe: groupNameUpdat,
    }
    $.ajax({
        url: '/getParcoursAdmin',
        method: 'post',
        data: parcoursUpdateData,
        dataType: 'json',
        success: function (res) {
            var data = JSON.parse(JSON.stringify(res));
            $("#presentParcoursUpdate").find("option").remove().end();
            $("#groupUpdateParcours").val(data[0]._id.groupe);
            // alert(data[0]._id.date);
            var date = data[0]._id.date;
            date = date.split("/").reverse().join("-");
            $("#dateUpdateParcours").val(date);
            //$("#dateUpdateParcours").val(data[0]._id.date);
            $("#timeStartUpdateParcours").val(data[0]._id.heureStart);
            $("#timeEndUpdateParcours").val(data[0]._id.heureFin);
            users = data[0].tabl;

            users.forEach(user => {
                if (user.presence == true) {
                    var option = `<option value="${user.id}" selected>${user.name}<option>`;
                    $("#presentParcoursUpdate").append(option);
                } else {
                    var option = `<option value="${user.id}">${user.name}<option>`;
                    $("#presentParcoursUpdate").append(option);
                }
            });
            $("#presentParcoursUpdate").chosen({
                disable_search_threshold: 10,
                no_results_text: "Oops, nothing found!",
                width: "100%"
            });
            selectVidUpd("#presentParcoursUpdate")
        },
        error: function (response) {
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
$("#addmbre").on('click', function () {
    var gpn = $("#select-gpe").val();
    $(".teacherAddMemberLabel").html(gpn);

});


// Envent listener on select group
// $("#select-gpe").on('change', function () {
//     $("#addmbre").css("display", "block");
//     refreshData();
// });


// Save new member to group
$("#saveNewMemberList").on('click', function () {
    var newMbList = [];
    var userToAddList = $("#listUserToAddMember").val();
    userToAddList.forEach(user => newMbList.push(user));
    var newMemberData = {
        groupeName: $("#select-group").val(),
        coursName: arg,
        newMemberList: newMbList,
    }
    $.ajax({
        url: "/newmembreadmin",
        method: "post",
        data: newMemberData,
        success: function (res) {
            Swal.fire(
                'Members Saved',
                `Members saved on group ${$("#select-group").val()}`,
                'success',
                {
                    confirmButtonText: 'Ok',
                });
            refreshData();
            resetTeacherAddMemberForm();
        },
        error: function (err) {
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



// Reset add Member Form
function resetTeacherAddMemberForm() {
    $(".closeAddMember").click();
    $("#listUserToAddMember").prop("selected", false);
}



// Refresh all data on group page 
function refreshData() {
    setAddMemberList();
    var newGgroupeName = $("#select-group").val();

    if (newGgroupeName != currentGroupName && firstShow == true) {
        $("#table-container").empty();
        var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${arg}/${newGgroupeName}`;
        $("#tableGroupAdmin").DataTable({
            "ajax": { "url": `${url}`, "dataSrc": "" },
            "columns": [
                { 'data': 'name' },
                { 'data': 'mcode' },
                { 'data': 'num_agent' },
                { 'data': 'niveau', 'render': function(niveau){ if(!niveau){ return ""; }else{ return niveau; }}},
                {
                    'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#editmember' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
        firstShow = false;
    } else if (newGgroupeName != currentGroupName && firstShow == false) {
        $("#table-container").empty();
        var tableData = `<table id="tableGroupAdmin" name="table" class="table table-striped table-bordered"><thead><tr><th>Username</th><th>M Code</th><th>Numbering</th><th>Level</th><th class="text-center">Actions</th></tr></thead><tbody></tbody></table>`;
        $("#table-container").append(tableData);
        var url = `/groupemember/${arg}/${newGgroupeName}`;
        $("#tableGroupAdmin").DataTable({
            "ajax": { "url": `${url}`, "dataSrc": "" },
            "columns": [
                { 'data': 'name' },
                { 'data': 'mcode' },
                { 'data': 'num_agent' },
                { 'data': 'niveau', 'render': function(niveau){ if(!niveau){ return ""; }else{ return niveau; }}},
                {
                    'defaultContent': "\
                                    <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                        <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#editmember' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                        <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                    </div>\
                                    "},

            ]
        });
        currentGroupName = newGgroupeName;
    } else {
        $("#tableGroupAdmin").DataTable().ajax.reload(null, false);
    }




}


// Get list user and set exclude existing member and set it to select option list
function setAddMemberList() {
    $("#listUserC").empty();
    var gpn = $("#select-group").val();
    dataToSend = { cours: arg, groupe: gpn };
    $.ajax({
        url: "/getMemberAndAllUserList",
        method: "post",
        dataType: 'json',
        data: dataToSend,
        success: function (res) {
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
        error: function (err) {
            alert("error");
        }
    });
}




$("#groupParcours").on("change", function () {
    groupMemberList = []
    //var groupMemberList = [];
    var groupName = $("#groupParcours").val();
    var groupMemberData = { gpe: groupName, cours: arg };

    $.ajax({
        url: "/presence",
        data: groupMemberData,
        method: "post",
        success: function (response) {
            $("#presentParcours").empty();

            response.forEach(element => {
                groupMemberList.push({"mail": element.username, "name": element.name});
                $('#presentParcours').append(`<option value="${element.username}">${element.name}</option>`)
            });
            $(document).ready(function () {
                $("#presentParcours").chosen({
                    disable_search_threshold: 10,
                    no_results_text: "Oops, nothing found!",
                    width: "100%"
                });})
            $('#presentParcours').trigger("chosen:updated");
        },
        error: function (error) { alert(JSON.stringify(error)); }
    });
    //alert(JSON.stringify(groupMember));
});

$("#saveParcoursCreate").on('click', function () {
    var dateParcours = $("#dateParcours").val();
    var startAtParcours = $("#timeStartParcours").val();
    var endAtParcours = $("#timeEndParcours").val();
    var groupNameParcours = $("#groupParcours").val();
    var present = $("#presentParcours").val();

    var absentParcours = [];
    var presentParcours = [];


    groupMemberList.forEach(member => {
        if (present.indexOf(member.mail) === -1) { 
            absentParcours.push(member); 
        }else{
            presentParcours.push(member); 
        }
    });


    var parcoursData = {
        dateNewParcours: dateParcours,
        timestartAt: startAtParcours,
        timeEndAt: endAtParcours,
        cours: arg,
        groupParcoursName: groupNameParcours,
        present: presentParcours,
        absent: absentParcours
    }

    $.ajax({
        url: "/Adminaddparcours",
        method: "post",
        data: parcoursData,
        success: function (res) {
            if (res === "exist") {
                Swal.fire(
                    'Error',
                    "this parcours already exist or complete the field!",
                    'info',
                    {
                        confirmButtonText: 'Ok',
                    });

            } else {
                $("#parcoursDatatable").DataTable().ajax.reload(null, false);
                Swal.fire(
                    'Parcours Saved',
                    'New parcours saved successfully!',
                    'success',
                    {
                        confirmButtonText: 'Ok',
                    });
                clearParcoursForm();
            }
        },
        error: function (err) {
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


// delete parcours
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
            date = date = date.split('/').reverse().join('-');
            parcoursDeleteData = {
                cours: arg,
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



// Remove member group from current selected group on datatable
$(document).on('click', ".removeToGroup", function(){
    var col = $(this).closest('tr');
    //var idToDelete = col.find('td:eq(0)').text();
    var memberMail = col.find('td:eq(1)').text();
    var groupName = $("#select-group").val();
    Swal.fire({
        title: 'Remove Group Member',
        text: `Are you sure to remove ${memberMail} from ${groupName} ?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'red',
        cancelButtonColor: 'green',
        confirmButtonText: `Yes, I'm sure!`,
    }).then((result) => {
            // var deletememberData = {id: idToDelete };
            var deletememberData = {id: memberMail, groupe: groupName };
            if (result.isConfirmed)
            {
                $.ajax({
                    url: '/deleteMbAdmin',
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


var userupdate = ""
// Remove member group from current selected group on datatable
$(document).on('click', ".btnUpdateParcours", function(){
    var colon = $(this).closest('tr');
    userupdate = colon.find('td:eq(0)').text()
    var niveau = colon.find('td:eq(3)').text()
    $("#userLevel").val(niveau)
});

 
$("#saveLevel").on('click', function(){
    var groupName = $("#select-group").val();
    var addLevelData = {
        user: userupdate,
        groupe: groupName,
        level: $("#userLevel").val()
    }

    $.ajax({
        url: "/addLevelToMemberAdmin",
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
            $("#userLevel").val("");
            $("#cancelLevel").click();
            refreshData()
            //$("#GroupTeacherDatatable").DataTable().ajax.reload(null, false);
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

//Reset form parcours
let inputs = document.querySelectorAll('input')

function clearParcoursForm() {
    $("#dateParcours").empty();
    inputs.forEach(input => input.value='')
    var presentDel = document.getElementById("presentParcours");
    for (let index = 0; index < ('#presentParcours option').length; index++) {
        const element = ('#presentParcours option')[index];
        presentDel.remove(element);
    }
    document.getElementById("groupParcours").value = "";
    selectVidUpd(".prensentSelect")
    selectVidUpd("#groupParcours")
    $("#cancelAddParcours").click();
}

function selectVidUpd(a) {
    jQuery(document).ready(function () {
        jQuery(a).trigger("chosen:updated");
    });
}



$("#saveParcoursUpdate").on('click', function () {
    //console.log("saveParcoursCreate", groupMemberList);

    var presentUpd = []
    var absentUpd = []
    var groupUpdateParcours = $("#groupUpdateParcours").val();
    var dateUpdateParcours = $("#dateUpdateParcours").val();
    var timeStartUpdateParcours = $("#timeStartUpdateParcours").val();
    var timeEndUpdateParcours = $("#timeEndUpdateParcours").val();
    var presentParcoursUpdate = $("#presentParcoursUpdate").val();
    var absentParcours = [];
    // groupMemberList.forEach(member => {
    //     if (presentParcours.indexOf(member) === -1) { absentParcours.push(member); }
    // });
    selectVidUpd("presentParcoursUpdate")

    for (var option of document.getElementById('presentParcoursUpdate').options)
    {
        if (option.selected) {
            presentUpd.push(option.value);
        }else{
            absentUpd.push(option.value);
        }
    }
    var parcoursDataUpd = {
        dateUpd: dateUpdateParcours,
        timeSUpd: timeStartUpdateParcours,
        timeEUpd: timeEndUpdateParcours,
        cours: arg,
        groupe: groupUpdateParcours,
        presentUpd : presentUpd,
        absentUpd : absentUpd,
    }

    $.ajax({
        url: "/update_parcours_admin",
        method: "post",
        data: parcoursDataUpd,
        success: function (res) {
            if (res === "exist") {
                Swal.fire(
                    'Error',
                    "this parcours already exist or complete the field!",
                    'info',
                    {
                        confirmButtonText: 'Ok',
                    });

            } else {
                $("#parcoursDatatable").DataTable().ajax.reload(null, false);
                Swal.fire(
                    'Parcours Saved',
                    'New parcours saved successfully!',
                    'success',
                    {
                        confirmButtonText: 'Ok',
                    });
                clearParcoursForm();
            }
        },
        error: function (err) {
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


let inputTime = document.querySelectorAll('input')

$("#newtimetable").on('click', function () {
    $("#date_time").empty();
    inputTime.forEach(input => input.value='')
    document.getElementById("select-jour").value = "";
    document.getElementById("select-gpe").value = "";
    selectVidUpd("#select-jour")
    selectVidUpd("#select-gpe")
    document.getElementById("timeStart").value = '';
    document.getElementById("timeEnd").value = '';
    //firstShow == false
    $("#closetimeTableModal").click();
})
// $("#newtimetable").on('click', function () {
//     //$("#dateParcours").empty();
//     document.getElementById("date_time").value = '';
//     document.getElementById("select-jour").value = '';
//     document.getElementById("select-gpe").value = '';
//     document.getElementById("timeStart").value = '';
//     document.getElementById("timeEnd").value = '';
//     $("#closetimeTableModal").click();
// })