
var currentUrl = window.location.href;
var arg = currentUrl.split('/');
var coursName = $(arg).get(-1);
var currentGroupName = "";
var firstShow = true;

// Add member to current selected group
$("#addMememberToGroupTeacher").on('click', function(){
    var gpn = $("#teacherSelectGroup").val();
    $(".teacherAddMemberLabel").html(gpn);

});


// Create Group
$("#saveNewGroup").on('click', function(){
    var newgroupData = { 
        newgroupe: $("#newgroupName").val(), 
        cours: coursName,
    };
    alert(JSON.stringify(newgroupData));
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
        var url = `/groupemember/${coursName}/${newGgroupeName}`;
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
                                        <button type='button'  class='btn px-2 btn-sm btn-danger removeToGroup' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
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
        var url = `/groupemember/${coursName}/${newGgroupeName}`;
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
    refreshData();
});

// Get list user and set exclude existing member and set it to select option list
function setAddMemberList()
{
    $("#listUserC").empty();
    var gpn = $("#teacherSelectGroup").val();
     dataToSend = {cours: coursName, groupe: gpn};
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
            alert("error");
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
                            coursName: coursName,
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