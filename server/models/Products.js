import { Schema, model } from "mongoose"; // Assuming Mongoose is imported

const productSchema = new Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0.01 },
  selectedSizes: { type: [String], required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  fabric: { type: String, required: true },
  fit: { type: String, required: true },
  washCare: { type: String, required: true },
  image1: { type: Schema.Types.Buffer, required: true },
  image2: { type: Schema.Types.Buffer, required: true },
  image3: { type: Schema.Types.Buffer, required: true },
  image4: { type: Schema.Types.Buffer, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

export default model("Product", productSchema); // Export the model
