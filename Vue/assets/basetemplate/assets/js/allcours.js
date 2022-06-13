let id, currentPage;


let coursDataTable = $('#CoursTable').DataTable(
    {
        "ajax": {
            "url": "/allCours",
            "dataSrc": "",
        },
        "columns": [
            // {"data": "_id"},
            {"data": "name_Cours"},
            {"data": "professeur"},
            {"data": "date_Commenc"},
            {"data": "type"},
            {"defaultContent": "\
                                <div class='btn-group' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ],
        "columnDefs": [ 
            {
            "targets": 2,
            "render": function(data)
                    {
                        return  (""+ new Date(data).getDay() + "/" + new Date(data).getMonth() + "/" + new Date(data).getFullYear());
                    }
            } 
        ]
    }
);

$('#btnCreateCours').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});


$("#saveCours").on("click", function()
{
    AddCourData = {
            nameCours: $('#nameCours').val(),
            date_Commenc: $('#date_Commenc').val(),
            professeur: $('#professeur').val(),
            typeCours: $('#typeCours').val()
        }

    alert(JSON.stringify(AddCourData));

    $.ajax({
        url: '/addcours',
        method: 'post',
        data: AddCourData,
        success: function(response)
        {
            if(response == 'error')
            {
                $('#errorAddCour').css('display', 'block');
                $('#errorAddCour').html('<strong>'+response+'</strong>' + ': Cours name already exist');
            }
            else {
                $('#closeCoursModal').click();
                resetCoursForm(action='addCours');
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
                    }
                });
            }
        }
    });
});



$(document).on('click', '.btnUpdateCours', function()
{
    column = $(this).closest('tr');
    var name_Cours = column.find('td:eq(0)').text();
    $.ajax(
            {
                url : "/getCours",
                method: 'post',
                dataType: 'json',
                data: {name_Cours: name_Cours},
                success: function(cours)
                    {
                        $('#cours_id').val(cours._id);
                        $('#nameCours_update').val(cours.name_Cours);
                        $('#typeCours_update').val(cours.type);
                        $('#professeur_update').val(cours.professeur);
                        $('#date_Commenc_update').val(new Date(cours.date_Commenc).toISOString().split('T')[0]);
    
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
        professeur: $('#professeur_update').val()
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
                resetCoursForm(action='updateCours');
                responsetxt = "cours " + response + ' Updated successfully';
                Swal.fire(
                    'Cours Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
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
    name_Cours = column.find('td:eq(0)').text();
    $.ajax(
        {
            url : "/getCours",
            method: 'post',
            dataType: 'json',
            data: {name_Cours: name_Cours},
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

                                        responsetxt = "Cours " + coursName + 'Deleted successfully';
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
    $('#closeCoursModal').click();
    switch(action){
        case 'addCours':
            $('#nameCours').val('');
            $('#date_Commenc').val('');
            $('#typeCours').val('');
            $('#professeur').val('');
            break;
        case 'updateCours':
            $('#cours_id').val('');
            $('#nameCours_update').val('');
            $('#date_Commenc_update').val('');
            $('#typeCours_update').val('');
            $('#professeur_update').val('');
            break;
    }
}