$(document).ready(
    function () {
        $('.delete-btn').on('click', function(event){
            event.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                text: "to delete this object",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'red',
                cancelButtonColor: 'green',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                    
                Swal.fire({
                    title:'Deleted!',
                    text:'Object was deleted successfuly',
                    confirmButtonColor: 'black',
                    icon:'success',
                })}else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Deletion',
                        text: 'deletion object canceled',
                        confirmButtonColor: 'black',
                    })
                }
            });
        })
    });