const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(`${__dirname}/public`)));

// Error Handlers
const AppError = require('./utils/AppError');
const globalErrorHandler = require('./controllers/errorController');

// Define Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// Use Routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Undefined Route Error Handler
app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
