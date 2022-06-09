const mongoose = require('mongoose');

const Parcours = mongoose.Schema({
    week: String,
    date: Date,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String,
    presence: Boolean,
    user: String
})

module.exports = mongoose.model('Parcours', Parcours);