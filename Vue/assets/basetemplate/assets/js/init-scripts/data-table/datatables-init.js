(function ($) {
    //    "use strict";


    /*  Data Table
    -------------*/
	

	$('#tableGroupTeacher').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#tableGroupAdmin').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		scrollY:        '50vh',
        scrollCollapse: true,
    });

    $('#bootstrap-data-table-gold').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#bootstrap-data-table-silver').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		// scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#bootstrap-data-table-bronze').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		// scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#timeTable').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		// scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#parcours').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		// scrollY:        '50vh',
        scrollCollapse: true,
    });

	$('#grouptable').DataTable({
        lengthMenu: [[10, 20, 50, -1], [10, 20, 50, "All"]],
		// scrollY:        '50vh',
        scrollCollapse: true,
    });

    $('#bootstrap-data-table-export').DataTable({
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        buttons: ['copy', 'csv', 'excel', 'pdf', 'print'],
		scrollY: '60vh',
        scrollCollapse: true,
    });

	$('#row-select').DataTable( {
        initComplete: function () {
				this.api().columns().every( function () {
					var column = this;
					var select = $('<select class="form-control"><option value=""></option></select>')
						.appendTo( $(column.footer()).empty() )
						.on( 'change', function () {
							var val = $.fn.dataTable.util.escapeRegex(
								$(this).val()
							);

							column
								.search( val ? '^'+val+'$' : '', true, false )
								.draw();
						} );

					column.data().unique().sort().each( function ( d, j ) {
						select.append( '<option value="'+d+'">'+d+'</option>' )
					} );
				} );
			}
		} );

})(jQuery);
