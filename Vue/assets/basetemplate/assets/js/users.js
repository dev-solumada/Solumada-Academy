let column, id, usernam, m_code, num_agent, type_util;

let currentPage;


let userDatatable = $("#userTable").DataTable({
    "ajax": {
        "url": "/allUsers",
        "dataSrc": "",
    },
    "columns": [
        {"data": "username"},
        {"data": "m_code"},
        {"data": "num_agent"},
        {"data": "type_util"},
        {"defaultContent": "\
                            <div class='btn-group' role='group' aria-label='Basic mixed styles example'>\
                                <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateUser' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#UserUpdateModal' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteUser' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                            </div>\
                            "
        }
    ]
});

$('#btnCreateUser').on('click', function()
{
    $('#largeModalLabelAdd').css('display', 'block');
    $('#largeModalLabelUpdate').css('display', 'none');
});


$('#saveUser').on("click", function()
{
    formAddData = {
            name: $('#name').val(),
            email: $('#email').val(),
            m_code: $('#m_code').val(),
            num_agent: $('#num_agent').val(),
            type_util: $('#type_util').val()
        }

    $.ajax({
        url: '/addemp',
        method: 'post',
        data: formAddData,
        success: function(response)
        {
            if(response == 'error')
            {
                $('#successAddUser').css('display', 'none');
                $('#errorAddUser').css('display', 'block');
                $('#errorAddUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            }
            else {
                resetForm(action='add');
                responsetxt = response + ' Saved successfully';
                Swal.fire(
                    'User Saved',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                }).then((result) => {
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
                        userDatatable.page(currentPage).draw('page');
                        $('#closeModal').click();
                    }
                })
            }
        }
    });
});


$(document).on('click', '.btnUpdateUser', function(){
    currentPage = parseInt(userDatatable.page.info().page);
    column = $(this).closest('tr');
    email = column.find('td:eq(0)').text();
    $.ajax(
            {
                url : "/getuser",
                method: 'post',
                dataType: 'json',
                data: {email: email},
                success: function(user){
                        $('#user_id').val(user._id);
                        $('#name_update').val(user.name);
                        $('#email_update').val(user.username);
                        $('#m_code_update').val(user.m_code);
                        $('#num_agent_update').val(user.num_agent);
                        $('#type_util_update').val(user.type_util);
                    },
                error: function(err){
                        alert(JSON.stringify(err));
                }
            }
        )

});


$(document).on('click', '#saveUpdateUser', function(){
    formUpdateData = {
        id : $('#user_id').val(),
        username: $('#name_update').val(),
        email: $('#email_update').val(),
        m_code: $('#m_code_update').val(),
        num_agent: $('#num_agent_update').val(),
        type_util: $('#type_util_update').val()
    }

    $.ajax({
        url: '/updateuser',
        method: 'post',
        data : formUpdateData,
        success : function(response){
            if(response == 'error'){
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                resetForm(action='update');
                responsetxt = response + ' Updated successfully';
                Swal.fire(
                    'User Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                        userDatatable.ajax.reload(null, false);
                        $('#closeModal').click();
                        userDatatable.page(currentPage).draw('page');
                    }
                })
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
});

$(document).on('click', '.btnDeleteUser', function()
{
    column = $(this).closest('tr');
    email = column.find('td:eq(0)').text();
    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {email: email},
            success: function(user){
                    var user_email = user.username
                    var txt = "Are you sure to delete " + user_email +"?";
                        Swal.fire({
                            title: 'Delete User',
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/dropuser',
                                    method: 'post',
                                    data: { email: user_email },
                                    success: function(response){
                                        responsetxt = user_email + ' Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                        userDatatable.ajax.reload(null, false);
                                        $('#closeModal').click();
                                        userDatatable.page(currentPage).draw('page');
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
                },
            error: function(err){
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: err
                });
            }
        }
    )
});




// function getuser(id)
// {

//     $.ajax(
//         {
//             url : "/getuser",
//             method: 'post',
//             dataType: 'json',
//             data: {id: id},
//             success: function(user){
//                     $('#user_id').val(user._id);
//                     $('#name_update').val(user.name);
//                     $('#email_update').val(user.username);
//                     $('#m_code_update').val(user.m_code);
//                     $('#num_agent_update').val(user.num_agent);
//                     $('#type_util_update').val(user.type_util);
//                 },
//             error: function(err){
//                     alert(JSON.stringify(err));
//             }
//         }
//     )
// }


// function addUser(url)
// {
//     formAddData = {
//                     name: $('#name').val(),
//                     email: $('#email').val(),
//                     m_code: $('#m_code').val(),
//                     num_agent: $('#num_agent').val(),
//                     type_util: $('#type_util').val()
//                 }

//     $.ajax({
//         url: url,
//         method: 'post',
//         data: formAddData,
//         success: function(response){
//             if(response == 'error'){
//                 $('#successAddUser').css('display', 'none');
//                 $('#errorAddUser').css('display', 'block');
//                 $('#errorAddUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
//             } else {
//                 resetForm(action='add');
//                 responsetxt = response + ' Saved successfully';
//                 Swal.fire(
//                     'User Saved',
//                     responsetxt,
//                     'success',
//                     {
//                     confirmButtonText: 'Ok',
//                   }).then((result) => {
//                     if (result.isConfirmed) {
//                     window.location = "/listeUser";
//                     }
//                   })
//             }
//         }
//     });
// }

function updateUser(url)
{
    formUpdateData = {
        id : $('#user_id').val(),
        username: $('#name_update').val(),
        email: $('#email_update').val(),
        m_code: $('#m_code_update').val(),
        num_agent: $('#num_agent_update').val(),
        type_util: $('#type_util_update').val()
    }

    $.ajax({
        url: url,
        method: 'post',
        data : formUpdateData,
        success : function(response){
            if(response == 'error'){
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                resetForm(action='update');
                responsetxt = response + ' Updated successfully';
                Swal.fire(
                    'User Updated',
                    responsetxt,
                    'success',
                    {
                    confirmButtonText: 'Ok',
                  }).then((result) => {
                    if (result.isConfirmed) {
                    window.location = "/listeUser";
                    }
                })
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
}


function getuserAndDelete(id)
{

    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {id: id},
            success: function(user){
                    var user_email = user.username
                    var txt = "Are you sure to delete " + user_email +"?";
                        Swal.fire({
                            title: 'Delete User',
                            text: txt,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: 'red',
                            cancelButtonColor: 'green',
                            confirmButtonText: 'Yes, delete it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                $.ajax({
                                    url: '/dropuser',
                                    method: 'post',
                                    data: { email: user_email },
                                    success: function(response){
                                        responsetxt = user_email + ' Deleted successfully';
                                        Swal.fire({
                                            position: 'center',
                                            icon: 'success',
                                            title: responsetxt,
                                            showConfirmButton: false,
                                            timer: 1600
                                        });
                                        window.location = "/listeUser";
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
                },
            error: function(err){
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: response
                });
            }
        }
    )
}


function resetForm(action)
{
    switch(action){
        case 'add':
            $('#name').val('');
            $('#email').val('');
            $('#m_code').val('');
            $('#num_agent').val('');
            $('#user_type').val('');
            break;
        case 'update':
            $('#name_update').val('');
            $('#email_update').val('');
            $('#m_code_update').val('');
            $('#num_agent_update').val('');
            $('#user_type_update').val('');
            break;
    }
}