const Users = require('../models/User');

module.exports.getFrequency = async (req, res) => {
    let response = {
        success: false,
        message: "",
        errMessage: "",
        data: [],
    }
    try {
        const { id } = req.params;
        
        const user = await Users.findOne({_id : id});
        console.log(user);
        if (!user) {
            response.errMessage = "User not found";
            res.status(404).json(response);
        }
        const { latest_score } = user;
        let score = [];
        for (let i = 0; i < latest_score.length; i++) {
            score.push(latest_score[i][2]);
        }

        // frequency of each score
        let frequency = {1:0, 2:0, 3:0, 4:0, 5:0};
        for (let i = 0; i < score.length; i++) {
            frequency[score[i]]++;
        }

        response.success = true;
        response.message = "Frequency fetched successfully";
        response.data = [frequency];
        res.status(200).json(response);
    } catch (err) {
        response.errMessage = err.message;
        res.status(500).json(response);
    }
}

module.exports.getAccuracy = async (req, res) => {
    let response = {
        success: false,
        message: "",
        errMessage: "",
        data: [],
        accuracy: 0,
    }
    try {
        const { id } = req.params;
        const user = await Users.findOne({_id : id});
        if (!user) {
            response.errMessage = "User not found";
            res.status(404).json(response);
        }
        const { prev_accuracy, latest_accuracy } = user;
        response.success = true;
        response.message = "Accuracies fetched successfully";
        response.data = prev_accuracy;
        response.accuracy = latest_accuracy;
        res.status(200).json(response);
    } catch (err) {
        response.errMessage = err.message;
        res.status(500).json(response);
    }
}