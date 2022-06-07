var error = document.getElementById("error");
var success = document.getElementById("success");
var first = document.getElementById("first");
var btns = document.getElementById("saveChange");


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

function getdata(url, id) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        var data = this.responseText.split(",");
        //console.log("type_util == "+ data[3]);

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
    http.send("username=" + username + "&email=" + email + "&mcode=" + m_code + "&num_agent=" + num_agent + "&type_util=" + type_util);
}


function modify() {
    update_user("/updateuser", ids,username.value, m_code.value, num_agent.value, type_util.value);
  }


function update_user(url, id, username, m_code, num_agent) {
  console.log("id, username, m_code, num_agent ", id, username, m_code, num_agent);
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