let menu = document.querySelector(".menu");
let menuBtn = document.querySelector(".menuBtn");
let deleteBtn = document.querySelector('.delete-btn');

menuBtn.onclick = function() {
    menu.classList.toggle("active");
}

