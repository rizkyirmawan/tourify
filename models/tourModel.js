const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = mongoose.Schema(
	{
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
		difficulty: {
			type: String,
			required: [true, 'A tour must have a difficulty']
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
			default: Date.now(),
			select: false
		},
		startDates: [Date],
		slug: String,
		secretTour: {
			type: Boolean,
			default: false
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true }
	}
);

// Virtual Properties
tourSchema.virtual('durationInWeeks').get(function() {
	const week = this.duration / 7;
	return week.toPrecision(2);
});

// Middleware Chaining
tourSchema
	.pre('save', function(next) {
		this.slug = slugify(this.name, { lower: true });
		next();
	})
	.pre(/^find/, function(next) {
		this.find({ secretTour: { $ne: true } });
		next();
	})
	.post(/^find/, function(docs, next) {
		console.log(docs[0].name);
		next();
	});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
