const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const { promisify } = require('util');

const signToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN
	});
};

// Signup Handler
exports.signUp = catchAsync(async (req, res, next) => {
	const { name, email, password, passwordConfirm, role } = req.body;

	const user = await User.create({
		name,
		email,
		password,
		passwordConfirm,
		role
	});

	const token = signToken(user._id);

	res.status(201).json({
		status: 'Success',
		token,
		data: {
			user
		}
	});
});

// Login Handler
exports.logIn = catchAsync(async (req, res, next) => {
	const { email, password } = req.body;
	const user = await User.findOne({ email }).select('+password');

	// Check Emptiness of Email and Password
	if (!email || !password) {
		return next(new AppError('Please provide email and password', 400));
	}

	// Check Incorrectness of Email and Password
	if (!user || !(await user.comparePass(password, user.password))) {
		return next(new AppError('Incorrect email or password!', 401));
	}

	// Send Response with Token
	const token = signToken(user._id);
	res.status(200).json({
		status: 'Success',
		token
	});
});

// Route Protector Handler
exports.protect = catchAsync(async (req, res, next) => {
	// Check Token
	const authorizationHeader = req.headers.authorization;

	let token;

	if (authorizationHeader && authorizationHeader.startsWith('Bearer')) {
		token = authorizationHeader.split(' ')[1];
	}

	if (!token) {
		return next(new AppError('Unauthorized access! Please sign in.', 401));
	}

	// Verify Token
	const decodedJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

	// Check If User Still Exist
	const currentUser = await User.findById(decodedJWT.id);

	if (!currentUser) {
		return next(
			new AppError('The token for this user is no longer exist.', 401)
		);
	}

	// Check If User Changed Password After Token Was Issued
	if (currentUser.changedPasswordAfter(decodedJWT.iat)) {
		return next(new AppError('Password has been changed! Please relog.', 401));
	}

	// Send User Request Object to Next Middleware
	req.user = currentUser;
	next();
});

// Role-based Authorization Handler
exports.restrictTo = (...roles) => {
	return (req, res, next) => {
		if (!roles.includes(req.user.role)) {
			return next(new AppError('Forbidden access!', 403));
		}

		next();
	};
};
