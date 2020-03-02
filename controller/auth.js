const bcryptjs = require("bcryptjs");
const { User } = require("./../model/user_model");
const Joi = require("Joi");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  // validate user
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      status: "Fail",
      message: "Invalid email or password..."
    });

  // query for user
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({
      status: "Fail",
      message: "Invalid email or password..."
    });

  // compare password sent by user and password stored in our database
  const result = await bcryptjs.compare(req.body.password, user.password);

  // match users password with given password
  if (!result)
    return res.status(400).json({
      status: "Fail",
      message: "Invalid email or password..."
    });

  // If we reach here it means everything is valid
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .status(200)
    .json({
      status: "Success",
      message: "Access granted..."
    });
});

const validate = user => {
  const schema = {
    email: Joi.string()
      .email({ minDomainAtoms: 2 })
      .required(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required()
  };
  return Joi.validate(user, schema);
};

module.exports = router;
