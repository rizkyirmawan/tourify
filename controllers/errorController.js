const AppError = require('./../utils/appError');

// Handle Duplicate IDs
const handleCastError = err => {
	const message = `Invalid ${err.path}: ${err.value}`;
	return new AppError(message, 400);
};

// Handle Duplicate Fields
const handleDuplicateError = err => {
	const value = err.errmsg.match(/"([^"]*)"/)[1];
	const message = `Duplicate field value of: ${value}. Please use another value!`;
	return new AppError(message, 400);
};

// Handle Validation Errors
const handleValidationError = err => {
	const errors = Object.values(err.errors).map(el => el.message);
	const message = `Invalid input data: ${errors.join(', ')}.`;
	return new AppError(message, 400);
};

// Handle JWT Errors
const handleJWTError = () =>
	new AppError('Invalid token signature! Please relog.', 401);

// Handle JWT Expired Token Errors
const handleJWTExpired = () =>
	new AppError('Token has been expired! Please relog.', 401);

// Development Environtment Error
const sendErrorDev = (err, res) => {
	res.status(err.statusCode).json({
		status: err.status,
		error: err,
		message: err.message,
		stack: err.stack
	});
};

// Production Environtment Error
const sendErrorProd = (err, res) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message
		});
	} else {
		console.error('Error: ', err);

		res.status(500).json({
			status: 'Error',
			message: 'Something went very wrong!'
		});
	}
};

module.exports = (err, req, res, next) => {
	err.status = err.status || 'Error';
	err.statusCode = err.statusCode || 500;

	if (process.env.NODE_ENV === 'development') {
		sendErrorDev(err, res);
	} else if (process.env.NODE_ENV === 'production') {
		let error = { ...err };

		if (error.name === 'CastError') error = handleCastError(error);
		if (error.name === 'ValidationError') error = handleValidationError(error);
		if (error.name === 'JsonWebTokenError') error = handleJWTError();
		if (error.name === 'TokenExpiredError') error = handleJWTExpired();
		if (error.code === 11000) error = handleDuplicateError(error);

		sendErrorProd(error, res);
	}
};
