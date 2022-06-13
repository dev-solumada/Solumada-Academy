
var listUsername = []
function getCheck(url) {
    var checkbox = document.getElementsByName('checkbox');
    var amt = [];
    for(var i = 0; i < checkbox.length; i++) {
        if(checkbox[i].checked == true) {
            amt.push(checkbox[i].id)
        }
    }
    
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var listRespon = JSON.parse(this.responseText)
            for (let i = 0; i < listRespon.length; i++) {
                const element = listRespon[i];
                listUsername.push(element[0].username)
            }
            userSuprimer.innerHTML = "Are you sure to delete " + listUsername
        }
    };
    http.send("id=" + amt);
}

function deleteManyUser() {
    console.log("deleteManyUser ", listUsername);
  drop_user("/dropManyUser", listUsername);
}

function drop_user(url, fname) {
  var http = new XMLHttpRequest();
  http.open("POST", url, true);
  console.log("fname ", fname);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      if (this.responseText == "error") {
        window.location = "/";
      }
      else {
        this.responseText
      }
    }
  };
  http.send("list=" + fname);
}