const express = require("express");
const userController = require("./../controller/user_controller");

const router = express.Router();

// Create New User
router.route("/").post(userController.createUser);

// Get users basic information
router
  .route("/basic/:id")
  .get(userController.getUserBasicInfo)
  .patch(userController.updateUserViaObj);

// Upload Profile pic
router.patch(
  "/profilePic/:id",
  userController.uploadProfilePic,
  userController.resizeUserPhoto,
  userController.UpdateUserDocument
);

// Get Users Education, Basics and lifestyle
router
  .route("/ebl/:id")
  .get(userController.getUserEbl)
  .patch(userController.updateUserEbl)
  .post(userController.updateUserViaObj);

// Get Users interest Information
router
  .route("/interest/:id")
  .get(userController.getUserInterest)
  .patch(userController.updateUserInterest)
  .post(userController.updateUserViaObj);

// Get Users family Information
router
  .route("/family/:id")
  .get(userController.getUserFamily)
  .patch(userController.UpdateUserFamily)
  .post(userController.updateUserViaObj);

module.exports = router;
