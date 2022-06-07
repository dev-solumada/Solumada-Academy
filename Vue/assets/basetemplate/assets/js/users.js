function getuser(id)
{

    $.ajax(
        {
            url : "/getuser",
            method: 'post',
            dataType: 'json',
            data: {id: id},
            success: function(user){
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
            }
        }
    });
}

function updateUser(url, id)
{
    let name = $('#name');
    let email = $('#email');
    let m_code = $('#m_code');
    let num_agent = $('#num_agent');
    let user_type = $('#user_type');
    $.ajax({
        url: url +'/'+ id,
        method: 'post',
        dataType: 'json',
        data : {'name':name, 'email':email, 'm_code':m_code, 'num_agent':num_agent, 'user_type':user_type},
        success : function(response){
            alert("user updatated");
            resetForm(name='update');
        },
        error: function(response){
            alert('Error occured when update the user');
        }
    })
}


function deleteUser(url, id)
{
    $.ajax({
        url: url + '/' + id,
        method: 'post',
        success: function(response){
            alert('user deleted successfully');
        },
        error: function(response){
            alert('deletion error');
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