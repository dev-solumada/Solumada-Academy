
var groupeId = document.getElementById('select-group');
var listU = document.getElementById('listUserC');
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const groupSelect = urlParams.get('select-group');
const end = urlParams.get('end');
var gpe = document.getElementById("gpe");
var select_jour = document.getElementById("sjour");
var timeStart = document.getElementById("timeS");
var timeEnd = document.getElementById("timeE");

var week_cptDel = document.getElementById("week_cptDel");
var weekDate = document.getElementById("weekDate");
var timeSDel = document.getElementById("timeSDel");
var timeEDel = document.getElementById("timeEDel");
var gpeDel = document.getElementById("gpeDel");
var presentDel = document.getElementById("presentDel");
var absentDel = document.getElementById("absentDel");

if (queryString.length != 0) {
    groupeId.value = groupSelect;
}
    var groupeVal = groupeId.value;
function getdataGP() {
    var cours = document.getElementById('cours').value;
    table.style.display = "block";
    sendRequest('/groupe', groupeVal, cours);
}


function sendRequest(url, groupeVal, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (groupeId.value == "") {
                window.location = "/listeCours/" + cours;
            }
            else {
                window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
            }
        }
    };
    http.send("groupe=" + groupeVal + "&cours=" + cours);
}

function getdataGPLoad(url) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (groupeId.value == "") {
                window.location = "/listeCours/" + cours;
            }
            else {
                window.location = "/listeCours/" + cours + "?select-group=" + groupeId.value;
            }
        }
    };
    http.send("groupe=" + groupeId.value + "&cours=" + cours.value);
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
                successGrpe.style.display = "none";
                errorGrpe.style.display = "block";
                errorGrpe.innerHTML = "Groupe is already registered";
            }
            else {
                window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                }
        }
    }

    http.send("newgroupe=" + newgroupe + "&cours=" + cours);
}




function add_new_niveau() {
    var newniveau = document.getElementById("newniveau").value;
    var cours = document.getElementById("cours").value;
    sendRequestN('/addniveau', newniveau, cours);
}

function sendRequestN(url, newniveau, cours) {
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
            if (this.responseText == "error" || jours == "" || grpe == "" || timeStart == "" || timeEnd == "" || cours == "") {
                successT.style.display = "none";
                errorT.style.display = "block";
                errorT.innerHTML = "This day at this time is already occupied or you must fill in the field";
            } else {
                successT.style.display = "block";
                errorT.style.display = "none";
                successT.innerHTML = "Group " + this.responseText + " registered successfuly in the time ";
            }
        }
    };
    http.send("jours=" + jours + "&group=" + grpe + "&heurdebut=" + timeStart + "&heurfin=" + timeEnd + "&cours=" + cours);
}


function add_new_parcours() {
    var week = document.getElementById("week_cpt");
    var date = document.getElementById("week");
    var grpe = document.getElementById("gpeCreate");
    var timeStart = document.getElementById("timeSCreate");
    var timeEnd = document.getElementById("timeECreate");
    var cours = document.getElementById("cours");
    var present = [];
    for (var option of document.getElementById('present').options) {
        if (option.selected) {
            present.push(option.value);
        }
    }
    var absent = [];
    for (var option of document.getElementById('absent').options) {
        if (option.selected) {
            absent.push(option.value);
        }
    }
    sendRequestParcours('/addparcours', date.value, grpe.value, timeStart.value, timeEnd.value, cours.value, present, absent, week.value);
}

function sendRequestParcours(url, date, grpe, timeStart, timeEnd, cours, present, absent, week) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error" || date == "" || grpe == "" || timeStart == "" || timeEnd == "" || cours == "") {
                successparc.style.display = "none";
                errorparc.style.display = "block";
                errorparc.innerHTML = "This day at this time is already occupied or you must fill in the field";
            } else {
                successparc.style.display = "block";
                errorparc.style.display = "none";
                successparc.innerHTML = "Groupe " + this.responseText + " registered successfuly";
            }
        }
    };

    http.send("date=" + date + "&group=" + grpe + "&heurdebut=" + timeStart + "&heurfin=" + timeEnd + "&cours=" + cours + "&present=" + present + "&absent=" + absent + "&week=" + week);
}


