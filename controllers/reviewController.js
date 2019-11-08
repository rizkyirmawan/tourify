const Review = require('./../models/reviewModel');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
	let tourId = {};
	if (req.params.tourId) tourId = req.params.tourId;

	const reviews = await Review.find(tourId);

	// Send Response
	res.status(200).json({
		status: 'Success',
		result: reviews.length,
		data: {
			reviews
		}
	});
});

exports.createReview = catchAsync(async (req, res, next) => {
	let { review, rating, tour, user } = req.body;

	if (!user) user = req.user.id;
	if (!tour) tour = req.params.tourId;

	const newReview = await Review.create({
		review,
		rating,
		user,
		tour
	});

	res.status(201).json({
		status: 'Success',
		data: {
			newReview
		}
	});
});
