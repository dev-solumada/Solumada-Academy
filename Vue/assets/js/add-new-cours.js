//btn
var btn_newCours = document.getElementById("btn_newCours");
btn_newCours.disabled = true;

//Verify
var name_Cours_done = false;
var date_Commenc_done = false;
var nb_Particp_done = false;
var prof_done = false;

//error 
var nm = document.getElementById("nm");
var dt = document.getElementById("dt");
var np = document.getElementById("np");
var nb = document.getElementById("nb");

//verify cours
function verify_cours() {
    var nameCours = document.getElementById("nameCours");
    if (nameCours.value != "") {
        nm.style.display = "none";
        nameCours.removeAttribute("style");
        name_Cours_done = true;
    }
    else {
        nm.style.display = "block";
        nameCours.setAttribute("style", "border-color:red;");
        name_Cours_done = false;
    }
    verify_all();
}
//verify date_Commenc
function verify_date() {
    var date_Commenc = document.getElementById("date_Commenc");
    if (date_Commenc.value != "") {
        dt.style.display = "none";
        date_Commenc.removeAttribute("style");
        date_Commenc_done = true;
    }
    else {
        dt.style.display = "block";
        date_Commenc.setAttribute("style", "border-color:red;");
        date_Commenc_done = false;
    }
    verify_all();
}

//verify nom professeur
function verify_professeur() {
    var professeur = document.getElementById("professeur");
    if (professeur.value != "") {
        np.style.display = "none";
        professeur.removeAttribute("style");
        prof_done = true;
    }
    else {
        np.style.display = "block";
        professeur.setAttribute("style", "border-color:red;");
        prof_done = false;
    }
    verify_all();
}

//verify nombre Particp
function verify_nb() {
    var nbParticp = document.getElementById("nbParticp");
    if (nbParticp.value != "") {
        nb.style.display = "none";
        nbParticp.removeAttribute("style");
        nb_Particp_done = true;
    }
    else {
        nb.style.display = "block";
        nbParticp.setAttribute("style", "border-color:red;");
        nb_Particp_done = false;
    }
    verify_all();
}

function verify_all() {
    if (name_Cours_done && date_Commenc_done && prof_done && nb_Particp_done) {
        btn_newCours.disabled = false;
    }
    else {
        btn_newCours.disabled = true;
    }
}

function add_new_cours() {
    var name_Cours = document.getElementById("nameCours").value;
    var date_Commenc = document.getElementById("date_Commenc").value;
    var professeur = document.getElementById("professeur").value;
    var nbParticp = document.getElementById("nbParticp").value;
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
    http.send("name_Cours=" + name_Cours + "&date_Commenc=" + date_Commenc + "&professeur=" + professeur + "&nbParticp=" + nbParticp);
}