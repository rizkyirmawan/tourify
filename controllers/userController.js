const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Filter Data Object
const filterObj = (obj, ...allowedFields) => {
	const newObj = {};
	Object.keys(obj).forEach(el => {
		if (allowedFields.includes(el)) newObj[el] = obj[el];
	});

	return newObj;
};

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

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
