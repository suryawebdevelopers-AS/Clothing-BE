import Product from "../models/Products.js";
import multer from "multer";
import { Binary } from "mongodb";

// Set up multer for parsing multipart/form-data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).any(); // Use .any() to handle any type of file

// Utility function to convert buffer to base64
const bufferToBase64 = (buffer) => {
  // Check if the input is already a base64 string
  if (typeof buffer === "string") {
    console.log("Input is already a base64 string:", buffer);
    return buffer;
  }

  // If not, proceed with the conversion
  const base64String = buffer.toString("base64");
  console.log("Buffer converted to base64:", base64String);
  return base64String;
};

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
      console.log("Product created successfully:", product);
      res.status(201).json(product);
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({ error: "Error creating product" });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }

    const productsWithBase64Images = products.map((product) => {
      return {
        ...product._doc,
        image1: bufferToBase64(product.image1),
        image2: bufferToBase64(product.image2),
        image3: bufferToBase64(product.image3),
        image4: bufferToBase64(product.image4),
      };
    });

    console.log(
      "Products fetched successfully with base64 images:",
      productsWithBase64Images
    );
    res.status(200).json(productsWithBase64Images);
  } catch (error) {
    console.error("Error getting all products:", error.message);
    res.status(500).json({ error: "Error getting all products" });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productWithBase64Images = {
      ...product._doc,
      image1: bufferToBase64(product.image1),
      image2: bufferToBase64(product.image2),
      image3: bufferToBase64(product.image3),
      image4: bufferToBase64(product.image4),
    };

    console.log(
      "Product fetched successfully by ID with base64 images:",
      productWithBase64Images
    );
    res.status(200).json(productWithBase64Images);
  } catch (error) {
    console.error("Error fetching product:", error.message);
    res.status(500).json({ error: "Error fetching product" });
  }
};

export const updateProductField = async (req, res) => {
  try {
    const { productId } = req.params;
    const { field, value } = req.body; // field and value to update

    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the specified field with the new value
    existingProduct[field] = value;

    try {
      // Attempt to save the updated Product
      const updatedProduct = await existingProduct.save();

      console.log("Product updated successfully");
      res.status(200).json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
    } catch (error) {
      console.error("Error saving updated Product:", error);
      console.log("Error updating Product in inventory");
      res.status(500).json({ message: "Error updating Product in inventory" });
    }
  } catch (error) {
    console.error(error);
    console.log("Error updating Product in inventory");
    res.status(500).json({ message: "Error updating Product in inventory" });
  }
};

export const deleteProductById = async (req, res) => {
  const { id } = req.params; // Access the ID from the request parameters

  try {
    console.log("Deleting product with ID:", id);

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    console.log("Product deleted successfully by ID:", product);
    res.status(200).json(); // No content response for successful deletion
  } catch (error) {
    console.error("Error deleting product:", error.message);
    // Handle specific errors here, e.g., database connection errors
    res.status(500).json({ error: "Error deleting product" });
  }
};
