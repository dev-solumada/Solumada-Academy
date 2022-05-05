//btn
var btn_newCours = document.getElementById("btn-newCours");
btn_newCours.disabled = true;

//Verify
var name_Cours_done = false;
var date_Commenc_done = false;
var nb_Particp_done = false;
var prof_done = false;

//error 
var em = document.getElementById("em");
var ec = document.getElementById("ec");
var en = document.getElementById("en");

//verify cours
function verify_cours() {
    var nameCours = document.getElementById("nameCours");
    console.log("name_cours == " + name_Cours_done);
    if (nameCours.value != "") {
        ec.style.display = "none";
        nameCours.removeAttribute("style");
        name_Cours_done = true;
    }
    else {
        ec.style.display = "block";
        nameCours.setAttribute("style", "border-color:red;");
        name_Cours_done = false;
    }
    verify_all();
}
//verify date_Commenc
function verify_date() {
    var dateCommenc = document.getElementById("dateCommenc");
    console.log("dateCommenc == " + dateCommenc);
    if (dateCommenc.value != "") {
        ec.style.display = "none";
        dateCommenc.removeAttribute("style");
        date_Commenc_done = true;
    }
    else {
        ec.style.display = "block";
        dateCommenc.setAttribute("style", "border-color:red;");
        date_Commenc_done = false;
    }
    verify_all();
}

//verify nom professeur
function verify_professeur() {
    var professeur = document.getElementById("professeur");
    console.log("professeur == " + professeur);
    if (professeur.value != "") {
        ec.style.display = "none";
        professeur.removeAttribute("style");
        prof_done = true;
    }
    else {
        ec.style.display = "block";
        professeur.setAttribute("style", "border-color:red;");
        prof_done = false;
    }
    verify_all();
}

//verify nombre Particp
function verify_nb() {
    var nbParticp = document.getElementById("nbParticp");
    if (nbParticp.value != "") {
        ec.style.display = "none";
        nbParticp.removeAttribute("style");
        nb_Particp_done = true;
    }
    else {
        ec.style.display = "block";
        nbParticp.setAttribute("style", "border-color:red;");
        nb_Particp_done = false;
    }
    verify_all();
}

function verify_all() {
    console.log("name_cours == " + name_Cours_done);
    console.log("professeur == " + professeur);
    if (name_Cours_done && date_Commenc_done && prof_done && nb_Particp_done) {
        btn_newCours.disabled = false;
    }
    else {
        btn_newCours.disabled = true;
    }
}

function add_new_cours() {
    var name_Cours = document.getElementById("name_Cours").value;
    var date_Commenc = document.getElementById("date_Commenc").value;
    var professeur = document.getElementById("professeur").value;
    var nbParticp = document.getElementById("nbParticp").value;
    console.log("name_Cours " + name_Cours);
    console.log("date_Commenc " + date_Commenc);
    console.log("professeur " + professeur);
    console.log("nbParticp " + nbParticp);
    sendRequest('/addcours', name_Cours, date_Commenc, professeur, nbParticp);
}

function sendRequest(url, name_Cours, date_Commenc, professeur, nbParticp) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
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
                success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    console.log('the type_util sendRequest ' + type_util)
    http.send("name_Cours=" + name_Cours + "&date_Commenc=" + date_Commenc + "&professeur=" + professeur + "&nbParticp=" + nbParticp);
}