const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasBestFive = (req, res, next) => {
	req.query.limit = 5;
	req.query.sort = '-ratingsAverage,price';
	req.query.fields = 'name,ratingsAverage,duration,price,difficulty,summary';
	next();
};

// Get All Tours Handler
exports.getAllTours = async (req, res) => {
	try {
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
	} catch (err) {
		res.status(404).json({
			status: 'Not Found',
			message: "Unfortunately, data can't be fetched!"
		});
	}
};

// Get Single Tour Handler
exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id);

		res.status(200).json({
			status: 'Success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'Not Found',
			message: 'No data with that ID'
		});
	}
};

// Create Tour Handler
exports.createTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body);

		res.status(200).json({
			status: 'Success',
			data: {
				newTour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'Error',
			message: 'Invalid data sent!'
		});
	}
};

// Update Tour Handler
exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		res.status(200).json({
			status: 'Success',
			data: {
				tour
			}
		});
	} catch (err) {
		res.status(400).json({
			status: 'Error',
			message: 'Invalid data sent!'
		});
	}
};

// Delete Tour Handler
exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id);

		res.status(204).json({
			status: 'Success',
			message: 'Data has been deleted!',
			data: null
		});
	} catch (err) {
		res.status(400).json({
			status: 'Error',
			message: 'Invalid ID sent!'
		});
	}
};

// Get Tour Stats using Aggregation Pipelines
exports.getTourStats = async (req, res) => {
	try {
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
			{ $sort: { avgPrice: 1 } }
		]);

		res.status(200).json({
			status: 'Success',
			data: {
				stats
			}
		});
	} catch (err) {
		res.status(404).json({
			status: 'Not Found',
			message: "Unfortunately, data can't be fetched!"
		});
	}
};
