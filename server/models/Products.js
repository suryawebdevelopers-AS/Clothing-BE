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
  image1: Buffer,
  image2: Buffer,
  image3: Buffer,
  image4: Buffer,
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
