const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// store the contact details of cusotmer send to owner

const addcontact = async (req, res) => {
  const { userEmail, message, city } = req.body;


  let emailSubject, emailText;
  try {

    emailSubject = 'Your message recived';
    emailText = message;

    let emailCredentials;
    let owneremail;
    if (city === 'erode') {
      owneremail ='kavinbr.20msc@kongu.edu';
      emailCredentials = { user: 'kavinbr.20msc@kongu.edu', pass: 'MSC@KONGU' };
    } else if (city === 'gobi') {
        owneremail ='yokeshr.20msc@kongu.edu';
      emailCredentials = { user: 'yokeshr.20msc@kongu.edu', pass: 'Dhivya753@' };
    } else {
      throw new Error('Invalid city');
    }
    const newContact = new Contact({
        userEmail,
        message,
        city,
        owneremail
      });
  
      const savedContact = await newContact.save();
  
      res.status(201).json(savedContact);
    await sendEmail(
      userEmail, 
      owneremail, 
      emailSubject,
      emailText,
      emailCredentials
    );
  } catch (err) {
    console.error('Error saving contact form submission:', err);
    res.status(500).json({ error: 'Server error' });
  }
};


// get all contact Messages send to that owneremail and city

const getcontact = async (req, res) => {
    try {
      const { owneremail, city } = req.query;
      const contacts = await Contact.find({owneremail, city });
      res.json(contacts);
    } catch (error) {
      console.error('Error fetching contact:', error);
      res.status(500).json({ error: error.message });
    }
  };
module.exports = {
   addcontact, getcontact
};
  