const Round = require("../models/Round");
const User = require("../models/User");
const tf = require("@tensorflow/tfjs");

module.exports.postRoundData = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
  };

  const { scores, userId, email } = req.body;
  if (scores.length < 10) {
    return res.status(422).json({ message: "Please enter 10 scores" });
  }
  try {
    const roundData = await Round.find().sort({ createdAt: -1 });

    let score = [];
    let previousData = [];
    for (let i = 0; i < roundData.length; i++) {
      let data = [];
      previousData.push(roundData[i]["scores"]);
      for (let j = 0; j < roundData[i].scores.length; j++) {
        data.push(roundData[i].scores[j][2]);
        if (data.length === 10) {
          score.push(data);
        }
      }
    }

    let onlyScores = [];
    let avgs = [];
    let latest_scores = [];
    for (let i = 0; i < previousData.length; i++) {
      score = [];
      for (let j = 0; j < previousData[i].length; j++) {
        score.push(previousData[i][j][2]);
        if (score.length === 10) {
          onlyScores.push(score);
        }
      }
    }

    for (let i = 0; i < onlyScores.length; i++) {
      if (onlyScores[i].length === 10) {
        avgs.push(
          onlyScores[i].reduce((a, b) => a + b, 0) / onlyScores[i].length
        );
      }
    }

    for (let i = 0; i < scores.length; i++) {
      latest_scores.push(scores[i][2]);
    }

    let avg = latest_scores.reduce((a, b) => a + b, 0) / latest_scores.length;
    avgs.push(avg);

    // sort the array
    avgs.sort((a, b) => a - b);
    console.log(avg, avgs);

    let index = avgs.indexOf(avg) + 1;
    let percentile = (index / avgs.length) * 100;

    // Flatten the previous data into a single array
    // const model = tf.sequential();
    // model.add(
    //   tf.layers.dense({ inputShape: [10, 3], units: 16, activation: "relu" })
    // );
    // model.add(tf.layers.flatten());
    // model.add(tf.layers.dense({ units: 6, activation: "softmax" }));
    // model.compile({
    //   optimizer: "adam",
    //   loss: "categoricalCrossentropy",
    //   metrics: ["accuracy"],
    // });

    // const oneHot = [
    //   [1, 0, 0, 0, 0],
    //   [0, 1, 0, 0, 0],
    //   [0, 0, 1, 0, 0],
    //   [0, 0, 0, 1, 0],
    //   [0, 0, 0, 0, 1],
    // ];
    // // Convert previous data to TensorFlow tensors
    // const previousDataTensor = tf.tensor3d(previousData);

    // // Generate labels for the previous data
    // const previousLabels = [];
    // for (let i = 0; i < previousData.length; i++) {
    //   const userPreviousData = previousData[i];
    //   const userPreviousLabels = [];
    //   for (let j = 0; j < userPreviousData.length; j++) {
    //     const angle = userPreviousData[j][0];
    //     const label = Array(6).fill(0);
    //     label[angle / 30 - 1] = 1;
    //     userPreviousLabels.push(label);
    //   }
    //   previousLabels.push(userPreviousLabels);
    // }

    // // Flatten and normalize the data
    // const flattenedData = scores.flat().map((x) => x / 10);
    // const flattenedDataTensor = tf.tensor2d([flattenedData]);
    // const normalizedDataTensor = tf.sub(
    //   flattenedDataTensor,
    //   tf.mean(flattenedDataTensor)
    // );
    // // .div(tf.std(flattenedDataTensor));

    // // Predict the label for the latest data
    // const latestPredictionsTensor = model.predict(
    //   normalizedDataTensor.reshape([1, 10, 3])
    // );
    // const latestPredictions = latestPredictionsTensor.dataSync();

    // // Print the predicted labels
    // console.log("Predicted labels for the latest data:");
    // console.log(latestPredictions);

    // // Convert the predictions to an array of tuples with the angle and the predicted score
    // const angleScores = [];
    // for (let i = 0; i < latestPredictions.length - 1; i++) {
    //   angleScores.push([i * 30 + 30, latestPredictions[i]]);
    // }

    // // Sort the angles by predicted score in descending order
    // angleScores.sort((a, b) => b[1] - a[1]);

    // // Print the angles by predicted score
    // console.log("Angles by predicted score:");
    // console.log(angleScores);

    // // Print the angle to improve
    // const angleToImprove = angleScores[0][0];
    // console.log(`Angle to improve: ${angleToImprove}`);

    // // print the angle which is the best
    // const angleBest = angleScores[4][0];
    // console.log(`Angle best: ${angleBest}`);

    // // Print the user's proficiency at the angles
    // const proficiency = {};
    // for (let i = 0; i < 5; i++) {
    //   proficiency[(i + 1) * 30] = latestPredictions[i];
    // }
    // console.log("Proficiency at the angles:");
    // console.log(proficiency);

    const newRound = new Round({
      scores,
      userId,
      email
    });
    await newRound.save();

    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          latest_accuracy: percentile,
          latest_score: scores,
        },
        $push: {
          prev_accuracy: percentile,
        },
      },
      { new: true }
    );
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

// [
//   [30, 10, 2],
//   [30, 10, 2],
//   [60, 10, 3],
//   [60, 10, 5],
//   [90, 10, 3],
//   [90, 10, 4],
//   [120, 10, 4],
//   [120, 10, 3],
//   [150, 10, 5],
//   [150, 10, 3]
// ]

// 6431ad39a9b0891674d62703
// 6431b5665d2f022b78b4845a
// 6432a73e4101583ff0d1b61e
// 6432a7824101583ff0d1b622
// 6432a7994101583ff0d1b625
// 6432a7a64101583ff0d1b628
