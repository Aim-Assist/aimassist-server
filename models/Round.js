const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  scores: {
    type: Array,
    required: true
  },
  CreatedAt: {
    type: Date,
    default: Date.now
  },
});
const round = mongoose.model("round", roundSchema);
module.exports = round;
