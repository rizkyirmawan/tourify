const express = require('express');
const view = require('./../controllers/viewsController');

const router = express.Router();

router.get('/', view.getOverview);
router.get('/tour/:slug', view.getSingleTour);

module.exports = router;
