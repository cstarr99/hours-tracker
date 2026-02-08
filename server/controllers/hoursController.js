const hoursTrackerDB = require("../db");

//get all hour logs and display it
exports.getAllHours = async (req, res) => {
  try {
    const allHours = await hoursTrackerDB.find();
    res.status(200).json({
      status: "success",
      results: allHours.length,
      data: {
        allHours,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//create a new hour log
exports.createHourLog = async (req, res) => {
  try {
    const newHourLog = await hoursTrackerDB.create({
      date: req.body.date.slice(0, 10),
      activeHrs: req.body.activeHrs,
      passiveHrs: req.body.passiveHrs,
    });
    res.status(201).json({
      status: "success",
      data: {
        hourLog: newHourLog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//delete a hour log
exports.deleteHourLog = async (req, res) => {
  try {
    await hoursTrackerDB.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};

//update a hour log
exports.updateHourLog = async (req, res) => {
  try {
    const updatedHourLog = await hoursTrackerDB.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        date: req.body.date?.slice(0, 10), // optional, keep as YYYY-MM-DD
      },
      { new: true, runValidators: true }
    );
    res.status(201).json({
      status: "success",
      data: {
        hourLog: updatedHourLog,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err,
    });
  }
};
