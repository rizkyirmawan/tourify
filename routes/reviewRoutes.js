const express = require('express');
const auth = require('./../controllers/authController');
const review = require('./../controllers/reviewController');

const router = express.Router();

router
	.route('/')
	.get(auth.protect, review.getAllReviews)
	.post(auth.protect, review.createReview);

module.exports = router;
