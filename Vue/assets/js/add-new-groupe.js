//addgroupe



function add_new_groupe() {
    var nameGroupe = document.getElementById("nameGroupe").value;
    sendRequest('/addgroupe', nameGroupe);
}
function sendRequest(url, nameGroupe) {
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
    http.send("nameGroupe=" + nameGroupe);
}
