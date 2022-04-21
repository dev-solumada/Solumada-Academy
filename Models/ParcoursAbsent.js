const mongoose = require('mongoose');

const ParcoursAbsent = mongoose.Schema({
    date: Date,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String,
    user: String
})

module.exports = mongoose.model('ParcoursAbsent', ParcoursAbsent);