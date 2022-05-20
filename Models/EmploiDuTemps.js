const mongoose = require('mongoose');

const EmplTemp = mongoose.Schema({
    jours: String,
    groupe: Date,
    heureStart: Number,
    heureFin: String,
    cours: String
})

module.exports = mongoose.model('EmplTemp', EmplTemp);