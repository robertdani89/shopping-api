const router = require("express").Router();
const User = require("../models/User");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verify-token");

//Update
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (!req.user.isAdmin && req.body.isAdmin) {
    res.status(403).json("You are not allowed to do that.");
    return;
  }

  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SECRET
    ).toString();
  }

  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    const { password, ...other } = updated._doc;

    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findOneAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get user
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...other } = user._doc;
    res.status(200).json(other);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get all user
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    const proper = users.map((user) => {
      const { password, ...other } = user._doc;
      return other;
    });
    res.status(200).json(proper);
  } catch (e) {
    res.status(500).json(e);
  }
});

//Get user start
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      { $project: { month: { $month: "$createdAt" } } },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
