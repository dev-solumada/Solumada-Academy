$(document).ready(
    function () {

        $("#UserForm").on('submit', function(e){

            e.preventDefault();

            $.ajax({
                type:  $(this).attr('method'),
                contentType: 'application/json',
                url:  $(this).attr('action'),
                data:  $(this).serialize()
            }).done(function(data){
                    console.log(JSON.stringify(data));
                    $('#success').css('display', 'block');
                    $('#error').css('display', 'none');
                    resetForm();
                    $("#UserFormModal").modal('hide');
            }).fail(function(data){
                    $('#error').css('display', 'block');
                    $('#success').css('display', 'none');
                    $('#erro').html('Error, please correct mistakes');
            })
        });


        $('.deleteUser').on('click', function(event)
        {
            event.preventDefault();

            Swal.fire
            ({
                title: 'Are you sure?',
                text: "to delete this user",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'red',
                cancelButtonColor: 'green',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => 
            {
                if (result.isConfirmed) 
                { 
                    
                    Swal.fire({
                        title:'Deleted!',
                        text:'user was deleted successfuly',
                        confirmButtonColor: 'black',
                        icon:'success',
                    })
                }else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Deletion',
                        text: 'deletion user canceled',
                        confirmButtonColor: 'black',
                    })
                }
            });
        });

        function resetForm(){
            $('#name').val('');
            $('#email').val('');
            $('#m_code').val('');
            $('#num_agent').val('');
            $('#type_util').val('');
        };
});