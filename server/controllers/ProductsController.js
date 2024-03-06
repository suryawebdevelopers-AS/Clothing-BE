// controllers/productController.js
import Product from "../models/Products.js";
import multer from "multer";

// Set up multer for parsing multipart/form-data
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Set the destination folder for file uploads
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name for storing
  },
});

const upload = multer({ storage: storage });

// Create a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      sizes,
      color,
      description,
      fabric,
      fit,
      washcare,
      category,
      subCategory,
    } = req.body;

    const images = {
      image1: req.files["image1"] ? req.files["image1"][0].filename : undefined,
      image2: req.files["image2"] ? req.files["image2"][0].filename : undefined,
      image3: req.files["image3"] ? req.files["image3"][0].filename : undefined,
      image4: req.files["image4"] ? req.files["image4"][0].filename : undefined,
    };

    const product = new Product({
      name,
      price,
      sizes,
      color,
      description,
      fabric,
      fit,
      washcare,
      category,
      subCategory,
      ...images,
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Error creating product" });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().lean();

    // Convert image buffers to Base64 for each product
    const productsWithBase64Images = products.map((product) => {
      const productWithBase64Images = { ...product };
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        if (product[fieldName]) {
          productWithBase64Images[fieldName] =
            product[fieldName].toString("base64");
        }
      }
      return productWithBase64Images;
    });

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
