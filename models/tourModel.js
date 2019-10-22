const mongoose = require('mongoose');

const tourModel = mongoose.Schema({
	name: {
		type: String,
		required: [true, 'A tour must have a name'],
		unique: true
	},
	rating: {
		type: Number,
		default: 4.0
	},
	price: {
		type: Number,
		required: [true, 'Price must be specified']
	}
});

const Tour = mongoose.model('Tour', tourModel);

module.exports = Tour;
