function addPoint(url, id, cours) {
    var http = new XMLHttpRequest();
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    console.log("id == ", id);
    console.log("url == ", url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = this.responseText.split(",");
            console.log("data == ", data);
            //console.log("data *** "+data[1].toLocaleDateString("fr"));
            coursPoint.value = data[0];;
            //btnu.disabled = false;
            ids = id;
        }
    };
    http.send("id=" + id)// + "&cours=" + cours);
    
}