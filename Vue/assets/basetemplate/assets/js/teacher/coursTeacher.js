
var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);
var groupMemberList = [];
var groupMemberPresentList = [];
var groupMemberAbsentList = [];


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
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateParcours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UpdateparcoursModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
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

function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

$("#groupParcours").on('change', function(){
    groupMemberList = [];
    var groupName = $("#groupParcours").val();
    var groupMemberData = { gpe: groupName, cours:arg };
    $.ajax({
        url: "/presence",
        data: groupMemberData,
        method: "post",
        success: function(response){ 
            response.forEach(element => {
                groupMemberList.push(element.username);
                $('#presentParcours').append(`<option value="${element.username}">${element.username}</option>`);
            });
            $("#presentParcours").chosen({
                disable_search_threshold: 10,
                no_results_text: "Oops, nothing found!",
                width: "100%"
            });
        },
        error: function(error){ alert(JSON.stringify(error)); }
    });
    alert(JSON.stringify(groupMember));

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
        cours: arg,
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
$(document).on('click', '.btnUpdateParcours', function(){

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

function clearParcoursForm(action)
{
    switch(action)
    {
        case 'add':
            $("#formAddPacours").each(function(){ this.reset(); });
            $("#cancelAddParcours").click();
        case 'update':
            $("#formUpdatePacours").each(function(){ this.reset(); });
            $("#cancelUpdateParcours").click();
    }
}












