const express = require('express');
const user = require('./../controllers/userController');
const router = express.Router();

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
