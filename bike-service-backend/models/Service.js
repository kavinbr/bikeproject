const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  cost: {
    type: Number, 
    required: true
  },
  duration: {
    type: Number, 
    required: true
  },
  image: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  ownerEmail: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Service', ServiceSchema);
