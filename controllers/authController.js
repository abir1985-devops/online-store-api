const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};
exports.signup = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new AppError('Please provide name, email, and password', 400);
  }

  // 1) Create user
  const newUser = await User.create({ name, email, password });

  // 2) Create token (auto-login)
  const token = signToken(newUser._id);

  // 3) Never send password back
  newUser.password = undefined;

  // 4) Send response
  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError('Please provide email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Incorrect email or password', 401);
  }

  const token = signToken(user._id);

  user.password = undefined;

  res.status(200).json({
    status: 'success',
    message: 'Login successful',
    token,
    data: { user },
  });
});
