const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const { check, validationResult } = require("express-validator");

// Input validation middleware
const validateRegisterInput = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Invalid email format"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

// REGISTER ==================================================

router.post("/register", validateRegisterInput, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(2);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// LOGIN==================================================

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json("USER NOT FOUND");
    }
    const match = await bcrypt.compare(req.body.password, user.password);

    if (!match) {
      return res.status(401).json("wrong credentials");
    }
    const token = jwt.sign(
      { _id: user._id, username: user.name, email: user.email },
      process.env.SECRET,
      {
        expiresIn: "1d",
      }
    );
    const { password, ...info } = user._doc;
    res.cookie("token", token).status(200).json(info);
    console.log(token);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// LOGout==================================================

router.get("/logout", async (req, res) => {
  try {
    res
      .clearCookie("token", { sameSite: "none", secure: true })
      .status(200)
      .send("User logged out sucessfully....!");
  } catch (error) {
    return res.status(500).json({ error: err.message });
  }
});

/* REFRESH */

router.get("/refetch", (req, res) => {
  const token = req.cookies.token;
  jwt.verify(token, process.env.SECRET, {}, async (err, data) => {
    if (err) {
      return res.status(404).json(err);
    }
    res.status(200).json(data);
  });
});

module.exports = router;
