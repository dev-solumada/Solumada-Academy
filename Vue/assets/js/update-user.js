
function liste_update_user(para) {
    console.log("para == " + para);
    listeUserRequest('/getUser/' + para);
}

function listeUserRequest(url) {
    var http = new XMLHttpRequest();
    http.open("GET", "UpdateUser.html", true);
    // http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.send();

    //http.send("m_code=" + para);
    // http.onreadystatechange = function () {
    //     if (this.readyState == 4 && this.status == 200) {
    //         if (this.responseText == "error") {
    //             // success.style.display = "none";
    //             // error.style.display = "block";
    //             error.innerHTML = "Employee is already registered";
    //         }
    //         else {
    //             // success.style.display = "block";
    //             // error.style.display = "none";
    //             success.innerHTML = "Employee " + this.responseText + " registered successfuly";
    //         }
    //     }
    // };
    // console.log('the type_util sendRequest ' + type_util)
    // http.send("email=" + email + "&mcode=" + m_code + "&num_agent=" + num_agent + "&type_util=" + type_util);
}
var error = document.getElementById("error");
var success = document.getElementById("success");
//btn
var btns = document.getElementById("btn_updateUser");
btns.disabled = false;
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
        // console.log("email.value");
        // em.style.display = "none";
        // email.removeAttribute("style");
        btns.disabled = false;
        mail_done = true;
        // console.log("email.valueddd");
    }
    else {
        btns.disabled = true;
        // em.style.display = "block";
        // email.setAttribute("style", "border-color:red;");
        mail_done = false;
    }
    verify_all();
}
//verify m_code
function verify_code() {
    var mcode = document.getElementById("mcode");
    if (mcode.value != "") {
        // ec.style.display = "none";
        // mcode.removeAttribute("style");
        code_done = true;
    }
    else {
        // ec.style.display = "block";
        // mcode.setAttribute("style", "border-color:red;");
        code_done = false;
    }
    verify_all();
}
//Verify number of agent
function verify_number() {
    var num_agent = document.getElementById("num_agent");
    if (email.value != "") {
        // en.style.display = "none";
        // num_agent.removeAttribute("style");
        number_done = true;
    }
    else {
        // en.style.display = "block";
        // num_agent.setAttribute("style", "border-color:red;");
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


function update_user() {
    var email = document.getElementById("email").value;
    var m_code = document.getElementById("mcode").value;
    var num_agent = document.getElementById("num_agent").value;
    var type_util = document.getElementById("type_util").value;
    console.log("email " + email);
    sendRequest('/updateUser', email, m_code, num_agent, type_util);
}
function sendRequest(url, email, m_code, num_agent, type_util) {
    console.log('sendRequest')
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                // success.style.display = "none";
                // error.style.display = "block";
                error.innerHTML = "Employee is already registered";
            }
            else {
                // success.style.display = "block";
                // error.style.display = "none";
                success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    console.log('the type_util sendRequest ' + type_util)
    http.send("email=" + email + "&mcode=" + m_code + "&num_agent=" + num_agent + "&type_util=" + type_util);
}

