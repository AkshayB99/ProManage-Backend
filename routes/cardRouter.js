const express = require("express");
const authController = require("./../controllers/authController");
const cardController = require("./../controllers/cardController");

const router = express.Router();

router.route("/").post(authController.protect, cardController.addItem);

router
  .route("/userdata/:id")
  .get(authController.protect, cardController.getUserData)
  .delete(authController.protect, cardController.deleteItem);

router.get("/:id/period", authController.protect, cardController.getPeriod);

router
  .route("/update/:id")
  .patch(authController.protect, cardController.updateItem);

router
  .route("/:collectionId/:checklistItemId")
  .patch(authController.protect, cardController.updateCheckbox);

module.exports = router;
