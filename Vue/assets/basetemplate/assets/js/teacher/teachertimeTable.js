var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);


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
        "columnDefs": [
            {
                'target': 0,
                'visible': false,
                'searchable': false,
            }
        ]
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
    }
    $.ajax({
        url: "/EmplTemp",
        method: "post",
        data: newTimeTableData,
        success: function(response)
            {
                if(response == 'success')
                {
                    resetTimeTableForm(action='add');
                    responsetxt = 'Time Table Saved successfully';
                    Swal.fire(
                        'Success',
                        responsetxt,
                        'success',
                        {
                        confirmButtonText: 'Ok',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            teacherTimeTableDataTable.ajax.reload(null, false);
                            searchOnDatatable(datatable=teacherTimeTableDataTable, value=newTimeTableData.groupe);
                        }
                    });
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
                $('#select-groupe-update').val(res.groupe);
                $('#timeStart-update').val(res.heureStart);
                $('#timeEnd-update').val(res.heureFin);
                teacherTimeTableDataTable.ajax.reload(null, false);
                
            },
            error: function(res) { 
                Swal.fire({
                    position: 'top-center',
                    icon: 'error',
                    title: 'Error occured when deleting TimeTable!',
                    showConfirmButton: false,
                    timer: 1700
                });
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
                                    teacherTimeTableDataTable.ajax.reload(null, false);
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


// Update Time Table
$("#saveTeacherTimeTable").on('click', function()
{
    var updateTimeTableData = {
        id: $("#id-timetable-update").val(),
        jour: $("#select-jour-update").val(),
        group: $('#select-groupe-update').val(),
        heuredebut: $('#timeStart-update').val(),
        heurfin: $('#timeEnd-update').val(),
    }
    $.ajax(
            {
                url: "/update_time",
                method: 'post',
                data: updateTimeTableData,
                success: function(res)
                {
                    if(res == 'success')
                    {
                        resetTimeTableForm('update');
                        Swal.fire(
                            'Update Successful',
                            'Timetable updated successfully',
                            'success',
                            {
                            confirmButtonText: 'Ok',
                        });
                    }else{
                        Swal.fire(
                            'Error',
                            'Error occured when updateting timetable!',
                            'error',
                            {
                            confirmButtonText: 'Ok',
                        });
                    }
                }
            }
        );
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
