const mongoose = require('mongoose');

const EmplTemp = mongoose.Schema({
    jours: String,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String,
    date: Date
})

module.exports = mongoose.model('EmplTemp', EmplTemp);

