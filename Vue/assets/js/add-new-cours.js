//btn
var btn_newCours = document.getElementById("btn-newCours");
btn_newCours.disabled = true;

//Verify
var name_Cours = false;
var date_Commenc = false;
var nb_Particp = false;
var prof = false;

//error 
var em = document.getElementById("em");
var ec = document.getElementById("ec");
var en = document.getElementById("en");

//verify cours
function verify_cours() {
    var nameCours = document.getElementById("nameCours");
    if (nameCours.value != "") {
        ec.style.display = "none";
        nameCours.removeAttribute("style");
        name_Cours = true;
    }
    else {
        ec.style.display = "block";
        nameCours.setAttribute("style", "border-color:red;");
        name_Cours = false;
    }
    verify_all();
}
//verify date_Commenc
function verify_date() {
    var dateCommenc = document.getElementById("dateCommenc");
    if (dateCommenc.value != "") {
        ec.style.display = "none";
        dateCommenc.removeAttribute("style");
        date_Commenc = true;
    }
    else {
        ec.style.display = "block";
        dateCommenc.setAttribute("style", "border-color:red;");
        date_Commenc = false;
    }
    verify_all();
}
//verify nom professeur
function verify_professeur() {
    var professeur = document.getElementById("professeur");
    if (professeur.value != "") {
        ec.style.display = "none";
        professeur.removeAttribute("style");
        prof = true;
    }
    else {
        ec.style.display = "block";
        professeur.setAttribute("style", "border-color:red;");
        prof = false;
    }
    verify_all();
}


function verify_all() {
    if (name_Cours && date_Commenc && professeur) {
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
    var nbParticp = document.getElementById("type_util").value;
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