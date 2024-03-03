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
  image1: String,
  image2: String,
  image3: String,
  image4: String,
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
