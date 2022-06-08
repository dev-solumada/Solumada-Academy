function getuser(id)
{

    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {id: id},
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
}


function addUser(url)
{
    formAddData = {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    m_code: $('#m_code').val(),
                    num_agent: $('#num_agent').val(),
                    type_util: $('#type_util').val()
                }

    $.ajax({
        url: url,
        method: 'post',
        data: formAddData,
        success: function(response){
            if(response == 'error'){
                $('#successAddUser').css('display', 'none');
                $('#errorAddUser').css('display', 'block');
                $('#errorAddUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                $('#errorAddUser').css('display', 'none');
                $('#successAddUser').css('display', 'block');
                resetForm(action='add');
                $('#successAddUser').html( response + ' Saved successfully');
                window.location = "/listeUser";
            }
        }
    });
}

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
                $('#successUpdateUser').css('display', 'none');
                $('#errorUpdateUser').css('display', 'block');
                $('#errorUpdateUser').html('<strong>'+response+'</strong>' + ': email or username already taken');
            } else {
                $('#errorUpdateUser').css('display', 'none');
                $('#successUpdateUser').css('display', 'block');
                resetForm(action='update');
                $('#successUpdateUser').html( response + ' updated successfully');
                window.location = "/listeUser";
            }
        },
        error: function(response){
            alert(JSON.stringify(response));
        }
    })
}


function getuserToDelete(id)
{

    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {id: id},
            success: function(user){
                    $('#confirmdeleteusername').html("Are you sure to delete " + user.username +" ?");
                    $('#emailtodelete').val(user.username);
                },
            error: function(err){
                    alert(JSON.stringify(err));
            }
        }
    )
}

function deleteUser(url)
{
    formDeleteData = {
        email: $('#emailtodelete').val()
    }

    $.ajax({
        url: url,
        method: 'post',
        data: formDeleteData,
        success: function(response){
            alert("delete user" + response);
            window.location = "/listeUser";
        },
        error: function(response){
            alert(response);
        }
    })
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