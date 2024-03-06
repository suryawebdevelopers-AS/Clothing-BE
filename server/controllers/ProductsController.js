// controllers/productController.js
import Product from "../models/Products.js";

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Convert image buffers to Base64
    const productsWithBase64Images = products.map((product) => ({
      ...product,
      image1: product.image1.toString("base64"),
      image2: product.image2.toString("base64"),
      image3: product.image3.toString("base64"),
      image4: product.image4.toString("base64"),
    }));

    res.status(200).json(productsWithBase64Images);
  } catch (error) {
    res.status(500).json({ error: "Error fetching products" });
  }
};

// Get a single product by ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error fetching product" });
  }
};

// Update a product by ID
export const updateProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Error updating product" });
  }
};

// Delete a product by ID
export const deleteProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findByIdAndRemove(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: "Error deleting product" });
  }
};
