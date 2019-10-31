const User = require('./../models/userModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
exports.updateUser = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};

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
