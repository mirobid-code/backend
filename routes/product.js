const express = require('express');
const router = express.Router();
const Product = require('../model/product');
const upload = require('../multer');

router.post('/', upload.single('image'), async (req, res) => {
  const { name, category, weight, price, description } = req.body;
  const image = `/uploads/${req.file.filename}`;

  try {
    const product = new Product({
      name,
      category,
      weight,
      price,
      description,
      image,
    });

    await product.save();
    res.status(201).json(product);
  } catch (e) {
    res.status(400).send(e);
  }
});
router.get('/', async (req, res) => {
  const { name, minPrice, maxPrice, category, weight, price, description, image, page = 1, limit = 6 } = req.query;

  let filter = {};
  if (name) filter.name = name;
  if (category && category !== "all") filter.category = category;
  if (weight) filter.weight = weight;
  if (price) filter.price = price;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  try {
    const products = await Product.find(filter)
      .populate('category', 'name')
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    res.status(200).json({ products });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});



router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id).populate('category', 'name').exec();
    res.status(200).json(product);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}); 


router.put('/:id', upload.single('image'), async (req, res) => {
  const { id } = req.params;
  const { name, category, weight, price, description } = req.body;
  const image = `/uploads/${req.file.filename}`;

  try {
    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        category,
        weight,
        price,
        description,
        image,
      },
      { new: true }
    ).exec();
    const totalCount = await Product.countDocuments(filter);
    res.status(200).json(product, totalCount);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Product.findByIdAndDelete(id).exec();
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});





module.exports = router;
