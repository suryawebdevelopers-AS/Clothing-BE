// models/Products.js
import { Schema, model } from "mongoose";

const productSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  selectedSizes: [String],
  color: String,
  description: String,
  fabric: String,
  fit: String,
  washCare: String,
  image1: { type: String }, // Change type to String
  image2: { type: String }, // Change type to String
  image3: { type: String }, // Change type to String
  image4: { type: String }, // Change type to String
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
