var particip = document.getElementById('particip')
var click_particip = document.getElementById('click_particip')

var val_prof = document.getElementById('val_prof')

console.log("val_prof.value", val_prof.value);
if (val_prof.value != "Professeur") {
    particip.style.display = "none";
} 