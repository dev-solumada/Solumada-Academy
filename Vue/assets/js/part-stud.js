var particip = document.getElementById('particip')
var click_particip = document.getElementById('click_particip')
var val_particip = document.getElementById('val_particp')
var val_prof = document.getElementById('val_prof')

console.log("val_particip.value ", val_particip.value);
if (val_particip.value != "Participant") {
    particip.style.display = "none";
} 


if (val_prof.value != "Professeur") {
    particip.style.display = "none";
} 
