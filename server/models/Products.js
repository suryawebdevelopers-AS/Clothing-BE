const mongoose = require("mongoose"); // Assuming Mongoose is imported

const productSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0.01 },
  selectedSizes: { type: [String], required: true },
  color: { type: String, required: true },
  description: { type: String, required: true },
  fabric: { type: String, required: true },
  fit: { type: String, required: true },
  washCare: { type: String, required: true },
  image1: { type: mongoose.Schema.Types.Buffer, required: true },
  image2: { type: mongoose.Schema.Types.Buffer, required: true },
  image3: { type: mongoose.Schema.Types.Buffer, required: true },
  image4: { type: mongoose.Schema.Types.Buffer, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
});

module.exports = mongoose.model("Product", productSchema); // Export the model
