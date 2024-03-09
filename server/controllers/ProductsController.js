import Product from "../models/Products.js";
import multer from "multer";
import { Binary } from "mongodb";
// Set up multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any(); // Use .any() to handle any type of file

export const createProduct = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        console.error("Error uploading files:", err.message);
        return res.status(500).json({ error: "Error uploading files" });
      }

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      const {
        productName,
        price,
        selectedSizes,
        color,
        description,
        fabric,
        fit,
        washCare,
        category,
        subCategory,
      } = req.body;

      const images = {};
      for (let i = 1; i <= 4; i++) {
        const fieldName = `image${i}`;
        const file = req.files.find((file) => file.fieldname === fieldName);

        if (file) {
          // Remove the base64 prefix (e.g., 'data:image/jpeg;base64,')
          const base64DataWithoutPrefix = file.buffer
            .toString("base64")
            .replace(/^data:image\/\w+;base64,/, "");

          // Save the image data as Binary
          images[fieldName] = Binary.createFromBase64(base64DataWithoutPrefix);
        }
      }

      const product = new Product({
        productName,
        price,
        selectedSizes,
        color,
        description,
        fabric,
        fit,
        washCare,
        category,
        subCategory,
        ...images,
      });

      await product.save();
      res.status(201).json(product);
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Error creating product" });
  }
};

// Get all products
// Import your Product model and other necessary modules

export const getAllProducts = async (req, res) => {
  try {
    // Fetch all products from the database
    const products = await Product.find();

    // Check if there are any products
    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    // Convert buffer to base64 for each image field in each product
    const productsWithBase64Images = products.map((product) => {
      return {
        ...product._doc,
        image1: product.image1 ? bufferToBase64(product.image1.buffer) : null,
        image2: product.image2 ? bufferToBase64(product.image2.buffer) : null,
        image3: product.image3 ? bufferToBase64(product.image3.buffer) : null,
        image4: product.image4 ? bufferToBase64(product.image4.buffer) : null,
      };
    });

    // Return the list of products with base64 images
    res.status(200).json(productsWithBase64Images);
  } catch (error) {
    console.error("Error getting all products:", error.message);
    res.status(500).json({ error: "Error getting all products" });
  }
};

// Get a single product by ID
const bufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

// ...

// Get a single product by ID with base64 images
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Convert buffer to base64 for each image field
    const productWithBase64Images = {
      ...product._doc,
      image1: product.image1 ? bufferToBase64(product.image1.buffer) : null,
      image2: product.image2 ? bufferToBase64(product.image2.buffer) : null,
      image3: product.image3 ? bufferToBase64(product.image3.buffer) : null,
      image4: product.image4 ? bufferToBase64(product.image4.buffer) : null,
    };

    res.status(200).json(productWithBase64Images);
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
