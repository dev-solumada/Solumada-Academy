var error = document.getElementById("error");
var success = document.getElementById("success");
var first = document.getElementById("first");
var btns = document.getElementById("saveChange");


//Verify mail
function verify_mail() {
    var email = document.getElementById("email");
    if (email.value != "" && email.value.includes("@")) {
        btns.disabled = false;
        mail_done = true;
    }
    else {
        btns.disabled = true;
        mail_done = false;
    }
    verify_all();
}
//verify m_code
function verify_code() {
    var mcode = document.getElementById("mcode");
    if (mcode.value != "") {
        code_done = true;
    }
    else {
        code_done = false;
    }
    verify_all();
}

//Verify number of agent
function verify_number() {
    var num_agent = document.getElementById("num_agent");
    if (email.value != "") {
        number_done = true;
    }
    else {
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

function getdata(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = this.responseText.split(",");

        var username = document.getElementById("name_update");
        var email = document.getElementById("email_update");
        var m_code = document.getElementById("m_code_update");
        var num_agent = document.getElementById("num_agent_update");
        var type_util = document.getElementById("type_util_update");
 
        username.value = data[0];
        email.value = data[1]
        m_code.value = data[2];
        num_agent.value = data[3]; 
        type_util.value = data[4];
        btnu.disabled = false;
        ids = id;
      }
    };
    http.send("id=" + id);
  }

function sendRequest(url, email, m_code, num_agent, type_util) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText == "error") {
                error.innerHTML = "Employee is already registered";
            }
            else {
                success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            }
        }
    };
    http.send("username=" + username + "&email=" + email + "&mcode=" + m_code + "&num_agent=" + num_agent + "&type_util=" + type_util);
}


function modify() {
    update_user("/updateuser", ids,username.value, m_code.value, num_agent.value, type_util.value);
  }


function update_user(url, id, username, m_code, num_agent) {
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
    http.send("id=" + id + "&username=" + username + "&m_code=" + m_code + "&num_agent=" + num_agent );
  }


function showNotif(text) {
    const notif = document.querySelector('.notification');
    notif.innerHTML = text;
    notif.style.display = 'block';
    setTimeout(() => {
      notif.style.display = 'none';
      window.location = "/listeUser";
    }, 2000);
  }
  


function delete_user(user) {
  textwarn.innerHTML = "Are you sure to delete <b>" + user + "</b>";
  del = user;
}


function confirm_del() {
  drop_user("/dropuser", del);
}
function drop_user(url, fname) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "error") {
        window.location = "/";
      }
      else {
        alert('user deleted');
      }
    }
  };
  http.send("fname=" + fname);
}


function anuler() {
  window.location = "/listeCours"
}



//ADD NEW COURS

//btn
var btn_newCours = document.getElementById("btn_newCours");
btn_newCours.disabled = true;

//Verify
var name_Cours_done = false;
var date_Commenc_done = false;
var nb_Type_done = false;
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
  } else {
      nm.style.display = "block";
      nameCours.setAttribute("style", "border-color:red;");
      name_Cours_done = false;
  }
  verify_all_cours();
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
  verify_all_cours();
}

//verify nom professeur
function verify_teacher() {
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
    verify_all_cours();
}

//verify nombre Particp
function verify_typ() {
  var typeCours = document.getElementById("typeCours");
  if (typeCours.value != "") {
      nb.style.display = "none";
      typeCours.removeAttribute("style");
      nb_Type_done = true;
  }
  else {
      nb.style.display = "block";
      typeCours.setAttribute("style", "border-color:red;");
      nb_Type_done = false;
  }
  verify_all_cours();
}

function verify_all_cours() {
  if (name_Cours_done && date_Commenc_done && nb_Type_done && prof_done) {
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
  var typeCours = document.getElementById("typeCours").value;
  sendRequestCours('/addcours', name_Cours, date_Commenc, professeur, typeCours);
}

function sendRequestCours(url, name_Cours, date_Commenc, professeur, typeCours) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
          if (this.responseText == "error") {
              successAddC.style.display = "none";
              errorAddC.style.display = "block";
              errorAddC.innerHTML = "Cours is already registered";
          }
          else {
              successAddC.style.display = "block";
              errorAddC.style.display = "none";
              successAddC.innerHTML = "Employee " + this.responseText + " registered successfuly";
          }
      }
  };
  http.send("name_Cours=" + name_Cours + "&date_Commenc=" + date_Commenc + "&professeur=" + professeur + "&typeCours=" + typeCours);
}