const express = require('express');
const view = require('./../controllers/viewsController');
const auth = require('./../controllers/authController');

const router = express.Router();

router.use(auth.isLoggedIn);

router.get('/', view.getOverview);
router.get('/tour/:slug', view.getSingleTour);
router.get('/signin', view.getSigninPage);

module.exports = router;
