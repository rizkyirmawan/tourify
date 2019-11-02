const express = require('express');
const tour = require('./../controllers/tourController');
const auth = require('./../controllers/authController');

const router = express.Router();

router.route('/best-5').get(tour.aliasBestFive, tour.getAllTours);

router.route('/stats').get(tour.getTourStats);

router.route('/monthly-plan/:year').get(tour.getMonthlyPlan);

router
	.route('/')
	.get(auth.protect, tour.getAllTours)
	.post(tour.createTour);

router
	.route('/:id')
	.get(tour.getTour)
	.patch(tour.updateTour)
	.delete(auth.protect, auth.restrictTo('admin'), tour.deleteTour);

module.exports = router;
