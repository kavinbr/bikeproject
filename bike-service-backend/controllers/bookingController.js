const Booking = require('../models/Booking');
const sendEmail = require('../utils/sendEmail');
const Service = require('../models/Service');
const User = require('../models/User');

//store the booking details and send email to both customer and owner based on status

const bookService = async (req, res) => {
  const { userId, userName, service, bikeBrand, bikeModel, bikeNumber, address, serviceDate, problemDetails, emailMessage } = req.body;

  if (!userId || !userName || !service || !bikeBrand || !bikeModel || !bikeNumber || !address || !serviceDate || !problemDetails || !emailMessage) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const serviceDetails = await Service.findById(service);
    const userDetails = await User.findById(userId);

    const booking = await Booking.create({
      userName,
      userId, // Storing userId
      service,
      serviceName: serviceDetails.name,
      mobileNumber: userDetails.mobileNumber, // Assuming mobile number is already stored in User model
      email: userDetails.email, // Ensure email is set correctly
      bikeBrand,
      bikeModel,
      bikeNumber,
      address,
      serviceDate,
      problemDetails,
      emailMessage,
      owneremail: serviceDetails.ownerEmail,
      city: serviceDetails.city
    });

    // Determine email credentials

    let emailCredentials;
    if (serviceDetails.ownerEmail === 'kavinbr.20msc@kongu.edu') {
      emailCredentials = { user: 'kavinbr.20msc@kongu.edu', pass: 'MSC@KONGU' };
    } else if (serviceDetails.ownerEmail === 'yokeshr.20msc@kongu.edu') {
      emailCredentials = { user: 'yokeshr.20msc@kongu.edu', pass: 'Dhivya753@' };
    } else {
      throw new Error('Invalid owner email');
    }

    // Send email to the service owner

    await sendEmail(
      userDetails.email, 
      serviceDetails.ownerEmail, 
      'New Service Booking',
      `New booking from ${userDetails.email} for ${serviceDetails.name} on ${serviceDate}\n\nDetails:\nBike Brand: ${bikeBrand}\nBike Model: ${bikeModel}\nBike Number: ${bikeNumber}\nAddress: ${address}\nProblem Details: ${problemDetails}`,
      emailCredentials 
    );

    // Send email to the user confirming the booking

    await sendEmail(
      serviceDetails.ownerEmail, 
      userDetails.email, 
      'Service Booking Confirmation',
      `Your booking for ${serviceDetails.name} on ${serviceDate} has been received.\n\nDetails:\nBike Brand: ${bikeBrand}\nBike Model: ${bikeModel}\nBike Number: ${bikeNumber}\nAddress: ${address}\nProblem Details: ${problemDetails}`,
      emailCredentials 
    );

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


// update the booking status by owner and send email to customer.

const updateBookingStatus = async (req, res) => {

  console.log('Request body:', req.body); 
  const { id } = req.params;
  const { status } = req.body;

  try {
    const booking = await Booking.findByIdAndUpdate(id, { status }, { new: true });

    console.log('Request body:', booking); 

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const userDetails = await User.findById(booking.userId);
   const serviceDetails = await Service.findById(booking.service); 

   console.log('Request body:', userDetails);
   console.log('Request body:', serviceDetails);  

    if (!serviceDetails || !serviceDetails.ownerEmail) {
      return res.status(400).json({ error: 'Service or owner email not found' });
    }

    let emailSubject, emailText;

    // Determine email subject and text based on status

    switch (status) {
      case 'accepted':
        emailSubject = 'Your service booking is accepted';
        emailText = 'Your service booking has been accepted. We will start working on it shortly.';
        break;
      case 'rejected':
        emailSubject = 'Your service booking is rejected';
        emailText = 'Unfortunately, your service booking has been rejected. Please contact us for further details.';
        break;
      case 'ready':
        emailSubject = 'Your service is ready for delivery';
        emailText = 'Your service is ready for delivery. Please contact us for further details.';
        break;
      case 'completed':
        emailSubject = 'Your service is completed';
        emailText = 'Your service has been completed. Thank you for choosing our service.';
        break;
      default:
        return res.status(400).json({ error: 'Invalid status' });
    }

    // Determine email credentials

    let emailCredentials;
    if (serviceDetails.ownerEmail === 'kavinbr.20msc@kongu.edu') {
      emailCredentials = { user: 'kavinbr.20msc@kongu.edu', pass: 'MSC@KONGU' };
    } else if (serviceDetails.ownerEmail === 'yokeshr.20msc@kongu.edu') {
      emailCredentials = { user: 'yokeshr.20msc@kongu.edu', pass: 'Dhivya753@' };
    } else {
      throw new Error('Invalid owner email');
    }

    await sendEmail(
      serviceDetails.ownerEmail, 
      userDetails.email, 
      emailSubject,
      emailText,
      emailCredentials 
    );

   
    booking.emailMessage = emailText;
    await booking.save();
    res.json(booking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(400).json({ error: error.message });
  }
};


//Get all booking based on city to owner

const getBookings = async (req, res) => {
  try {
    const { city } = req.query;
    const bookings = await Booking.find({ city });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
};


//Get all booking details based on email and city for customer.

const getBookingsUser = async (req, res) => {
  try {
    const { email, city } = req.query;
    const bookings = await Booking.find({email, city });
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { bookService, updateBookingStatus, getBookings, getBookingsUser  };



