// const crypto = require('crypto');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Student = require('../model/student');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const bcrypt = require('bcryptjs');
const Due = require('../model/due');
const { JWT_COOKIE_EXPIRE } = require('../config/dev');

// @desc register user
// @route POST /auth/register
// @access PUBLIC

module.exports.registerUser = asyncHandler(async (req, res, next) => {
  const role = req.body.role;
  let user;
  if (role === 'student') {
    const { reg_no } = req.body;
    user = await Student.findOne({ reg_no });
    if (!user) {
      next(new ErrorResponse('No student found', 404));
    }
  } else if (role === 'department') {
    const { email } = req.body;
    // user = await Department.findOne({ email });
    user = await Student.findOne({ reg_no });
    if (!user) {
      next(new ErrorResponse('No department found', 404));
    }
  }

  if (user && user.password) {
    next(new ErrorResponse('You have already registered, please login', 404));
  } else {
    const genreatedPassword = crypto.randomBytes(8).toString('hex');

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(genreatedPassword, salt);

    await user.save();

    const message = `Your password for login is ${genreatedPassword}`;
    await sendEmail({
      email: user.email,
      subject: 'Your password',
      message,
    });
    sendTokenResponse(user, 200, res);
  }

  // const user = await User.create({
  //   name,
  //   email,
  //   password,
  //   role,
  // });
});

// @desc register user
// @route POST /auth/login
// @access PUBLIC

module.exports.loginUser = asyncHandler(async (req, res, next) => {
  try {
    const role = req.body.role;
    let user;
    if (role === 'student') {
      const { reg_no, password } = req.body;
      // Validate regNo & password
      if (!reg_no || !password) {
        return next(
          new ErrorResponse('Please provide an reg_no and password', 400)
        );
      }
      user = await Student.findOne({
        reg_no,
      }).select('+password');
    } else if (role === 'department') {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new ErrorResponse('Please provide an reg_no and password', 400)
        );
      }
      user = await Student.findOne({ reg_no });
      // user = await Department.findOne({ email }).select('+password');
    }

    if (!user) {
      return next(
        new ErrorResponse('User does not exist or invalid credentials!', 401)
      );
    }

    if (!user.password) {
      return next(
        new ErrorResponse('Please signup first to get your password!', 401)
      );
    }

    // *

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }
    const due = await Due.find({ reg_no });
    let message = `Please clear your dues for`;
    for (d of due) {
      message =
        message + `\n${d.department} - Rs.${d.amount_due} - ${d.details}\n`;
    }

    if (due.length > 0) {
      console.log(due);
      await sendEmail({
        email: user.email,
        subject: 'Your dues',
        message,
      });
      return next(
        new ErrorResponse(
          'Please clear your dues first,please check your mail for due details ',
          401
        )
      );
    }
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.log(err);
  }
});

// @desc get user after login
// @route GET /auth/getUser
// access PRIVATE

exports.getUserAfterLogin = asyncHandler(async (req, res, next) => {
  // getting user based on id of jwt token from header and as we don't want password we neglect it  using select('-password')
  let user = await Student.findById(req.user._id).select('-password');

  if (!user) {
    next(new ErrorResponse('User not found!', 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc      add communication data
// @route     post /auth/add-communication-data
// @access    Private
exports.addCommunicationData = asyncHandler(async (req, res, next) => {
  const user = await Student.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    next(new ErrorResponse('User not found!', 404));
  }
  res.status(200).json({ success: true, data: user });
});

// @desc      Log user out / clear cookie
// @route     GET /logout
// @access    Public

exports.logoutUser = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    msg: 'successfully logged out!',
  });
});

// @desc      Update user details
// @route     PUT /auth/updateDetails
// @access    Private

exports.updateDetails = asyncHandler(async (req, res, next) => {
  const { name, email } = req.body;

  const fields = { name, email };

  const user = await User.findByIdAndUpdate(req.user._id, fields, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Update password
// @route     PUT /auth/updatePassword
// @access    Private

exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  let user = await User.findById(req.user._id).select('+password');

  if (!user) {
    throw new ErrorResponse(
      'User does not exist, please logout and login again!',
      404
    );
  }

  const isMatch = await user.matchPassword(currentPassword);

  // Check current password

  if (!isMatch) {
    return next(new ErrorResponse('Password is incorrect', 401));
  }

  user.password = newPassword;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /auth/forgotpassword
// @access    Public

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorResponse('There is no user with that email', 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetpassword/${resetToken}`;
  // const resetUrl = `${req.protocol}://localhost:3000/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please visit this link to reset password: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message,
    });

    res.status(200).json({ success: true, data: 'Email sent', resetUrl });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse('Email could not be sent!', 500));
  }
});

// @desc      Reset password
// @route     PUT /auth/resetpassword/:resetToken
// @access    Public

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const { resetToken } = req.params;

  // Get hashed token

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse('Invalid token', 400));
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};
