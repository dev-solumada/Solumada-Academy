const mongoose = require('mongoose');

const Parcours = mongoose.Schema({
    date: Date,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String
})

module.exports = mongoose.model('Parcours', Parcours);