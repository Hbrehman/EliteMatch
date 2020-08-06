// Mark phone and email as unique

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");
const crypto = require("crypto");

// Regular expression for testing phone numberse
// ^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$

// Users education schema
const eduAndLifestyleSchema = new mongoose.Schema({
  education: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  profession: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  motherTongue: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  complexion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  weight: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  diet: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  height: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  about: {
    type: String,
    required: true,
    minlength: 20,
    maxlength: 500,
  },
});

// User interest schema

const userInterestSchema = new mongoose.Schema({
  age: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  maritalStatus: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  complexion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  height: {
    type: String,
    required: true,
    minlength: 1,
    maxlength: 255,
  },
  caste: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  religion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  diet: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
});

// Family information Schema

const familyInfoSchema = new mongoose.Schema({
  caste: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  fatherName: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  fathersEdu: {
    type: String,
    minlength: 2,
    maxlength: 255,
  },
  mothersName: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  mothersOcu: {
    type: String,
    minlength: 3,
    maxlength: 255,
  },
  noBros: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
  noSis: {
    type: String,
    minlength: 1,
    maxlength: 255,
  },
});

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  phone: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    required: true,
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  dob: {
    type: Date,
    required: true,
  },
  religion: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  country: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
  },
  interestedPpl: {
    type: String,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpire: Date,
  usersEbl: eduAndLifestyleSchema,
  userInterest: userInterestSchema,
  familyInfo: familyInfoSchema,
});

userSchema.pre("save", async function (next) {
  // if password is not modified return
  if (!this.isModified("password")) return next();
  //
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY);
};

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.passwordChangedAfter = function (JWTTimeStmp) {
  if (this.passwordChangedAt) {
    const changedTimeStmp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return changedTimeStmp > JWTTimeStmp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const validateUser = (user) => {
  const Schema = {
    name: Joi.string().min(5).max(255).required(),
    phone: Joi.string().min(5).max(255).required(),
    email: Joi.string().email({ minDomainAtoms: 2 }).min(5).max(255).required(),
    dob: Joi.date().required(),
    gender: Joi.string().min(4).max(255).required(),
    religion: Joi.string().min(3).max(255).required(),
    country: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(5).max(255).required(),
  };
  return Joi.validate(user, Schema);
};

const User = mongoose.model("user", userSchema);
const Ebl = mongoose.model("ebl", eduAndLifestyleSchema);
const Interest = mongoose.model("interest", userInterestSchema);
const Family = mongoose.model("family", familyInfoSchema);

const validateEbl = (ebl) => {
  const Schema = {
    education: Joi.string().min(3).max(255).required(),
    profession: Joi.string().min(3).max(255).required(),
    motherTongue: Joi.string().min(3).max(255).required(),
    complexion: Joi.string().min(3).max(255).required(),
    weight: Joi.string().min(1).max(255).required(),
    diet: Joi.string().min(3).max(255).required(),
    height: Joi.string().min(1).max(255).required(),
    about: Joi.string().min(20).max(255).required(),
  };
  return Joi.validate(ebl, Schema);
};

const validateInterest = (interest) => {
  const Schema = {
    age: Joi.string().min(1).max(255).required(),
    maritalStatus: Joi.string().min(3).max(255).required(),
    complexion: Joi.string().min(3).max(255).required(),
    height: Joi.string().min(1).max(255).required(),
    caste: Joi.string().required().min(3).max(255),
    religion: Joi.string().min(3).max(255).required(),
    diet: Joi.string().min(3).max(255).required(),
  };
  return Joi.validate(interest, Schema);
};

const validateFamily = (family) => {
  const Schema = {
    caste: Joi.string().required().min(3).max(255),
    fatherName: Joi.string().min(1).max(255).required(),
    fathersEdu: Joi.string().min(1).max(255).required(),
    mothersName: Joi.string().min(3).max(255).required(),
    mothersOcu: Joi.string().min(1).max(255).required(),
    noBros: Joi.string().required().min(1).max(255),
    noSis: Joi.string().min(1).max(255).required(),
  };
  return Joi.validate(family, Schema);
};

exports.validate = validateUser;
exports.validateEbl = validateEbl;
exports.validateInterest = validateInterest;
exports.validateFamily = validateFamily;
exports.User = User;
exports.Ebl = Ebl;
exports.Interest = Interest;
exports.Family = Family;
