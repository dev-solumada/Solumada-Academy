function getuser(id)
{
    let username = $('#name');
    let email = $('#email');
    let m_code = $('#m_code');
    let num_agent = $('#num_agent');
    let user_type = $('#user_type');

    $.ajax(
        {
            url : "/getuser",
            method: 'get',
            dataType: 'json',
            beforeSend: function(){
                $('#userUpdate').modal('show');
            },
            success: function(response){
                    console.log(JSON.stringify(response));
                },
            error: function(err){
                    console.log(err);
            }
        }
    )
}