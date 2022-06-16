const mongoose = require('mongoose');

const ForeignK = mongoose.Schema({
   username: String,
   mcode: String,
   num_agent: String,
   cours: String,
   groupe: String,
   niveau: String,
   point: String,
   graduation: String,
   professeur: String
})
module.exports = mongoose.model('ForeignK', ForeignK);