const router = require("express").Router();
const Cart = require("../models/Cart");
const { verifyTokenAndAuthorization, verifyToken } = require("./verify-token");

// Create
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updated = await Cart.findByIdAndUpdate(
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
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Cart.findOneAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get user cart
router.get("/find/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).json(carts);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
