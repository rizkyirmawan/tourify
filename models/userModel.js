const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const moment = require('moment');

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
		select: false,
		minlength: [7, 'Password must be at least 7 characters!'],
		required: [true, 'Password is required']
	},
	passwordConfirm: {
		type: String,
		required: [true, 'Password confirmation is required'],
		validate: {
			validator: function(val) {
				return val === this.password;
			},
			message: 'Password does not match the original one!'
		}
	},
	passwordChangedAt: Date,
	passwordResetToken: String,
	passwordResetExpires: Date,
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

// Add Now Date To Password Changed At Property
userSchema.pre('save', function(next) {
	if (!this.isModified('password') || this.isNew) return next();

	this.passwordChangedAt = moment()
		.subtract(1, 's')
		.toDate();
	next();
});

// Compare Password Instance Method
userSchema.methods.comparePass = async function(candidatePass, userPass) {
	return await bcrypt.compare(candidatePass, userPass);
};

// Check If Issued JWT Token is Not Earlier Than User's Changed Password
userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);

		return JWTTimestamp < changedTimestamp;
	}

	return false;
};

// Create Reset Password Token
userSchema.methods.createResetPasswordToken = function() {
	const resetToken = crypto.randomBytes(32).toString('hex');

	this.passwordResetToken = crypto
		.createHash('sha256')
		.update(resetToken)
		.digest('hex');

	this.passwordResetExpires = moment()
		.add(20, 'm')
		.toDate();

	return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
