const mongoose = require('mongoose');
var Schema = mongoose.Schema;

const ForeignK = mongoose.Schema({
   username: String,
   mcode: String,
   num_agent: String,
   cours: 
      {type: Schema.Types.ObjectId, ref: 'dataCours'}
    ,
   groupe: String,
   niveau: String,
   point: String,
   graduation: String,
   professeur: String
})
module.exports = mongoose.model('ForeignK', ForeignK);