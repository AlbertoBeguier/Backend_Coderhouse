import express from "express";
import mongoose from "mongoose";
import { Cart } from "../models/carts.model.js";
import { Product } from "../models/products.model.js";

const router = express.Router();

// Crear un nuevo carrito (sin verificar si ya existe)
router.post("/", async (req, res) => {
  try {
    // Encuentra el último carrito para determinar el siguiente ID
    const lastCart = await Cart.findOne().sort({ id: -1 });
    const newId = lastCart ? lastCart.id + 1 : 1;

    // Crea un nuevo carrito con un nuevo ID
    const cart = new Cart({ id: newId, products: [] });
    await cart.save();

    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Obtener todos los carritos con limitación
router.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit, 10);
  try {
    const carts = await Cart.find().populate("products.product");
    const carritos = limit && limit > 0 ? carts.slice(0, limit) : carts;

    res.status(200).json({
      status: "success",
      payload: carritos,
    });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Obtener los productos de un carrito por su ID
router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) }).populate(
      "products.product"
    );
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }
    res.status(200).send(cart.products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Agregar un producto al carrito existente
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let cart = await Cart.findOne({ id: parseInt(req.params.cid) });

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const product = await Product.findOne({ id: parseInt(req.params.pid) });
    if (!product) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === product._id.toString()
    );
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

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) });
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productId = req.params.pid;
    console.log("Intentando eliminar producto con ID:", productId);

    const initialProductCount = cart.products.length;

    // Aquí comparamos el ObjectId como cadena de texto
    cart.products = cart.products.filter(
      (p) => p.product.toString() !== productId
    );

    if (initialProductCount === cart.products.length) {
      console.log("Producto no encontrado en el carrito.");
      return res
        .status(404)
        .send({ error: "Producto no encontrado en el carrito" });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      id: parseInt(req.params.cid),
    }).populate("products.product");

    res.status(200).send(updatedCart);
  } catch (error) {
    console.error("Error al eliminar el producto del carrito:", error);
    res.status(500).send({ error: error.message });
  }
});

// Actualizar todo el carrito
router.put("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { id: parseInt(req.params.cid) },
      { products: req.body.products },
      { new: true }
    ).populate("products.product");

    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Actualizar la cantidad de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) });
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.product.toString() === req.params.pid.toString()
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = req.body.quantity;
    } else {
      return res
        .status(404)
        .send({ error: "Producto no encontrado en el carrito" });
    }

    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findOne({ id: parseInt(req.params.cid) });
    if (!cart) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();
    res.status(200).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

export default router;
