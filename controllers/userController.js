const multer = require('multer');
const fs = require('fs');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');

// Multer Configuration
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/img/users');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('File must be an image!', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Export Multer Middleware
exports.uploadUserPhoto = upload.single('photo');

// Filter Data Object
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// Get Current User Data
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

// Update Current User Data
exports.updateMe = catchAsync(async (req, res, next) => {
  // Send Error If User Tries to Update Password
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is for updating current user data only!', 400)
    );
  }

  // Filter Fields That Allowed to be Updated
  const filter = filterObj(req.body, 'name', 'email');

  // Handle Image Uploads
  if (req.file) {
    const user = await User.findById(req.user.id);
    if (user.photo !== 'default.jpg') {
      await fs.unlink(
        `${__dirname}/../public/assets/img/users/${user.photo}`,
        err => {
          if (err) return next(new AppError('Cannot find image!', 404));
        }
      );
    }
    filter.photo = req.file.filename;
  }

  // Update the User
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filter, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    updatedUser
  });
});

// Soft Delete Current User
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'Success',
    message: 'Successfully deleted current user!',
    data: null
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
