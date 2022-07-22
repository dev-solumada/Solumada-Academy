const mongoose = require('mongoose');

const DemandCours = mongoose.Schema({
    coursd: String,
    user: String,
    demand: Boolean,
    valid: Boolean
})

module.exports = mongoose.model('coursDemand', DemandCours);