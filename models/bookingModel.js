const mongoose = require('mongoose');
const moment = require('moment');

const bookingSchema = mongoose.Schema({
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: 'Tour',
		required: [true, 'Booking must belong to a tour!']
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: 'User',
		required: [true, 'Booking must belong to a user!']
	},
	price: {
		type: Number,
		required: [true, 'A price must be specified!']
	},
	paid: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: moment()
	}
});

bookingSchema.index({ tour: 1, user: 1 }, { unique: true });

bookingSchema.pre(/^find/, function(next) {
	this.populate('user').populate({
		path: 'tour',
		select: 'name imageCover slug startDates'
	});

	next();
});

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
