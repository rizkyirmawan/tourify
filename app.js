const cookieParser = require('cookie-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const booking = require('./controllers/bookingController');

const app = express();

// Enable Moment as Locals Variable and Setting Pug Template Engine
app.locals.moment = require('moment');
app.set('view engine', 'pug');
app.set('views', path.join(`${__dirname}/views`));

// Implementing GZIP Compression and CORS
app.use(compression());
app.use(cors());
app.options('*', cors());

// Rate Limiter
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

// Stripe Webhook Checkout
app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  booking.webhookCheckout
);

// Dev Logger, Body Parser and Static File Middleware
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());
app.use(express.static(path.join(`${__dirname}/public`)));
app.use(cookieParser());

// Error Handlers
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

// Define Routes
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const viewRouter = require('./routes/viewRoutes');

// Use Routes
app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

// Undefined Route Error Handler
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
