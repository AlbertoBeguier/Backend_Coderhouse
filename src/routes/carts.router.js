import express from "express";
import CartManager from "../cartManager.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Ruta para agregar un producto al carrito del usuario
router.post("/add/:productId", authMiddleware, async (req, res) => {
  try {
    console.log("Usuario autenticado:", req.user); // Información del usuario autenticado
    const userId = req.user.id;
    const productId = req.params.productId;
    const cart = await CartManager.addProductToUserCart(userId, productId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para mostrar el carrito del usuario
router.get("/", authMiddleware, async (req, res) => {
  try {
    const cart = await CartManager.getUserCart(req.user.id);
    if (!cart) {
      return res.render("carritos", { carritos: [], total: 0 });
    }
    const total = cart.products.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    res.render("carritos", { carritos: [cart], total });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta para eliminar un producto del carrito
router.delete("/:productId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const cart = await CartManager.removeOneProductUnit(userId, productId); // Cambié a removeOneProductUnit para manejar cantidades
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para vaciar el carrito del usuario
router.delete("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await CartManager.emptyCart(userId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Nueva ruta para obtener la cantidad de productos del carrito del usuario
router.get("/count", authMiddleware, async (req, res) => {
  try {
    const cart = await CartManager.getUserCart(req.user.id);

    // Si no hay carrito, devolvemos un total de 0
    if (!cart || !cart.products.length) {
      return res.json({ totalQuantity: 0 });
    }

    // Sumar la cantidad total de productos
    const totalQuantity = cart.products.reduce(
      (acc, product) => acc + product.quantity,
      0
    );

    res.json({ totalQuantity });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
