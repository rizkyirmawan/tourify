const catchAsync = require('./../utils/catchAsync');
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError');

exports.deleteOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndDelete(req.params.id);

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(204).json({
			status: 'Success',
			message: 'Data has been deleted!',
			data: null
		});
	});

exports.updateOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true
		});

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'Success',
			data: {
				document: doc
			}
		});
	});

exports.createOne = Model =>
	catchAsync(async (req, res, next) => {
		const doc = await Model.create(req.body);

		res.status(201).json({
			status: 'Success',
			data: {
				document: doc
			}
		});
	});

exports.getOne = (Model, popOpts) =>
	catchAsync(async (req, res, next) => {
		let query = Model.findById(req.params.id);
		if (popOpts) query = query.populate(popOpts);
		const doc = await query;

		if (!doc) {
			return next(new AppError('No document found with that ID', 404));
		}

		res.status(200).json({
			status: 'Success',
			data: {
				document: doc
			}
		});
	});

exports.getAll = Model =>
	catchAsync(async (req, res, next) => {
		// Merge Params of Reviews and Tour
		let filter = {};
		if (req.params.tourId) filter = { tour: req.params.tourId };

		// Execute Query
		const features = new APIFeatures(Model.find(filter), req.query)
			.filter()
			.sort()
			.selectFields()
			.paginate();
		const doc = await features.query;

		// Send Response
		res.status(200).json({
			status: 'Success',
			result: doc.length,
			data: {
				document: doc
			}
		});
	});
