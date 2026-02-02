const hoursTrackerDB = require("../db");

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
