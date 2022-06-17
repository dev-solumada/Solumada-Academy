let AdminglobalViewDatatable = $('#AdminglobalViewDatatable').DataTable(
    {
      ajax:     {
                      'url': '/adminGlobalViewAjax',
                      'dataSrc': '',
                  },
      columns: [
                      {'data': 'email'},
                      {'data': 'm_code'},
                      {'data': 'number'},
                      {'data': 'courslevel'},
                      {'data': 'point'},
                      {'data': 'grade'}

                  ],
    }
);

