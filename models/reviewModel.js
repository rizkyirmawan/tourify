const mongoose = require('mongoose');
const moment = require('moment');

const reviewSchema = mongoose.Schema(
	{
		review: {
			type: String,
			required: [true, 'Review cannot be empty!']
		},
		rating: {
			type: Number,
			min: 1,
			max: 5,
			required: [true, 'Please specify the rating for your review!']
		},
		userId: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		tourId: {
			type: mongoose.Schema.ObjectId,
			ref: 'Tour',
			required: [true, 'Review must belong to a tour!']
		},
		createdAt: {
			type: Date,
			default: moment(),
			required: [true, 'Review must belong to a user!']
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Populate User and Tour
reviewSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'userId',
		select: 'name photo'
	}).populate({
		path: 'tourId',
		select: 'name duration'
	});

	next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
