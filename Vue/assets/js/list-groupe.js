function getdataGP(url, name_Cours, type){
    console.log('name_cours == ', name_Cours);
    console.log('type == ', type);
    sendRequest('/GroupeAdmin', name_Cours);
}


function sendRequest(url, name_Cours) {
    //console.log('sendRequest')
    var http = new XMLHttpRequest();
    http.open("GET", url, true);
    // console.log("Niveau == ", niveau);
    // console.log("Heure == ", heure);
    // console.log("Groupe == ", groupe);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            //console.log("this.responseText  "+this.responseText);
            // if (this.responseText == "error") {
            //     success.style.display = "none";
            //     error.style.display = "block";
            //     error.innerHTML = "Employee is already registered";
            // }
            // else {
            //     success.style.display = "block";
            //     error.style.display = "none";
            //     success.innerHTML = "Employee " + this.responseText + " registered successfuly";
            // }
        }
    };
    http.send("name_Cours=" + name_Cours);
}