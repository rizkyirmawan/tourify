/* eslint-disable require-atomic-updates */
const multer = require('multer');
const fs = require('fs');
const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');
const AppError = require('./../utils/appError');

// Multer Configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/img/tours');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `tour-${req.params.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File must be an image!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

exports.processTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  const tour = await Tour.findById(req.params.id);

  // Delete Image Cover if Exists
  if (req.files.imageCover && tour.imageCover) {
    fs.unlink(
      `${__dirname}/../public/assets/img/tours/${tour.imageCover}`,
      err => {
        if (err) return next(new AppError('Something went wrong!', 500));
      }
    );
  }

  // Delete Images if Exists
  if (req.files.images && tour.images.length > 0) {
    tour.images.forEach(img => {
      fs.unlink(`${__dirname}/../public/assets/img/tours/${img}`, err => {
        if (err) return next(new AppError('Something went wrong!', 500));
      });
    });
  }

  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = [];
  req.files.images.map(img => {
    req.body.images.push(img.filename);
  });

  next();
});

exports.aliasBestFive = (req, res, next) => {
  req.query.limit = 5;
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,ratingsAverage,duration,price,difficulty,summary';
  next();
};

exports.getAllTours = factory.getAll(Tour);
exports.getTour = factory.getOne(Tour, { path: 'reviews' });
exports.createTour = factory.createOne(Tour);
exports.updateTour = factory.updateOne(Tour);
exports.deleteTour = factory.deleteOne(Tour);

// Get Tours Within Radius
exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, ltdlng, unit } = req.params;
  const [ltd, lng] = ltdlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!ltd || !lng) {
    return next(
      new AppError(
        'Please provide longitude and latitude separated with comma!',
        400
      )
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, ltd], radius] } }
  });

  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours
    }
  });
});

// Get Tours Distances From a Certain Point
exports.getTourDistances = catchAsync(async (req, res, next) => {
  const { ltdlng, unit } = req.params;
  const [ltd, lng] = ltdlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!ltd || !lng) {
    return next(
      new AppError(
        'Please provide longitude and latitude separated with comma!',
        400
      )
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [Number(lng), Number(ltd)] },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    { $project: { distance: 1, name: 1 } }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      data: distances
    }
  });
});

// Get Tour Stats using Aggregation Pipelines
exports.getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    { $match: { ratingsAverage: { $gte: 4.5 } } },
    {
      $group: {
        _id: { $toUpper: '$difficulty' },
        totalTours: { $sum: 1 },
        totalRating: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' }
      }
    },
    { $addFields: { groupByDifficulty: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { avgPrice: 1 } }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      stats
    }
  });
});

// Get Tours Monthly Plan using Aggregation Pipelines
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const { year } = req.params;

  const plan = await Tour.aggregate([
    { $unwind: '$startDates' },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`)
        }
      }
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        totalTours: { $sum: 1 },
        tours: { $push: '$name' }
      }
    },
    { $addFields: { month: '$_id' } },
    { $project: { _id: 0 } },
    { $sort: { totalTours: -1 } },
    { $limit: 12 }
  ]);

  res.status(200).json({
    status: 'Success',
    data: {
      plan
    }
  });
});
