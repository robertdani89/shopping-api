const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//Register
router.post("/register", async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString(),
  });

  try {
    const saved = await newUser.save();
    res.status(201).json(saved);
  } catch (e) {
    console.error(e);
    res.status(500).json(e);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username,
    });
    if (!user) {
      res.status(401).json("Wrong credentials!");
      return;
    }

    const hash = CryptoJS.AES.decrypt(user.password, process.env.PASS_SECRET);
    const originalPassword = hash.toString(CryptoJS.enc.Utf8);
    if (originalPassword !== req.body.password) {
      res.status(401).json("Wrong credentials!");
      return;
    }

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
