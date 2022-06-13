const mongoose = require('mongoose');

const Cours = mongoose.Schema({
    name_Cours: String,
    date_Commenc: Date,
    professeur: String,
    type: String,
})

module.exports = mongoose.model('dataCours', Cours);