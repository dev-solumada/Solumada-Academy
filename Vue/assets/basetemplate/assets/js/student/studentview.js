


$(document).on('click', ".btnSendRequest", function()
{
    var askJoinData = {
        "user": $("#userId").val(),
        "cours": $(this).parent().find(".card_price").text(),
        "demand": false
    }

    $.ajax({
        url: "/createDemand",
        method: "post",
        data: askJoinData,
        success: function(res){
            Swal.fire(
                'Success',
                "Your request has been sent successfully!",
                'success',
                {
                    confirmButtonText: 'Ok',
                });
        },
        error: function(error){
            Swal.fire(
                'Error',
                "Failed to send request, please try again later!",
                'error',
                {
                    confirmButtonText: 'Ok',
            });
        }
    });
});