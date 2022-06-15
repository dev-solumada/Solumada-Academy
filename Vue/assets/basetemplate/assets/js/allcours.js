let id, currentPage;

getCoursList();

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
            {"data": ""},
            {"data": "date_Commenc"},
            {"data": "type"},
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ],
        "columnDefs": [ 
            {
            "targets": 3,
            "render": function(data)
                    {
                        var date = new Date(data);
                        var month = date.getUTCMonth() + 1;
                        return  (date.getUTCDay() + "/" + month + "/" + date.getUTCFullYear());
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


function searchOnDatatable(datatable, value)
{
    datatable.search(value).draw();
}

// Function to Save new Cours
$("#saveCours").on("click", function()
{
    AddCourData = {
            nameCours: $('#nameCours').val(),
            date_Commenc: $('#date_Commenc').val(),
            professeur: $('#professeur').val(),
            typeCours: $('#typeCours').val()
        }

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
                resetCoursForm(action='addCours');
                getCoursList();
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
                        searchOnDatatable(datatable=coursDataTable, value=response);
                        setTimeout(function() { 
                            coursDataTable.search('').draw();
                            coursDataTable.page(currentPage).draw('page');
                        }, 3000);
                    }
                });
            }
        }
    });
});


// Function to get Cours from backend and insert it at Modal Update Cours
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
                        var date = new Date(cours.date_Commenc);
                        var day = date.getUTCDay();
                        var month = date.getUTCMonth();
                        var year = date.getUTCFullYear();
                        date = `${day}/${month + 1}/${year}`;
                        alert(date);
                        $('#date_Commenc_update').val(date);
                    },
                error: function(err){
                        alert(JSON.stringify(err));
                }
            }
        )
});

// Function to Save the Update on Cours
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
                getCoursList();
                Swal.fire(
                    'Cours Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        coursDataTable.ajax.reload(null, false);
                        searchOnDatatable(datatable=coursDataTable, value=response);
                        setTimeout(function() { 
                            coursDataTable.search('').draw();
                            coursDataTable.page(currentPage).draw('page');
                        }, 3000);
                    }
                })
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
});

// Function to Delete Cours
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

                                        responsetxt = "Cours " + coursName + ' Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1700
                                        });
                                        coursDataTable.ajax.reload(null, false);
                                        getCoursList();
                                        coursDataTable.search('').draw();
                                        coursDataTable.page(currentPage).draw('page');
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
                }
        }
    )
});



// Reset the Cours Modal Form
function resetCoursForm(action)
{
    $('#closeCoursModal').click();
    switch(action){
        case 'addCours':
            $('#nameCours').val('');
            $('#date_Commenc').val('');
            $('#typeCours').val('');
            $('#professeur').val('');
            $('#errorAddCour').css('display', 'none');
            $('#closeCoursModal').click();
            break;
        case 'updateCours':
            $('#cours_id').val('');
            $('#nameCours_update').val('');
            $('#date_Commenc_update').val('');
            $('#typeCours_update').val('');
            $('#professeur_update').val('');
            $('#errorUpdateCour').css('display', 'none');
            $('#closeAddCoursModal').click();
            break;
    }
}


// Get all cours List from the Database and diplay asyncronously on menu
function getCoursList()
{
    $.ajax(
        {
            url: '/allCoursLists',
            method: 'get',
            dataType: 'json',
            success: function(data)
                {
                    $('#dropdownCoursObligatory').empty();
                    $('#dropdownCoursOptional').empty();

                    obligatoryCours = data.listcourOblig;
                    optionalCours =data.listcourFac;

                    $.each(obligatoryCours, function(key, value)
                    {
                        $("#dropdownCoursObligatory").append(`<li class="sub-menu-item"><i class="fa fa-arrow-circle-o-right"></i><a href="/listeCours/${value.name_Cours}"</a>${value.name_Cours}</li>`);
                    });

                    $.each(optionalCours, function(key, value)
                    {
                        $("#dropdownCoursOptional").append(`<li class="sub-menu-item"><i class="fa fa-arrow-circle-o-right"></i><a href="/listeCours/${value.name_Cours}"</a>${value.name_Cours}</li>`);
                    });
                },
            error: function(error)
                {
                    alert(error);
                }      
        }
    );
}