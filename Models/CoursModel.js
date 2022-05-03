const mongoose = require('mongoose');

const User = mongoose.Schema({
    name_Cours: String,
    date_Commenc: Date,
    nbParticp: Number,
    professeur: String
})

module.exports = mongoose.model('dataCours', User);