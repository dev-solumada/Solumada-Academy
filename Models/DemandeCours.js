const mongoose = require('mongoose');

const DemandCours = mongoose.Schema({
    cours: String,
    user: String,
    demand: Boolean
})

module.exports = mongoose.model('dataCoursDemander', DemandCours);