
var error = document.getElementById("error");
var success = document.getElementById("success");
//btn
var btns = document.getElementById("btns");
btns.disabled = true;
//Verify
var mail_done = false;
var code_done = false;
var number_done = false;
//error 
var em = document.getElementById("em");
var ec = document.getElementById("ec");
var en = document.getElementById("en");
//Verify mail
function verify_mail() {
    var email = document.getElementById("email");

    if (email.value != "" && email.value.includes("@")) {
        em.style.display = "none";
        email.removeAttribute("style");
        mail_done = true;
    }
    else {
        em.style.display = "block";
        email.setAttribute("style", "border-color:red;");
        mail_done = false;
    }
    verify_all();
}
//verify m_code
function verify_code() {
    var mcode = document.getElementById("mcode");
    if (mcode.value != "") {
        ec.style.display = "none";
        mcode.removeAttribute("style");
        code_done = true;
    }
    else {
        ec.style.display = "block";
        mcode.setAttribute("style", "border-color:red;");
        code_done = false;
    }
    verify_all();
}
//Verify number of agent
function verify_number() {
    var num_agent = document.getElementById("num_agent");
    if (email.value != "") {
        en.style.display = "none";
        num_agent.removeAttribute("style");
        number_done = true;
    }
    else {
        en.style.display = "block";
        num_agent.setAttribute("style", "border-color:red;");
        number_done = false;
    }
    verify_all();
}

function verify_all() {
    if (mail_done && code_done && number_done) {
        btns.disabled = false;
    }
    else {
        btns.disabled = true;
    }
}


function add_new_employee() {
    var email = document.getElementById("email").value;
    var m_code = document.getElementById("mcode").value;
    var num_agent = document.getElementById("num_agent").value;
    var type_util = document.getElementById("type_util").value;
    var niveau = document.getElementById("Niveau").value;
    var heure = document.getElementById("Heure").value;
    var groupe = document.getElementById("Groupe").value;
    var cours = document.getElementById("cours").value;
    sendRequest('/addemp', email, m_code, num_agent, type_util, niveau, heure, groupe, cours);
}
function sendRequest(url, email, m_code, num_agent, type_util, niveau, heure, groupe, cours) {
    //console.log('sendRequest')
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    // console.log("Niveau == ", niveau);
    // console.log("Heure == ", heure);
    // console.log("Groupe == ", groupe);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            console.log("this.responseText  "+this.responseText);
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
    http.send("email=" + email + "&m_code=" + m_code + "&num_agent=" + num_agent + "&type_util=" + type_util +  "&niveau=" + niveau + "&heure=" + heure + "&groupe=" + groupe + "&cours=" + cours);
}

function test() {
    if (document.getElementById('type_util').value == 'Participant') {
        document.getElementById('label-Niveau').style.display = 'block';
        document.getElementById('Niveau').style.display = 'block';
        document.getElementById('label-Heure').style.display = 'block';
        document.getElementById('Heure').style.display = 'block';
        document.getElementById('label-Groupe').style.display = 'block';
        document.getElementById('Groupe').style.display = 'block';
        document.getElementById('label-cours').style.display = 'block';
        document.getElementById('cours').style.display = 'block';
    }else{
        document.getElementById('label-Niveau').style.display = 'none';
        document.getElementById('Niveau').style.display = 'none';
        document.getElementById('label-Heure').style.display = 'none';
        document.getElementById('Heure').style.display = 'none';
        document.getElementById('label-Groupe').style.display = 'none';
        document.getElementById('Groupe').style.display = 'none';
        document.getElementById('label-cours').style.display = 'none';
        document.getElementById('cours').style.display = 'none';
    }
}