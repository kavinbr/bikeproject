const express = require('express');
const { bookService, getBookings, getBookingsUser, updateBookingStatus } = require('../controllers/bookingController');
const router = express.Router();

router.post('/add', bookService);
router.get('/', getBookings);
router.put('/:id', updateBookingStatus);
router.get('/user', getBookingsUser);
module.exports = router;
