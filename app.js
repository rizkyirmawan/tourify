const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(`${__dirname}/public`)));

// Define Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Use Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Undefined Route Error Handler
app.all('*', (req, res, next) => {
	const err = new Error(`Can't find ${req.originalUrl} on this server!`);
	err.status = 'Not Found';
	err.statusCode = 404;

	next(err);
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
	err.status = err.status || 'Error';
	err.statusCode = err.statusCode || 500;

	res.status(err.statusCode).json({
		status: err.status,
		message: err.message
	});
});

module.exports = app;
