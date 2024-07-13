const express = require('express');
const router = express.Router();
const { UserDetails } = require('../controllers/userController');
const protect = require('../middlewares/authMiddleware');

router.get('/', protect, UserDetails);

module.exports = router;
