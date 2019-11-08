const express = require('express');
const user = require('./../controllers/userController');
const auth = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', auth.signUp);
router.post('/login', auth.logIn);

router.post('/forgot-password', auth.forgotPassword);
router.patch('/reset-password/:token', auth.resetPassword);
router.patch('/update-password', auth.protect, auth.updatePassword);
router.patch('/update-me', auth.protect, user.updateMe);
router.delete('/delete-me', auth.protect, user.deleteMe);

router.route('/').get(user.getAllUsers);

router
	.route('/:id')
	.get(user.getUser)
	.patch(user.updateUser)
	.delete(user.deleteUser);

module.exports = router;
