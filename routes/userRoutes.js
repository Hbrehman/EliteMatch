const express = require("express");
const userController = require("../controller/userController");
const authController = require("../controller/authController");

const router = express.Router();

// Create New User
router.route("/signup").post(authController.signUp);
router.route("/login").post(authController.logIn);
router.route("/forgotPassword").post(authController.forgotPassword);
router.route("/resetPassword/:token").post(authController.resetPassword);
router.route("/getMatches").get(userController.getMatches);
// router.route("/").post(authController.signUp);

// Get users basic information
router
  .route("/basic/:id")
  .get(userController.getUserBasicInfo)
  .patch(userController.updateUserDataSingleEl);

// Upload Profile pic
router.patch(
  "/profilePic/:id",
  userController.uploadProfilePic,
  userController.resizeUserPhoto,
  userController.updateProfilePic
);

// Get Users Education, Basics and lifestyle
router
  .route("/ebl/:id")
  .get(userController.getUserEbl)
  .put(userController.updateUserEbl)
  .patch(userController.updateUserDataSingleEl);

// Get Users interest Information
router
  .route("/interest/:id")
  .get(userController.getUserInterest)
  .put(userController.updateUserInterest)
  .patch(userController.updateUserDataSingleEl);

// Get Users family Information
router
  .route("/family/:id")
  .get(userController.getUserFamily)
  .put(userController.UpdateUserFamily)
  .patch(userController.updateUserDataSingleEl);

module.exports = router;
