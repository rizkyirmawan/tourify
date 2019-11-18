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
const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }

  return res.status(err.statusCode).render('partials/_error', {
    title: 'Something Went To Space!',
    msg: err.message
  });
};

// Production Environtment Error
const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }

    return res.status(500).json({
      status: 'Error',
      message: 'Something went very wrong!'
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render('partials/_error', {
      title: "Something's Not Right",
      msg: err.message
    });
  }

  return res.status(err.statusCode).render('partials/_error', {
    title: "Something's Not Right",
    msg: 'Something went very wrong. Try again later.'
  });
};

module.exports = (err, req, res, next) => {
  err.status = err.status || 'Error';
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpired();
    if (error.code === 11000) error = handleDuplicateError(error);

    sendErrorProd(error, req, res);
  }
};
