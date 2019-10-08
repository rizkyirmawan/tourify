const fs = require('fs');
const path = require('path');

// Read Tours Data
const tours = JSON.parse(
	fs.readFileSync(path.join(`${__dirname}/../dummies/data/tours-simple.json`))
);

// Check ID Middleware
exports.checkID = (req, res, next, val) => {
	const tour = tours.find(el => el.id == val);

	if (!tour) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Please provide ID that exists!'
		});
	}

	next();
};

// Check Body Middleware
exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Missing name or price'
		});
	}

	next();
};

// Get All Tours
exports.getAllTours = (req, res) => {
	res.status(200).json({
		status: 'Success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: {
			tours
		}
	});
};

// Get Single Tour
exports.createTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);

	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dummies/data/tours-simple.json`,
		JSON.stringify(tours),
		() => {
			res.status(201).json({
				status: 'Created',
				data: {
					tour: newTour
				}
			});
		}
	);
};

// Create Tour
exports.getTour = (req, res) => {
	const tour = tours.find(el => el.id == req.params.id);

	res.status(200).json({
		status: 'Success',
		data: {
			tour
		}
	});
};

// Update Tour
exports.updateTour = (req, res) => {
	res.status(200).json({
		status: 'Success',
		data: {
			tour: 'Updated tour data here...'
		}
	});
};

// Delete Tour
exports.deleteTour = (req, res) => {
	const tourId = req.params.id * 1;
	const newTours = tours.filter(el => el.id !== tourId);

	fs.writeFile(
		`${__dirname}/dummies/data/tours-simple.json`,
		JSON.stringify(newTours),
		() => {
			res.status(200).json({
				status: 'Deleted',
				data: {
					tourId
				}
			});
		}
	);
};
