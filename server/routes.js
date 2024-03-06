// Import required modules
import { Router } from "express";
import UserController from "./controllers/UserController.js";
import ProductsController from "./controllers/ProductsController.js";

// Create a new router instance
const router = Router();

// Define routes with clear comments
router.get("/", (req, res) => {
  res.send("Hello from Express!"); // Root path response
});

// User routes
router.get("/users", UserController.getAllUsers);
router.post("/users", UserController.createUser);

// Product routes
router.get("/getallproducts", ProductsController.getAllProducts);
router.get("/getproducts/:id", ProductsController.getProductById);
router.post("/addproducts", ProductsController.createProduct);
router.put("/products/:id", ProductsController.updateProduct);
router.delete("/products/:id", ProductsController.deleteProduct);
router.get("/search", ProductsController.handleSearch);
// Export the router for use in the main app
export default router;
