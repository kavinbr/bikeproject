const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const { generateOTP, verifyOTP  } = require('../controllers/otpController');


router.post('/generate', generateOTP);
router.post('/verify', verifyOTP); 
module.exports = router;
