const bcryptjs = require("bcryptjs");
const sharp = require("sharp");
const multer = require("multer");
const _ = require("underscore");

const {
  User,
  Ebl,
  Interest,
  Family,
  validate,
  validateEbl,
  validateInterest,
  validateFamily
} = require("./../model/user_model");

/*
// Create multer Storage
const multerStorage = multer.diskStorage({
  // this destination is callback funciton
  destination: (req, file, cb) => {
    cb(null, "public/img/user");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.params.id}-${Date.now()}.${ext}`);
  }
});
*/

// Multer filter
const multerFilter = (req, file, cb) => {
  // Goal of call back is to test if uploaded file is an image and if so then we pass true into the callback function if not we will pass false alongwith error
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Error uploading file...", false);
  }
};

// Here I have commented out multerStorage and wrote a new line in which we define memoryStorage which simply means that the file is not written on disk but kept on storage for further processing like resizing. With multerStorage file is stored in memory

const multerStorage = multer.memoryStorage();

// Uploading images using multer package
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// upload.single("profilePic") here profilePic is name of filed used to upload image
exports.uploadProfilePic = upload.single("photo");

// resize users photo

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();
  req.file.filename = `user-${req.params.id}-${Date.now()}.jpeg`;
  // Calling the sharp function like this will create an object on which we can chain multiple methods in order to do our image processing
  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({ qaulity: 90 })
    .toFile(`public/img/user/${req.file.filename}`);
  next();
};

exports.UpdateUserDocument = async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  if (req.file) {
    const pic = req.file.filename;

    await User.findByIdAndUpdate(req.params.id, {
      photo: pic
    });
    res.status(200).json({
      status: "successful",
      message: "Photo uploaded successully",
      data: {
        photo: pic
      }
    });
  } else {
    return res.status(400).json("No image found...");
  }
};

// Get users basic information
exports.getUserBasicInfo = async (req, res) => {
  try {
    // create new user
    let user = await User.findById(req.params.id);
    // console.log(user);
    if (user) {
      res.status(200).json({
        status: "success",
        message: "Users Basic information...",
        data: _.pick(user, [
          "name",
          "email",
          "phone",
          "photo",
          "gender",
          "dob",
          "religion",
          "country"
        ])
      });
    } else {
      return res.status(404).send({
        status: "fail",
        message: "Information not found..."
      });
    }
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// Create new user
exports.createUser = async (req, res) => {
  // validate user.
  const { error } = validate(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message
    });

  // check user with same email does not exist
  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res.status(400).json({
      status: "fail",
      message: "User with same email is already registered..."
    });

  // Hash password
  const salt = await bcryptjs.genSalt(10);
  req.body.password = await bcryptjs.hash(req.body.password, salt);

  try {
    user = await User.create(req.body);
  } catch (ex) {
    // console.log(ex.errmsg);
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }

  const token = user.generateAuthToken();

  // return success response
  res
    .header("x-auth-token", token)
    .status(201)
    .json({
      status: "success",
      message: "User created successfully...",
      data: _.pick(user, [
        "name",
        "email",
        "gender",
        "country",
        "religion",
        "dob"
      ])
    });
};

exports.updateUser = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: req.body
      }
    );
  } catch (ex) {
    // console.log(ex.errmsg);
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// Add Education, Basics and lifestyle
exports.updateUserEbl = async (req, res) => {
  // validate information of user.
  const { error } = validateEbl(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message
    });
  try {
    // create new user
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          usersEbl: new Ebl(req.body)
        }
      },
      {
        new: true
      }
    );
    res.status(200).json({
      status: "success",
      message: "Updated successfully..",
      data: user.usersEbl
    });
  } catch (ex) {
    // console.log(ex.errmsg);
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// User interest
exports.updateUserInterest = async (req, res) => {
  // console.log(req.body);
  // validate information of user.
  const { error } = validateInterest(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message
    });
  try {
    // create new user
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          userInterest: new Interest(req.body)
        }
      },
      {
        new: true
      }
    );
    res.status(200).json({
      status: "success",
      message: "Updated successfully..",
      data: user.userInterest
    });
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

exports.UpdateUserFamily = async (req, res) => {
  console.log(req.body);
  // validate information of user.
  const { error } = validateFamily(req.body);
  if (error)
    return res.status(400).send({
      status: "fail",
      message: error.details[0].message
    });
  try {
    // create new user
    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          familyInfo: new Family(req.body)
        }
      },
      {
        new: true
      }
    );
    // console.log(user);
    res.status(200).json({
      status: "success",
      message: "Updated successfully..",
      data: user.familyInfo
    });
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// get users information
exports.getUserEbl = async (req, res) => {
  try {
    // create new user
    let user = await User.findById(req.params.id);
    if (user.usersEbl) {
      res.status(200).json({
        status: "success",
        message: "Education, Basics and Lifestyle",
        name: user.name,
        data: user.usersEbl
      });
    } else {
      return res.status(200).send({
        status: "fail",
        message: "Information not found..."
      });
    }
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// Get users interest informaion
exports.getUserInterest = async (req, res) => {
  try {
    // create new user
    let user = await User.findById(req.params.id);

    if (user.userInterest) {
      res.status(200).json({
        status: "success",
        message: "What I am Looking for",
        data: user.userInterest
      });
    } else {
      return res.status(200).send({
        status: "fail",
        message: "Information not found..."
      });
    }
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

// Get users Family informaion
exports.getUserFamily = async (req, res) => {
  try {
    // create new user
    let user = await User.findById(req.params.id);

    if (user.familyInfo) {
      res.status(200).json({
        status: "success",
        message: "Family Details",
        data: user.familyInfo
      });
    } else {
      return res.status(200).send({
        status: "fail",
        message: "Information not found..."
      });
    }
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};

exports.updateUserViaObj = async (req, res) => {
  console.log(req.body);
  try {
    // create new user
    let user = await User.findOneAndUpdate(
      {
        _id: req.params.id
      },
      {
        $set: req.body
      },
      {
        new: true
      }
    );
    res.status(200).json({
      status: "success",
      message: "Updated successfully..",
      data: user
    });
  } catch (ex) {
    for (const fields in ex.errors) {
      console.log(ex.errors[fields].message);
    }
  }
};
