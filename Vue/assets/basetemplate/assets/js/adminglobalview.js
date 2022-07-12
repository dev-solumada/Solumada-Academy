

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
                      {'data': 'emp_point', 'render': function(emp_point, i){
                        console.log("emp_point", emp_point);
                        var points = "";
                        i = 0
                        i = i + 1
                        var user_point = `<option value=${emp_point[0]} class='text-center'>${emp_point[0]}</option>`;
                        points = points + user_point;
                        delete emp_point[0];
                        emp_point.forEach(point => {
                          points = points + `<option value=${point} class='text-center'>${point}</option>`;
                        });
                        var points_data = `<div class='input-group'><select class='form-control selectNiveau selectPoint' >${points}</select></div>`;
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

$("#saveChange").on("click", function()
    {
        //
    var table = document.getElementById("get-table");
    //iterate trough rows
    //console.log(table);
    var row
    var val=[];
   for (var i = 0, row; row = table.rows[i]; i++) {

        var x = row.cells[0].innerText;
        var y = row.cells[1].innerText;
        var z = row.cells[2].innerText;
        var b = row.cells[4].childNodes[0].childNodes[0]//.childNodes[1]//.childNodes[3]
        var point = b.options[b.options.selectedIndex].value;
        var c = row.cells[5].childNodes[0].childNodes[0]
        var grad = c.options[c.options.selectedIndex].value;
        var obj = {};
        var pair ={mail : x, m_code: y, numb: z, point: point, grad: grad};// {mail: x.replace(/(^"|"$)/g, ''),m_coe: y, numb: z};
        obj = {...obj, ...pair};
        val.push(obj)
    }
    
    PointData =  { point: val }
        $.ajax({
            url: '/point_grad',
            method: 'post',
            data: PointData,
            success: function(response){
              if(response == "success")
              {
                Swal.fire({
                  icon: 'success',
                  title: 'New Point Saved',
                  text: `Point saved successfully`,
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



// $("#btnGrad").on("click", function()
//     {
//         GradData = { newgrad: $('#AddGrad').val() }
$("#savePoint").on("click", function()
    {
        PointData = { newpoint: $('#newPoint').val() }
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
                }) ;
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

$("#point").on("click", function()
    {
      currentPage = parseInt(AdminglobalViewDatatable.page.info().page);
      
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
