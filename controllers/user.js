const User = require("../models/User");

module.exports.register = async (req, res) => {
    const response = {
      success: true,
      message: "",
      errMessage: "",
    };
    const { name, email, password, phoneno } = req.body;
    if (!name || !email || !password || !phoneno) {
      return res.status(422).json({ message: "Please fill all the fields" });
    }
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        return res.json({ message: "User already exists" }).status(200);
    }
    if(phoneno.length != 10){
        return res.json({ message: "Enter Proper Phone No." }).status(200);
    }
      const newUser = new User({
        name,
        email,
        password,
        phoneno,
      });
      await newUser.save();
      response.success = true;
      response.message = "User created successfully";
      res.status(200).json(response);
    } catch (err) {
      console.log(err);
    }
  };

  module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    let token = "";
    if (!email || !password) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }
    try {
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      } else {
        const isMatch = await bcrypt.compare(password, user.password);
        token = await user.generateAuthToken();
        const maxAge = 1000 * 60;
        res.cookie("jwttoken", token, {
          httpOnly: true,
          secure: true,
          expires: maxAge,
          maxAge: maxAge * 1000,
        });
  
        if (!isMatch) {
          return res.status(400).json({ message: "Invalid Credentials" });
        } else {
          res.json({ message: "Login Successful" });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };
  