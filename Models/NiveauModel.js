const mongoose = require('mongoose');

const Niveau = mongoose.Schema({
    name_niveau: String,
    cours: String,
})

module.exports = mongoose.model('dataNiveau', Niveau);