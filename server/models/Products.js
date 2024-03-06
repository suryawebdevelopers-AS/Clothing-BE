// models/Products.js
import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: [String],
  color: String,
  description: String,
  fabric: String,
  fit: String,
  washcare: String,
  image1: { type: Buffer },
  image2: { type: Buffer },
  image3: { type: Buffer },
  image4: { type: Buffer },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
