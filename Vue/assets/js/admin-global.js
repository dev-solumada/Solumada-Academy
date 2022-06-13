var id= ""
var coursP = document.getElementById('selectPoints')
var coursG = document.getElementById('selectGrad')
var point = document.getElementById('point')
var AddPoint = document.getElementById('AddPoint')
var AddGrad = document.getElementById('AddGrad')
// var custId = document.getElementById('custId')
// console.log(" iiii ", custId.value);
// coursP.options[coursP.selectedIndex].value = custId.value
function getPoint(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    var data = JSON.parse(id);
    console.log("url == ", data[0].id);
    console.log("coursP.value ", coursP.value);
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
    console.log("url == ", data[0].id);
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
    console.log("coursG.value ", coursG.value);
    http.send("id=" + data[0].id + "&grad=" + coursG.value)
}

function savePoint() {
    
    savePBack("/savePoint", AddPoint.value);
    // console.log("ids == ", ids);
    // console.log("userlevel == ", userLevel.value);
}

function savePBack(url, point) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
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
    // console.log("ids == ", ids);
    // console.log("userlevel == ", userLevel.value);
}

function saveGBack(url, grad) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
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
