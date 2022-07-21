var usermd = document.getElementById("userId").value
$("#requet").on('click', function () {
    //$("#requet").html("Button New Text");
    var cours = document.getElementById("title").textContent
    var dem = document.getElementById("demande").value
    console.log("$(title) ", document.getElementById("title"));
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
        //data: demandeCoursData,
        // success: function (res) {
        //     if (res === "exist") {
        //         Swal.fire(
        //             'Error',
        //             "this parcours already exist or complete the field!",
        //             'info',
        //             {
        //                 confirmButtonText: 'Ok',
        //             });

        //     } else {
        //         $("#parcoursDatatable").DataTable().ajax.reload(null, false);
        //         Swal.fire(
        //             'Parcours Saved',
        //             'New parcours saved successfully!',
        //             'success',
        //             {
        //                 confirmButtonText: 'Ok',
        //             });
        //         clearParcoursForm();
        //     }
        // },
        // error: function (err) {
        //     Swal.fire(
        //         'Error',
        //         `${err}`,
        //         'error',
        //         {
        //             confirmButtonText: 'Ok',
        //         })
        // }
    });
    }
});

