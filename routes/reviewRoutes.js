const express = require('express');
const auth = require('./../controllers/authController');
const review = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(auth.protect, review.getAllReviews)
	.post(auth.protect, auth.restrictTo('user'), review.createReview);

module.exports = router;
