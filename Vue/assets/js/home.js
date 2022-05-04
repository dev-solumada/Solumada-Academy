let menu = document.querySelector(".menu");
let menuBtn = document.querySelector(".menuBtn");

menuBtn.onclick = function() {
    menu.classList.toggle("active");
}