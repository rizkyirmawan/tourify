const express = require('express');
const auth = require('./../controllers/authController');
const review = require('./../controllers/reviewController');

const router = express.Router({ mergeParams: true });

router.use(auth.protect);

router
	.route('/')
	.get(review.getAllReviews)
	.post(auth.restrictTo('user'), review.signIds, review.createReview);

router
	.route('/:id')
	.get(review.getReview)
	.patch(auth.restrictTo('admin', 'user'), review.updateReview)
	.delete(auth.restrictTo('admin', 'user'), review.deleteReview);

module.exports = router;
