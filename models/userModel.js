const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
				return val === this.password;
			},
			message: 'Password does not match the original one!'
		}
	},
	active: {
		type: Boolean,
		default: true,
		select: false
	},
	role: {
		type: String,
		default: 'user',
		enum: {
			values: ['admin', 'user', 'guide', 'lead-guide'],
			message: 'User role is either: admin, user, guide or lead-guide'
		}
	},
	photo: String
});

// Password Hashing Middleware
userSchema.pre('save', async function(next) {
	if (!this.isModified('password')) return next();

	this.password = await bcrypt.hash(this.password, 12);
	this.passwordConfirm = undefined;
	next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
