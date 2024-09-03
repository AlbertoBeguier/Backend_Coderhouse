import express from "express";
import { Cart } from "../models/carts.model.js";
import { Product } from "../models/products.model.js";

const router = express.Router();

// Crear un nuevo carrito (solo si no existe)
router.post("/", async (req, res) => {
  try {
    let cart = await Cart.findOne({ id: 1 }); // Busca el carrito con id 1

    if (!cart) {
      // Si no existe ningún carrito, crea uno nuevo con id 1
      cart = new Cart({ id: 1, products: [] });
      await cart.save();
    }

    res.status(201).send(cart);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Obtener todos los carritos con limitación y renderizado en vista
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

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(product._id)
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

    cart.products = cart.products.filter(
      (p) => !p.product.equals(req.params.pid)
    );

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

    const productIndex = cart.products.findIndex((p) =>
      p.product.equals(req.params.pid)
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
