const express = require('express');
const tour = require('./../controllers/tourController');
const auth = require('./../controllers/authController');
const reviewRouter = require('./../routes/reviewRoutes');

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/best-5').get(tour.aliasBestFive, tour.getAllTours);

router.route('/stats').get(tour.getTourStats);

router
  .route('/monthly-plan/:year')
  .get(
    auth.protect,
    auth.restrictTo('admin', 'lead-guide'),
    tour.getMonthlyPlan
  );

router.get(
  '/tours-within/:distance/center/:ltdlng/unit/:unit',
  tour.getToursWithin
);

router.get('/distances/:ltdlng/unit/:unit', tour.getTourDistances);

router
  .route('/')
  .get(tour.getAllTours)
  .post(auth.protect, auth.restrictTo('admin', 'lead-guide'), tour.createTour);

router
  .route('/:id')
  .get(tour.getTour)
  .patch(
    auth.protect,
    auth.restrictTo('admin', 'lead-guide'),
    tour.uploadTourImages,
    tour.processTourImages,
    tour.updateTour
  )
  .delete(
    auth.protect,
    auth.restrictTo('admin', 'lead-guide'),
    tour.deleteTour
  );

module.exports = router;
