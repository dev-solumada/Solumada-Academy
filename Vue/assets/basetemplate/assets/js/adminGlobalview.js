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
                      {'data': 'emp_point'},
                      {'data': 'emp_grade'}

                  ],
    }
);

