const Tour = require('./../models/tourModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

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
