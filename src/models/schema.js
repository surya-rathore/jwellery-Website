// schema.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    ring: [{
        img: { type: String, required: true }
    }],
    gift: [{
        img: { type: String, required: true }
    }]
});

const Product = new mongoose.model("Product", productSchema);
module.exports = Product;
