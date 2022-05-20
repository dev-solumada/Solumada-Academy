const mongoose = require('mongoose');

const UserCGN = mongoose.Schema({
   username: String,
   mcode: String,
   num_agent: String,
   cours: String,
   groupe: String,
   niveau: String,
   // groupe: String,
   // heure: String
})
module.exports = mongoose.model('UserCGN', UserCGN);