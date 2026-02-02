const hoursController = require("../controllers/hoursController");
const express = require("express");

const router = express.Router();
router
  .route("/")
  .get(hoursController.getAllHours)
  .post(hoursController.createHourLog);
router
  .route("/:id")
  .delete(hoursController.deleteHourLog)
  .patch(hoursController.updateHourLog);

module.exports = router;
