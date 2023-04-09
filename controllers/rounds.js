const Round = require("../models/Round");

module.exports.postRoundData = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };
  const { scores, userId } = req.body;
  if (scores.length < 10) {
    return res.status(422).json({ message: "Please enter 10 scores" });
  }
  try {
    const newRound = new Round({
      scores,
      userId,
    });
    await newRound.save();
    response.success = true;
    response.message = "Round data saved successfully";
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = err.message;
    res.status(500).json(response);
  }
};

module.exports.getAllRoundData = async (req, res) => {
    let response = {
        success: false,
        message: "",
        errMessage: "",
        data: [],
    };
    try {
        const roundData = await Round.find().sort({ createdAt: -1 });
        response.success = true;
        response.message = "Round data fetched successfully";
        response.data = roundData;
        res.status(200).json(response);
    } catch (err) {
        console.log(err);
        response.errMessage = err.message;
        res.status(500).json(response);
    }
};

// module.exports.getAllScores = async (req, res) => {
//   try {
//     const roundData = await Round.find().sort({ createdAt: -1 });
//     const scores = roundData.map((data) => data.scores);
//     res.status(200).json({ scores });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };