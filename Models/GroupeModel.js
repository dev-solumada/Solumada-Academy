const mongoose = require('mongoose');

const Groupe = mongoose.Schema({
    name_Groupe: String,
    cours: String,
})

module.exports = mongoose.model('dataGroupe', Groupe);