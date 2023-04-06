const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  phoneno: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  latest_accuracy: {
    type: Number,
  },
  prev_accuracy: [
    {
      type: Number,
    },
  ],
  session_started: {
    type: Boolean,
    default: false,
  },
  token: {
    type: String,
  },
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();
    return token;
  } catch (err) {
    console.log(err);
  }
};

const user = mongoose.model("User", userSchema);
module.exports = user;
