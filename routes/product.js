const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyTokenAndAdmin,
} = require("./verify-token");

// Create
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
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
    await Product.findOneAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get product
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get all products
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({ categories: { $in: [qCategory] } });
    } else {
        products = await Product.find();
    }

    res.status(200).json(products);
  } catch (e) {
    res.status(500).json(e);
  }
});

module.exports = router;
