const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    category: { type: mongoose.Schema.Types.ObjectId,
         ref: 'Category',
          required: true },
    weight: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;