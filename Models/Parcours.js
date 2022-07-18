const mongoose = require('mongoose');

const Parcours = mongoose.Schema({
    date: Date,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String,
    presence: Boolean,
    user: String,
    name: String
})

module.exports = mongoose.model('Parcours', Parcours);