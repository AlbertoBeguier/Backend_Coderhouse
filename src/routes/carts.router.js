import { Router } from "express";
import { Cart } from "../models/carts.model.js"; 
import { Product } from "../models/products.model.js"; 

const router = Router();

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const lastCart = await Cart.findOne().sort({ id: -1 });
    const newId = lastCart ? lastCart.id + 1 : 1;
    const newCart = new Cart({ id: newId, products: [] });
    await newCart.save();
    res.status(201).send(newCart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta para obtener y mostrar todos los carritos con limitación
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  try {
    const carts = await Cart.find().populate('products.product');
    const carritos = limit && limit > 0 ? carts.slice(0, limit) : carts;

    res.render("carritos", { 
      title: "Carritos", 
      carritos // Envía los carritos a la vista
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta para obtener los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) }).populate('products.product');
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }
    res.status(200).send(cart.products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Ruta para agregar un producto a un carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) }).populate('products.product');
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const product = await Product.findOne({ id: parseInt(req.params.pid) });
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const productIndex = cart.products.findIndex(p => p.product.toString() === product._id.toString());
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: product._id, quantity: 1 });
    }

    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;



