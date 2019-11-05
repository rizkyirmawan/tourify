const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Filter Data Object
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});

	return newObj;
};

// Get All Users Handler
exports.getAllUsers = catchAsync(async (req, res, next) => {
	// Execute Query
	const features = new APIFeatures(User.find(), req.query)
		.filter()
		.sort()
		.selectFields()
		.paginate();
	const users = await features.query;

	// Send Response
	res.status(200).json({
		status: 'Success',
		result: users.length,
		data: {
			users
		}
	});
});

// Update Current User Data
exports.updateMe = catchAsync(async (req, res, next) => {
	// Send Error If User Tries to Update Password
	if (req.body.password || req.body.passwordConfirm) {
		return next(
			new AppError('This route is for updating current user data only!', 400)
		);
	}

	// Filter Fields That Allowed to be Updated
	const filter = filterObj(req.body, 'name', 'email');

	// Update the User
	const user = await User.findByIdAndUpdate(req.user.id, filter, {
		new: true,
		runValidators: true
	});

	res.status(200).json({
		status: 'Success',
		updatedUser: user
	});
});

// Soft Delete Current User
exports.deleteMe = catchAsync(async (req, res, next) => {
	await User.findByIdAndUpdate(req.user.id, { active: false });

	res.status(204).json({
		status: 'Success',
		message: 'Successfully deleted current user!',
		data: null
	});
});

// Get Single User Handler
exports.getUser = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};

// Create User Handler
exports.createUser = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};

// Update User Handler
exports.updateUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!user) return next(new AppError('No user with given ID!', 400));

	res.status(200).json({
		status: 'Success',
		data: {
			updatedUser: user
		}
	});
});

// Delete User Handler
exports.deleteUser = catchAsync(async (req, res, next) => {
	const user = await User.findByIdAndDelete(req.params.id);

	if (!user) return next(new AppError('No user with that ID!', 400));

	res.status(204).json({
		status: 'Success',
		message: 'User successfully deleted!',
		data: null
	});
});
