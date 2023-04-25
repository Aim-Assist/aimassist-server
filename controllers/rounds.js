const Round = require("../models/Round");
const User = require("../models/User");
const tf = require("@tensorflow/tfjs");
const nj = require("numjs");

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

    // Find frequency of scores
    let frequency = {1: 0,2: 0, 3: 0, 4: 0, 5: 0};
    for (let i = 0; i < scores.length; i++) {
      frequency[scores[i][2]] += 1;
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

    let index = avgs.indexOf(avg) + 1;
    let percentile = (index / avgs.length) * 100;

    let latest_point = {};
    for (let i = 0; i < scores.length; i++) {
      let angle = scores[i][0];
      let points = scores[i][2];
      if (angle in latest_point) {
        latest_point[angle].push(points);
      } else {
        latest_point[angle] = [points];
      }
    }

    let previous_points = [];
    for (let i = 0; i < previousData.length; i++) {
      let user_points = {};
      for (let j = 0; j < previousData[i].length; j++) {
        let angle = previousData[i][j][0];
        let points = previousData[i][j][2];
        if (angle in user_points) {
          user_points[angle].push(points);
        } else {
          user_points[angle] = [points];
        }
      }
      previous_points.push(user_points);
    }

    average_points = {};
    for (let i = 0; i < previous_points.length; i++) {
      // get angle and points
      for (angle in previous_points[i]) {
        average_points[angle] =
          previous_points[i][angle].reduce((a, b) => a + b, 0) /
          previous_points[i][angle].length;
      }
    }

    let good_angles = [];
    let improve_angles = [];
    latest_angle_avg = {};
    for (const [angle, points] of Object.entries(latest_point)) {
      if (angle in average_points) {
        const avg_points_score = average_points[angle];
        const latest_points_score =
          points.reduce((a, b) => a + b, 0) / points.length;
        latest_angle_avg[angle] = latest_points_score;
        if (latest_points_score > avg_points_score) {
          good_angles.push(angle);
        } else {
          improve_angles.push(angle);
        }
      } else {
        good_angles.push(angle);
      }
    }

    let best_angle = 0;
    if (good_angles.length <= 0) {
      best_angle = null;
    } else {
      // best_angle = nj.max(good_angles, (key = average_points[angle]));
      best_angle = good_angles.reduce((prevAngle, currAngle) => {
        const prevPoints = average_points[prevAngle] || 0;
        const currPoints = average_points[currAngle] || 0;
        return currPoints > prevPoints ? currAngle : prevAngle;
      });
    }

    let improve_angle = 0;
    if (improve_angles.length <= 0) {
      improve_angle = null;
    } else {
      // improve_angle = nj.max(improve_angles, (key = average_points[angle]));
      improve_angle = improve_angles.reduce((maxAngle, angle) => {
        const maxPoints = average_points[maxAngle] || 0;
        const currPoints = average_points[angle] || 0;
        return currPoints > maxPoints ? angle : maxAngle;
      });
    }

    angle_labels1 = {
      30: "Angle 1",
      60: "Angle 2",
      90: "Angle 3",
      120: "Angle 4",
      150: "Angle 5",
    };

    angle_labels = [
      "Angle 30Deg",
      "Angle 60Deg",
      "Angle 90Deg",
      "Angle 120Deg",
      "Angle 150Deg",
    ];

    const model = tf.sequential();
    model.add(
      tf.layers.dense({ inputShape: [5], units: 16, activation: "relu" })
    );
    model.add(tf.layers.dense({ units: 5, activation: "softmax" }));
    model.compile({
      optimizer: "adam",
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });
    let good_angles_one_hot = [[0, 0, 0, 0, 0]];
    let label = Object.keys(angle_labels1);

    for (let i = 0; i < label.length; i++) {
      if (good_angles.includes(label[i])) {
        good_angles_one_hot[0][i] = 1;
      }
    }

    const input = tf.tensor(good_angles_one_hot, [1, 5]);
    let predicted_labels = model.predict(input);

    const argmax_tensor = tf.argMax(predicted_labels, 1);
    const argmin_tensor = tf.argMin(predicted_labels, 1);

    let best = label[argmax_tensor.dataSync()[0]];
    let worst = label[argmin_tensor.dataSync()[0]];

    if (best !== best_angle || good_angles.length < 0) {
      best = Object.keys(latest_angle_avg).reduce((a, b) =>
        latest_angle_avg[a] > latest_angle_avg[b] ? a : b
      );
    }

    if (worst !== improve_angle || improve_angles.length < 0) {
      worst = Object.keys(latest_angle_avg).reduce((a, b) =>
        latest_angle_avg[a] < latest_angle_avg[b] ? a : b
      );
    }

    const latestRoundData = {
      accuracy: percentile,
      distance: scores[0][1],
      bestangle: best,
      worstangle: worst,
    };

    const newRound = new Round({
      scores,
      userId,
      roundData: latestRoundData,
      frequency: frequency,
      email
    });
    await newRound.save();

    await User.findOneAndUpdate(
      { email, email },
      {
        $set: {
          latest_accuracy: percentile,
          latest_score: scores,
          latestroundData: latestRoundData,
          latestfrequency: frequency,
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

module.exports.getUserRounds = async (req, res) => {
  let response = {
    success: false,
    message: "",
    errMessage: "",
    data: [],
  };
  try {
    const userId = req.params.id;
    const roundData = await Round.find({ userId : userId }).sort({ createdAt: -1 });
    response.success = true;
    response.message = "Round data fetched successfully";
    response.data = roundData;
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    response.errMessage = err.message;
    res.status(500).json(response);
  }
}

    // // predict the best angle
    // // let predict = [];
    // // predict.push(good_angles_one_hot.selection.data);
    // // console.log(predict);
    // let predicted_labels;
    // if (
    //   good_angles_one_hot.selection &&
    //   good_angles_one_hot.selection.data &&
    //   good_angles_one_hot.selection.data.length > 0
    // ) {
    //   console.log("Predicting");
    //   predicted_labels = model.predict(input);
    // }
    // console.log(predicted_labels);
    // const argmin_tensor = predicted_labels.argMax();
    // console.log(argmin_tensor);
    // console.log(argmin_tensor.dataSync());
    // predicted_label = angle_labels[nj.argmax(predicted_labels)];
    // console.log("Predicted label: {}".format(predicted_label));

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