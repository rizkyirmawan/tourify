const express = require('express');
const user = require('./../controllers/userController');
const auth = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', auth.signUp);
router.post('/login', auth.logIn);

router.post('/forgot-password', auth.forgotPassword);
router.patch('/reset-password/:token', auth.resetPassword);
router.patch('/update-password', auth.protect, auth.updatePassword);

router
	.route('/')
	.get(user.getAllUsers)
	.post(user.createUser);

router
	.route('/:id')
	.get(user.getUser)
	.patch(user.updateUser)
	.delete(user.deleteUser);

module.exports = router;
