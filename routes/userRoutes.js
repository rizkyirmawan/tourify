const express = require('express');
const user = require('./../controllers/userController');
const auth = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', auth.signUp);
router.post('/login', auth.logIn);
router.post('/forgot-password', auth.forgotPassword);
router.patch('/reset-password/:token', auth.resetPassword);

router.use(auth.protect);

router.get('/me', user.getMe, user.getUser);
router.patch('/update-me', user.updateMe);
router.delete('/delete-me', user.deleteMe);
router.patch('/update-password', auth.updatePassword);

router.use(auth.restrictTo('admin'));

router.route('/').get(user.getAllUsers);

router
	.route('/:id')
	.get(user.getUser)
	.patch(user.updateUser)
	.delete(user.deleteUser);

module.exports = router;
