const express = require('express');
const fs = require('fs');
const router = express.Router();

// Read Tours Data
const tours = JSON.parse(
	fs.readFileSync(`${__dirname}/../dummies/data/tours-simple.json`),
);

//Get All Tours
const getAllTours = (req, res) => {
	res.status(200).json({
		status: 'Success',
		requestedAt: req.requestTime,
		results: tours.length,
		data: {
			tours,
		},
	});
};

// Get Single Tour
const getTour = (req, res) => {
	const newId = tours[tours.length - 1].id + 1;
	const newTour = Object.assign({ id: newId }, req.body);

	tours.push(newTour);
	fs.writeFile(
		`${__dirname}/dummies/data/tours-simple.json`,
		JSON.stringify(tours),
		err => {
			res.status(201).json({
				status: 'Created',
				data: {
					tour: newTour,
				},
			});
		},
	);
};

// Create Tour
const createTour = (req, res) => {
	const tour = tours.find(el => el.id == req.params.id);

	if (!tour) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Please provide ID that exists!',
		});
	}

	res.status(200).json({
		status: 'Success',
		data: {
			tour,
		},
	});
};

// Update Tour
const updateTour = (req, res) => {
	const tour = tours.find(el => el.id == req.params.id);

	if (!tour) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Please provide ID that exists!',
		});
	}

	res.status(200).json({
		status: 'Success',
		data: {
			tour: 'Updated tour data here...',
		},
	});
};

// Delete Tour
const deleteTour = (req, res) => {
	const tourId = req.params.id * 1;
	const tour = tours.find(el => el.id == req.params.id);
	const newTours = tours.filter(el => el.id !== tourId);

	if (!tour) {
		return res.status(400).json({
			status: 'Failed',
			message: 'Please provide ID that exists!',
		});
	}

	fs.writeFile(
		`${__dirname}/dummies/data/tours-simple.json`,
		JSON.stringify(newTours),
		err => {
			res.status(200).json({
				status: 'Deleted',
				data: {
					tourId,
				},
			});
		},
	);
};

router
	.route('/')
	.get(getAllTours)
	.post(createTour);

router
	.route('/:id')
	.get(getTour)
	.patch(updateTour)
	.delete(deleteTour);

module.exports = router;
