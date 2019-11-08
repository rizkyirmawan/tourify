const Review = require('./../models/reviewModel');
const factory = require('./handlerFactory');

exports.signIds = (req, res, next) => {
	let { tour, user } = req.body;

	if (!user) user = req.user.id;
	if (!tour) tour = req.params.tourId;
	next();
};

exports.getAllReviews = factory.getAll(Review);
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
