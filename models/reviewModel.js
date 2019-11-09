const mongoose = require('mongoose');
const moment = require('moment');
const Tour = require('./tourModel');

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
		user: {
			type: mongoose.Schema.ObjectId,
			ref: 'User'
		},
		tour: {
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

// Prevent Duplicate Review using Index
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Populate User and Tour
reviewSchema.pre(/^find/, function(next) {
	this.populate({
		path: 'user',
		select: 'name photo'
	});

	next();
});

// Calculating Ratings Average
reviewSchema.statics.calcAverageRating = async function(tourId) {
	const stats = await this.aggregate([
		{ $match: { tour: tourId } },
		{
			$group: {
				_id: '$tour',
				nRating: { $sum: 1 },
				avgRating: { $avg: '$rating' }
			}
		}
	]);

	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRating,
			ratingsAverage: stats[0].avgRating
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5
		});
	}
};

reviewSchema.post('save', function() {
	this.constructor.calcAverageRating(this.tour);
});

// Calculate Ratings on Update and Delete
reviewSchema.pre(/^findOneAnd/, async function(next) {
	this.rev = await this.findOne();
	next();
});

reviewSchema.post(/^findOneAnd/, function() {
	this.rev.constructor.calcAverageRating(this.rev.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
