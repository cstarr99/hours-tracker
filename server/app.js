const express = require("express");
const cors = require("cors");
const hoursRouter = require("./routers/hoursRouter");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/hours", hoursRouter);

module.exports = app;
