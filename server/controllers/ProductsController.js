// Import Product model
import Product from "../models/Products.js";

// Import Multer
import multer from "multer";

// Create a Multer instance with some options
const upload = multer({
  // Specify the destination folder
  dest: "uploads/",
  // Specify the file name
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
  // Specify the file size limit (in bytes)
  limits: {
    fileSize: 1000000,
  },
  // Specify the file type filter
  fileFilter: function (req, file, cb) {
    // Only accept image files
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

const ProductsController = {
  async getAllProducts(req, res) {
    try {
      const products = await Product.find(); // Use Product model to query the database
      res.status(200).send(products);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async getProductById(req, res) {
    try {
      const { id } = req.params; // Get product ID from request parameter
      const product = await Product.findById(id); // Use Product model to query the database
      if (!product) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(200).send(product);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async createProduct(req, res) {
    try {
      upload.single("image")(req, res, async (err) => {
        if (err) {
          return res.status(400).send(err);
        }

        const base64Image = req.file.buffer.toString("base64");

        const newProductData = {
          ...req.body,
          image: base64Image,
        };

        const newProduct = new Product(newProductData);

        await newProduct.save();

        res.status(201).send(newProduct);
      });
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async updateProduct(req, res) {
    try {
      const { id } = req.params;

      // Convert incoming images to base64 format
      const convertImagesToBase64 = () => {
        const base64Images = [];
        if (req.body.images) {
          for (const image of req.body.images) {
            base64Images.push(Buffer.from(image, "base64").toString("base64"));
          }
        } else if (req.files) {
          for (const file of req.files) {
            base64Images.push(file.buffer.toString("base64"));
          }
        }
        return base64Images;
      };

      // Update the product
      const updates = req.body;
      updates.images = convertImagesToBase64(); // Add or update the 'images' field
      const options = { new: true }; // Return the updated product
      const updatedProduct = await Product.findByIdAndUpdate(
        id,
        updates,
        options
      );

      if (!updatedProduct) {
        return res.status(404).send({ message: "Product not found" });
      }

      // Save the product to the database
      await updatedProduct.save();

      // Send the product as a response
      res.status(200).send(updatedProduct);
    } catch (error) {
      res.status(400).send(error); // Handle validation errors
    }
  },

  async deleteProduct(req, res) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id); // Use Product model to query the database
      if (!deletedProduct) {
        return res.status(404).send({ message: "Product not found" });
      }
      res.status(204).send(); // No content response for successful deletion
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async searchProducts(searchTerm) {
    try {
      const filter = { name: { $regex: searchTerm, $options: "i" } };
      const products = await Product.find(filter);
      return products;
    } catch (error) {
      throw error; // You might want to handle or log the error accordingly
    }
  },

  async handleSearch(req, res) {
    try {
      const searchTerm = req.query.q; // Get search term from query string
      const products = await ProductsController.searchProducts(searchTerm);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

export default ProductsController;
