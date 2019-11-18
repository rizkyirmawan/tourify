const express = require('express');
const booking = require('./../controllers/bookingController');
const auth = require('./../controllers/authController');

const router = express.Router();

router.use(auth.protect);

router.get('/checkout-session/:tourId', booking.getCheckout);

router
	.route('/')
	.get(booking.getAllBookings)
	.post(booking.createBooking);

router
	.route('/:id')
	.get(booking.getOneBooking)
	.patch(booking.updateBooking)
	.delete(booking.deleteBooking);

module.exports = router;
