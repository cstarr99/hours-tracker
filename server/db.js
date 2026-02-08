const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });

const hours = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  activeHrs: { type: Number, required: true },
  passiveHrs: { type: Number, required: true },
});

const hoursTrackerDB = mongoose.model("hoursTrackerDB", hours);

module.exports = hoursTrackerDB;
