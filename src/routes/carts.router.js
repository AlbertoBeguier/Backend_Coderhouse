// C:\Users\aabeg\Dropbox\1.JavaScript\BACKEND\CoderHouse\Backend I\proyectoCoder\src\routes\carts.router.js

import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import CartController from "../controllers/cart.controller.js";

const router = express.Router();

// Ruta para agregar un producto al carrito del usuario
router.post("/add/:productId", authMiddleware, CartController.addProductToCart);

// Ruta para mostrar el carrito del usuario
router.get("/", authMiddleware, CartController.getUserCart);

// Ruta para eliminar un producto del carrito
router.delete(
  "/:productId",
  authMiddleware,
  CartController.removeProductFromCart
);

// Ruta para vaciar el carrito del usuario
router.delete("/", authMiddleware, CartController.emptyCart);

// Ruta para obtener la cantidad de productos del carrito del usuario
router.get("/count", authMiddleware, CartController.getCartCount);

export default router;
