
$("#UserForm").on('submit', function(e){
        e.preventDefault();

        $.ajax({
            type:  $(this).attr('method'),
            contentType: 'application/json',
            url:  $(this).attr('action'),
            data:  $(this).serialize(),
            success: function(res){
                $('#success').css('display', 'block');
                $('#error').css('display', 'none');
                resetForm();
                $("#UserFormModal").modal('hide');
            },
            error: function(res){
                $('#error').css('display', 'block');
                $('#success').css('display', 'none');
        }
        
    });

    return false;
});




function resetForm(){
        $('#name').val('');
        $('#email').val('');
        $('#m_code').val('');
        $('#num_agent').val('');
        $('#type_util').val('');
};