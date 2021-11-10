$(document).ready(function () {


    var DT1 = $('#example').DataTable({

        columnDefs: [{
            orderable: false,
            className: 'select-checkbox',
            targets: 0,
        }],
        select: {
            style: 'os',
            selector: 'td:first-child'
        },
        order: [
            [1, 'asc']
        ],
        "language": {
            "info": "Showing _START_ to _END_ of _TOTAL_ Projects",
            "infoEmpty": "Showing 0 to 0 of 0 Projects",
            "infoFiltered": "(filtered from _MAX_ total Projects)"
        },
        "pagingType": "numbers",
        dom: 'rtip',
        initComplete: function (settings, json) {
            // calculate the sum when table is first created:
            doSum();
        }
    });

    $('#example').on('draw.dt', function () {
        // re-calculate the sum whenever the table is re-displayed:
        doSum();
    });
    $(".selectAll").on("click", function (e) {
        if ($(this).is(":checked")) {
            DT1.rows().select();
        } else {
            DT1.rows().deselect();
        }
    });

    // This provides the sum of all records:
    function doSum() {
        // get the DataTables API object:
        var table = $('#example').DataTable();
        // set up the initial (unsummed) data array for the footer row:
        var totals = ['', 'Total:', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        // iterate all rows - use table.rows( {search: 'applied'} ).data()
        // if you want to sum only filtered (visible) rows:
        totals = table.rows().data()
            // sum the amounts:
            .reduce(function (sum, record) {
                for (let i = 2; i <= 12; i++) {
                    sum[i] = sum[i] + numberFromString(record[i]);
                }
                return sum;
            }, totals);
        // place the sum in the relevant footer cell:
        for (let i = 1; i <= 12; i++) {
            var column = table.column(i);
            $(column.footer()).html(formatNumber(totals[i]));
        }


        $('#example > tbody  > tr').each(function (index, tr) {
            var rowSum = 0;
            for (let j = 0; j < 12; j++) {
                if (j >= 2) {
                    var tdCellValue = numberFromString(tr.cells[j].innerText);
                    rowSum = rowSum + tdCellValue;
                }
                if (j >= 11) {
                    tr.cells[12].innerText = rowSum;
                }
            }
        });
        var grandTotal = 0;
        $('#example > tfoot  > tr').each(function (index, tr) {
            if (index < 1) {
                grandTotal = 0;
                var rowSum = 0;
                for (let j = 0; j < 12; j++) {
                    if (j >= 2) {
                        var tdCellValue = numberFromString(tr.cells[j].innerText);
                        rowSum = rowSum + tdCellValue;
                    }
                    if (j >= 11) {
                        tr.cells[12].innerText = rowSum;
                        grandTotal = rowSum;
                    }
                }
            } else {
                tr.cells[11].innerText = "Grand Total";
                tr.cells[12].innerText = grandTotal;
            }
        });
    }

    function numberFromString(s) {
        return typeof s === 'string' ?
            s.replace(/[\$,]/g, '') * 1 :
            typeof s === 'number' ?
                s : 0;
    }

    function formatNumber(n) {
        return n.toLocaleString(); // or whatever you prefer here
    }
});