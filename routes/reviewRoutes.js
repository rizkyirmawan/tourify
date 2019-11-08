const express = require('express');
const auth = require('./../controllers/authController');
const review = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router
	.route('/')
	.get(auth.protect, review.getAllReviews)
	.post(
		auth.protect,
		auth.restrictTo('user'),
		review.checkBody,
		review.createReview
	);

router
	.route('/:id')
	.get(review.getReview)
	.patch(review.updateReview)
	.delete(review.deleteReview);

module.exports = router;
