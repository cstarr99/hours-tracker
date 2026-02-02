const hoursController = require("../controllers/hoursController");
const express = require("express");

const router = express.Router();
router.route("/").get(hoursController.getAllHours);

module.exports = router;
