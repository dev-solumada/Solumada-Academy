var id= ""
var coursP = document.getElementById('selectPoints')
var coursG = document.getElementById('selectGrad')
var point = document.getElementById('point')
var AddPoint = document.getElementById('AddPoint')
var AddGrad = document.getElementById('AddGrad')
var custId = document.getElementById('custId')

function getPoint(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data = JSON.parse(id);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerHTML = "Point is already registered";
            }
            else {
                success.style.display = "block";
                error.style.display = "none";
                success.innerHTML = this.responseText;
            }
        }
    };
    http.send("id=" + data[0].id + "&point=" + coursP.value)
    
}


function anuler() {
    window.location = "/adminGlobalview"
}

function anulerTeach() {
    window.location = "/teacherGlobalView"
}


function getGrad(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data = JSON.parse(id);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerHTML = "Employee is already registered";
            }
            else {
                success.style.display = "block";
                error.style.display = "none";
                success.innerHTML = this.responseText;
            }
        }
    };
    http.send("id=" + data[0].id + "&grad=" + coursG.value)
}

function savePoint() {
    savePBack("/savePoint", AddPoint.value);
}

function savePBack(url, point) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                successP.style.display = "none";
                errorP.style.display = "block";
                errorP.innerHTML = "Point is already registered";
            }
            else {
                successP.style.display = "block";
                errorP.style.display = "none";
                successP.innerHTML = "Point " + this.responseText + " is successfully saved";
            }
        }
    };
    http.send("point=" + point)// + "&cours=" + cours);
    
}

function saveGraduation() {
    saveGBack("/saveGrad", AddGrad.value);
}

function saveGBack(url, grad) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                successG.style.display = "none";
                errorG.style.display = "block";
                errorG.innerHTML = "Graduation is already registered";
            }
            else {
                successG.style.display = "block";
                errorG.style.display = "none";
                successG.innerHTML = "Graduation" + this.responseText + " is successfully saved";
            }
        }
    };
    http.send("grad=" + grad)// + "&cours=" + cours);
    
}

function saveAll() {
    var selectPoints = document.getElementById('selectPoints');
    console.log("coursP.value", custId.value);  
    console.log("selectPoints", selectPoints.value);  
    console.log("selectPoints", selectPoints.options[selectPoints.selectedIndex].text );  
    
    var table = document.getElementById("get-table");
    //iterate trough rows
    var row
   for (var i = 0, row; row = table.rows[i]; i++) {
    //iterate trough columns

        var x = row.cells[0].childNodes[0];
        var y = row.cells[1].childNodes[0];
        var z = row.cells[2].childNodes[0];
        //var a = row.cells[3].childNodes[1];
        var b = row.cells[4].childNodes[1];
    //    for (var j = 0, col; col = row.cells[j]; j++) {
    //       // do something
    //       //console.log("table.rows[i]", table.rows[i]);
    //       //console.log("bootstrap-data-table-export", row.cells[j].textContent.replace(/\s/g, ''));
    //       console.log("bootstrap-data-table-export", row.cells[j].childNodes[1].value.replace(/\s/g, ''));
    //       console.log("jjjjjjjjjjjjjjjjjjjj");
    //     }
        console.log(x, y, z, b);
        console.log("iiiiiiiiiiiiiiiiiiiiii");
    }
   
}

