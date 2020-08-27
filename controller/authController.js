const crypto = require("crypto");
const sendEmail = require("./../utils/email");
const jwt = require("jsonwebtoken");
const _ = require("underscore");
const AppError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const bcryptjs = require("bcryptjs");
const { User, validate } = require("./../model/user_model");
const Joi = require("Joi");

// Sign Up User
module.exports.signUp = catchAsync(async (req, res, next) => {
  // validate user.
  const { error } = validate(req.body);
  if (error) return next(new AppError(error.details[0].message, 400));

  // check if user with same email exists
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return next(
      new AppError("User with same email is already registered...", 400)
    );

  user = await User.create(
    _.pick(req.body, [
      "name",
      "phone",
      "email",
      "gender",
      "religion",
      "dob",
      "country",
      "password",
    ])
  );

  // generate json web token and send it to client
  const token = user.generateAuthToken();

  // send response
  res
    .header("x-auth-token", token)
    .status(201)
    .json({
      status: "success",
      token,
      message: "User created successfully...",
      data: _.pick(user, [
        "name",
        "email",
        "gender",
        "country",
        "religion",
        "dob",
      ]),
    });
});

module.exports.logIn = catchAsync(async (req, res, next) => {
  // validate user
  const { error } = validateLogin(req.body);
  if (error) return next(new AppError("Invalid email or password", 400));

  // Check if the user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("Invalid email or password", 400));

  // compare password sent by user and password stored in our database
  const result = await user.comparePassword(req.body.password, user.password);

  // match users password with given password
  if (!result) return next(new AppError("Invalid email or password", 400));

  // If we reach here it means everything is valid
  const token = user.generateAuthToken();

  console.log(token);

  res.header("x-auth-token", token).status(200).json({
    token,
    status: "Success",
    message: "Access granted...",
  });
});

module.exports.protect = catchAsync(async (req, res, next) => {
  let token;
  // Check if the token exists and is bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(
      new AppError("You are not logged in please log in to get access!", 401)
    );
  }

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  // Check if the user whose id was in token exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError("User belonging to this token does no longer exist", 401)
    );

  if (currentUser.passwordChangedAfter(decoded.iat)) {
    return next(
      new AppError(
        "User recently changed his password Please log In again.",
        401
      )
    );
  }
  res.user = currentUser;
  next();
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("There is no user with this email address", 404));
  // 2) Generate Random email token
  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });
  // 3) Send it to users email

  const message = `Forgot your password submit a patch request with your new password and passwordConfirm to: ${resetURL} \n if you didn't forgot your password please ignore this email`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.save({ validateBeforeSave: false });
    return next(
      new AppError("There was an error sending the email! Try again later", 500)
    );
  }
  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

// Rsest Users Password
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpire: { $gt: Date.now() },
  });

  // 2) If the token has not expired and there is user, set new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired.", 400));
  }
  user.password = req.body.password;
  // user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetExpires = undefined;
  user.passwordResetToken = undefined;
  await user.save();

  // 4) If everything is ok send token to client
  const token = user.generateAuthToken();
  res.status(200).json({
    token,
    status: "Success",
  });
});

const validateLogin = (user) => {
  const schema = {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, schema);
};
