const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

const limiter = rateLimit({
	max: 100,
	windowMs: 60 * 60 * 1000,
	message: 'Limit reached within this IP! Try again in an hour.'
});

// Security Middlewares
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use('/api', limiter);

// Prevent Parameter Pollution Middleware
app.use(
	hpp({
		whitelist: [
			'duration',
			'ratingsAverage',
			'ratingsQuantity',
			'difficulty',
			'maxGroupSize',
			'price'
		]
	})
);

// Dev Logger, Body Parser and Static File Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(`${__dirname}/public`)));

// Error Handlers
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

// Define Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// Use Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Undefined Route Error Handler
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
