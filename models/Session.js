const mongoose = require('mongoose');

const SessionSchema = new mongoose.Schema({
    userid : {
        type: String,
    },
    distance : {
        type: Number,
    },
    session_started : {
        type: Boolean,
        default: false,
    },
    email : {
        type: String,
    }
})

module.exports = mongoose.model('Session', SessionSchema);