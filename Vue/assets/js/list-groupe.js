
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
function getdataGP() {
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
            if (groupeId.value == "") {
                window.location = "/listeCoursBack/" + cours;
            }
            else {
                window.location = "/listeCoursBack/" + cours + "?select-group=" + groupeVal;
            }
        }
    };
    http.send("groupe=" + groupeVal + "&cours=" + cours);
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
                // success.style.display = "block";
                // error.style.display = "none";
                // success.innerHTML = "Groupe " + this.responseText + " registered successfuly";
            }
        }
    }

    // http.onreadystatechange = function () {
    //     errorG.style.display = "block";

    //     console.log("onreadystatechange ");
    //     if (this.readyState == 4 && this.status == 200) {
    //         // if (this.responseText == "error") {
    //         //     successG.style.display = "none";
    //         //     error.style.display = "block";
    //         //     error.innerHTML = "Groupe is already registered";
    //         // }
    //         // else {
    //         //     success.style.display = "block";
    //         //     error.style.display = "none";
    //         //     success.innerHTML = "Groupe " + this.responseText + " registered successfuly";
    //         // }
    //     }
    // };
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
    var week = document.getElementById("week_cpt").value;
    var date = document.getElementById("week").value;
    var grpe = document.getElementById("gpe").value;
    var timeStart = document.getElementById("timeS").value;
    var timeEnd = document.getElementById("timeE").value;
    var cours = document.getElementById("cours").value;
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
    //alert(selected);

    //var present = document.getElementById("present").value;
    console.log("present === ", present);
    sendRequestParcours('/addparcours', date, grpe, timeStart, timeEnd, cours, present, absent, week);
}

function sendRequestParcours(url, date, grpe, timeStart, timeEnd, cours, present, absent, week) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("niveau == ", date, grpe, timeStart, timeEnd, cours, week);
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
    window.location = "/listeCours/" + cours
}
function anulerBack() {
    window.location = "/listeCoursBack/" + cours
}


var present = document.getElementById('present')
var absent = document.getElementById('absent')
function groupePresence(sel) {
    //var sel = document.getElementById("maListe");
    //console.log("present ", ('#present option').length);
    for (let index = 0; index < ('#present option').length; index++) {
        const element = ('#present option')[index];
        //console.log("element");
        present.remove(element);
    }

    for (let index = 0; index < ('#absent option').length; index++) {
        const element = ('#absent option')[index];
        //console.log("element");
        absent.remove(element);
    }
    jQuery(document).ready(function () {
        jQuery(".prensentSelect").trigger("chosen:updated");
    });

    //console.log("result après=== ", present);
    //var gpe = document.getElementById("gpe").value;
    //console.log("ggggpe = ", sel.value);
    sendRequestPresence('/presence', sel.value, cours);
}

var selectAbsPres = []
function sendRequestPresence(url, gpe, cours) {
    //console.log("groupe == ", gpe, cours);
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        //console.log(" niveau ");
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                successP.style.display = "none";
                errorP.style.display = "block";
                errorP.innerHTML = "This day at this time is already occupied or you must fill in the field";
            } else {
                result = JSON.parse(this.responseText)
                function_foreach(result, absent)
                // console.log("aaaa ", absent);
                function_foreach(result, present)

                console.log("present ", present.value);
                jQuery(document).ready(function () {
                    jQuery(".prensentSelect").chosen({
                        disable_search_threshold: 10,
                        no_results_text: "Oops, nothing found!",
                        width: "100%"
                    });
                });

                var selectedValue = ''
                jQuery('.prensentSelect').on('change', function (evt, params) {
                    selectedValue = params.selected;
                    selectAbsPres.push(selectedValue)
                    //console.log(selectAbsPres);
                });

                console.log("selectAbsPres", selectAbsPres);


                jQuery(document).ready(function () {
                    jQuery(".absentSelect").chosen({
                        disable_search_threshold: 10,
                        no_results_text: "Oops, nothing found!",
                        width: "100%"
                    });
                });

                var val = 'developpeur.solumada@gmail.com';

                jQuery('.absentSelect').on('change', function (evt, params) {
                    //selectedValue = val.selected;
                    // selectAbsPres.push(selectedValue)
                    jQuery('select option .absentSelect[value="developpeur.solumada@gmail.com"]').attr("selected", true);

                });

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
    //var cours = document.getElementById('cours').value;

    var list = [];
    for (var option of document.getElementById('listUserC').options) {
        if (option.selected) {
            list.push(option.value);
        }
    }
    console.log("list mbre", list);
    console.log('listU == ', cours);
    //document.getElementById('select-group').value = groupe
    //console.log('type == ', type);
    sendRequest1('/newmembre', list, groupeVal, cours);
}


function sendRequest1(url, username, groupeVal, cours) {
    //console.log('sendRequest')
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("this.responseText  "+this.responseText);
            if (this.responseText == "error") {
                successMbre.style.display = "none";
                errorMbre.style.display = "block";
                errorMbre.innerHTML = "Employee is already registered";
            } else {
                //window.location = "/listeCours/" + cours + "?select-group=" + groupeVal;
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
            console.log("type_util == " + data[3]);
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
            console.log("data == ", data);
            userLevel.value = data[0];
            ids = id;
        }
    };
    http.send("id=" + id);
}

function updateMembre() {
    update_membre("/updatemembre", ids, userLevel.value);
    console.log("ids == ", ids);
    console.log("userlevel == ", userLevel.value);
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
            console.log("data == ", data);
            //userLevel.value = data[0];
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