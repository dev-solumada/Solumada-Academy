var usermd = document.getElementById("userId").value
var cours = document.getElementById("title").textContent
console.log("usermd", cours);

$(".requet").on('click', function () {
    var dem = document.getElementsByClassName("demande").value
    console.log("$(title) ", document.getElementsByClassName("title"));

    console.log("cours", cours);
    if (dem = "") {
        console.log("deeeemmande ", dem);
    } else {
        console.log("non deeeemmande ");
        demandeCoursData = {
            user: usermd,
            cours: cours,
            demand: false
        } 
        console.log("demandeCoursData", demandeCoursData);
    $.ajax({
        url: "/createDemand",
        method: "post",
        data: demandeCoursData,
        success: function (res) {
            if (res === "exist") {
                Swal.fire(
                    'Error',
                    "this parcours already exist or complete the field!",
                    'info',
                    {
                        confirmButtonText: 'Ok',
                    });

            } else {
                Swal.fire(
                    'Parcours Saved',
                    'New parcours saved successfully!',
                    'success',
                    {
                        confirmButtonText: 'Ok',
                    });
            }
        },
        error: function (err) {
            Swal.fire(
                'Error',
                `${err}`,
                'error',
                {
                    confirmButtonText: 'Ok',
                })
        }
    });
    }
});