function anuler() {
    var cours = document.getElementById("cours").value;
    window.location = "/listeCours/" + cours
}
function anulerBack() {
    var cours = document.getElementById("cours").value;
    window.location = "/listeCoursBack/" + cours
}


var present = document.getElementById('present')
var absent = document.getElementById('absent')

function groupePresence(sel) {
    for (let index = 0; index < ('#present option').length; index++) {
        const element = ('#present option')[index];
        present.remove(element);
    }

    for (let index = 0; index < ('#absent option').length; index++) {
        const element = ('#absent option')[index];
        absent.remove(element);
    }
    jQuery(document).ready(function () {
        jQuery(".prensentSelect").trigger("chosen:updated");
    });

    sendRequestPresence('/presence', sel.value, cours);
}

var selectAbsPres = []
function sendRequestPresence(url, gpe, cours) {
    var cours = document.getElementById('cours').value;
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                successP.style.display = "none";
                errorP.style.display = "block";
                errorP.innerHTML = "This day at this time is already occupied or you must fill in the field";
            } else {
                result = JSON.parse(this.responseText)
                function_foreach(result, absent)
                function_foreach(result, present)
                jQuery(document).ready(function () {
                    jQuery(".prensentSelect").chosen({
                        disable_search_threshold: 10,
                        no_results_text: "Oops, nothing found!",
                        width: "100%"
                    });
                });

                var selectedValue = ''

                jQuery('.prensentSelect').change(function(evt, params){
                    jQuery('.absentSelect').html(''); //Clear
                    jQuery('.prensentSelect option:not(:selected)')
                        .clone()
                        .appendTo('.absentSelect')

                    selectedValue = params.selected;
                    selectAbsPres.push(selectedValue)

                })

                jQuery('.absentSelect').change(function(evt, params){
                    jQuery(".absentSelect").chosen({
                        disable_search_threshold: 10,
                        no_results_text: "Oops, nothing found!",
                        width: "100%"
                    });
                });
                // jQuery(".absentSelect").chosen({
                //     disable_search_threshold: 10,
                //     no_results_text: "Oops, nothing found!",
                //     width: "100%"
                // });

                jQuery(document).ready(function () {
                    jQuery(".prensentSelect").trigger("chosen:updated");
                });
            }
        }
    };
    http.send("gpe=" + gpe + "&cours=" + cours)
}




function add_membre() {
    //var list = listU.value;
    var groupeVal = groupeId.value
    var cours = document.getElementById('cours').value;

    var list = [];
    for (var option of document.getElementById('listUserC').options) {
        if (option.selected) {
            list.push(option.value);
        }
    }

    sendRequest1('/newmembre', list, groupeVal, cours);
}


function sendRequest1(url, username, groupeVal, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                successMbre.style.display = "none";
                errorMbre.style.display = "block";
                errorMbre.innerHTML = "Employee is already registered";
            } else {
                errorMbre.style.display = "none";
                successMbre.innerHTML = "Employee registered successfuly";
            }
        }
    };
    http.send("username=" + username + "&cours=" + cours + "&groupeVal=" + groupeVal);
}


function function_foreach(params1, params2) {
    params1.forEach(element => {
        var opt = document.createElement("option")
        opt.value = element.username;
        opt.text = element.username;
        params2.add(opt, null);
    });
}

function getdata(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText.split(",");
            username.value = data[0]; m_code.value = data[1]; num_agent.value = data[2]; type_util.value = data[3];
            btnu.disabled = false;
            ids = id;
        }
    };
    http.send("id=" + id);
}
var ids = ""
function getmembre(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText.split(",");
            userLevel.value = data[0];
            ids = id;
        }
    };
    http.send("id=" + id);
}

function updateMembre() {
    update_membre("/updatemembre", ids, userLevel.value);
}


function update_membre(url, id, userLevel) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText.includes("already")) {
                document.getElementById("notif").setAttribute("style", "background-color:red");
                showNotif(this.responseText);
            }
            else if (this.responseText == "error") {
                window.location = "/";
            }
            else {
                document.getElementById("notif").setAttribute("style", "background-color:limeagreen");
                showNotif(this.responseText);
            }
        }
    };
    http.send("id=" + id + "&userLevel=" + userLevel);
}
function showNotif(text) {
    const notif = document.querySelector('.notification');
    notif.innerHTML = text;
    notif.style.display = 'block';
    setTimeout(() => {
        notif.style.display = 'none';
        window.location = "/listeCours/" + cours;
    }, 2000);
}
var membreDel = ""
function getmbDelete(url, membreDelete) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText.split(",");
            membreDel = membreDelete;
        }
    };
    http.send("id=" + membreDelete);
}


