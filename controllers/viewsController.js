const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  const tours = await Tour.find();

  res.status(200).render('front/overview', {
    title: 'All Tours',
    tours
  });
});

exports.getSingleTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) return next(new AppError('No tour found with that name.', 404));

  const { user } = res.locals;
  let bookings = [];
  let tourIds = [];

  if (user) {
    bookings = await Booking.find({ user: user.id });
    tourIds = bookings.map(el => el.tour.id);
  }

  const isBooked = tourIds.includes(tour.id);

  res.status(200).render('front/tourDetails', {
    title: tour.name,
    isBooked,
    tour
  });
});

exports.getSigninPage = (req, res) => {
  res.status(200).render('front/signIn', {
    title: 'Sign In'
  });
};

exports.getProfile = catchAsync(async (req, res, next) => {
  const { user } = res.locals;
  const bookings = await Booking.find({ user: user.id });

  res.status(200).render('front/profilePage', {
    title: `${user.name.split(' ')[0]}'s Profile`,
    bookings
  });
});
