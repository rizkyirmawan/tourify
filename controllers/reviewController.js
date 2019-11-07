const Review = require('./../models/reviewModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
// const AppError = require('./../utils/appError');

exports.getAllReviews = catchAsync(async (req, res, next) => {
	const features = new APIFeatures(Review.find(), req.query)
		.filter()
		.sort()
		.selectFields()
		.paginate();
	const reviews = await features.query;

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
	const { review, rating, tourId } = req.body;
	const userId = req.user.id;
	const newReview = await Review.create({
		review,
		rating,
		userId,
		tourId
	});

	res.status(201).json({
		status: 'Success',
		data: {
			review: newReview
		}
	});
});
