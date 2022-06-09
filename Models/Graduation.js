const mongoose = require('mongoose');

const Graduation = mongoose.Schema({
    graduation: String
})

module.exports = mongoose.model('Graduation', Graduation);