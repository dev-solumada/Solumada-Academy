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

$("#savePoint").on("click", function()
    {
        PointData = { newpoint: $('#newPoint').val() }
        $.ajax({
            url: '/savePoint',
            method: 'post',
            data: PointData,
            success: function(response){
              if(response == "success")
              {
                Swal.fire({
                  icon: 'success',
                  title: 'New Point Saved',
                  text: `Point ${PointData.newpoint} saved successfully`,
                });
                clearPointForm();
                AdminglobalViewDatatable.ajax.reload(null, false);
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'this point already exist!',
                });
              }
            }
        });
    }
);


$("#btnGrad").on("click", function()
    {
        GradData = { newgrad: $('#AddGrad').val() }
        $.ajax({
            url: '/saveGrad',
            method: 'post',
            data: GradData,
            success: function(response){
              if(response == "success")
              {
                Swal.fire({
                  icon: 'success',
                  title: 'New Graduation Saved',
                  text: `Graduation ${GradData.newgrad} saved successfully`,
                });
                clearGradForm();
                AdminglobalViewDatatable.ajax.reload(null, false);
              }else{
                Swal.fire({
                  icon: 'error',
                  title: 'Error',
                  text: 'this Graduation already exist!',
                });
              }
            }
        });
    }
);



function clearPointForm()
{
    $('#newPoint').val('');
    $('#closePointModal').click();
}


function clearGradForm()
{
    $('#AddGrad').val('');
    $('#cancelGrad').click();
}
