const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

  res.status(200).render('front/tourDetails', {
    title: tour.name,
    tour
  });
});

exports.getSigninPage = (req, res) => {
  res.status(200).render('front/signIn', {
    title: 'Sign In'
  });
};

exports.getProfile = (req, res) => {
  const { user } = res.locals;

  res.status(200).render('front/profilePage', {
    title: `${user.name.split(' ')[0]}'s Profile`
  });
};
