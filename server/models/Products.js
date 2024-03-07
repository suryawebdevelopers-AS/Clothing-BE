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
  image1: { type: Buffer }, // Change type to Buffer
  image2: { type: Buffer }, // Change type to Buffer
  image3: { type: Buffer }, // Change type to Buffer
  image4: { type: Buffer }, // Change type to Buffer
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

const Product = model("Product", productSchema);

export default Product;
