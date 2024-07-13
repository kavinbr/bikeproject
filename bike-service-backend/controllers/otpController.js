
const sendSms = require('../utils/sms');
const User = require('../models/User');
// Function to generate a random OTP

const generateOTPFunction = () => {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};


let generatedOTP = '';


// Generating the OTP to customer for verification

const generateOTP = async (req, res) => {
  const { userId } = req.body;

  
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    generatedOTP = generateOTPFunction(); 
    const formattedPhoneNumber = '+91' + user.mobileNumber; 

    const message = await sendSms(formattedPhoneNumber, `Your OTP for verification is: ${generatedOTP}`);

    console.log('Generated OTP:', generatedOTP);
    res.status(200).json({ message: 'OTP sent successfully', otp: generatedOTP });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ error: 'Error generating OTP' });
  }
};

// Verify the OTP  entered by cusotmer with generatedOTP

const verifyOTP = async (req, res) => {
  const { userId, otp, generatedOTP } = req.body;

 

  if (!userId || !otp || !generatedOTP) {
    return res.status(400).json({ error: 'User ID, OTP and generated OTP are required' });
  }

  try {
   
    if (otp === generatedOTP) {
     
      await User.findByIdAndUpdate(userId, { $set: { verified: true } });

      res.status(200).json({ message: 'OTP verification successful' });
    } else {
      
      res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ error: 'Error verifying OTP' });
  }
};

module.exports = {
  generateOTP,
  verifyOTP,
};

