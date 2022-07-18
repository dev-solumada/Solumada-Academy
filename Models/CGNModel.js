const mongoose = require('mongoose');

const UserCGN = mongoose.Schema({
   username: String,
   name: String,
   mcode: String,
   num_agent: String,
   cours: String,
   groupe: String,
   niveau: String,
   point: String,
   graduation: String,
   professeur: String
})
module.exports = mongoose.model('UserCGN', UserCGN);