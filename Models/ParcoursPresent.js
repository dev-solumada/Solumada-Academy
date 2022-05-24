const mongoose = require('mongoose');

const ParcoursPresent = mongoose.Schema({
    date: Date,
    groupe: String,
    heureStart: String,
    heureFin: String,
    cours: String,
    user: String
})

module.exports = mongoose.model('ParcoursPresent', ParcoursPresent);