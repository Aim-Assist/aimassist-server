const mongoose = require("mongoose");

const roundSchema = new mongoose.Schema({
  scores: [
    {
      type: Array,
      required: true,
    }
  ],
  // userId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "User",
  // },
  userId: {
    type: String,
  },
  roundData: {
    accuracy: {
      type: Number,
    },
    distance: {
      type: Number,
    },
    bestangle: {
      type: Number,
    },
    worstangle: {
      type: Number,
    }
  },
  frequency: {
    type: Object,
  },
  CreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const round = mongoose.model("round", roundSchema);
module.exports = round;
