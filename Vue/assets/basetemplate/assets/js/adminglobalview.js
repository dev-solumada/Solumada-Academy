let AdminglobalViewDatatable = $('#AdminglobalViewDatatable').DataTable(
    {
      ajax:     {
                      'url': '/adminGlobalViewAjax',
                      'dataSrc': '',
                  },
      columns: [
                      {'data': 'emp_email'},
                      {'data': 'emp_m_code'},
                      {'data': 'emp_number'},
                      {'data': 'emp_courslevel', 'render': function(emp_courslevel){
                        var options = "";
                        emp_courslevel.forEach(cours => {
                            options = options + `<option value=${cours} class='text-center'>${cours}</option>`;
                        });
                        var coursLevels = `<div class='input-group'><select class='form-control selectNiveau'>${options}</select></div>`;
                        return coursLevels;
                      }},
                      {'data': 'emp_point', 'render': function(emp_point){
                        var points = "";
                        var user_point = `<option value=${emp_point[0]} class='text-center' selected>${emp_point[0]}</option>`;
                        points = points + user_point;
                        delete emp_point[0];
                        emp_point.forEach(point => {
                          points = points + `<option value=${point} class='text-center'>${point}</option>`;
                        });
                        var points_data = `<div class='input-group'><select class='form-control selectNiveau'>${points}</select></div>`;
                        return points_data;
                      }},
                      {'data': 'emp_grade', 'render': function(emp_grade){
                        var grades = ""
                        var user_grade = `<option value=${emp_grade[0]} class='text-center' selected>${emp_grade[0]}</option>`;
                        grades = grades + user_grade;
                        delete emp_grade[0];
                        emp_grade.forEach(grade => {
                          grades = grades + `<option value=${grade} class='text-center'>${grade}</option>`;
                        });
                        var grades_data = `<div class='input-group'><select class='form-control selectNiveau'>${grades}</select></div>`;
                        return grades_data;
                      }}


                  ],
    }
);



// Reset the Point Modal Form
// function resetPointForm(action)
// {
//     $('#cancelPoint').click();
//     switch(action){
//         case 'addPoint':
//             $('#AddPoint').val('');
//             $('#errorAddPoint').css('display', 'none');
//             $('#cancelPoint').click();
//             break;
//         // case 'updatePoint':
//         //     $('#point_id').val('');
//         //     $('#AddPoint').val('');
//         //     $('#errorUpdatePoint').css('display', 'none');
//         //     $('#cancelPoint').click();
//         //     break;
//     }
// }




// // Function to Save new Point
// $("#savePoint").on("click", function()
// {
//     AddPointData = {
//             point: $('#AddPoint').val()
//         }

//     $.ajax({
//         url: '/savePoint',
//         method: 'post',
//         data: AddPointData,
//         success: function(response)
//         {
//             if(response == 'error')
//             {
//                 $('#errorAddPoint').css('display', 'block');
//                 $('#errorAddPoint').html('<strong>'+response+'</strong>' + ': Point already exist');
//             }
//             else {
//                 resetPointForm(action='addPoint');
//                 responsetxt = response + ' Saved successfully';
//                 Swal.fire(
//                     'Point Saved',
//                     responsetxt,
//                     'success',
//                     {
//                     confirmButtonText: 'Ok',
//                 });
//                 // .then((result) => {
//                 //   $('#cancelPoint').click();
//                 //   if (result.isConfirmed) {
//                 //     AdminglobalViewDatatable.ajax.reload(null, false);
//                 //       searchOnDatatable(datatable=AdminglobalViewDatatable, value=response);
//                 //       setTimeout(function() { 
//                 //         AdminglobalViewDatatable.search('').draw();
//                 //         AdminglobalViewDatatable.page(currentPage).draw('page');
//                 //       }, 3000);
//                 //   }
//                 // });
//             }
//         }
//     });
// });


