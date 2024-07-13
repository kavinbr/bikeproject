const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userName: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  email : { type: String, required: true },
  serviceName: { type: String, required: true },
  mobileNumber: { type: String, required: true },
  bikeBrand: { type: String, required: true },
  bikeModel: { type: String, required: true },
  bikeNumber: { type: String, required: true },
  address: { type: String, required: true },
  serviceDate: { type: Date, required: true },
  problemDetails: { type: String, required: true },
  emailMessage :{type: String, required: true },
  owneremail :{type: String, required: true },
  city:{type: String, required: true },
  status: { type: String, enum: ['pending','accepted',,'rejected', 'ready', 'completed'], default: 'pending' },
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
