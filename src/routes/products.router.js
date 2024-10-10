import express from "express";
import ProductController from "../controllers/product.controller.js";

const router = express.Router();

// Ruta para obtener todos los productos en formato JSON desde la base de datos
router.get("/api/products", ProductController.getAllProducts);

// Ruta para obtener todos los productos con paginación y renderizado en vista
router.get("/productos", ProductController.getProductsPaginated);

// Ruta para obtener un producto por su ID y renderizado en vista
router.get("/productos/:pid", ProductController.getProductById);

// Rutas adicionales para crear, actualizar y eliminar productos
router.post("/productos", ProductController.createProduct);

router.delete("/productos/:pid", ProductController.deleteProduct);

router.put("/productos/:pid", ProductController.updateProduct);

export default router;
