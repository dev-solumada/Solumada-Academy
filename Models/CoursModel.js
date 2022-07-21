const mongoose = require('mongoose');

const Cours = mongoose.Schema({
    name_Cours: String,
    date_Commenc: Date,
    professeur: String,
    type: String,
    name_c: String,
    nbrePart: Number,
    description : String
})

module.exports = mongoose.model('dataCours', Cours);