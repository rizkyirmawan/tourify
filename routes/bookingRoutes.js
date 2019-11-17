const express = require('express');
const booking = require('./../controllers/bookingController');
const auth = require('./../controllers/authController');

const router = express.Router();

router.get('/checkout-session/:tourId', auth.protect, booking.getCheckout);

module.exports = router;
