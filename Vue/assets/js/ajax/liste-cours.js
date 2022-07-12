getGroupeList()

var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);

var select_gp = document.getElementById("select-group")
console.log("onchange", select_gp);
var groupe = "GROUPE FIRST"

console.log("groupe ", groupe);

function functTabl() {
    setTimeout( 
        $('#tableGroupAdmin').DataTable(
            {
                "ajax": { "url": `/groupe/${arg}/${groupe}`, "dataSrc": "" },
                "columns": [
                    {'data': 'username'},
                    {'data': 'mcode'},
                    {'data': 'num_agent'}

                ]}) 
                , 10000)
    
}

functTabl()
$("#saveGroupe").on("click", function()
{
    GroupData = { newgroupe: $('#groupeNew').val(), cours: $('#cours').val()}

    console.log("save goupre");
            $("#select-gpe").append(new Option("Hello", "1"));
    $.ajax({
        url: '/addgroupe',
        method: 'post',
        data: GroupData,
        success: function(response){
          if(response == "error")
          {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'this groupe is already exist!',
            });
          }else{
            Swal.fire({
              icon: 'success',
              title: 'New Point Saved',
              text: `Point ${GroupData.newgroupe} saved successfully`,
            });
            clearForm();
            getGroupeList()
          }
        }
    });
}
);

$("#select-group").on("change", function()
{
    if (select_gp != "") {
            
        $("#tableGroupAdmin").DataTable().ajax.reload(null, false);

                //     {'data': 'present', 'render': function(present){
                //                 var presenceOptionData = '';
                //                 present.forEach(element => {
                //                     presenceOptionData = presenceOptionData + `<option>${element}</option>`
                //                 });
                //                 presentOptions = `<select data-placeholder="" class="prensentSelect form-control" tabindex="1">${presenceOptionData}</select>`;
                //                 return presentOptions;
                //             }
                // },
                //     {'data': 'absent', 'render': function(absent){
                //         var absentOptionData = '';
                //         absent.forEach(element => {
                //             absentOptionData = absentOptionData + `<option>${element}</option>`
                //         });
                //         absentOptions = `<select data-placeholder="" class="prensentSelect form-control" tabindex="1">${absentOptionData}</select>`;
                //         return absentOptions;
                //     }
                // },
                //     {"defaultContent": "\
                //                         <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                //                             <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                //                             <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                //                         </div>\
                //                         "
                //     }
                // ]


    }





    // GroupData = { newgroupe: $('#groupeNew').val(), cours: $('#cours').val()}

    // console.log("save goupre");
    //         $("#select-gpe").append(new Option("Hello", "1"));
    // $.ajax({
    //     url: '/addgroupe',
    //     method: 'post',
    //     data: GroupData,
    //     success: function(response){
    //       if(response == "error")
    //       {
    //         Swal.fire({
    //           icon: 'error',
    //           title: 'Error',
    //           text: 'this groupe is already exist!',
    //         });
    //       }else{
    //         Swal.fire({
    //           icon: 'success',
    //           title: 'New Point Saved',
    //           text: `Point ${GroupData.newgroupe} saved successfully`,
    //         });
    //         clearForm();
    //         getGroupeList()
    //       }
    //     }
    // });
}
);


$('#select-group').change(function(){
    $.ajax({
        url: "/",
        dataType:"html",
        type: "post",
        success: function(data){
           $('#artist').append(data);
        }
    });
});
function clearForm()
{
    $('#groupeNew').val('');
    $('#cancelGroupe').click();
}


// Get all cours List from the Database and diplay asyncronously on menu
function getGroupeList()
{
    CoursData = { cours: $('#cours').val()}
    $.ajax(
        {

            url: '/allGroupe',
            method: 'post',
            dataType: 'json',
            data: CoursData,
            success: function(data1)
                {
                    $('#select-group').empty();
                    // $("#select-group").append(`<option value="">
                    // Choose groupe
                    // </option>`);
                    $.each(data1, function(key, value)
                    {
                        $("#select-group").append(`<option value="${data1[key].name_Groupe}">
                        ${data1[key].name_Groupe}
                   </option>`);
                    });
                },
            error: function(error)
                {
                    console.log("error", error);
                }
        }
    );
}