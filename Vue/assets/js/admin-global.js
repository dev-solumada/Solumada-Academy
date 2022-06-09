var id= ""
var coursl = document.getElementById('selectCours')
var coursG = document.getElementById('CoursGrad')
var point = document.getElementById('point')
function getPoint(url, id) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(id);;

            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                var opt = document.createElement("option")
                opt.value = element.id;
                opt.text = element.cours;
                coursl.add(opt, null)
            }
        }
    };
    http.send("id=" + 00000)// + "&cours=" + cours);
    
}


function anuler() {
    window.location = "/adminGlobalview"
}

function anulerTeach() {
    window.location = "/teacherGlobalView"
}
function add_point() {
    
    add_p_back("/updatePoint", point.value, coursl.value);
    // console.log("ids == ", ids);
    // console.log("userlevel == ", userLevel.value);
}

function add_p_back(url, point,  id) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                // success.style.display = "none";
                // error.style.display = "block";
                errorPoint.innerHTML = "Employee is already registered";
            }
            else {
                successPoint.style.display = "block";
                // error.style.display = "none";
                successPoint.innerHTML = this.responseText;
            }
        }
    };
    http.send("id=" + id + "&point=" + point)// + "&cours=" + cours);
    
}


function getGrad(url, id) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(id);;
            console.log("data == ", data);

            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                console.log("elem ", element);
                var opt = document.createElement("option")
                opt.value = element.id;
                opt.text = element.cours;
                coursG.add(opt, null)
            }
        }
    };
    http.send("id=" + 00000)// + "&cours=" + cours);
    
}

function add_grad() {
    
    add_grad_back("/updateGrad", graduation.value, coursG.value);
    // console.log("ids == ", ids);
    // console.log("userlevel == ", userLevel.value);
}

function add_grad_back(url, grad,  id) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log("url == ", grad, id);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                // success.style.display = "none";
                // error.style.display = "block";
                errorGraduation.innerHTML = "Employee is already registered";
            }
            else {
                successGraduation.style.display = "block";
                // error.style.display = "none";
                successGraduation.innerHTML = this.responseText;
            }
        }
    };
    http.send("id=" + id + "&grad=" + grad)// + "&cours=" + cours);
    
}
