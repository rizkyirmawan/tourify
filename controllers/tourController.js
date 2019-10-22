const Tour = require('./../models/tourModel');

// Get All Tours Handler
exports.getAllTours = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};

// Get Single Tour Handler
exports.getTour = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
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
exports.updateTour = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};

// Delete Tour Handler
exports.deleteTour = (req, res) => {
	res.status(500).json({
		status: 'Error',
		message: 'Route not defined yet!'
	});
};
