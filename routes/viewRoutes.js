const express = require('express');
const view = require('./../controllers/viewsController');
const auth = require('./../controllers/authController');
const booking = require('./../controllers/bookingController');

const router = express.Router();

router.use(auth.isLoggedIn);

router.get('/', booking.createBookingCheckout, view.getOverview);
router.get('/tour/:slug', view.getSingleTour);
router.get('/signin', view.getSigninPage);
router.get('/profile', view.getProfile);

module.exports = router;
