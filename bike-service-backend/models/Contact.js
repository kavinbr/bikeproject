const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contactSchema = new Schema({
  userEmail: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  city :{ type: String, required: true},
  owneremail :{ type: String, required: true}
});


module.exports = mongoose.model('Contact', contactSchema);