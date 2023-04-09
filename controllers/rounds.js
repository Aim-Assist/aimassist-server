const Round = require("../models/Round");
const tf = require("@tensorflow/tfjs");

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
    console.log(scores);
    console.log(previousData);

    const latestData = [
      [30, 10, 4],
      [30, 10, 3],
      [60, 10, 3],
      [60, 10, 2],
      [90, 10, 2],
      [90, 10, 5],
      [120, 10, 1],
      [120, 10, 5],
      [150, 10, 4],
      [150, 10, 1],
    ];

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

    // Define the model architecture
    // const model = tf.sequential();
    // model.add(
    //   tf.layers.dense({ units: 10, activation: "relu", inputShape: [10, 3] })
    // );
    // model.add(tf.layers.flatten());
    // model.add(tf.layers.dense({ units: 5, activation: "softmax" }));

    // // Compile the model
    // model.compile({
    //   optimizer: tf.train.adam(),
    //   loss: "categoricalCrossentropy",
    //   metrics: ["accuracy"],
    // });

    // // Preprocess the data
    // const X_train = preprocessData(trainData);
    // const y_train = preprocessLabels(trainLabels);
    // const X_test = preprocessData(testData);
    // const y_test = preprocessLabels(testLabels);

    // // Train the model
    // const history = await model.fit(X_train, y_train, {
    //   epochs: 50,
    //   validationData: [X_test, y_test],
    // });

    // // Use the model to make predictions
    // const predictions = model.predict(X_test);
    // const predictedLabels = postprocessLabels(predictions);

    // // Evaluate the model
    // const [testLoss, testAcc] = model.evaluate(X_test, y_test);

    // console.log("Test loss:", testLoss.toFixed(4));
    // console.log("Test accuracy:", testAcc.toFixed(4));

    // // Determine which angles the user is good at and which angles they need to improve on
    // const goodAngles = [];
    // const improveAngles = [];

    // for (let i = 0; i < predictedLabels.length; i++) {
    //   const predictedLabel = predictedLabels[i];
    //   const actualLabel = testLabels[i];
    //   const angle = actualLabel[0];
    //   const points = actualLabel[2];

    //   if (predictedLabel === points) {
    //     goodAngles.push(angle);
    //   } else {
    //     improveAngles.push(angle);
    //   }
    // }

    // console.log("User is good at angles:", goodAngles);
    // console.log("User needs to improve on angles:", improveAngles);

    // const inputShape = [3]; // three features: angle, distance, and points scored
    // const outputShape = [5]; // five classes: 30deg, 60deg, 90deg, 120deg, 150deg

    // Define the architecture of the neural network
    // const model = tf.sequential();
    // model.add(tf.layers.dense({ units: 10, activation: "relu" }));
    // model.add(tf.layers.dense({ units: 5, activation: "softmax" }));

    // // Compile the model with an appropriate loss function and optimizer
    // model.compile({ loss: "categoricalCrossentropy", optimizer: "adam" });

    // const xTrain = tf.tensor3d(
    //   [...previousData, ...scores].map(([angle, distance, points]) => [
    //     angle,
    //     distance,
    //     points,
    //   ])
    // );
    // const yTrain = tf.oneHot(
    //   tf.tensor1d(
    //     [
    //       ...Array(previousData.length).fill(0),
    //       ...Array(scores.length).fill(1),
    //     ].map((_, i) => i % 10)
    //   ).toInt(),
    //   5
    // );

    // model.fit(xTrain, yTrain, { epochs: 50 }).then(() => {
    //   // Use the model to make predictions on the latest data
    //   const xTest = tf.tensor2d(
    //     scores.map(([angle, distance, points]) => [angle, distance, points])
    //   );
    //   const yTest = model.predict(xTest);
    //   const predictedAngles = yTest.argMax(1).arraySync();

    //   // Analyze the predictions to determine which angles the user is good at
    //   // and which angles they need to improve on
    //   const angleCounts = [0, 0, 0, 0, 0];
    //   predictedAngles.forEach((angle) => angleCounts[angle]++);
    //   const bestAngle = predictedAngles[0];
    //   const worstAngle = angleCounts.indexOf(Math.min(...angleCounts)) * 30 + 30;

    //   console.log(
    //     `The user is best at ${bestAngle}deg and needs to improve at ${worstAngle}deg.`
    //   );
    // });

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