function deleteMembre() {
    deleteM("/deleteMb", membreDel)
}
function deleteM(url, deleteMembre) { 
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

                //window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                errorDelete.style.display = "none";
                successDelete.innerHTML = this.responseText ;
        }
    };
    http.send("id=" + deleteMembre);
}




var time_tab = ""
function gettime(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            gpe.value = data.groupe;
            select_jour.value = data.jours
            timeStart.value = data.heureStart
            timeEnd.value = data.heureFin
            time_tab = data._id;
        }
    };
    http.send("id=" + id);
}

function save_time_update() {
    sendRequestTimeUpdate('/update_time',time_tab, select_jour.value, gpe.value, timeStart.value, timeEnd.value);
}

function sendRequestTimeUpdate(url, time_tab, jours, grpe, timeStart, timeEnd) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error" || jours == "" || grpe == "" || timeStart == "" || timeEnd == "" ) {
                successTT.style.display = "none";
                errorTT.style.display = "block";
                errorTT.innerHTML = "This day at this time is already occupied or you must fill in the field";
            } else {
                successTT.style.display = "block";
                errorTT.style.display = "none";
                successTT.innerHTML = "Time is successfully update ";
            }
        }
    };
    http.send("id=" + time_tab + "&jours=" + jours + "&group=" + grpe + "&heurdebut=" + timeStart + "&heurfin=" + timeEnd);
}

var timeDel = ""
function gettimeDelete(url, timeDelete) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText);
            timeDel = data._id;
        }
    };
    http.send("id=" + timeDelete);
}


function deleteEmploi() {
    deleteE("/deleteEmploi", timeDel)
}
function deleteE(url, deleteMembre) { 
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

                //window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                errorDelete.style.display = "none";
                successDelete.innerHTML = this.responseText ;
        }
    };
    http.send("id=" + deleteMembre);
}


function getParcours(url, id) {
    var param = JSON.parse(id)
    console.log("cccccc",param );
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText)
            console.log("data ", data);
            var dateFormat = new Date(data[0]._id.date).toLocaleDateString("fr")
            //console.log("dateFormat",new Date(dateFormat).toLocaleDateString());
            week_cptDel.value = data[0]._id.week
            weekDate.value = dateFormat
            timeSDel.value = data[0]._id.heureStart
            timeEDel.value = data[0]._id.heureFin
            gpeDel.value = data[0]._id.groupe
            //console.log("data[0]._id ",data._id.date.toLocaleDateString("fr") );
        }
    };
    http.send("cours=" + param.cours+ "&week=" + param.week + "&groupe=" + param.groupe + "&heureStart=" + param.heureStart + "&heureFin=" + param.heureFin + "&date=" + param.date );
}


var parcours = ""
var cours_data = ""
var groupe = ""
var heureS = ""
var heureF = ""
var date = ""
function getparcDelete(url, id) {
    var param = JSON.parse(id)
    console.log("cccccc",param );
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(this.responseText)
            cours_data = data[0]._id.cours
            groupe = data[0]._id.groupe
            heureS = data[0]._id.heureStart
            heureF = data[0]._id.heureFin
            date = data[0]._id.date
        }
    };
    http.send("cours=" + param.cours + "&groupe=" + param.groupe + "&heureStart=" + param.heureStart + "&heureFin=" + param.heureFin + "&date=" + param.date );
}


function deleteParcours() {
    deleteP("/deleteParcours", cours_data,  groupe, heureS, heureF, date )
}
function deleteP(url,  cours,  groupe, heureS, heureF, date) { 
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

                //window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
                errorDelete.style.display = "none";
                successDelete.innerHTML = this.responseText ;
        }
    };
    http.send("cours=" + cours + "&groupe=" + groupe + "&heureStart=" + heureS + "&heureFin=" + heureF + "&date=" + date );
}
