const mongoose = require('mongoose');

const tourModel = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true,
		trim: true
	},
	duration: {
		type: Number,
		required: [true, 'A tour must have a duration']
	},
	maxGroupSize: {
		type: Number,
		required: [true, 'A tour must have a maximum group size']
	},
	description: {
		type: String,
		trim: true,
		required: [true, 'A tour must have a description']
	},
	summary: {
		type: String,
		trim: true,
		required: [true, 'A summary of a tour must be specified']
	},
	ratingsAverage: {
		type: Number,
		default: 4.0
	},
	ratingsQuantity: {
		type: Number,
		default: 0
	},
	price: {
		type: Number,
		required: [true, 'Price must be specified']
	},
	priceDiscount: Number,
	imageCover: {
		type: String,
		required: [true, 'A tour must have a cover image']
	},
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now()
	},
	startDates: [Date]
});

const Tour = mongoose.model('Tour', tourModel);

module.exports = Tour;
