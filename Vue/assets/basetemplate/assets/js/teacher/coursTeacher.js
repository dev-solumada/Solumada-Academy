
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
                            presenceOptionData = presenceOptionData + `<option>${element}</option>`;
                        });
                        presentOptions = `<select data-placeholder="" class="standartselect form-control" tabindex="1">${presenceOptionData}</select>`;
                        return presentOptions;
                    }
        },
            {'data': 'absent', 'render': function(absent)
            {
                var absentOptionData = '';
                absent.forEach(element => {
                    absentOptionData = absentOptionData + `<option>${element}</option>`
                });
                absentOptions = `<select data-placeholder="" class="standartselect form-control" tabindex="1">${absentOptionData}</select>`;
                return absentOptions;
            }
        },
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ]
    }
);


$("#gpeCreate").on('change', function(){
    groupMemberList = [];
    var groupName = $("#groupParcours").val();
    var groupMemberData = { gpe: groupName, cours:arg };
    $.ajax({
        url: "/presence",
        data: groupMemberData,
        method: "post",
        beforeSend: function(){ 
            $("#present").empty();
        },
        success: function(response){ 
            response.forEach(element => {
                groupMemberList.push(element._id);
                $('#present').append(`<option value="${element._id}">${element.username}</option>`);
            });
            $("#present").chosen({
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
    var parcoursData = {
        date: dateParcours,
        start: startAtParcours,
        endAt: endAtParcours,
        group: groupNameParcours,
        present: presentParcours
    }
    alert(JSON.stringify(parcoursData));
});







