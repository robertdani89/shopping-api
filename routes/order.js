const router = require("express").Router();
const Order = require("../models/order");
const {
  verifyTokenAndAuthorization,
  verifyToken,
  verifyTokenAndAdmin,
} = require("./verify-token");

// Create
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Delete
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findOneAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get user orders
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.findOne({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Monthly income

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: previousMonth } } },
      {
        $project: {
          month: { $month: "createdAt" },
        },
        sales: "$amount",
      },
      {
        $group: {
          _id: "$month",
          total: {
            $sum: "$sales",
          },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
