const Round_Model = require('../models/Round');

const postRoundData = async (req, res) => {

    const dataSend = req.body;

    const newData = new Round_Model(dataSend);
        newData
            .save()
            .then((data) => {
                console.log(data)
                res.status(200).json({status: true, data});
            })
            .catch((err) => console.log(err));

}

const getAllRoundData = async (req, res) => {
    Round_Model.find().sort({ createdAt: -1 })
        .then((data) => {
            res.status(200).json({ status: true, data });
        })
        .catch((err) => console.log(err));
}

const getAllScores = async (req, res) => {
    try {
        const roundData = await Round_Model.find().sort({ createdAt: -1 });
        const scores = roundData.map(data => data.scores);
        res.status(200).json({ scores });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}


module.exports = {
    postRoundData,
    getAllRoundData,
    getAllScores
}