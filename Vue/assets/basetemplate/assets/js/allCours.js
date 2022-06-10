let id, currentPage;

let coursDataTable = $('#CoursTable').DataTable(
    {
        "ajax": {
            "url": "/allCours",
            "dataSrc": "",
        },
        "columns": [
        {"data": "_id"},
        // {"data": "name_Cours"},
        {"data": "professeur"},
        {"data": "date_Commenc"},
        // {"data": "type"},
        {"defaultContent": "\
                            <div class='btn-group' role='group' aria-label='Basic mixed styles example'>\
                                <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                            </div>\
                            "
        }
    ],
    }
);

$('#btnCreateCours').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});


$('#saveCours').on("click", function()
{
    formAddCourData = {
            nameCours: $('#nameCours').val(),
            date_Commenc: $('#date_Commenc').val(),
            professeur: $('#professeur').val(),
            typeCours: $('#typeCours').val()
        }

    $.ajax({
        url: '/addcours',
        method: 'post',
        data: formAddCourData,
        success: function(response)
        {
            if(response == 'error')
            {
                $('#errorAddCour').css('display', 'block');
                $('#errorAddCour').html('<strong>'+response+'</strong>' + ': Cours name already exist');
            }
            else {
                // resetForm(action='add');
                responsetxt = response + ' Saved successfully';
                Swal.fire(
                    'Cours Saved',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        coursDataTable.ajax.reload(null, false);
                        $('#closeCoursModal').click();
                    }
                });
            }
        }
    });
});



$(document).on('click', '.btnUpdateCours', function()
{
    column = $(this).closest('tr');
    id = column.find('td:eq(0)').text();
    $.ajax(
            {
                url : "/getCours",
                method: 'post',
                dataType: 'json',
                data: {id: id},
                success: function(cours)
                    {
                        $('#cours_id').val(cours._id);
                        $('#nameCours_update').val(cours.name_Cours);
                        $('#date_Commenc_update').val(cours.date_Commenc);
                        $('#typeCours_update').val(cours.type);
                        $('#professeur_update').val(cours.professeur);
                    },
                error: function(err){
                        alert(JSON.stringify(err));
                }
            }
        )
});


$(document).on('click', '#saveUpdateCours', function(){
    formUpdateCoursData = {
        id : $('#cours_id').val(),
        name_Cours: $('#nameCours_update').val(),
        date_Commenc: $('#date_Commenc_update').val(),
        typeCours: $('#typeCours_update').val(),
        professeur: $('#typeCours_update').val()
    }

    $.ajax({
        url: '/updatecours',
        method: 'post',
        data : formUpdateCoursData,
        success : function(response){
            if(response == 'error'){
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                // resetForm(action='update');
                responsetxt = response + ' Updated successfully';
                Swal.fire(
                    'Cours Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
                        $('#closeCoursModal').click();
                    }
                })
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
});


$(document).on('click', '.btnDeleteCours', function()
{
    column = $(this).closest('tr');
    id = column.find('td:eq(0)').text();
    $.ajax(
        {
            url : "/getCours",
            method: 'post',
            dataType: 'json',
            data: {id: id},
            success: function(cours)
            {
                    var coursName = cours.name_Cours
                    var txt = "Are you sure to delete " + coursName +"?";
                        Swal.fire({
                            title: 'Delete Cours',
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/dropcours',
                                    method: 'post',
                                    data: { name_Cours: coursName },
                                    success: function(coursName){
                                        responsetxt = coursName + 'Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                        coursDataTable.ajax.reload(null, false);
                                    },
                                    error: function(response){
                                        Swal.fire({
                                            position: 'top-center',
                                            icon: 'error',
                                            title: response,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                    }
                                })
                            }
                        })
                }
        }
    )
});


function resetCoursForm(action)
{
    switch(action){
        case 'add':
            $('#nameCours_update').val('');
            $('#date_Commenc_update').val('');
            $('#typeCours_update').val('');
            $('#professeur_update').val('');
            break;
        case 'update':
            $('#cours_id').val('');
            $('#nameCours_update').val('');
            $('#date_Commenc_update').val('');
            $('#typeCours_update').val('');
            $('#professeur_update').val('');
            break;
    }
}