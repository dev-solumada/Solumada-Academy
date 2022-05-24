
var groupeId = document.getElementById('select-group');
var listU = document.getElementById('listUserC');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const groupSelect = urlParams.get('select-group');
const end = urlParams.get('end');
var cours = document.getElementById("cours").value;
if (queryString.length != 0) {
    //document.getElementById("ch_title").innerHTML = "Your filtered data";
    groupeId.value = groupSelect;
}
function getdataGP(){
    var groupeVal = groupeId.value;
    var cours = document.getElementById('cours').value;

    console.log('name_groupe == ', groupeVal, cours);
    table.style.display = "block";
    sendRequest('/groupe', groupeVal, cours);
}


function sendRequest(url, groupeVal, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            //console.log("this.responseText  "+this.responseText);
            // if (this.responseText == "error") {
            //     success.style.display = "none";
            //     error.style.display = "block";
            //     error.innerHTML = "Employee is already registered";
            // }
            

            // else {

                if (groupeId.value == "" ) {
                    window.location = "/listeCours/" + cours;
                }
                else {
                    // document.getElementById("download").disabled = true;
                    // load.style.display = "none";
                    window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                }
                // console.log("send Reque");
            //     error.style.display = "none";
            //     success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            //}
        }
    };
    http.send("groupe=" + groupeVal + "&cours=" + cours);
}



function add_membre(){
    var list = listU.value;
    var groupeVal = groupeId.value
    var cours = document.getElementById('cours').value;
    //var cours = document.getElementById('cours').value;

    console.log('listU == ', cours), list;
    //document.getElementById('select-group').value = groupe
    //console.log('type == ', type);
    sendRequest1('/newmembre', list, groupeVal, cours);
}


function sendRequest1(url, username,groupeVal, cours) {
    //console.log('sendRequest')
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("this.responseText  "+this.responseText);
            if (this.responseText == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerHTML = "Employee is already registered";
            }
            

            else {
                window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                    //window.location = "/listeCoursBack/" + cours ;
            //     error.style.display = "none";
            //     success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    http.send("username=" + username + "&cours=" + cours + "&groupeVal=" + groupeVal);
}



function add_new_groupe() {
    var newgroupe = document.getElementById("groupeNew").value;
    var cours = document.getElementById("cours").value;
    sendRequestGroupe('/addgroupe', newgroupe, cours);
}

function sendRequestGroupe(url, newgroupe, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerHTML = "Groupe is already registered";
            }
            else {
                success.style.display = "block";
                error.style.display = "none";
                success.innerHTML = "Groupe " + this.responseText + " registered successfuly";
            }
        }
    };
    http.send("newgroupe=" + newgroupe + "&cours=" + cours);
}




function add_new_niveau() {
    var newniveau = document.getElementById("newniveau").value;
    var cours = document.getElementById("cours").value;
    console.log("newniveau ", newniveau);
    sendRequestN('/addniveau', newniveau, cours);
}

function sendRequestN(url, newniveau, cours) {
    console.log("niveau == " + newniveau);
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                success.style.display = "none";
                error.style.display = "block";
                error.innerHTML = "Cours is already registered";
            }
            else {
                success.style.display = "block";
                error.style.display = "none";
                success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    http.send("newniveau=" + newniveau + "&cours=" + cours);
}




function save_time() {
    var jour = document.getElementById("select-jour").value;
    var grpe = document.getElementById("select-gpe").value;
    var timeStart = document.getElementById("timeStart").value;
    var timeEnd = document.getElementById("timeEnd").value;
    var cours = document.getElementById("cours").value;
    sendRequestTime('/EmplTemp', jour, grpe, timeStart, timeEnd, cours);
}

function sendRequestTime(url, jours, grpe, timeStart, timeEnd, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("niveau == ", jours, grpe, timeStart, timeEnd, cours);
            if (this.responseText == "error" || jours=="" || grpe=="" || timeStart=="" || timeEnd=="" || cours=="") {
                successT.style.display = "none";
                errorT.style.display = "block";
                errorT.innerHTML = "This day at this time is already occupied or you must fill in the field";
            }else {
                successT.style.display = "block";
                errorT.style.display = "none";
                successT.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    http.send("jours=" + jours + "&group=" + grpe + "&heurdebut=" + timeStart + "&heurfin=" + timeEnd + "&cours=" + cours);
}


function add_new_parcours() {
    var date = document.getElementById("week").value;
    var grpe = document.getElementById("gpe").value;
    var timeStart = document.getElementById("timeS").value;
    var timeEnd = document.getElementById("timeE").value;
    var cours = document.getElementById("cours").value;
    sendRequestParcours('/addparcours', date, grpe, timeStart, timeEnd, cours);
}

function sendRequestParcours(url, date, grpe, timeStart, timeEnd, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("niveau == ", date, grpe, timeStart, timeEnd, cours);
            if (this.responseText == "error" || date=="" || grpe=="" || timeStart=="" || timeEnd=="" || cours=="") {
                successP.style.display = "none";
                errorP.style.display = "block";
                errorP.innerHTML = "This day at this time is already occupied or you must fill in the field";
            }else {
                successP.style.display = "block";
                errorP.style.display = "none";
                successP.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };

    http.send("date=" + date + "&group=" + grpe + "&heurdebut=" + timeStart + "&heurfin=" + timeEnd + "&cours=" + cours);
}


function anuler(){
    window.location = "/listeCours/" + cours
}