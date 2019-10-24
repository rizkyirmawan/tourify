const Tour = require('./../models/tourModel');

// Get All Tours Handler
exports.getAllTours = async (req, res) => {
	try {
		// Filtering
		const queryObj = { ...req.query };
		const excludedFields = ['page', 'limit', 'sort', 'field'];
		excludedFields.forEach(el => delete queryObj[el]);

		// Advanced Filtering
		let queryStr = JSON.stringify(queryObj);
		queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

		let query = Tour.find(JSON.parse(queryStr));

		// Sorting
		if (req.query.sort) {
			const sortBy = req.query.sort.split(',').join(' ');
			query = query.sort(sortBy);
		} else {
			query = query.sort('-createdAt');
		}

		const tours = await query;

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
