const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

userSchema.pre("save", async function (next) {
  var user = this;
  if (this.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

userSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id, email: this.email, name: this.name }, process.env.JWT_KEY);
    return token;
  } catch (err) {
    console.log(err);
  }
};

const user = mongoose.model("User", userSchema);
module.exports = user;
