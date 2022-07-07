
var currentUrl = window.location.href;
var arg = currentUrl.split('/');
arg = $(arg).get(-1);

var parcoursDataTable = $('#parcoursDatatable').DataTable(
    {
        "ajax": { "url": `/teacherParcours/${arg}`, "dataSrc": "" },
        "columns": [
            {'data': 'date'},
            {'data': 'start_time'},
            {'data': 'end_time'},
            {'data': 'group_name'},
            {'data': 'present', 'render': function(present){
                        var presenceOptionData = '';
                        present.forEach(element => {
                            presenceOptionData = presenceOptionData + `<option>${element}</option>`
                        });
                        presentOptions = `<select data-placeholder="" class="prensentSelect form-control" tabindex="1">${presenceOptionData}</select>`;
                        return presentOptions;
                    }
        },
            {'data': 'absent', 'render': function(absent){
                var absentOptionData = '';
                absent.forEach(element => {
                    absentOptionData = absentOptionData + `<option>${element}</option>`
                });
                absentOptions = `<select data-placeholder="" class="prensentSelect form-control" tabindex="1">${absentOptionData}</select>`;
                return absentOptions;
            }
        },
            {"defaultContent": "\
                                <div class='btn-group d-flex justify-content-center' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ]
    }
);



