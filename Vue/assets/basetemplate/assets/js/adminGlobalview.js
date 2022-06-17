let adminGlobalViewTable = $('#AdminglobalViewDatatable').DataTable();

let datas;

var getData = function(){
    $.ajax(
        {
            url: '/adminGlobalViewAjax',
            type: 'get',
            dataType: 'json',
            success: datas,
            error: function(error)
                {
                    alert(error);
                }
        });
}

getData();
alert(datas);


class Employee {
    constructor(email, m_code, number, coursLevel, point, graduation) {
        this.email = email;
        this.m_code = m_code;
        this.number = number;
        this.coursLevel = coursLevel;
        this.point = point;
        this.graduation = graduation;
    }
};



/*

data = {
    "members": {
        "data1": {"username":"user1"},
        "data2": {"niveau": "bronze"}
    }
}

*/
