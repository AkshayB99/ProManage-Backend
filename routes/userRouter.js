const express = require("express");
const authController = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.patch(
  "/updateMyPassword",
  authController.protect,
  authController.updatePassword
);

router.post("/updateName", authController.protect, authController.updateName);

module.exports = router;
