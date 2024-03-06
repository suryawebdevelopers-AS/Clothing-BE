// models/Products.js
import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  sizes: { type: [String], required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  fabric: { type: String, required: true },
  fit: { type: String, required: true },
  washcare: { type: String, required: true },
  image1: { type: Buffer, required: true },
  image2: { type: Buffer, required: true },
  image3: { type: Buffer, required: true },
  image4: { type: Buffer, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
