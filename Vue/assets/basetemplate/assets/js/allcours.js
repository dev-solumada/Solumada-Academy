let column, id, name_Cours, date_Commenc, professeur, type;

let currentPage;

let coursDatatable = $("#allCoursTable").DataTable(
    {
        "ajax": {
            "url": "/allCours",
            "dataSrc": "",
        },
        "columns": [
            {"data": "name_Cours"},
            {"data": "professeur"},
            {"data": "date_Commenc"},
            {"data": "type"},
            {"defaultContent": "\
                                <div class='btn-group' role='group' aria-label='Basic mixed styles example'>\
                                    <button type='button'  class='btn px-2 btn-sm btn-warning btnUpdateCours' type='button' class='btn btn-sm btn-warning' data-toggle='modal' data-target='#updateCours' data-bs-whatever='@getbootstrap'><i class='fa fa-edit'></i></button>\
                                    <button type='button'  class='btn px-2 btn-sm btn-danger btnDeleteCours' type='button' class='btn btn-sm btn-warning'><i class='fa fa-trash'></i></button>\
                                </div>\
                                "
            }
        ]
    }
);

