const mongoose = require('mongoose');

const Point = mongoose.Schema({
    point: String
})

module.exports = mongoose.model('Point', Point);