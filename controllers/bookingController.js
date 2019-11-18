const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Booking = require('../models/bookingModel');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckout = catchAsync(async (req, res, next) => {
	const tour = await Tour.findById(req.params.tourId);

	const stripeSession = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		success_url: `${req.protocol}://${req.get('host')}/?tour=${
			req.params.tourId
		}&user=${req.user.id}&price=${tour.price}`,
		cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
		customer_email: req.user.email,
		client_reference_id: req.params.tourId,
		line_items: [
			{
				name: `${tour.name} Tour`,
				description: tour.summary,
				images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
				amount: tour.price * 100,
				currency: 'usd',
				quantity: 1
			}
		]
	});

	res.status(200).json({
		status: 'Success',
		session: stripeSession
	});
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
	const { tour, user, price } = req.query;
	if (!tour && !user && !price) return next();
	await Booking.create({ tour, user, price });
	res.redirect(`${req.protocol}://${req.get('host')}/profile`);
});

exports.getAllBookings = factory.getAll(Booking);
exports.getOneBooking = factory.getOne(Booking);
exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
