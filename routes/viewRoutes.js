const express = require('express');
const view = require('./../controllers/viewsController');
const auth = require('./../controllers/authController');

const router = express.Router();

router.use(auth.isLoggedIn, view.alert);

router.get('/', view.getOverview);
router.get('/tour/:slug', view.getSingleTour);
router.get('/signin', view.getSigninPage);
router.get('/profile', view.getProfile);

module.exports = router;
