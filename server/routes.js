// Import required modules
import express from "express";
import UserController from "./controllers/UserController.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProductField,
  deleteProductById,
} from "./controllers/ProductsController.js";

const router = express.Router();

// CRUD endpoints for products
router.post("/addproduct", createProduct);
router.get("/getallproduct", getAllProducts);
router.get("getproduct/:id", getProductById);
router.put("product/:productId", updateProductField);
router.delete("/products/:id", deleteProductById);

// Define routes with clear comments
router.get("/", (req, res) => {
  res.send("Hello from Express!"); // Root path response
});

// User routes
router.get("/users", UserController.getAllUsers);
router.post("/users", UserController.createUser);

export default router;
