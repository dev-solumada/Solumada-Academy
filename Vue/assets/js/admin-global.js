var id= ""
function addPoint(url, id) {
    var http = new XMLHttpRequest();
    //console.log("id == ", id);
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    // console.log("url == ", url);
    http.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var data = JSON.parse(id);;
            console.log("data == ", data);

            var coursl = document.getElementById('selectCours')
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                console.log("elem ", element);
                var opt = document.createElement("option")
                opt.value = element.id;
                opt.text = element.cours;
                coursl.add(opt, null)
            }
            // id.forEach(element => {
            //     console.log("element ", element);
            //     var opt = document.createElement("selectCours")
            //     opt.value = element.username;
            //     opt.text = element.username;                                                  console.log("xxxxxxxxx ", xxx);
            // });
            //params2.add(opt, null);

            //console.log("data *** "+data[1].toLocaleDateString("fr"));
            //coursPoint.value = data[0];;
            //btnu.disabled = false;
            //ids = id;
        }
    };
    http.send("id=" + 00000)// + "&cours=" + cours);
    
}


function anuler() {
    window.location = "/adminGlobalview"
}