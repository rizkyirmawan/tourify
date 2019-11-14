/* eslint-disable require-atomic-updates */
const crypto = require('crypto');
const moment = require('moment');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/emailSender');
const AppError = require('./../utils/appError');
const { promisify } = require('util');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const sendResponseToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: moment()
      .add(process.env.JWT_COOKIE_EXPIRES, 'd')
      .toDate(),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('JWT', token, cookieOptions);

  user.password = undefined;
  user.__v = undefined;

  res.status(statusCode).json({
    status: 'Success',
    token,
    data: {
      user
    }
  });
};

// Signup Handler
exports.signUp = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    passwordConfirm
  });

  sendResponseToken(user, 201, res);
});

// Login Handler
exports.logIn = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  // Check Emptiness of Email and Password
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  // Check Incorrectness of Email and Password
  if (!user || !(await user.comparePass(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  // Send Response with Token
  sendResponseToken(user, 200, res);
});

// Route Protector Handler
exports.protect = catchAsync(async (req, res, next) => {
  // Check Token
  const authHeader = req.headers.authorization;

  let token;

  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  } else if (req.cookies.JWT) {
    token = req.cookies.JWT;
  }

  if (!token) {
    return next(new AppError('Unauthorized access! Please sign in.', 401));
  }

  // Verify Token
  const decodedJWT = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check If User Still Exist
  const currentUser = await User.findById(decodedJWT.id);

  if (!currentUser) {
    return next(
      new AppError('The token for this user is no longer exist.', 401)
    );
  }

  // Check If User Changed Password After Token Was Issued
  if (currentUser.changedPasswordAfter(decodedJWT.iat)) {
    return next(new AppError('Password has been changed! Please relog.', 401));
  }

  // Send User Request Object to Next Middleware
  req.user = currentUser;
  next();
});

// Is Logged In Middleware
exports.isLoggedIn = async (req, res, next) => {
  try {
    // Check Token
    if (req.cookies.JWT) {
      // Verify Token
      const decodedJWT = await promisify(jwt.verify)(
        req.cookies.JWT,
        process.env.JWT_SECRET
      );

      // Check If User Still Exist
      const currentUser = await User.findById(decodedJWT.id);

      if (!currentUser) {
        return next();
      }

      // Check If User Changed Password After Token Was Issued
      if (currentUser.changedPasswordAfter(decodedJWT.iat)) {
        return next();
      }

      // Send User Request Object to Next Middleware
      res.locals.user = currentUser;
      return next();
    }
  } catch (err) {
    return next();
  }
  next();
};

// Logging Out Users
exports.logOut = (req, res) => {
  // Set Token to Random String
  res.cookie('JWT', 'Logged-out', {
    expires: moment()
      .add(10, 's')
      .toDate(),
    httpOnly: true
  });

  // Send Response
  res.status(200).json({ status: 'Success' });
};

// Role-based Authorization Handler
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Forbidden access!', 403));
    }

    next();
  };
};

// Forgot Password Handler
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError('No user with given email!', 404));

  const resetToken = user.createResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/reset-password/${resetToken}`;
  const message = `Submit PATCH request to: ${resetUrl} to reset your password!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your Reset Password Token (Valid For 20 Minutes)',
      message
    });

    res.status(200).json({
      status: 'Success',
      message: 'Reset token sent!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save({ validateBeforeSave: false });
    return next(new AppError('Email not sent. Try again later.', 500));
  }
});

// Reset Password Handler
exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: moment() }
  });

  if (!user) return next(new AppError('Token has been expired!', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendResponseToken(user, 200, res);
});

// Update Password Handler
exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePass(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Password not match the old one!', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  sendResponseToken(user, 200, res);
});
