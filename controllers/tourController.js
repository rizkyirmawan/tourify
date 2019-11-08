const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.aliasBestFive = (req, res, next) => {
	req.query.limit = 5;
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,ratingsAverage,duration,price,difficulty,summary';
	next();
};

// Get All Tours Handler
exports.getAllTours = catchAsync(async (req, res, next) => {
	// Execute Query
	const features = new APIFeatures(Tour.find(), req.query)
		.filter()
		.sort()
		.selectFields()
		.paginate();
	const tours = await features.query;

	// Send Response
	res.status(200).json({
		status: 'Success',
		result: tours.length,
		data: {
			tours
		}
	});
});

// Get Single Tour Handler
exports.getTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.id).populate('reviews');

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	res.status(200).json({
		status: 'Success',
		data: {
			tour
		}
	});
});

// Create Tour Handler
exports.createTour = catchAsync(async (req, res, next) => {
	const newTour = await Tour.create(req.body);

	res.status(201).json({
		status: 'Success',
		data: {
			newTour
		}
	});
});

// Update Tour Handler
exports.updateTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
		new: true,
		runValidators: true
	});

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	res.status(200).json({
		status: 'Success',
		data: {
			tour
		}
	});
});

// Delete Tour Handler
exports.deleteTour = catchAsync(async (req, res, next) => {
	const tour = await Tour.findByIdAndDelete(req.params.id);

	if (!tour) {
		return next(new AppError('No tour found with that ID', 404));
	}

	res.status(204).json({
		status: 'Success',
		message: 'Data has been deleted!',
		data: null
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
	const year = req.params.year;

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
