const mongoose = require('mongoose');

const User = mongoose.Schema({
   name: String,
   username: String,
   password: String,
   m_code: String,
   num_agent: String,
   //cours: String,
   type_util: String,
   // niveau: String,
   // groupe: String,
   // heure: String
})
module.exports = mongoose.model('datauser', User);