const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = mongoose.Schema({
	name: {
		type: String,
		minlength: [5, 'Name must be greater than 5 characters'],
		maxlength: [65, 'Name must be less than 65 characters'],
		trim: true,
		required: [true, 'Please tell us your name!']
	},
	email: {
		type: String,
		unique: true,
		lowercase: true,
		required: [true, 'Please provide your email'],
		validate: [validator.isEmail, '{VALUE} is not a valid email']
	},
	password: {
		type: String,
		required: true
	},
	passwordConfirm: {
		type: String,
		validate: {
			validator: function(val) {
				return val === this.price;
			},
			message: 'Password does not match the original one!'
		}
	},
	photo: String
});

const User = mongoose.model('User', userSchema);

module.exports = User;
