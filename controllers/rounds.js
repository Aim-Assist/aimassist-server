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

const getRoundData = 

module.exports = {
    postRoundData,
    getAllRoundData
}