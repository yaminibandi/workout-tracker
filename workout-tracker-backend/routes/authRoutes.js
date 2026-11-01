const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body; // Get user input
    // Validate user input
    if (!(email && password && name)) {
      res.status(400).send("All input is required");
    }
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }
    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);
    // Create user in our database
    const user = await User.create({
      name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });
    const savedUser = await user.save();
    // Create token
    const token = jwt.sign(
      { userId: user._id, email },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    // return new user
    res.status(201).json({ user: savedUser, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { userId: user._id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2h",
        },
      );

      // user
      res.status(200).json({ user, token });
    } else {
      res.status(400).send("User not present or Invalid Credentials");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
