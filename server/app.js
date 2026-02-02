const express = require("express");
const cors = require("cors");
const hoursRouter = require("./routers/hoursRouter");

const app = express();
app.use(cors());
app.use(express.json());

// app.post("/api/hours", async (req, res) => {
//   const newLog = await hoursTrackerDB.create({
//     date: req.body.hi,
//     hoursWorked: req.body.hours,
//   });
//   res.status(201).json({
//     message: "Hours logged successfully",
//     data: newLog,
//   });
// });

app.use("/api/hours", hoursRouter);

module.exports = app;
