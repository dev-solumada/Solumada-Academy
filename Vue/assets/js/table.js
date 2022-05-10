$(document).ready(
    function () {
        $('.btn-header').click(
            function () {
                $('.menu').addClass('active-mini');
            }
        );
        $('.close-btn').click(
            function () {
                $('.menu').removeClass('active-mini');
            }
        );
        $('.delete-btn').on('click', function(event){
            event.preventDefault();
            Swal.fire({
                title: 'Are you sure?',
                text: "to delete this object",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            }).then((result) => {
                if (result.isConfirmed) {
                Swal.fire(
                    'Deleted!',
                    'Object was deleted successfuly',
                    'success'
                )}else{
                    Swal.fire({
                        icon: 'error',
                        title: 'Deletion',
                        text: 'deletion object canceled',
                    })
                }
            });
        })
    });